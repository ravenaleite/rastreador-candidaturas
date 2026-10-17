"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { criarCandidatura, type EstadoCadastro } from "./acoes";
import CamposCandidatura from "./campos";
import type { EntradaCandidatura } from "@/lib/validacao";

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

  const vazio: EntradaCandidatura = {
    empresa: "",
    cargo: "",
    link: "",
    data_candidatura: hoje,
    status: "aplicado",
    follow_up: "",
    observacoes: "",
  };

  return (
    <form ref={formulario} action={acao} className="cartao-form">
      <CamposCandidatura valores={estado.valores ?? vazio} />

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
