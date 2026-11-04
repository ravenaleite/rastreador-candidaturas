/**
 * Regras da troca de senha, sem React e sem Supabase, para
 * poderem ser testadas sozinhas (mesma ideia de validacao.ts).
 */

export const SENHA_MINIMA = 6;

export type ResultadoSenha = { ok: true; senha: string } | { ok: false; erro: string };

export function validarNovaSenha(senha: string, confirmacao: string): ResultadoSenha {
  if (!senha || !confirmacao) return { ok: false, erro: "Preencha os dois campos." };
  if (senha.length < SENHA_MINIMA) {
    return { ok: false, erro: `A senha precisa de pelo menos ${SENHA_MINIMA} caracteres.` };
  }
  if (senha !== confirmacao) return { ok: false, erro: "As senhas não são iguais." };
  return { ok: true, senha };
}

const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function emailValido(email: string): boolean {
  return FORMATO_EMAIL.test(email.trim());
}

/**
 * Para onde mandar a pessoa depois do link do e-mail. So aceita
 * caminhos internos: um "next=https://site-falso.com" vindo na URL
 * viraria um redirecionamento aberto, e isso e golpe pronto.
 */
export function destinoSeguro(next: string | null, padrao = "/painel"): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.includes("\\")) {
    return padrao;
  }
  return next;
}
