import type { Metadata } from "next";
import "./main.scss";

export const metadata: Metadata = {
  title: "Puzzle game AI",
  description: "solve the puzzle game using AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html id="root" lang="en">
      <body>{children}</body>
    </html>
  );
}
