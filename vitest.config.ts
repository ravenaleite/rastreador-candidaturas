import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Node basta: estes testes sao de funcao pura, sem DOM e sem React.
    environment: "node",
    include: ["lib/**/*.test.ts"],
  },
});
