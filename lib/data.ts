/**
 * O servidor da Vercel roda em UTC. Se usassemos a data dele, entre
 * 21h e meia-noite aqui ja seria o dia seguinte la, e um follow up
 * marcado para hoje apareceria como atrasado. Por isso fixamos o
 * fuso de Brasilia.
 *
 * O locale en-CA e um atalho conhecido: ele formata justamente como
 * AAAA-MM-DD, que e o formato que o resto do codigo compara.
 */
const FUSO = "America/Sao_Paulo";

export function dataDeHoje(agora: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: FUSO }).format(agora);
}

/** "2026-10-15" -> "15/10/2026", sem passar por Date e sem risco de fuso. */
export function exibirData(iso: string): string {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

/**
 * Quantos dias separam duas datas AAAA-MM-DD.
 *
 * As duas viram meia-noite UTC antes da conta. Fazer a subtracao no
 * fuso local daria 23 ou 25 horas nos dias de mudanca de horario, e
 * o resultado erraria por um dia justamente duas vezes por ano.
 */
export function diasEntre(de: string, ate: string): number {
  const UM_DIA = 86_400_000;
  const a = Date.parse(`${de}T00:00:00Z`);
  const b = Date.parse(`${ate}T00:00:00Z`);
  return Math.round((b - a) / UM_DIA);
}

/** "venceu hoje", "venceu ontem", "venceu ha 10 dias". */
export function haQuantoVenceu(followUp: string, hoje: string): string {
  const dias = diasEntre(followUp, hoje);
  if (dias <= 0) return "vence hoje";
  if (dias === 1) return "venceu ontem";
  return `venceu há ${dias} dias`;
}
