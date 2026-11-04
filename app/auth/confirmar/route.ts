import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { criarClienteServidor } from "@/lib/supabase/servidor";
import { destinoSeguro } from "@/lib/senha";

/**
 * Para onde os links dos e-mails do Supabase apontam (confirmar
 * conta, criar senha nova). O link traz um codigo de uso unico;
 * trocamos esse codigo por uma sessao e seguimos para `next`.
 *
 * Aceita os dois formatos que o Supabase pode mandar:
 * - ?code=...                 (fluxo PKCE, o padrao do @supabase/ssr)
 * - ?token_hash=...&type=...  (quando o modelo do e-mail usa token)
 */
export async function GET(requisicao: NextRequest) {
  const { searchParams, origin } = new URL(requisicao.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const tipo = searchParams.get("type") as EmailOtpType | null;
  const destino = destinoSeguro(searchParams.get("next"));

  const supabase = await criarClienteServidor();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${destino}`);
  } else if (tokenHash && tipo) {
    const { error } = await supabase.auth.verifyOtp({ type: tipo, token_hash: tokenHash });
    if (!error) return NextResponse.redirect(`${origin}${destino}`);
  }

  return NextResponse.redirect(`${origin}/entrar?link=invalido`);
}
