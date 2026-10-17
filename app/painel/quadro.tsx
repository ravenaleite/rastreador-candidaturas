"use client";

import Link from "next/link";
import { useOptimistic, useTransition } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useState } from "react";

import { STATUS, ROTULO, type Candidatura, type Status } from "@/lib/tipos";
import { ehStatus, estaAtrasado, podeMover } from "@/lib/status";
import { exibirData } from "@/lib/data";
import { apagarCandidatura, moverCandidatura } from "./acoes";

type Mudanca = { id: string; para: Status };

export default function Quadro({
  candidaturas,
  hoje,
}: {
  candidaturas: Candidatura[];
  hoje: string;
}) {
  const [arrastando, setArrastando] = useState<Candidatura | null>(null);
  const [, iniciar] = useTransition();

  /**
   * A tela nao espera o banco. Mostramos o card na coluna nova na
   * hora e so depois mandamos a mudanca. Se o servidor recusar, o
   * revalidatePath devolve a verdade e o React desfaz sozinho.
   */
  const [itens, aplicarOtimista] = useOptimistic(
    candidaturas,
    (atual: Candidatura[], mudanca: Mudanca) =>
      atual.map((c) => (c.id === mudanca.id ? { ...c, status: mudanca.para } : c)),
  );

  /**
   * O PointerSensor so comeca a arrastar depois de 6px de movimento.
   * Sem isso, um clique no "Apagar" ou no "Ver vaga" vira arrasto e
   * o link nunca abre.
   *
   * O KeyboardSensor existe porque arrastar com mouse nao pode ser o
   * unico caminho: com ele da para mover o card por teclado, usando
   * espaco para pegar e as setas para andar entre colunas.
   */
  const sensores = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );

  function aoPegar(evento: DragStartEvent) {
    const achado = itens.find((c) => c.id === evento.active.id);
    setArrastando(achado ?? null);
  }

  /**
   * Mover um card. Serve ao arrasto e ao seletor "Mover para", que
   * existe porque arrastar nao pode ser o unico caminho: no celular
   * as colunas empilham, e levar um card de Aplicado ate Proposta
   * com o dedo atravessa varias telas de rolagem. Quem usa teclado
   * tem o mesmo problema.
   */
  function mover(card: Candidatura, destino: Status) {
    // A mesma regra que roda no servidor e nos testes.
    if (!podeMover(card.status, destino)) return;
    iniciar(async () => {
      aplicarOtimista({ id: card.id, para: destino });
      await moverCandidatura(card.id, destino);
    });
  }

  function aoSoltar(evento: DragEndEvent) {
    setArrastando(null);

    const destino = evento.over?.id;
    if (typeof destino !== "string" || !ehStatus(destino)) return;

    const card = itens.find((c) => c.id === evento.active.id);
    if (card) mover(card, destino);
  }

  return (
    <DndContext
      /* Sem um id fixo, o dnd-kit numera os ids de acessibilidade
         com um contador interno. O servidor conta ate 1, o
         navegador recomeca do 0, e o React acusa que o HTML dos
         dois lados nao bate. Com o id abaixo os nomes viram
         deterministicos. */
      id="quadro-candidaturas"
      sensors={sensores}
      onDragStart={aoPegar}
      onDragEnd={aoSoltar}
      onDragCancel={() => setArrastando(null)}
    >
      <div className="quadro">
        {STATUS.map((status) => (
          <Coluna
            key={status}
            status={status}
            cards={itens.filter((c) => c.status === status)}
            hoje={hoje}
            aoMover={mover}
            podeReceber={arrastando ? podeMover(arrastando.status, status) : false}
          />
        ))}
      </div>

      {/* O card que acompanha o cursor. Sem isso o original some
          da coluna e a pessoa arrasta o nada. */}
      <DragOverlay>
        {arrastando && <Card candidatura={arrastando} hoje={hoje} flutuando />}
      </DragOverlay>
    </DndContext>
  );
}

