"use client";

import { type ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from "@/lib/auth";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Analytics />
    </AuthProvider>
  );
}
