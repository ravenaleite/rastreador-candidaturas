"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { criarClienteServidor } from "@/lib/supabase/servidor";

export type EstadoForm = { erro?: string; aviso?: string };

/**
 * O Supabase responde em ingles. Traduzimos as mensagens que o
 * usuario pode realmente encontrar; o resto cai no texto generico,
 * porque mostrar erro cru de biblioteca nao ajuda ninguem.
 */
function traduzir(mensagem: string): string {
  const m = mensagem.toLowerCase();
  if (m.includes("invalid login credentials")) return "E-mail ou senha incorretos.";
  if (m.includes("email not confirmed")) return "Confirme o e-mail antes de entrar.";
  if (m.includes("user already registered")) return "Esse e-mail já tem conta. Tente entrar.";
  if (m.includes("password should be at least")) return "A senha precisa de pelo menos 6 caracteres.";
  if (m.includes("unable to validate email")) return "E-mail inválido.";
  if (m.includes("rate limit")) return "Muitas tentativas seguidas. Espere um minuto.";
  return "Não consegui concluir agora. Tente de novo em instantes.";
}

function lerFormulario(dados: FormData) {
  return {
    email: String(dados.get("email") ?? "").trim(),
    senha: String(dados.get("senha") ?? ""),
  };
}

export async function entrar(
  _anterior: EstadoForm,
  dados: FormData,
): Promise<EstadoForm> {
  const { email, senha } = lerFormulario(dados);
  if (!email || !senha) return { erro: "Preencha e-mail e senha." };

  const supabase = await criarClienteServidor();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: senha,
  });

  if (error) return { erro: traduzir(error.message) };

  // Limpa o cache das paginas para que elas sejam remontadas ja
  // com a sessao nova.
  revalidatePath("/", "layout");
  redirect("/painel");
}

export async function cadastrar(
  _anterior: EstadoForm,
  dados: FormData,
): Promise<EstadoForm> {
  const { email, senha } = lerFormulario(dados);
  if (!email || !senha) return { erro: "Preencha e-mail e senha." };
  if (senha.length < 6) return { erro: "A senha precisa de pelo menos 6 caracteres." };

  const supabase = await criarClienteServidor();
  const { data, error } = await supabase.auth.signUp({
    email,
    password: senha,
  });

  if (error) return { erro: traduzir(error.message) };

  // Quando a confirmacao por e-mail esta ligada, o Supabase cria o
  // usuario mas nao abre sessao. Avisamos em vez de redirecionar
  // para uma pagina que o middleware devolveria.
  if (!data.session) {
    return { aviso: "Conta criada. Confirme o e-mail para entrar." };
  }

  revalidatePath("/", "layout");
  redirect("/painel");
}

export async function sair() {
  const supabase = await criarClienteServidor();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/entrar");
}
