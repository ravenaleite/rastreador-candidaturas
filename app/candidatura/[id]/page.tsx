import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { criarClienteServidor } from "@/lib/supabase/servidor";
import { type Candidatura } from "@/lib/tipos";
import type { EntradaCandidatura } from "@/lib/validacao";
import FormularioEditar from "./formulario-editar";

export const metadata: Metadata = { title: "Editar candidatura" };

export default async function PaginaEditar({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await criarClienteServidor();

  // Sem filtro por usuario, de novo de proposito: a RLS so devolve a
  // linha se ela for de quem esta pedindo. Pedir o id de outra pessoa
  // nao da erro de permissao, da "nao encontrado" — que e a resposta
  // certa, porque nem a existencia da linha deve vazar.
  const { data } = await supabase
    .from("candidaturas")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();
  const c = data as Candidatura;

  const iniciais: EntradaCandidatura = {
    empresa: c.empresa,
    cargo: c.cargo,
    link: c.link ?? "",
    data_candidatura: c.data_candidatura,
    status: c.status,
    follow_up: c.follow_up ?? "",
    observacoes: c.observacoes ?? "",
  };

  return (
    <div className="interno estreito">
      <header className="topo-app">
        <div className="topo-linha">
          <h1>Editar candidatura</h1>
        </div>
        <nav className="abas">
          <Link href="/painel">← Voltar ao quadro</Link>
        </nav>
      </header>

      <FormularioEditar id={c.id} iniciais={iniciais} />
    </div>
  );
}
