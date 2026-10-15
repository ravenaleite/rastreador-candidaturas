import { describe, it, expect } from "vitest";
import {
  validarCandidatura,
  ehDataValida,
  normalizarLink,
  LIMITES,
  type EntradaCandidatura,
} from "./validacao";

function entrada(trocas: Partial<EntradaCandidatura> = {}): EntradaCandidatura {
  return {
    empresa: "Nubank",
    cargo: "Frontend Junior",
    link: "",
    data_candidatura: "2026-10-15",
    status: "aplicado",
    follow_up: "",
    observacoes: "",
    ...trocas,
  };
}

describe("ehDataValida", () => {
  it("aceita uma data real", () => {
    expect(ehDataValida("2026-10-15")).toBe(true);
  });

  it("recusa dia que nao existe no calendario", () => {
    expect(ehDataValida("2026-02-31")).toBe(false);
  });

  it("aceita 29 de fevereiro em ano bissexto", () => {
    expect(ehDataValida("2028-02-29")).toBe(true);
  });

  it("recusa 29 de fevereiro fora do ano bissexto", () => {
    expect(ehDataValida("2027-02-29")).toBe(false);
  });

  it("recusa formato diferente de AAAA-MM-DD", () => {
    expect(ehDataValida("15/10/2026")).toBe(false);
    expect(ehDataValida("")).toBe(false);
  });
});

describe("normalizarLink", () => {
  it("devolve nulo quando esta vazio", () => {
    expect(normalizarLink("   ")).toBe(null);
  });

  it("mantem o endereco que ja veio completo", () => {
    expect(normalizarLink("https://vaga.com/1")).toBe("https://vaga.com/1");
  });

  it("acrescenta https quando falta", () => {
    expect(normalizarLink("linkedin.com/jobs/123")).toBe("https://linkedin.com/jobs/123");
  });
});

describe("validarCandidatura", () => {
  it("aceita o preenchimento minimo", () => {
    const r = validarCandidatura(entrada());
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.valor.empresa).toBe("Nubank");
      expect(r.valor.link).toBe(null);
      expect(r.valor.follow_up).toBe(null);
      expect(r.valor.observacoes).toBe(null);
    }
  });

  it("tira espacos sobrando das pontas", () => {
    const r = validarCandidatura(entrada({ empresa: "  Nubank  ", cargo: " Dev " }));
    expect(r.ok && r.valor.empresa).toBe("Nubank");
    expect(r.ok && r.valor.cargo).toBe("Dev");
  });

  it("recusa empresa em branco", () => {
    const r = validarCandidatura(entrada({ empresa: "   " }));
    expect(r.ok).toBe(false);
  });

  it("recusa cargo em branco", () => {
    expect(validarCandidatura(entrada({ cargo: "" })).ok).toBe(false);
  });

  it("recusa texto maior que o limite", () => {
    const r = validarCandidatura(entrada({ empresa: "a".repeat(LIMITES.empresa + 1) }));
    expect(r.ok).toBe(false);
  });

  it("recusa status que nao existe", () => {
    const r = validarCandidatura(entrada({ status: "contratado" }));
    expect(r.ok).toBe(false);
    expect(r.ok === false && r.erro).toMatch(/status/i);
  });

  it("recusa follow up anterior a candidatura", () => {
    const r = validarCandidatura(
      entrada({ data_candidatura: "2026-10-15", follow_up: "2026-10-10" }),
    );
    expect(r.ok).toBe(false);
  });

  it("aceita follow up no mesmo dia da candidatura", () => {
    const r = validarCandidatura(
      entrada({ data_candidatura: "2026-10-15", follow_up: "2026-10-15" }),
    );
    expect(r.ok).toBe(true);
  });

  it("guarda o link ja com esquema", () => {
    const r = validarCandidatura(entrada({ link: "vagas.com/frontend" }));
    expect(r.ok && r.valor.link).toBe("https://vagas.com/frontend");
  });
});
