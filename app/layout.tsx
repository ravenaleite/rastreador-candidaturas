import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rastreador de candidaturas",
  description:
    "Acompanhe onde você se candidatou, quem respondeu e quando cobrar retorno.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
