import { describe, it, expect } from "vitest";
import { ehStatus, podeMover, proximoStatus, estaAtrasado } from "./status";

describe("ehStatus", () => {
  it("aceita os cinco valores do banco", () => {
    expect(ehStatus("aplicado")).toBe(true);
    expect(ehStatus("recusado")).toBe(true);
  });

  it("recusa qualquer outra coisa", () => {
    expect(ehStatus("Aplicado")).toBe(false); // maiuscula e o rotulo da tela
    expect(ehStatus("contratado")).toBe(false);
    expect(ehStatus(null)).toBe(false);
    expect(ehStatus(3)).toBe(false);
  });
});

describe("podeMover", () => {
  it("deixa avancar e deixa pular etapa", () => {
    expect(podeMover("aplicado", "em_processo")).toBe(true);
    expect(podeMover("aplicado", "entrevista")).toBe(true);
  });

  it("deixa voltar atras", () => {
    expect(podeMover("entrevista", "em_processo")).toBe(true);
  });

  it("deixa recusar de qualquer etapa", () => {
    expect(podeMover("aplicado", "recusado")).toBe(true);
    expect(podeMover("proposta", "recusado")).toBe(true);
  });

  it("nao deixa sair de recusado", () => {
    expect(podeMover("recusado", "entrevista")).toBe(false);
    expect(podeMover("recusado", "aplicado")).toBe(false);
  });

  it("soltar na mesma coluna nao e movimento", () => {
    expect(podeMover("entrevista", "entrevista")).toBe(false);
  });
});

describe("proximoStatus", () => {
  it("anda uma etapa", () => {
    expect(proximoStatus("aplicado")).toBe("em_processo");
    expect(proximoStatus("entrevista")).toBe("proposta");
  });

  it("para na proposta", () => {
    expect(proximoStatus("proposta")).toBeNull();
  });

  it("recusado nao avanca", () => {
    expect(proximoStatus("recusado")).toBeNull();
  });
});

describe("estaAtrasado", () => {
  const hoje = "2026-10-14";

  it("marca o prazo que ja passou", () => {
    expect(estaAtrasado("2026-10-13", hoje, "aplicado")).toBe(true);
  });

  it("o proprio dia ainda nao esta atrasado", () => {
    expect(estaAtrasado(hoje, hoje, "aplicado")).toBe(false);
  });

  it("prazo futuro nao esta atrasado", () => {
    expect(estaAtrasado("2026-10-20", hoje, "aplicado")).toBe(false);
  });

  it("sem prazo nao ha atraso", () => {
    expect(estaAtrasado(null, hoje, "aplicado")).toBe(false);
  });

  it("nao cobra retorno de candidatura recusada", () => {
    expect(estaAtrasado("2026-01-01", hoje, "recusado")).toBe(false);
  });

  it("vira o ano sem se confundir", () => {
    expect(estaAtrasado("2025-12-31", "2026-01-01", "aplicado")).toBe(true);
  });
});
