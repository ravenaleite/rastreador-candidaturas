import type { Metadata } from "next";
import Formulario from "./formulario";

export const metadata: Metadata = { title: "Entrar · Rastreador de candidaturas" };

export default async function PaginaEntrar({
  searchParams,
}: {
  searchParams: Promise<{ link?: string }>;
}) {
  const { link } = await searchParams;
  return (
    <main className="centralizado">
      <div className="cartao-entrada">
        <h1>Rastreador de candidaturas</h1>
        <p className="apoio">
          Acompanhe onde você se candidatou, quem respondeu e quando cobrar
          retorno.
        </p>
        <Formulario linkInvalido={link === "invalido"} />
      </div>
    </main>
  );
}
