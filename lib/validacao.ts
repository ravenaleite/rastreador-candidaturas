import type { Status } from "./tipos";
import { ehStatus } from "./status";

/**
 * Tudo que chega de um <form> chega como texto. Esta camada recebe
 * esse texto cru e devolve ou um objeto pronto para o banco, ou uma
 * mensagem de erro em portugues.
 *
 * Ela nao sabe o que e Supabase e nao sabe o que e React, entao da
 * para testar as regras sem subir nada.
 */

export type EntradaCandidatura = {
  empresa: string;
  cargo: string;
  link: string;
  data_candidatura: string;
  status: string;
  follow_up: string;
  observacoes: string;
};

export type CandidaturaValidada = {
  empresa: string;
  cargo: string;
  link: string | null;
  data_candidatura: string;
  status: Status;
  follow_up: string | null;
  observacoes: string | null;
};

export type Resultado =
  | { ok: true; valor: CandidaturaValidada }
  | { ok: false; erro: string };

export const LIMITES = { empresa: 120, cargo: 120, observacoes: 1000 } as const;

const FORMATO_DATA = /^\d{4}-\d{2}-\d{2}$/;

/**
 * "2026-02-31" passa no formato mas nao existe no calendario. O
 * jeito mais curto de conferir e deixar o proprio Date normalizar e
 * ver se ele mudou o texto: 31 de fevereiro vira 3 de marco.
 */
export function ehDataValida(texto: string): boolean {
  if (!FORMATO_DATA.test(texto)) return false;
  const data = new Date(`${texto}T00:00:00Z`);
  if (Number.isNaN(data.getTime())) return false;
  return data.toISOString().slice(0, 10) === texto;
}

/**
 * Ninguem digita "https://" ao colar o link de uma vaga. Guardamos
 * sempre com o esquema, senao o href vira caminho relativo e o
 * clique leva para dentro do proprio site.
 */
export function normalizarLink(bruto: string): string | null {
  const texto = bruto.trim();
  if (!texto) return null;
  if (/^https?:\/\//i.test(texto)) return texto;
  return `https://${texto}`;
}

export function validarCandidatura(entrada: EntradaCandidatura): Resultado {
  const empresa = entrada.empresa.trim();
  const cargo = entrada.cargo.trim();
  const observacoes = entrada.observacoes.trim();
  const data = entrada.data_candidatura.trim();
  const followUp = entrada.follow_up.trim();

  if (!empresa) return { ok: false, erro: "Diga em qual empresa você se candidatou." };
  if (empresa.length > LIMITES.empresa)
    return { ok: false, erro: `O nome da empresa passa de ${LIMITES.empresa} caracteres.` };

  if (!cargo) return { ok: false, erro: "Diga para qual cargo." };
  if (cargo.length > LIMITES.cargo)
    return { ok: false, erro: `O cargo passa de ${LIMITES.cargo} caracteres.` };

  if (!data) return { ok: false, erro: "Informe a data da candidatura." };
  if (!ehDataValida(data)) return { ok: false, erro: "A data da candidatura não existe no calendário." };

  if (followUp && !ehDataValida(followUp))
    return { ok: false, erro: "A data de follow up não existe no calendário." };

  // Cobrar retorno antes de ter se candidatado nao faz sentido, e
  // deixar passar bagunca o destaque de atraso depois.
  if (followUp && followUp < data)
    return { ok: false, erro: "O follow up não pode ser antes da candidatura." };

  if (!ehStatus(entrada.status)) return { ok: false, erro: "Status desconhecido." };

  if (observacoes.length > LIMITES.observacoes)
    return { ok: false, erro: `As observações passam de ${LIMITES.observacoes} caracteres.` };

  return {
    ok: true,
    valor: {
      empresa,
      cargo,
      link: normalizarLink(entrada.link),
      data_candidatura: data,
      status: entrada.status,
      follow_up: followUp || null,
      observacoes: observacoes || null,
    },
  };
}
