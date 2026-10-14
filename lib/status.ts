import { STATUS, type Status } from "./tipos";

/**
 * Confere se um texto qualquer e um status valido.
 * Serve para o que chega de fora: banco, URL, formulario.
 * O "v is Status" no retorno avisa o TypeScript que, depois
 * desta funcao dar true, o valor pode ser tratado como Status.
 */
export function ehStatus(valor: unknown): valor is Status {
  return typeof valor === "string" && (STATUS as readonly string[]).includes(valor);
}

/** Etapas em que a candidatura ainda esta viva, na ordem natural. */
export const ETAPAS_ATIVAS: Status[] = [
  "aplicado",
  "em_processo",
  "entrevista",
  "proposta",
];

/**
 * Pode arrastar o card de "de" para "para"?
 *
 * Duas regras, e so:
 *   1. "recusado" e ponto final. Saiu dali, nao volta.
 *   2. Entre as etapas ativas vale qualquer salto, nos dois sentidos.
 *      Processo seletivo pula fase (as vezes a entrevista vem antes
 *      da triagem) e tambem volta atras.
 *
 * Soltar o card na mesma coluna de onde saiu nao e movimento.
 */
export function podeMover(de: Status, para: Status): boolean {
  if (de === para) return false;
  if (de === "recusado") return false;
  return true;
}

/**
 * O proximo passo natural, usado pelo botao de avancar.
 * Devolve null quando nao existe proximo.
 */
export function proximoStatus(atual: Status): Status | null {
  const i = ETAPAS_ATIVAS.indexOf(atual);
  if (i === -1) return null;              // recusado nao avanca
  return ETAPAS_ATIVAS[i + 1] ?? null;    // proposta e o fim da fila
}

/**
 * O follow up ja venceu?
 *
 * "hoje" entra como parametro de proposito. Se a funcao chamasse
 * new Date() por dentro, o resultado mudaria a cada execucao e nao
 * daria para testar. Assim ela e pura: mesma entrada, mesma saida.
 *
 * Comparacao de texto funciona porque YYYY-MM-DD ordena igual a data,
 * e evita o fuso horario mudar o dia sem avisar.
 */
export function estaAtrasado(
  followUp: string | null,
  hoje: string,
  status: Status,
): boolean {
  if (!followUp) return false;            // sem prazo, nao ha atraso
  if (status === "recusado") return false; // encerrada, nao se cobra
  return followUp < hoje;
}
