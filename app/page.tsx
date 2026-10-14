import { STATUS, ROTULO } from "@/lib/tipos";

// Tela provisoria. Serve para confirmar que o projeto sobe e que o
// lib/ ja esta sendo importado. O login entra no lugar disto.
export default function Pagina() {
  return (
    <main className="interno">
      <h1>Rastreador de candidaturas</h1>
      <p style={{ color: "var(--tinta-fraca)", maxWidth: "60ch" }}>
        Projeto em construção. As regras de status e o cálculo das métricas
        já estão escritos e testados em <code>lib/</code>.
      </p>

      <h2>Colunas do quadro</h2>
      <ol>
        {STATUS.map((s) => (
          <li key={s}>
            {ROTULO[s]} <code style={{ color: "var(--tinta-fraca)" }}>{s}</code>
          </li>
        ))}
      </ol>
    </main>
  );
}
