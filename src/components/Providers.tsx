"use client";

import { type ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Analytics />
    </>
  );
}