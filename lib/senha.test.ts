import { describe, expect, it } from "vitest";
import { destinoSeguro, emailValido, validarNovaSenha } from "./senha";

describe("validarNovaSenha", () => {
  it("aceita senha com o mínimo e confirmação igual", () => {
    expect(validarNovaSenha("abc123", "abc123")).toEqual({ ok: true, senha: "abc123" });
  });

  it("recusa campo vazio", () => {
    expect(validarNovaSenha("", "")).toEqual({ ok: false, erro: "Preencha os dois campos." });
    expect(validarNovaSenha("abc123", "").ok).toBe(false);
  });

  it("recusa senha curta", () => {
    const r = validarNovaSenha("abc12", "abc12");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.erro).toMatch(/6 caracteres/);
  });

  it("recusa quando as duas não batem", () => {
    expect(validarNovaSenha("abc123", "abc124")).toEqual({
      ok: false,
      erro: "As senhas não são iguais.",
    });
  });
});

describe("emailValido", () => {
  it("aceita e-mail comum, mesmo com espaço nas pontas", () => {
    expect(emailValido("ravena@exemplo.com")).toBe(true);
    expect(emailValido("  ravena@exemplo.com ")).toBe(true);
  });

  it("recusa texto sem formato de e-mail", () => {
    expect(emailValido("")).toBe(false);
    expect(emailValido("ravena")).toBe(false);
    expect(emailValido("ravena@exemplo")).toBe(false);
  });
});

describe("destinoSeguro", () => {
  it("aceita caminho interno", () => {
    expect(destinoSeguro("/nova-senha")).toBe("/nova-senha");
  });

  it("usa o padrão quando não vem nada", () => {
    expect(destinoSeguro(null)).toBe("/painel");
  });

  it("recusa endereço externo (redirecionamento aberto)", () => {
    expect(destinoSeguro("https://golpe.com")).toBe("/painel");
    expect(destinoSeguro("//golpe.com")).toBe("/painel");
    expect(destinoSeguro("/\\golpe.com")).toBe("/painel");
  });
});
