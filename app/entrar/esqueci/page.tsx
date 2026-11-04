import type { Metadata } from "next";
import FormularioEsqueci from "./formulario";

export const metadata: Metadata = { title: "Esqueci a senha · Rastreador de candidaturas" };

export default function PaginaEsqueci() {
  return (
    <main className="centralizado">
      <div className="cartao-entrada">
        <h1>Esqueceu a senha?</h1>
        <p className="apoio">
          Digite o e-mail da sua conta. Vamos mandar um link para você criar uma senha nova.
        </p>
        <FormularioEsqueci />
      </div>
    </main>
  );
}