function Coluna({
  status,
  cards,
  hoje,
  podeReceber,
  aoMover,
}: {
  status: Status;
  cards: Candidatura[];
  hoje: string;
  podeReceber: boolean;
  aoMover: (card: Candidatura, destino: Status) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  const classe = ["coluna", isOver && podeReceber ? "alvo" : "", podeReceber ? "disponivel" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <section ref={setNodeRef} className={classe} data-status={status}>
      <h2>
        {ROTULO[status]} <span className="contador">{cards.length}</span>
      </h2>

      {cards.length === 0 ? (
        /* Coluna vazia precisa mostrar que e um alvo. Sem isso a
           pessoa ve so o titulo e nao sabe onde soltar — foi
           exatamente o que aconteceu no primeiro teste de uso. */
        <p className="solte-aqui">Solte um card aqui</p>
      ) : (
        cards.map((c) => (
          <Card key={c.id} candidatura={c} hoje={hoje} aoMover={aoMover} />
        ))
      )}
    </section>
  );
}

function Card({
  candidatura: c,
  hoje,
  flutuando = false,
  aoMover,
}: {
  candidatura: Candidatura;
  hoje: string;
  flutuando?: boolean;
  aoMover?: (card: Candidatura, destino: Status) => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: c.id,
    disabled: flutuando,
  });

  const atrasada = estaAtrasado(c.follow_up, hoje, c.status);

  const classe = [
    "card",
    atrasada ? "atrasado" : "",
    isDragging ? "fantasma" : "",
    flutuando ? "flutuando" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article ref={setNodeRef} className={classe}>
      {/* So o cabecalho arrasta. O resto do card continua clicavel,
          entao o link da vaga e o botao de apagar funcionam normal. */}
      <div className="pega" {...listeners} {...attributes}>
        <h3>{c.empresa}</h3>
        <p className="apoio">{c.cargo}</p>
      </div>

      <p className="meta">Aplicou em {exibirData(c.data_candidatura)}</p>

      {c.follow_up && (
        <p className={atrasada ? "meta aviso-atraso" : "meta"}>
          {atrasada ? "Follow up venceu em " : "Follow up em "}
          {exibirData(c.follow_up)}
        </p>
      )}

      {c.observacoes && <p className="nota">{c.observacoes}</p>}

      {!flutuando && aoMover && <SeletorMover candidatura={c} aoMover={aoMover} />}

      {!flutuando && (
        <div className="rodape-card">
          {c.link ? (
            <a href={c.link} target="_blank" rel="noopener noreferrer">
              Ver vaga
            </a>
          ) : (
            <span />
          )}
          <span className="acoes-card">
            <Link className="link-discreto" href={`/candidatura/${c.id}`}>
              Editar
            </Link>
            <form action={apagarCandidatura}>
              <input type="hidden" name="id" value={c.id} />
              <button className="link-discreto">Apagar</button>
            </form>
          </span>
        </div>
      )}
    </article>
  );
}

/**
 * O segundo caminho para mover um card, sem arrastar.
 *
 * Lista so os destinos que podeMover aceita, entao um card em
 * "recusado" nao mostra seletor nenhum — a mesma regra do quadro,
 * dita de outro jeito.
 */
function SeletorMover({
  candidatura: c,
  aoMover,
}: {
  candidatura: Candidatura;
  aoMover: (card: Candidatura, destino: Status) => void;
}) {
  const destinos = STATUS.filter((s) => podeMover(c.status, s));
  if (destinos.length === 0) return null;

  return (
    <label className="mover">
      <span className="apenas-leitor">Mover {c.empresa} para</span>
      <select
        value=""
        onChange={(e) => {
          const destino = e.target.value;
          if (ehStatus(destino)) aoMover(c, destino);
        }}
      >
        <option value="">Mover para…</option>
        {destinos.map((s) => (
          <option key={s} value={s}>
            {ROTULO[s]}
          </option>
        ))}
      </select>
    </label>
  );
}
