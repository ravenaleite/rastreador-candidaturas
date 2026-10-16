import type { Metadata } from "next";
import Link from "next/link";
import { criarClienteServidor } from "@/lib/supabase/servidor";
import { sair } from "../entrar/acoes";
import { STATUS, ROTULO, type Candidatura } from "@/lib/tipos";
import { calcularMetricas, porcentagem } from "@/lib/metricas";
import { dataDeHoje } from "@/lib/data";

export const metadata: Metadata = { title: "Métricas · Rastreador de candidaturas" };

export default async function PaginaMetricas() {
  const supabase = await criarClienteServidor();
  const { data } = await supabase.from("candidaturas").select("*");

  const candidaturas = (data ?? []) as Candidatura[];
  const m = calcularMetricas(candidaturas, dataDeHoje());

  // A barra mais longa vira 100% da largura. Escalar pelo total
  // deixaria as etapas finais com 2px e invisiveis.
  const maior = Math.max(1, ...STATUS.map((s) => m.porEtapa[s]));

  return (
    <div className="interno">
      <header className="topo-app">
        <div className="topo-linha">
          <h1>Métricas</h1>
          <div className="identidade">
            <form action={sair}>
              <button className="botao-vazado">Sair</button>
            </form>
          </div>
        </div>

        <nav className="abas">
          <Link href="/painel">Quadro</Link>
          <span aria-current="page">Métricas</span>
        </nav>
      </header>

      {m.total === 0 ? (
        <section className="vazio">
          <h2>Ainda não há o que medir</h2>
          <p>
            <Link href="/painel">Cadastre a primeira candidatura</Link> e os
            números aparecem aqui.
          </p>
        </section>
      ) : (
        <>
          <div className="placar">
            <article className="ficha">
              <p className="rotulo-ficha">Candidaturas</p>
              <p className="numerao">{m.total}</p>
            </article>

            <article className="ficha">
              <p className="rotulo-ficha">Taxa de resposta</p>
              <p className="numerao">{porcentagem(m.taxaResposta)}</p>
              <p className="meta">
                {m.responderam} de {m.total} saíram de Aplicado
              </p>
            </article>

            <article className={m.atrasadas > 0 ? "ficha em-atraso" : "ficha"}>
              <p className="rotulo-ficha">Follow up vencido</p>
              <p className="numerao">{m.atrasadas}</p>
              <p className="meta">
                {m.atrasadas === 0 ? "Nada atrasado" : "Precisam de cobrança"}
              </p>
            </article>
          </div>

          <section className="funil">
            <h2>Onde elas estão</h2>

            {/* Uma serie so, entao uma cor so. O numero vai escrito ao
                lado de cada barra: quem nao enxerga a barra le o valor. */}
            <ol>
              {STATUS.map((s) => {
                const quantas = m.porEtapa[s];
                return (
                  <li key={s} data-status={s}>
                    <span className="nome-etapa">{ROTULO[s]}</span>
                    <span className="trilho">
                      {/* Zero nao desenha marca nenhuma. A barra tem uma
                          largura minima para o valor 1 nao sumir, e essa
                          minima faria o zero parecer que tem algo. */}
                      {quantas > 0 && (
                        <span
                          className="barra"
                          style={{ width: `${(quantas / maior) * 100}%` }}
                        />
                      )}
                    </span>
                    <span className="valor-etapa">{quantas}</span>
                  </li>
                );
              })}
            </ol>
          </section>

          <p className="criterio">
            <strong>Como a taxa é contada:</strong> sair de “Aplicado” conta
            como resposta, inclusive uma recusa. Recusa é resposta; silêncio
            não é. O critério está escrito em{" "}
            <code>lib/metricas.ts</code> e coberto por teste.
          </p>
        </>
      )}
    </div>
  );
}
