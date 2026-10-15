"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { criarCandidatura, type EstadoCadastro } from "./acoes";
import { STATUS, ROTULO } from "@/lib/tipos";

const INICIAL: EstadoCadastro = {};

/**
 * "hoje" vem pronto do servidor. Se chamassemos new Date() aqui, o
 * HTML gerado no servidor e o que o navegador monta poderiam cair em
 * dias diferentes e o React reclamaria de hidratacao.
 */
export default function FormularioNova({
  hoje,
  comecarAberto,
}: {
  hoje: string;
  comecarAberto: boolean;
}) {
  const [aberto, setAberto] = useState(comecarAberto);
  const [estado, acao, enviando] = useActionState(criarCandidatura, INICIAL);
  const formulario = useRef<HTMLFormElement>(null);

  // Depois de salvar, limpamos os campos e deixamos o formulario
  // aberto: quem esta cadastrando uma vaga costuma cadastrar tres.
  useEffect(() => {
    if (estado.ok) formulario.current?.reset();
  }, [estado]);

  if (!aberto) {
    return (
      <button className="adicionar" onClick={() => setAberto(true)}>
        Adicionar candidatura
      </button>
    );
  }

  return (
    <form ref={formulario} action={acao} className="cartao-form">
      <div className="linha-dupla">
        <label className="campo">
          <span>Empresa</span>
          <input
            name="empresa"
            required
            maxLength={120}
            autoFocus
            defaultValue={estado.valores?.empresa ?? ""}
          />
        </label>

        <label className="campo">
          <span>Cargo</span>
          <input
            name="cargo"
            required
            maxLength={120}
            defaultValue={estado.valores?.cargo ?? ""}
          />
        </label>
      </div>

      <label className="campo">
        <span>Link da vaga</span>
        <input
          name="link"
          placeholder="linkedin.com/jobs/..."
          defaultValue={estado.valores?.link ?? ""}
        />
      </label>

      <div className="linha-tripla">
        <label className="campo">
          <span>Data da candidatura</span>
          <input
            type="date"
            name="data_candidatura"
            required
            defaultValue={estado.valores?.data_candidatura || hoje}
          />
        </label>

        <label className="campo">
          <span>Follow up</span>
          <input
            type="date"
            name="follow_up"
            defaultValue={estado.valores?.follow_up ?? ""}
          />
        </label>

        <label className="campo">
          <span>Status</span>
          <select name="status" defaultValue={estado.valores?.status || "aplicado"}>
            {STATUS.map((s) => (
              <option key={s} value={s}>
                {ROTULO[s]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="campo">
        <span>Observações</span>
        <textarea
          name="observacoes"
          rows={3}
          maxLength={1000}
          defaultValue={estado.valores?.observacoes ?? ""}
        />
      </label>

      {estado.erro && (
        <p className="recado erro" role="alert">
          {estado.erro}
        </p>
      )}
      {estado.ok && !estado.erro && (
        <p className="recado aviso" role="status">
          Candidatura salva.
        </p>
      )}

      <div className="acoes">
        <button className="botao" disabled={enviando}>
          {enviando ? "Salvando..." : "Salvar"}
        </button>
        <button
          type="button"
          className="botao-vazado"
          onClick={() => setAberto(false)}
          disabled={enviando}
        >
          Fechar
        </button>
      </div>
    </form>
  );
}
