// Os cinco status, na ordem em que aparecem no quadro.
// "as const" congela o array: o TypeScript passa a tratar cada item
// como um valor literal, e e dai que sai o tipo Status abaixo.
export const STATUS = [
  "aplicado",
  "em_processo",
  "entrevista",
  "proposta",
  "recusado",
] as const;

export type Status = (typeof STATUS)[number];

// O banco guarda sem acento e sem espaco; a tela mostra com.
// Converter so nas pontas evita acento virando caractere estranho
// em URL, em exportacao e em nome de coluna.
export const ROTULO: Record<Status, string> = {
  aplicado: "Aplicado",
  em_processo: "Em processo",
  entrevista: "Entrevista",
  proposta: "Proposta",
  recusado: "Recusado",
};

export type Candidatura = {
  id: string;
  empresa: string;
  cargo: string;
  link: string | null;
  /** Data no formato YYYY-MM-DD, como o Postgres devolve. */
  data_candidatura: string;
  status: Status;
  /** Quando cobrar retorno. YYYY-MM-DD, ou null se nao definiu. */
  follow_up: string | null;
  observacoes: string | null;
};
