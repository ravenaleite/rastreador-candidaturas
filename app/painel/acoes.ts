"use server";

import { revalidatePath } from "next/cache";
import { criarClienteServidor } from "@/lib/supabase/servidor";
import { validarCandidatura, type EntradaCandidatura } from "@/lib/validacao";
import { ehStatus, podeMover } from "@/lib/status";

export type EstadoCadastro = { erro?: string; ok?: boolean };

function texto(dados: FormData, campo: string): string {
  return String(dados.get(campo) ?? "");
}

export async function criarCandidatura(
  _anterior: EstadoCadastro,
  dados: FormData,
): Promise<EstadoCadastro> {
  const entrada: EntradaCandidatura = {
    empresa: texto(dados, "empresa"),
    cargo: texto(dados, "cargo"),
    link: texto(dados, "link"),
    data_candidatura: texto(dados, "data_candidatura"),
    status: texto(dados, "status"),
    follow_up: texto(dados, "follow_up"),
    observacoes: texto(dados, "observacoes"),
  };

  // As mesmas regras que os testes cobrem. O formulario tambem valida
  // no navegador, mas aquilo e conveniencia: qualquer um desliga o
  // required pelo DevTools, entao a palavra final e aqui no servidor.
  const conferido = validarCandidatura(entrada);
  if (!conferido.ok) return { erro: conferido.erro };

  const supabase = await criarClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { erro: "Sua sessão expirou. Entre de novo." };

  const { error } = await supabase
    .from("candidaturas")
    .insert({ ...conferido.valor, usuario_id: user.id });

  if (error) return { erro: "Não consegui salvar agora. Tente de novo." };

  revalidatePath("/painel");
  return { ok: true };
}

export async function moverCandidatura(id: string, destino: string) {
  if (!ehStatus(destino)) return;

  const supabase = await criarClienteServidor();

  // Lemos antes de escrever porque a regra de transicao depende de
  // onde o card estava. A RLS garante que so volta linha se for dela.
  const { data: atual } = await supabase
    .from("candidaturas")
    .select("status")
    .eq("id", id)
    .single();

  if (!atual || !ehStatus(atual.status)) return;
  if (!podeMover(atual.status, destino)) return;

  await supabase.from("candidaturas").update({ status: destino }).eq("id", id);
  revalidatePath("/painel");
}

export async function apagarCandidatura(dados: FormData) {
  const id = String(dados.get("id") ?? "");
  if (!id) return;

  const supabase = await criarClienteServidor();
  await supabase.from("candidaturas").delete().eq("id", id);
  revalidatePath("/painel");
}
