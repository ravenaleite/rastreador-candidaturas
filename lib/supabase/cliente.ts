import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente para codigo que roda no NAVEGADOR.
 *
 * Usa a chave publishable, que e feita para ficar exposta. Quem
 * protege os dados e o Row Level Security no banco, nao o segredo
 * da chave.
 */
export function criarClienteNavegador() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
