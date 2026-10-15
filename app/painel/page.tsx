import type { Metadata } from "next";
import { criarClienteServidor } from "@/lib/supabase/servidor";
import { sair } from "../entrar/acoes";

export const metadata: Metadata = { title: "Painel · Rastreador de candidaturas" };

export default async function PaginaPainel() {
  const supabase = await criarClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // O middleware ja barra quem nao esta logado, entao aqui user
  // sempre existe. O ?? e so para o TypeScript ficar tranquilo.
  const email = user?.email ?? "";

  return (
    <div className="interno">
      <header className="topo-app">
        <div>
          <h1>Minhas candidaturas</h1>
          <p className="apoio">{email}</p>
        </div>
        <form action={sair}>
          <button className="botao-vazado">Sair</button>
        </form>
      </header>

      <section className="vazio">
        <h2>Nenhuma candidatura ainda</h2>
        <p>
          O quadro com as cinco colunas entra aqui. Por enquanto, o que já
          funciona é o login: esta página só abre para quem tem sessão, e o
          banco só devolve as linhas de quem está pedindo.
        </p>
      </section>
    </div>
  );
}
