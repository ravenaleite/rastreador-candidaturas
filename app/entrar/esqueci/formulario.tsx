"use client";

import Link from "next/link";
import { useActionState } from "react";
import { pedirNovaSenha, type EstadoEsqueci } from "./acoes";

const INICIAL: EstadoEsqueci = {};

export default function FormularioEsqueci() {
  const [estado, acao, enviando] = useActionState(pedirNovaSenha, INICIAL);

  if (estado.enviado) {
    return (
      <div className="formulario">
        <p className="recado aviso" role="status">
          Se esse e-mail tiver conta, enviamos um link para criar uma senha nova.
          Confira a caixa de entrada e o spam. Abra o link neste mesmo navegador.
        </p>
        <Link href="/entrar" className="botao-vazado">
          Voltar para o login
        </Link>
      </div>
    );
  }

  return (
    <form className="formulario" action={acao}>
      <div className="campo">
        <label htmlFor="email">E-mail da conta</label>
        <input id="email" name="email" type="email" autoComplete="email" required autoFocus />
      </div>

      {estado.erro && (
        <p className="recado erro" role="alert">
          {estado.erro}
        </p>
      )}

      <div className="acoes">
        <button className="botao" disabled={enviando}>
          {enviando ? "Enviando…" : "Enviar link"}
        </button>
        <Link href="/entrar" className="botao-vazado">
          Voltar
        </Link>
      </div>
    </form>
  );
}
