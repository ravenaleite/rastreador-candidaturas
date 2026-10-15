import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/** Paginas que podem ser abertas sem estar logado. */
const PUBLICAS = ["/entrar"];

/**
 * Roda antes de cada requisicao. Faz duas coisas:
 *
 * 1. Renova o token da sessao e devolve os cookies atualizados.
 *    Sem isso a pessoa seria deslogada quando o token vencesse.
 *
 * 2. Decide quem pode entrar onde. Sem sessao, so as paginas
 *    publicas; com sessao, a tela de login redireciona pro painel.
 *
 * Usamos getUser() e nao getSession(): getSession le o cookie e
 * acredita nele, enquanto getUser pergunta ao servidor do Supabase
 * se o token e mesmo valido. Para decidir acesso, confiar no cookie
 * do navegador nao serve.
 */
export async function atualizarSessao(requisicao: NextRequest) {
  let resposta = NextResponse.next({ request: requisicao });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return requisicao.cookies.getAll();
        },
        setAll(novos) {
          for (const { name, value } of novos) {
            requisicao.cookies.set(name, value);
          }
          resposta = NextResponse.next({ request: requisicao });
          for (const { name, value, options } of novos) {
            resposta.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const caminho = requisicao.nextUrl.pathname;
  const ehPublica = PUBLICAS.some((p) => caminho.startsWith(p));

  if (!user && !ehPublica) {
    const destino = requisicao.nextUrl.clone();
    destino.pathname = "/entrar";
    return NextResponse.redirect(destino);
  }

  if (user && ehPublica) {
    const destino = requisicao.nextUrl.clone();
    destino.pathname = "/painel";
    return NextResponse.redirect(destino);
  }

  return resposta;
}
