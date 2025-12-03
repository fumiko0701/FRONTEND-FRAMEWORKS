import React, { useState, useEffect, useMemo } from "react";
import RemoteSelect from "./RemoteSelect";

export default function FormModal({
  open,
  onClose,
  fields = [],
  onSubmit,
  submitText = "Enviar"
}) {

  // Memoiza o cálculo de valores iniciais: SEMPRE estável!
  const initialValues = useMemo(() => {
    return Object.fromEntries(fields.map((f) => [f.name, f.defaultValue ?? ""]));
  }, [fields]);

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeField, setActiveField] = useState(null);

  // Quando abrir ou quando "fields" mudar → resetar o formulário
  useEffect(() => {
    if (open) {
      setValues(initialValues);
      setErrors([]);
      setActiveField(null);
    }
  }, [open, initialValues]);

  function updateValue(name, value) {
    setValues((prev) => ({ ...prev, [name]: value }));
    setActiveField(null);
  }

  function handleChange(e, field) {
    setActiveField(null);
    updateValue(field.name, e.target.value);
  }

  function validateFields() {
    const errs = [];
    for (const f of fields) {
      const v = values[f.name];

      if (f.required) {
        const empty =
          v === undefined ||
          v === null ||
          (typeof v === "string" && v.trim() === "") ||
          (typeof v === "object" && (v.id === undefined || v.id === null || v.id === ""));

        if (empty) errs.push(`${f.label} é obrigatório.`);
      }
    }
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors([]);

    const errs = validateFields();
    if (errs.length > 0) return setErrors(errs);

    try {
      setLoading(true);
      await onSubmit(values);
    } catch (err) {
      const msg = err?.response?.data?.erro || err?.message || "Erro ao enviar formulário.";
      setErrors([msg]);
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  const labelStyle = { marginBottom: 6, color: "#e6d8c6", fontSize: 14 };
  const inputStyle = {
    padding: 10,
    borderRadius: 10,
    border: "1px solid #3b312a",
    background: "#1a1816",
    color: "#fff",
    outline: "none",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        padding: 16,
      }}
      onClick={() => setActiveField(null)}
    >
      <div
        style={{
          background: "#151617",
          padding: 20,
          borderRadius: 12,
          minWidth: 320,
          maxWidth: 560,
          width: "100%",
          border: "1px solid #2d2520",
          boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ color: "#f5e6cf", marginBottom: 12 }}>{submitText}</h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {errors.length > 0 && (
            <div style={{ color: "#ff8b81", fontSize: 14 }}>
              {errors.map((err, i) => <div key={i}>• {err}</div>)}
            </div>
          )}

          {fields.map((f) => (
            <div key={f.name} style={{ display: "flex", flexDirection: "column" }}>
              <label style={labelStyle}>{f.label}</label>

              {f.type === "remote-select" ? (
                <RemoteSelect
                  field={f}
                  value={values[f.name]}
                  onSelect={(v) => updateValue(f.name, v)}
                  activeField={activeField}
                  setActiveField={setActiveField}
                />
              ) : f.type === "select" ? (
                <select
                  value={values[f.name]}
                  onChange={(e) => updateValue(f.name, e.target.value)}
                  style={{ ...inputStyle, padding: 10 }}
                >
                  <option value="">Selecione...</option>
                  {Array.isArray(f.options) &&
                    f.options.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                </select>
              ) : (
                <input
                  type={f.type ?? "text"}
                  placeholder={f.placeholder ?? ""}
                  value={values[f.name]}
                  onChange={(e) => handleChange(e, f)}
                  onFocus={() => setActiveField(null)}
                  style={inputStyle}
                />
              )}
            </div>
          ))}

          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                background: loading ? "#3a3a3a" : "#6d4c41",
                color: "#fff",
                fontWeight: "700",
                border: "none",
                cursor: loading ? "default" : "pointer",
              }}
            >
              {loading ? "Enviando..." : submitText}
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveField(null);
                onClose();
              }}
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                background: "#2b2b2b",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              Fechar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
