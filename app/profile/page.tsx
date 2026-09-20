"use client";

import { FormEvent, useEffect, useState } from "react";
import { ShieldCheck, User } from "lucide-react";
import { Band, OffsetGrid } from "@/components/ui/band";
import { PageHeader } from "@/components/ui/page-header";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { QuietButton } from "@/components/ui/quiet-button";
import { InlineConfirm, useConfirmFocus } from "@/components/ui/inline-confirm";
import { HistoryList } from "@/components/profile/history-list";
import { getMonogram, profileAccentStyles } from "@/components/profile/profile-utils";
import { CountUp } from "@/components/results/count-up";
import {
  buildLocalDataExport,
  clearLocalProfileAndHistory,
  loadRunHistory,
  NICKNAME_MAX_LENGTH
} from "@/lib/storage";
import { useLocalProfile } from "@/lib/use-local-profile";
import { formatDate } from "@/lib/i18n";
import { useLocale, useLocalizedTitle } from "@/lib/i18n/provider";
import { HistoryEntry, ProfileAccentId } from "@/types";

const accentOrder: ProfileAccentId[] = ["warm", "stay", "return"];

export default function ProfilePage() {
  const { t, locale } = useLocale();
  useLocalizedTitle(t.titles.profile);
  // The profile page is the one place a record is created on arrival.
  const { profile, update: updateProfile } = useLocalProfile({ create: true });
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([]);
  const [nicknameDraft, setNicknameDraft] = useState("");
  const [savedNotice, setSavedNotice] = useState(false);
  const [isConfirmingDeleteAll, setIsConfirmingDeleteAll] = useState(false);
  const deleteAllTriggerRef = useConfirmFocus(isConfirmingDeleteAll);

  useEffect(() => {
    setHistoryEntries(loadRunHistory());
  }, []);

  // Follow the stored nickname, which is trimmed — keyed on the profile
  // object, which is new on every save, so a draft of only spaces snaps back.
  useEffect(() => {
    setNicknameDraft(profile?.nickname ?? "");
  }, [profile]);

  useEffect(() => {
    if (!savedNotice) {
      return;
    }

    const timeoutId = window.setTimeout(() => setSavedNotice(false), 2400);
    return () => window.clearTimeout(timeoutId);
  }, [savedNotice]);

  if (!profile) {
    return null;
  }

  const monogram = getMonogram(profile.nickname);
  const accent = profileAccentStyles[profile.accentId];
  const decisionsCount = historyEntries.length;

  const handleNicknameSubmit = (event: FormEvent) => {
    event.preventDefault();
    updateProfile({ nickname: nicknameDraft });
    setSavedNotice(true);
  };

  const handleAccentChange = (accentId: ProfileAccentId) => {
    updateProfile({ accentId });
    setSavedNotice(true);
  };

  const handleExport = () => {
    const payload = JSON.stringify(buildLocalDataExport(), null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "stay-or-return-my-data.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteAll = () => {
    setIsConfirmingDeleteAll(false);
    clearLocalProfileAndHistory();
    // The hook re-reads on the storage change and recreates the record,
    // because this page is where having a profile is the point.
    setHistoryEntries([]);
  };

  return (
    <>
      <Band padding="header">
        <PageHeader
          eyebrow={t.profile.eyebrow}
          title={profile.nickname ? t.profile.titleWithName(profile.nickname) : t.profile.title}
        />
      </Band>

      {/* Who you are on the left; how much you have decided on the right,
          as the page's one number. */}
      <Band aria-labelledby="identity-heading">
        <h2 id="identity-heading" className="sr-only">
          {t.profile.identity}
        </h2>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-16">
          <div className="grid gap-6 sm:grid-cols-[5rem_minmax(0,1fr)] sm:gap-8">
            <span
              aria-hidden="true"
              className="flex h-20 w-20 items-center justify-center rounded-pill text-3xl font-semibold"
              style={{ backgroundColor: accent.background, color: accent.color }}
            >
              {monogram ?? <User className="h-8 w-8" strokeWidth={1.6} />}
            </span>

            <div className="min-w-0 space-y-6">
              <form onSubmit={handleNicknameSubmit}>
                <label htmlFor="profile-nickname" className="text-body-sm font-medium text-ink/70">
                  {t.profile.nickname} <span className="font-normal text-ink/50">{t.profile.optional}</span>
                </label>
                <div className="mt-2 flex gap-2">
                  <input
                    id="profile-nickname"
                    type="text"
                    value={nicknameDraft}
                    maxLength={NICKNAME_MAX_LENGTH}
                    onChange={(event) => setNicknameDraft(event.target.value)}
                    placeholder={t.profile.placeholder}
                    className="interaction-field min-h-11 w-full rounded-control border border-border bg-surface-raised px-3.5 py-2 text-body text-ink placeholder:text-ink/40"
                  />
                  <SecondaryButton type="submit" className="shrink-0">
                    {t.profile.save}
                  </SecondaryButton>
                </div>
                <p aria-live="polite" className="mt-2 min-h-5 text-label text-ink/65">
                  {savedNotice ? t.profile.saved : ""}
                </p>
              </form>

              <fieldset>
                <legend className="text-body-sm font-medium text-ink/70">{t.profile.accent}</legend>
                <div className="mt-3 flex flex-wrap gap-x-6 gap-y-3">
                  {accentOrder.map((accentId) => {
                    const option = profileAccentStyles[accentId];

                    return (
                      <label
                        key={accentId}
                        className="inline-flex cursor-pointer items-center gap-2.5 text-sm text-ink/65 transition-colors duration-motion-standard ease-interaction has-[:checked]:font-medium has-[:checked]:text-ink motion-reduce:transition-none"
                      >
                        <input
                          type="radio"
                          name="profile-accent"
                          value={accentId}
                          checked={profile.accentId === accentId}
                          onChange={() => handleAccentChange(accentId)}
                          className="peer sr-only"
                        />
                        <span
                          aria-hidden="true"
                          className="h-6 w-6 rounded-pill ring-offset-2 ring-offset-canvas transition-shadow duration-motion-standard ease-interaction peer-checked:ring-2 peer-checked:ring-ink/40 peer-focus-visible:ring-2 peer-focus-visible:ring-action-primary/70 motion-reduce:transition-none"
                          style={{ backgroundColor: option.color }}
                        />
                        {t.profile.accents[accentId]}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            </div>
          </div>

          <div className="lg:text-right">
            <p className="num text-hero-number text-ink">
              <CountUp value={decisionsCount} />
            </p>
            <p className="mt-3 text-body text-ink/60">{t.profile.decisionsLabel(decisionsCount)}</p>
            <p className="num mt-1 text-label text-ink/45">{t.profile.sinceDate(formatDate(locale, profile.createdAt))}</p>
          </div>
        </div>
      </Band>

      {/* Privacy on its own warm band: the promise on the left, the
          details and the two actions on the right. */}
      <Band tone="warm" as="aside" aria-labelledby="privacy-heading">
        <OffsetGrid
          aside={
            <h2 id="privacy-heading" className="flex items-center gap-2 text-section-title text-ink">
              <ShieldCheck aria-hidden="true" className="h-5 w-5 shrink-0 text-ink-accent" strokeWidth={1.8} />
              {t.profile.privacyTitle}
            </h2>
          }
        >
          <div className="space-y-1 text-body text-ink/75">
            {t.profile.privacyBody.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <p className="mt-3 text-body-sm text-ink/65">{t.profile.privacyFlip}</p>

          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
            <SecondaryButton onClick={handleExport}>{t.profile.exportData}</SecondaryButton>

            {isConfirmingDeleteAll ? (
              <InlineConfirm
                prompt={t.profile.erasePrompt}
                confirmLabel={t.profile.erase}
                onConfirm={handleDeleteAll}
                onCancel={() => setIsConfirmingDeleteAll(false)}
              />
            ) : (
              <QuietButton
                ref={deleteAllTriggerRef}
                tone="caution"
                onClick={() => setIsConfirmingDeleteAll(true)}
              >
                {t.profile.deleteAll}
              </QuietButton>
            )}
          </div>
        </OffsetGrid>
      </Band>

      <Band aria-labelledby="history-heading">
        <div>
          <p className="num text-label text-ink/45">{t.profile.historyEyebrow}</p>
          {/* Focus target after the last history row is deleted. */}
          <h2
            id="history-heading"
            tabIndex={-1}
            className="mt-2 text-section-title text-ink outline-none"
          >
            {t.profile.historyTitle}
          </h2>
        </div>

        <div className="mt-8">
          <HistoryList entries={historyEntries} onEntriesChange={setHistoryEntries} />
        </div>
      </Band>
    </>
  );
}
