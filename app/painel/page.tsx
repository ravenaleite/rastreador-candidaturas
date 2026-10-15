import type { Metadata } from "next";
import Link from "next/link";
import { criarClienteServidor } from "@/lib/supabase/servidor";
import { sair } from "../entrar/acoes";
import FormularioNova from "./formulario-nova";
import Quadro from "./quadro";
import { type Candidatura } from "@/lib/tipos";
import { estaAtrasado } from "@/lib/status";
import { dataDeHoje, haQuantoVenceu } from "@/lib/data";

export const metadata: Metadata = { title: "Quadro · Rastreador de candidaturas" };

export default async function PaginaPainel() {
  const supabase = await criarClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Nenhum filtro por usuario nesta consulta, de proposito: quem
  // filtra e a politica de RLS no banco. Se ela cair, isto aqui nao
  // vaza nada, porque sem policy o Postgres nao devolve linha
  // nenhuma.
  const { data } = await supabase
    .from("candidaturas")
    .select("*")
    .order("data_candidatura", { ascending: false });

  const candidaturas = (data ?? []) as Candidatura[];
  const hoje = dataDeHoje();
  const vencidas = candidaturas.filter((c) => estaAtrasado(c.follow_up, hoje, c.status));

  return (
    <div className="interno">
      <header className="topo-app">
        <div className="topo-linha">
          <h1>Minhas candidaturas</h1>
          <div className="identidade">
            <span>{user?.email ?? ""}</span>
            <form action={sair}>
              <button className="botao-vazado">Sair</button>
            </form>
          </div>
        </div>

        <nav className="abas">
          <span aria-current="page">Quadro</span>
          <Link href="/metricas">Métricas</Link>
        </nav>
      </header>

      {candidaturas.length > 0 && (
        <Chamada vencidas={vencidas} total={candidaturas.length} hoje={hoje} />
      )}

      <FormularioNova hoje={hoje} comecarAberto={candidaturas.length === 0} />

      {candidaturas.length === 0 ? (
        <section className="vazio">
          <h2>Comece pela primeira</h2>
          <p>
            Cadastre uma candidatura acima. Ela entra no quadro em “Aplicado” e
            você arrasta conforme o processo anda.
          </p>
        </section>
      ) : (
        <Quadro candidaturas={candidaturas} hoje={hoje} />
      )}
    </div>
  );
}

/**
 * A primeira coisa da tela responde a pergunta que faz alguem abrir
 * o app: tem alguma coisa pra cobrar hoje? O quadro vem depois.
 */
function Chamada({
  vencidas,
  total,
  hoje,
}: {
  vencidas: Candidatura[];
  total: number;
  hoje: string;
}) {
  if (vencidas.length === 0) {
    return (
      <section className="chamada">
        <div className="chamada-texto">
          <h2>Nenhuma cobrança atrasada</h2>
          <p className="meta">
            {total === 1
              ? "1 candidatura em acompanhamento."
              : `${total} candidaturas em acompanhamento.`}
          </p>
        </div>
      </section>
    );
  }

  const primeira = vencidas[0];
  const resto = vencidas.length - 1;

  return (
    <section className="chamada cobrar">
      <div className="chamada-texto">
        <h2>
          {vencidas.length === 1
            ? "1 follow up vencido"
            : `${vencidas.length} follow ups vencidos`}
        </h2>
        <p className="meta">
          {primeira.empresa} · {primeira.cargo} ·{" "}
          {haQuantoVenceu(primeira.follow_up as string, hoje)}
          {resto > 0 && (resto === 1 ? " · e mais 1" : ` · e mais ${resto}`)}
        </p>
      </div>
    </section>
  );
}
