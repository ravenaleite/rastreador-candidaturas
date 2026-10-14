import { describe, it, expect } from "vitest";
import { calcularMetricas, porcentagem } from "./metricas";
import type { Candidatura, Status } from "./tipos";

const HOJE = "2026-10-14";

// Monta uma candidatura so com o que o teste precisa; o resto
// fica com valor neutro para o teste nao virar um muro de texto.
function candidatura(status: Status, followUp: string | null = null): Candidatura {
  return {
    id: Math.random().toString(36).slice(2),
    empresa: "Empresa",
    cargo: "Frontend Junior",
    link: null,
    data_candidatura: "2026-10-01",
    status,
    follow_up: followUp,
    observacoes: null,
  };
}

describe("calcularMetricas", () => {
  it("lista vazia nao quebra e nao devolve NaN", () => {
    const m = calcularMetricas([], HOJE);
    expect(m.total).toBe(0);
    expect(m.responderam).toBe(0);
    expect(m.taxaResposta).toBe(0);
    expect(Number.isNaN(m.taxaResposta)).toBe(false);
    expect(m.porEtapa.aplicado).toBe(0);
  });

  it("conta quantas estao em cada etapa", () => {
    const m = calcularMetricas(
      [
        candidatura("aplicado"),
        candidatura("aplicado"),
        candidatura("entrevista"),
        candidatura("recusado"),
      ],
      HOJE,
    );
    expect(m.total).toBe(4);
    expect(m.porEtapa.aplicado).toBe(2);
    expect(m.porEtapa.entrevista).toBe(1);
    expect(m.porEtapa.recusado).toBe(1);
    expect(m.porEtapa.proposta).toBe(0);
  });

  it("sair de aplicado conta como resposta, recusa inclusive", () => {
    const m = calcularMetricas(
      [candidatura("aplicado"), candidatura("entrevista"), candidatura("recusado")],
      HOJE,
    );
    expect(m.responderam).toBe(2);
    expect(m.taxaResposta).toBeCloseTo(2 / 3);
  });

  it("ninguem respondeu: taxa zero", () => {
    const m = calcularMetricas([candidatura("aplicado"), candidatura("aplicado")], HOJE);
    expect(m.taxaResposta).toBe(0);
  });

  it("todas responderam: taxa cheia", () => {
    const m = calcularMetricas([candidatura("proposta")], HOJE);
    expect(m.taxaResposta).toBe(1);
  });

  it("conta as atrasadas e ignora as recusadas", () => {
    const m = calcularMetricas(
      [
        candidatura("aplicado", "2026-10-10"),   // venceu
        candidatura("em_processo", "2026-10-30"), // ainda nao
        candidatura("entrevista", null),          // sem prazo
        candidatura("recusado", "2026-01-01"),    // encerrada
      ],
      HOJE,
    );
    expect(m.atrasadas).toBe(1);
  });
});

describe("porcentagem", () => {
  it("formata como inteiro com o sinal", () => {
    expect(porcentagem(0)).toBe("0%");
    expect(porcentagem(1)).toBe("100%");
    expect(porcentagem(2 / 3)).toBe("67%");
  });
});
