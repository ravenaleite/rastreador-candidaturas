"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { criarClienteServidor } from "@/lib/supabase/servidor";
import { validarNovaSenha } from "@/lib/senha";

export type EstadoNovaSenha = { erro?: string };

export async function salvarNovaSenha(
  _anterior: EstadoNovaSenha,
  dados: FormData,
): Promise<EstadoNovaSenha> {
  const resultado = validarNovaSenha(
    String(dados.get("senha") ?? ""),
    String(dados.get("confirmacao") ?? ""),
  );
  if (!resultado.ok) return { erro: resultado.erro };

  const supabase = await criarClienteServidor();
  const { error } = await supabase.auth.updateUser({ password: resultado.senha });

  if (error) {
    const m = error.message.toLowerCase();
    if (m.includes("different from the old")) {
      return { erro: "A senha nova precisa ser diferente da antiga." };
    }
    if (m.includes("session") || m.includes("jwt")) {
      return { erro: "O link expirou. Peça um novo em “Esqueci a senha”." };
    }
    return { erro: "Não consegui salvar agora. Tente de novo em instantes." };
  }

  revalidatePath("/", "layout");
  redirect("/painel?senha=atualizada");
}
