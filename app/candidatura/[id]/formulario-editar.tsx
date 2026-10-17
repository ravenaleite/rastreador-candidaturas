"use client";

import Link from "next/link";
import { useActionState } from "react";
import { editarCandidatura, type EstadoCadastro } from "@/app/painel/acoes";
import CamposCandidatura from "@/app/painel/campos";
import type { EntradaCandidatura } from "@/lib/validacao";

const INICIAL: EstadoCadastro = {};

export default function FormularioEditar({
  id,
  iniciais,
}: {
  id: string;
  iniciais: EntradaCandidatura;
}) {
  const [estado, acao, enviando] = useActionState(editarCandidatura, INICIAL);

  return (
    <form action={acao} className="cartao-form">
      <input type="hidden" name="id" value={id} />

      {/* Se a validacao recusar, voltam os valores que a pessoa
          acabou de digitar, nao os que estavam no banco. */}
      <CamposCandidatura valores={estado.valores ?? iniciais} />

      {estado.erro && (
        <p className="recado erro" role="alert">
          {estado.erro}
        </p>
      )}

      <div className="acoes">
        <button className="botao" disabled={enviando}>
          {enviando ? "Salvando..." : "Salvar alterações"}
        </button>
        <Link className="botao-vazado" href="/painel">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
