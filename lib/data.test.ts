import { describe, it, expect } from "vitest";
import { diasEntre, haQuantoVenceu, exibirData, dataDeHoje } from "./data";

describe("diasEntre", () => {
  it("conta dias corridos", () => {
    expect(diasEntre("2026-10-05", "2026-10-15")).toBe(10);
  });

  it("devolve zero no mesmo dia", () => {
    expect(diasEntre("2026-10-15", "2026-10-15")).toBe(0);
  });

  it("atravessa a virada do mes", () => {
    expect(diasEntre("2026-09-28", "2026-10-02")).toBe(4);
  });

  it("nao erra na mudanca de horario de verao", () => {
    // Datas que em fuso local poderiam dar 23h ou 25h de diferenca.
    expect(diasEntre("2026-02-14", "2026-02-16")).toBe(2);
  });

  it("devolve negativo quando a segunda data e anterior", () => {
    expect(diasEntre("2026-10-15", "2026-10-10")).toBe(-5);
  });
});

describe("haQuantoVenceu", () => {
  it("fala no singular com um dia", () => {
    expect(haQuantoVenceu("2026-10-14", "2026-10-15")).toBe("venceu ontem");
  });

  it("fala no plural com varios dias", () => {
    expect(haQuantoVenceu("2026-10-05", "2026-10-15")).toBe("venceu há 10 dias");
  });

  it("trata o proprio dia como ainda nao vencido", () => {
    expect(haQuantoVenceu("2026-10-15", "2026-10-15")).toBe("vence hoje");
  });
});

describe("exibirData", () => {
  it("troca a ordem sem passar por Date", () => {
    expect(exibirData("2026-10-15")).toBe("15/10/2026");
  });
});

describe("dataDeHoje", () => {
  it("devolve sempre no formato AAAA-MM-DD", () => {
    expect(dataDeHoje()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("usa o fuso de Brasilia, nao o do servidor", () => {
    // 1h UTC de 16/10 ainda e dia 15 em Brasilia (UTC-3).
    expect(dataDeHoje(new Date("2026-10-16T01:00:00Z"))).toBe("2026-10-15");
  });
});
