import { STATUS, type Candidatura, type Status } from "./tipos";
import { estaAtrasado } from "./status";

export type Metricas = {
  total: number;
  porEtapa: Record<Status, number>;
  /** Quantas sairam de "aplicado", ou seja, tiveram alguma resposta. */
  responderam: number;
  /** Entre 0 e 1. Vale 0 quando ainda nao existe candidatura. */
  taxaResposta: number;
  atrasadas: number;
};

/**
 * Tudo que a tela de metricas mostra, calculado de uma vez.
 *
 * Funcao pura: recebe a lista e a data de hoje, devolve numeros.
 * Nao consulta banco, nao olha relogio, nao toca na tela — por isso
 * o teste roda em milissegundos e o CI consegue executar.
 *
 * Criterio da taxa de resposta: sair de "aplicado" conta como resposta,
 * inclusive uma recusa. Recusa e resposta; silencio nao e.
 */
export function calcularMetricas(
  candidaturas: Candidatura[],
  hoje: string,
): Metricas {
  const porEtapa = Object.fromEntries(
    STATUS.map((s) => [s, 0]),
  ) as Record<Status, number>;

  let atrasadas = 0;

  for (const c of candidaturas) {
    porEtapa[c.status] += 1;
    if (estaAtrasado(c.follow_up, hoje, c.status)) atrasadas += 1;
  }

  const total = candidaturas.length;
  const responderam = total - porEtapa.aplicado;

  return {
    total,
    porEtapa,
    responderam,
    // Guarda da divisao por zero: sem isso, lista vazia devolve NaN
    // e a tela mostra "NaN%" para quem acabou de criar a conta.
    taxaResposta: total === 0 ? 0 : responderam / total,
    atrasadas,
  };
}

/** Formata 0.3333 como "33%". Arredonda para o inteiro mais proximo. */
export function porcentagem(fracao: number): string {
  return `${Math.round(fracao * 100)}%`;
}
