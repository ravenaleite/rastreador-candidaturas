import type { Metadata } from "next";
import { Bricolage_Grotesque, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

/**
 * As fontes vem pelo next/font, nao por <link> para o Google.
 * Assim elas sao baixadas junto com o site, o navegador nao faz uma
 * viagem extra ate outro dominio e nao existe aquele pisca-pisca de
 * texto trocando de fonte no meio do carregamento.
 */
const titulos = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--fonte-titulo",
  display: "swap",
});

const corpo = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--fonte-corpo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rastreador de candidaturas",
  description:
    "Acompanhe onde você se candidatou, quem respondeu e quando cobrar retorno.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${titulos.variable} ${corpo.variable}`}>
      <body>{children}</body>
    </html>
  );
}
