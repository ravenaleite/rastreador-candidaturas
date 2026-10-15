import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Cliente para codigo que roda no SERVIDOR: Server Components,
 * Server Actions e Route Handlers.
 *
 * A sessao do usuario vive em cookies. Este cliente le esses cookies
 * da requisicao para saber quem esta pedindo, e e isso que faz o
 * auth.uid() do banco apontar para a pessoa certa.
 */
export async function criarClienteServidor() {
  const armazem = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return armazem.getAll();
        },
        setAll(novos) {
          try {
            for (const { name, value, options } of novos) {
              armazem.set(name, value, options);
            }
          } catch {
            // Um Server Component nao pode escrever cookie: a resposta
            // ja comecou a ser montada. Quem renova a sessao e o
            // middleware, entao aqui o erro pode ser ignorado.
          }
        },
      },
    },
  );
}
