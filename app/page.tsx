import { redirect } from "next/navigation";

// A raiz nao tem conteudo proprio. Quem esta logado vai para o
// painel; quem nao esta e mandado para /entrar pelo middleware.
export default function Raiz() {
  redirect("/painel");
}
