"use server";

import { headers } from "next/headers";
import { criarClienteServidor } from "@/lib/supabase/servidor";
import { emailValido } from "@/lib/senha";

export type EstadoEsqueci = { erro?: string; enviado?: boolean };

export async function pedirNovaSenha(
  _anterior: EstadoEsqueci,
  dados: FormData,
): Promise<EstadoEsqueci> {
  const email = String(dados.get("email") ?? "").trim();
  if (!emailValido(email)) return { erro: "Digite um e-mail válido." };

  // O link do e-mail precisa voltar para o mesmo site que pediu,
  // seja o da Vercel ou o localhost de desenvolvimento.
  const cabecalhos = await headers();
  const origem =
    cabecalhos.get("origin") ??
    `${cabecalhos.get("x-forwarded-proto") ?? "https"}://${cabecalhos.get("host")}`;

  const supabase = await criarClienteServidor();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origem}/auth/confirmar?next=/nova-senha`,
  });

  if (error && error.message.toLowerCase().includes("rate limit")) {
    return { erro: "Muitos pedidos seguidos. Espere um minuto e tente de novo." };
  }

  // Mesmo se o e-mail nao tiver conta, respondemos igual. Dizer
  // "esse e-mail nao existe" entregaria quem usa o app.
  return { enviado: true };
}
