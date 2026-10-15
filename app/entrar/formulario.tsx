"use client";

import { useActionState } from "react";
import { entrar, cadastrar, type EstadoForm } from "./acoes";

const INICIAL: EstadoForm = {};

export default function Formulario() {
  const [estadoEntrar, acaoEntrar, entrando] = useActionState(entrar, INICIAL);
  const [estadoCriar, acaoCriar, criando] = useActionState(cadastrar, INICIAL);

  const estado = estadoCriar.aviso || estadoCriar.erro ? estadoCriar : estadoEntrar;
  const ocupado = entrando || criando;

  return (
    <form className="formulario">
      <div className="campo">
        <label htmlFor="email">E-mail</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          autoFocus
        />
      </div>

      <div className="campo">
        <label htmlFor="senha">Senha</label>
        <input
          id="senha"
          name="senha"
          type="password"
          autoComplete="current-password"
          minLength={6}
          required
        />
        <span className="dica">Mínimo de 6 caracteres.</span>
      </div>

      {estado.erro && (
        <p className="recado erro" role="alert">
          {estado.erro}
        </p>
      )}
      {estado.aviso && (
        <p className="recado aviso" role="status">
          {estado.aviso}
        </p>
      )}

      <div className="acoes">
        <button className="botao" formAction={acaoEntrar} disabled={ocupado}>
          {entrando ? "Entrando…" : "Entrar"}
        </button>
        <button
          className="botao-vazado"
          formAction={acaoCriar}
          disabled={ocupado}
        >
          {criando ? "Criando…" : "Criar conta"}
        </button>
      </div>
    </form>
  );
}
