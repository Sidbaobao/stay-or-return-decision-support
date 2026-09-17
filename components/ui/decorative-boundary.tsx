"use client";

import { Component, ReactNode } from "react";

type DecorativeBoundaryProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

type DecorativeBoundaryState = {
  failed: boolean;
};

// Decoration must never take the page down with it. A hero canvas or a
// video that throws leaves its space to the fallback (nothing by default)
// and the rest of the page carries on. Error boundaries are still class
// components in React.
export class DecorativeBoundary extends Component<DecorativeBoundaryProps, DecorativeBoundaryState> {
  state: DecorativeBoundaryState = { failed: false };

  static getDerivedStateFromError(): DecorativeBoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error("A decorative element failed and was removed:", error);
  }

  render() {
    return this.state.failed ? (this.props.fallback ?? null) : this.props.children;
  }
}
