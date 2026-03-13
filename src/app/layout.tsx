// Root layout - locale-specific layout is in [locale]/layout.tsx
// This file is needed for Next.js but delegates everything to the locale layout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
