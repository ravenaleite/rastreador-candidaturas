import { type NextRequest } from "next/server";
import { atualizarSessao } from "@/lib/supabase/middleware";

export async function middleware(requisicao: NextRequest) {
  return await atualizarSessao(requisicao);
}

export const config = {
  // Roda em tudo, menos nos arquivos estaticos. Sem esta lista, o
  // middleware rodaria tambem para cada imagem e cada script, de graca.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
