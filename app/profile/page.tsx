"use client";

import { FormEvent, useEffect, useState } from "react";
import { ShieldCheck, User } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { HistoryList } from "@/components/profile/history-list";
import {
  formatFriendlyDate,
  getMonogram,
  profileAccentStyles
} from "@/components/profile/profile-utils";
import {
  buildLocalDataExport,
  clearLocalProfileAndHistory,
  loadRunHistory,
  NICKNAME_MAX_LENGTH
} from "@/lib/storage";
import { useLocalProfile } from "@/lib/use-local-profile";
import { HistoryEntry, ProfileAccentId } from "@/types";

const accentOrder: ProfileAccentId[] = ["warm", "stay", "return"];

export default function ProfilePage() {
  // The profile page is the one place a record is created on arrival.
  const { profile, update: updateProfile } = useLocalProfile({ create: true });
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([]);
  const [nicknameDraft, setNicknameDraft] = useState("");
  const [savedNotice, setSavedNotice] = useState(false);
  const [isConfirmingDeleteAll, setIsConfirmingDeleteAll] = useState(false);

  useEffect(() => {
    setHistoryEntries(loadRunHistory());
  }, []);

  // Follow the stored nickname, which is trimmed — the input used to keep
  // showing the untrimmed draft after saving. Keyed on the profile object,
  // which is new on every save, so a draft of only spaces also snaps back.
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
    clearLocalProfileAndHistory();
    // The hook re-reads on the storage change and recreates the record,
    // because this page is where having a profile is the point.
    setHistoryEntries([]);
    setIsConfirmingDeleteAll(false);
  };

  return (
    <>
      <PageHeader
        eyebrow="Your space"
        title={profile.nickname ? `Hi, ${profile.nickname}.` : "Your profile"}
        description="Your profile and decision history live only in this browser — private to you, we can't see them."
      />

      <section
        aria-labelledby="identity-heading"
        className="rounded-feature border border-border bg-surface p-6 shadow-legacy-sm sm:p-8"
      >
        <h2 id="identity-heading" className="sr-only">
          Profile identity
        </h2>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <span
            aria-hidden="true"
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-card text-2xl font-semibold"
            style={{ backgroundColor: accent.background, color: accent.color }}
          >
            {monogram ?? <User className="h-7 w-7" strokeWidth={1.6} />}
          </span>

          <div className="min-w-0 flex-1 space-y-5">
            <form onSubmit={handleNicknameSubmit} className="max-w-md">
              <label htmlFor="profile-nickname" className="text-body-sm font-medium text-ink/70">
                Nickname <span className="font-normal text-ink/50">(optional)</span>
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  id="profile-nickname"
                  type="text"
                  value={nicknameDraft}
                  maxLength={NICKNAME_MAX_LENGTH}
                  onChange={(event) => setNicknameDraft(event.target.value)}
                  placeholder="How should we greet you?"
                  className="min-h-11 w-full rounded-control border border-border bg-surface-strong px-3.5 py-2 text-body text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-action-primary/40"
                />
                <button
                  type="submit"
                  className="interaction-secondary min-h-11 shrink-0 rounded-control border border-ink/15 px-4 py-2 text-sm font-medium text-ink/75"
                >
                  Save
                </button>
              </div>
              <p aria-live="polite" className="mt-2 min-h-5 text-label text-ink/65">
                {savedNotice ? "Saved on this device." : ""}
              </p>
            </form>

            <fieldset>
              <legend className="text-body-sm font-medium text-ink/70">Accent</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {accentOrder.map((accentId) => {
                  const option = profileAccentStyles[accentId];
                  const isSelected = profile.accentId === accentId;

                  return (
                    <label
                      key={accentId}
                      className={`interaction-quiet inline-flex cursor-pointer items-center gap-2 rounded-pill border px-3 py-1.5 text-sm ${
                        isSelected
                          ? "border-ink/30 bg-surface-strong font-medium text-ink"
                          : "border-border text-ink/65 hover:text-ink"
                      }`}
                    >
                      <input
                        type="radio"
                        name="profile-accent"
                        value={accentId}
                        checked={isSelected}
                        onChange={() => handleAccentChange(accentId)}
                        className="sr-only"
                      />
                      <span
                        aria-hidden="true"
                        className="h-3.5 w-3.5 rounded-pill"
                        style={{ backgroundColor: option.color }}
                      />
                      {option.label}
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <p className="text-body-sm text-ink/65">
              On this device since {formatFriendlyDate(profile.createdAt)} ·{" "}
              {decisionsCount === 1 ? "1 decision saved" : `${decisionsCount} decisions saved`}
            </p>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="privacy-heading"
        className="rounded-feature border border-border bg-surface-warm/60 p-6 shadow-legacy-sm sm:p-8"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
          <span
            aria-hidden="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-tile bg-surface text-ink-accent"
          >
            <ShieldCheck className="h-5 w-5" strokeWidth={1.8} />
          </span>
          <div className="min-w-0 space-y-3">
            <h2 id="privacy-heading" className="font-serif text-card-title text-ink">
              Private to this device
            </h2>
            <p className="max-w-measure text-body text-ink/75">
              Your nickname and history are saved only in this browser, on this device. Nothing is
              sent anywhere — no account, no cloud, no sync. We couldn&apos;t see it if we wanted to.
            </p>
            <p className="max-w-measure text-body-sm text-ink/65">
              The honest flip side: it won&apos;t follow you to other devices, and clearing this
              browser&apos;s data erases it. Export a copy below if you want to keep one.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleExport}
                className="interaction-secondary rounded-control border border-ink/15 px-4 py-2 text-sm font-medium text-ink/75"
              >
                Export my data (JSON)
              </button>

              {isConfirmingDeleteAll ? (
                <span className="inline-flex flex-wrap items-center gap-2">
                  <span className="text-sm text-ink/70">
                    Erase your profile and all saved decisions from this browser?
                  </span>
                  <button
                    type="button"
                    onClick={handleDeleteAll}
                    className="interaction-quiet rounded-control px-1.5 py-1 text-sm font-semibold text-path-return"
                  >
                    Erase everything
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsConfirmingDeleteAll(false)}
                    className="interaction-quiet rounded-control px-1.5 py-1 text-sm font-medium text-ink/60 hover:text-ink"
                  >
                    Keep
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsConfirmingDeleteAll(true)}
                  className="interaction-quiet rounded-control px-1.5 py-1 text-sm font-medium text-ink/60 hover:text-path-return"
                >
                  Delete profile &amp; history
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="history-heading" className="rounded-feature border border-border bg-surface p-6 shadow-legacy-sm sm:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-eyebrow text-ink-accent">History</p>
            <h2 id="history-heading" className="mt-2 font-serif text-section-title text-ink">
              Your decisions
            </h2>
          </div>
          <p className="text-body-sm text-ink/70">Saved only in this browser · newest first.</p>
        </div>

        <div className="mt-6">
          <HistoryList entries={historyEntries} onEntriesChange={setHistoryEntries} />
        </div>
      </section>
    </>
  );
}
