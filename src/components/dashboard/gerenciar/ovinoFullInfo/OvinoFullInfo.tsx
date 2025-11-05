import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import OvinoCardFull from "../../../common/cards/ovinoCard/OvinoCardFull";
import type { Ovino } from "../../../../api/models/ovino/OvinoModel";
import { OvinoService } from "../../../../api/services/ovino/OvinoService";
import Button from "../../../common/buttons/Button";
import { toast } from "react-toastify";
import "./OvinoFullInfo.css";

import { TypeRaca } from "../../../../api/enums/typeRaca/TypeRaca";
import { TypeStatus } from "../../../../api/enums/typeStatus/TypeStatus";
import { TypeGrauPureza } from "../../../../api/enums/typeGrauPureza/TypeGrauPureza";

import { PartoService } from "../../../../api/services/parto/PartoService";
import { CompraService } from "../../../../api/services/compra/CompraService";

const OvinoFullInfo: React.FC = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const ovinoInicial = state?.ovino as Ovino | undefined;

  const [ovino, setOvino] = useState<Ovino | null>(ovinoInicial ?? null);
  const [editField, setEditField] = useState<keyof Ovino | null>(null);
  const [tempValue, setTempValue] = useState<any>("");
  const [loading, setLoading] = useState(false);

  const [ovinos, setOvinos] = useState<Ovino[]>([]);
  const [partos, setPartos] = useState<any[]>([]);
  const [compras, setCompras] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [ovinosData, partosData, comprasData] = await Promise.all([
          OvinoService.listarTodos(),
          PartoService.listar(),
          CompraService.listarTodos?.() ?? [],
        ]);
        setOvinos(ovinosData);
        setPartos(partosData);
        setCompras(comprasData);
      } catch (err) {
        console.error("Erro ao carregar relacionamentos:", err);
      }
    })();
  }, []);

  if (!ovino) {
    return <p>Carregando dados do ovino {id}...</p>;
  }

  const handleDisable = async () => {
    if (!ovino.id) return;
    if (!window.confirm("Tem certeza que deseja desativar este ovino?")) return;

    try {
      await OvinoService.desativar(ovino.id);
      toast.success("Ovino desativado com sucesso!");
      navigate("/dashboard/ovinos");
    } catch (err: any) {
      console.error(err);
      toast.error("Erro ao desativar ovino.");
    }
  };

  const handleEdit = (field: keyof Ovino) => {
    setEditField(field);
    const value = (ovino as any)[field];
    setTempValue(
      typeof value === "object" && value !== null
        ? (value.id ?? "")
        : (value ?? "")
    );
  };

  const handleSave = async () => {
    if (!ovino || !editField) return;

    try {
      setLoading(true);

      let newValue: any = tempValue;

      if (["ovinoMae", "ovinoPai"].includes(editField)) {
        newValue = ovinos.find((o) => o.id === Number(tempValue)) ?? null;
      } else if (editField === "parto") {
        newValue = partos.find((p) => p.id === Number(tempValue)) ?? null;
      } else if (editField === "compra") {
        newValue = compras.find((c) => c.id === Number(tempValue)) ?? null;
      }

      let finalValue = newValue;

      if (String(editField).toLowerCase().includes("data") && newValue) {
        finalValue = newValue.includes("T") ? newValue : `${newValue}T00:00:00`;
      }

      const updated = { ...ovino, [editField]: finalValue };

      await OvinoService.editar(ovino.id, updated as any);

      toast.success("Campo atualizado com sucesso!");
      setOvino(updated);
      setEditField(null);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao atualizar o campo.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditField(null);
    setTempValue("");
  };

  const renderInput = () => {
    if (!editField) return null;
    if (editField === "sexo") {
      return (
        <select
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
        >
          <option value="">Selecione</option>
          <option value="MACHO">Macho</option>
          <option value="FEMEA">Fêmea</option>
        </select>
      );
    }

    if (editField === "raca") {
      return (
        <select
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
        >
          <option value="">Selecione</option>
          {Object.values(TypeRaca).map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      );
    }
    if (editField === "status") {
      return (
        <select
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
        >
          <option value="">Selecione</option>
          {Object.values(TypeStatus).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      );
    }
    if (editField === "grauPureza") {
      return (
        <select
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
        >
          <option value="">Selecione</option>
          {Object.values(TypeGrauPureza).map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      );
    }

    if (editField === "ovinoMae" || editField === "ovinoPai") {
      const options = ovinos.filter((o) =>
        editField === "ovinoMae" ? o.sexo === "Fêmea" : o.sexo === "Macho"
      );
      return (
        <select
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
        >
          <option value="">Selecione</option>
          {options.map((o) => (
            <option key={o.id} value={o.id}>
              {o.nome || `#${o.id}`} — RFID: {o.rfid ?? "—"}
            </option>
          ))}
        </select>
      );
    }

    if (editField === "parto") {
      return (
        <select
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
        >
          <option value="">Selecione</option>
          {partos.map((p) => (
            <option key={p.id} value={p.id}>
              Parto #{p.id} — {p.dataParto?.split("T")[0]}
            </option>
          ))}
        </select>
      );
    }

    if (editField === "compra") {
      return (
        <select
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
        >
          <option value="">Selecione</option>
          {compras.map((c) => (
            <option key={c.id} value={c.id}>
              Compra #{c.id}
            </option>
          ))}
        </select>
      );
    }

    const isDate = String(editField).toLowerCase().includes("data");
    return (
      <input
        type={isDate ? "dateTime-local" : "text"}
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
      />
    );
  };

  return (
    <div className="ovinoFullInfo flex-column">
      <OvinoCardFull
        ovino={ovino}
        onEdit={handleEdit}
        onRemove={handleDisable}
      />

      {editField && (
        <div className="edit-overlay">
          <div className="edit-panel">
            <h3>Editando: {editField}</h3>
            {renderInput()}
            <div className="edit-buttons">
              <Button
                variant="cardPrimary"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? "Salvando..." : "Salvar"}
              </Button>
              <Button
                variant="cardSecondary"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OvinoFullInfo;
