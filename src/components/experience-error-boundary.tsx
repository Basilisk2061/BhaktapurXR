"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import Link from "next/link";
import {StartupDiagnostics} from "./startup-diagnostics";
import {startupError} from "../game/startup-diagnostics";

export function ExperienceFailure({ message = "The experience encountered a startup or rendering error. Reload to try again." }: { message?: string }) {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#f5f2eb] px-6" role="alert">
      <StartupDiagnostics/><div className="max-w-md text-center">
        <h2 className="font-semibold">Unable to display the 3D experience</h2>
        <p className="mt-3 text-sm leading-relaxed text-stone-600">{message}</p>
        <button onClick={() => window.location.reload()} className="mt-6 rounded-sm bg-[#34473c] px-5 py-3 text-sm text-white">Reload experience</button>
        <Link href="/" className="ml-5 text-sm underline underline-offset-4">Return home</Link>
      </div>
    </div>
  );
}

export class ExperienceErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() { return { failed: true }; }

  componentDidCatch(error: Error, info: ErrorInfo) {
    startupError(error,"Experience error boundary");
    console.error("BhaktapurXR experience failed", error, info.componentStack);
  }

  render() {
    return this.state.failed ? <ExperienceFailure /> : this.props.children;
  }
}
