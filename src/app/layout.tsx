/**
 * Root layout — passes children through.
 * Real html/body + providers live in `[locale]/layout.tsx`.
 * Top-level 404s use Next.js default; in-locale 404s use `[locale]/not-found.tsx`.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
