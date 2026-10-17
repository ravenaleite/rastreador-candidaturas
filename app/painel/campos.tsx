"use client";

import { STATUS, ROTULO } from "@/lib/tipos";
import type { EntradaCandidatura } from "@/lib/validacao";

/**
 * Os campos de uma candidatura, usados pela tela de criar e pela de
 * editar. Um componente so para os dois: se amanha entrar um campo
 * novo, ele aparece nas duas telas sem ninguem precisar lembrar.
 */
export default function CamposCandidatura({
  valores,
}: {
  valores: EntradaCandidatura;
}) {
  return (
    <>
      <div className="linha-dupla">
        <label className="campo">
          <span>Empresa</span>
          <input
            name="empresa"
            required
            maxLength={120}
            autoFocus
            defaultValue={valores.empresa}
          />
        </label>

        <label className="campo">
          <span>Cargo</span>
          <input name="cargo" required maxLength={120} defaultValue={valores.cargo} />
        </label>
      </div>

      <label className="campo">
        <span>Link da vaga</span>
        <input
          name="link"
          placeholder="linkedin.com/jobs/..."
          defaultValue={valores.link}
        />
      </label>

      <div className="linha-tripla">
        <label className="campo">
          <span>Data da candidatura</span>
          <input
            type="date"
            name="data_candidatura"
            required
            defaultValue={valores.data_candidatura}
          />
        </label>

        <label className="campo">
          <span>Follow up</span>
          <input type="date" name="follow_up" defaultValue={valores.follow_up} />
        </label>

        <label className="campo">
          <span>Status</span>
          <select name="status" defaultValue={valores.status}>
            {STATUS.map((s) => (
              <option key={s} value={s}>
                {ROTULO[s]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="campo">
        <span>Observações</span>
        <textarea
          name="observacoes"
          rows={3}
          maxLength={1000}
          defaultValue={valores.observacoes}
        />
      </label>
    </>
  );
}
