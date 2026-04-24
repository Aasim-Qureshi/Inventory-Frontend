import { useState } from "react";

export function Modal({ title, onClose, children }) {
  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <div className="modal-title">{title}</div>
        {children}
      </div>
    </div>
  );
}

export function AddItemModal({ onClose, onAdd }) {
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!name.trim()) {
      setError("Item name is required.");
      return;
    }
    setLoading(true);
    try {
      await onAdd({ name: name.trim(), unit: unit.trim() || "Units" });
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal title="Add new item" onClose={onClose}>
      {error && <div className="error-bar">{error}</div>}
      <div className="modal-field">
        <label className="modal-label">Particular (item name)</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Cement Bags (50kg)"
          autoFocus
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
      </div>
      <div className="modal-field">
        <label className="modal-label">Unit of measure</label>
        <input
          type="text"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          placeholder="e.g. Bags, Tons, Cubic m"
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
      </div>
      <div className="modal-actions">
        <button className="btn btn-ghost" onClick={onClose}>
          Cancel
        </button>
        <button
          className="btn btn-accent"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Adding…" : "Add item"}
        </button>
      </div>
    </Modal>
  );
}

export function fmt(n) {
  if (n === undefined || n === null) return "—";
  const num = parseFloat(n);
  return isNaN(num) ? "—" : num % 1 === 0 ? num.toString() : num.toFixed(1);
}
