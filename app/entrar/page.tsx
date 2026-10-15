import type { Metadata } from "next";
import Formulario from "./formulario";

export const metadata: Metadata = { title: "Entrar · Rastreador de candidaturas" };

export default function PaginaEntrar() {
  return (
    <main className="centralizado">
      <div className="cartao-entrada">
        <h1>Rastreador de candidaturas</h1>
        <p className="apoio">
          Acompanhe onde você se candidatou, quem respondeu e quando cobrar
          retorno.
        </p>
        <Formulario />
      </div>
    </main>
  );
}
