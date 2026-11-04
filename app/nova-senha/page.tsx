import type { Metadata } from "next";
import FormularioNovaSenha from "./formulario";

export const metadata: Metadata = { title: "Nova senha · Rastreador de candidaturas" };

/**
 * So chega aqui quem abriu o link do e-mail: a rota /auth/confirmar
 * ja abriu a sessao. Sem sessao, o middleware manda para /entrar.
 */
export default function PaginaNovaSenha() {
  return (
    <main className="centralizado">
      <div className="cartao-entrada">
        <h1>Crie uma senha nova</h1>
        <p className="apoio">Depois de salvar, você entra direto no seu quadro.</p>
        <FormularioNovaSenha />
      </div>
    </main>
  );
}
