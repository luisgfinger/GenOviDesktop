import React, { useState } from "react";
import "./DetalhesBase.css";
import ActionButtons from "../buttons/ActionButtons";
import Button from "../buttons/Button";
import { toast } from "react-toastify";

export interface CampoConfig<T> {
  label: string;
  key: keyof T;
  renderView?: (valor: any, item: T) => React.ReactNode;
  renderEdit?: (
    valor: any,
    onChange: (val: any) => void,
    item: T
  ) => React.ReactNode;
}

interface DetalhesBaseProps<T> {
  titulo: string;
  item: T;
  campos: CampoConfig<T>[];
  onSave: (atualizado: T) => Promise<void>;
  onRemove?: () => Promise<void>;
  onClose: () => void;
}

function DetalhesBase<T extends { id?: number }>({
  titulo,
  item,
  campos,
  onSave,
  onRemove,
  onClose,
}: DetalhesBaseProps<T>) {
  const [editField, setEditField] = useState<keyof T | null>(null);
  const [updated, setUpdated] = useState<T>(item);
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEditField = (field: keyof T) => {
    setEditField((prev) => (prev === field ? null : field));
  };

  const handleChange = (field: keyof T, value: any) => {
    setUpdated((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await onSave(updated);
      toast.success("Alterações salvas com sucesso!");
      setHasChanges(false);
      setEditField(null);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar alterações.");
    } finally {
      setLoading(false);
    }
  };

  const handleDiscard = () => {
    setUpdated(item);
    setEditField(null);
    setHasChanges(false);
    toast.info("Alterações descartadas.");
  };

  const handleRemove = async () => {
    if (!onRemove) return;
    if (!window.confirm("Tem certeza que deseja remover este registro?"))
      return;

    try {
      setLoading(true);
      await onRemove();
      toast.success("Registro removido com sucesso!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao remover registro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="detalhes-overlay">
      <div className="detalhes-card">
        {onRemove && (
          <ActionButtons
            className="remove-btn"
            showEdit={false}
            onRemove={handleRemove}
          />
        )}

        <h2>{titulo}</h2>

        <div className="detalhes-info">
          {campos.map((campo) => {
            const valor = updated[campo.key];
            return (
              <div className="detalhes-row" key={String(campo.key)}>
                <strong className="detalhes-title flex">{campo.label}</strong>
                {editField === campo.key ? (
                  campo.renderEdit ? (
                    campo.renderEdit(
                      valor,
                      (v) => handleChange(campo.key, v),
                      updated
                    )
                  ) : (
                    <input
                      value={valor as any}
                      onChange={(e) => handleChange(campo.key, e.target.value)}
                      maxLength={255}
                    />
                  )
                ) : (
                  <span className="detalhes-value">
                    {campo.renderView
                      ? campo.renderView(valor, updated)
                      : ((valor as React.ReactNode) ?? "—")}
                  </span>
                )}

                <ActionButtons
                  onEdit={() => handleEditField(campo.key)}
                  showRemove={false}
                />
              </div>
            );
          })}
        </div>

        <div className="detalhes-footer flex">
          {hasChanges ? (
            <>
              <Button
                variant="cardPrimary"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? "Salvando..." : "Salvar alterações"}
              </Button>
              <Button
                variant="cardSecondary"
                onClick={handleDiscard}
                disabled={loading}
              >
                Descartar alterações
              </Button>
            </>
          ) : (
            <Button
              variant="cardSecondary"
              onClick={() => {
                setEditField(null);
                onClose();
              }}
              disabled={loading}
            >
              {loading ? "Carregando..." : "Fechar"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetalhesBase;
