"use client";

import { useActionState } from "react";
import { salvarNovaSenha, type EstadoNovaSenha } from "./acoes";
import { SENHA_MINIMA } from "@/lib/senha";

const INICIAL: EstadoNovaSenha = {};

export default function FormularioNovaSenha() {
  const [estado, acao, salvando] = useActionState(salvarNovaSenha, INICIAL);

  return (
    <form className="formulario" action={acao}>
      <div className="campo">
        <label htmlFor="senha">Senha nova</label>
        <input
          id="senha"
          name="senha"
          type="password"
          autoComplete="new-password"
          minLength={SENHA_MINIMA}
          required
          autoFocus
        />
        <span className="dica">Mínimo de {SENHA_MINIMA} caracteres.</span>
      </div>

      <div className="campo">
        <label htmlFor="confirmacao">Repita a senha nova</label>
        <input
          id="confirmacao"
          name="confirmacao"
          type="password"
          autoComplete="new-password"
          minLength={SENHA_MINIMA}
          required
        />
      </div>

      {estado.erro && (
        <p className="recado erro" role="alert">
          {estado.erro}
        </p>
      )}

      <div className="acoes">
        <button className="botao" disabled={salvando}>
          {salvando ? "Salvando…" : "Salvar senha nova"}
        </button>
      </div>
    </form>
  );
}
