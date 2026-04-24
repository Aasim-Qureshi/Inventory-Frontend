import { useState } from "react";
import { api } from "../api/api";
import { fmt } from "./Shared";

export default function ItemCard({ item, onRefresh, onDelete }) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [type, setType] = useState("received");
  const [qty, setQty] = useState("");
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const lowStock = item.balance < 50;

  async function handleAddEntry() {
    if (!qty || parseFloat(qty) <= 0) {
      setError("Enter a valid quantity.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await api.addEntry(item._id, {
        date,
        type,
        quantity: parseFloat(qty),
        remarks,
      });
      setQty("");
      setRemarks("");
      await onRefresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteEntry(entryId) {
    if (!window.confirm("Delete this entry?")) return;
    try {
      await api.deleteEntry(entryId);
      await onRefresh();
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div className="item-card">
      <div className="item-card-header" onClick={() => setOpen((o) => !o)}>
        <div style={{ flex: 1 }}>
          <div className="item-card-name">{item.name}</div>
          <div className="item-card-unit">{item.unit}</div>
        </div>
        <div className="item-stats">
          <div className="item-stat">
            <div className="item-stat-label">Received</div>
            <div className="item-stat-val green">
              +{fmt(item.totalReceived)}
            </div>
          </div>
          <div className="item-stat">
            <div className="item-stat-label">Issued</div>
            <div className="item-stat-val red">−{fmt(item.totalIssued)}</div>
          </div>
          <div className="item-stat">
            <div className="item-stat-label">Balance</div>
            <div className="item-stat-val gold">{fmt(item.balance)}</div>
          </div>
          <span className={`badge ${lowStock ? "badge-amber" : "badge-green"}`}>
            {lowStock ? "Low stock" : "In stock"}
          </span>
          <button
            className="btn btn-ghost btn-sm btn-danger"
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm(`Delete "${item.name}" and all its entries?`))
                onDelete(item._id);
            }}
            title="Delete item"
          >
            ✕
          </button>
        </div>
        <span className={`chevron ${open ? "open" : ""}`}>▶</span>
      </div>

      {open && (
        <div className="item-body">
          <div className="item-totals">
            <div className="mini-stat">
              <div className="mini-stat-label">Total received</div>
              <div className="mini-stat-val green">
                +{fmt(item.totalReceived)} {item.unit}
              </div>
            </div>
            <div className="mini-stat">
              <div className="mini-stat-label">Total issued</div>
              <div className="mini-stat-val red">
                −{fmt(item.totalIssued)} {item.unit}
              </div>
            </div>
            <div className="mini-stat">
              <div className="mini-stat-label">Closing balance</div>
              <div className="mini-stat-val gold">
                {fmt(item.balance)} {item.unit}
              </div>
            </div>
          </div>

          {item.entries && item.entries.length > 0 ? (
            <table className="ledger-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Received</th>
                  <th>Issued</th>
                  <th>Balance</th>
                  <th>Remarks</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {item.entries.map((e) => (
                  <tr key={e._id}>
                    <td className="td-mono">{e.date}</td>
                    <td
                      className={e.type === "received" ? "td-green" : "td-dim"}
                    >
                      {e.type === "received" ? `+${fmt(e.quantity)}` : "—"}
                    </td>
                    <td className={e.type === "issued" ? "td-red" : "td-dim"}>
                      {e.type === "issued" ? `−${fmt(e.quantity)}` : "—"}
                    </td>
                    <td className="td-mono">{fmt(e.balance)}</td>
                    <td className="td-dim" style={{ fontSize: 12 }}>
                      {e.remarks || "—"}
                    </td>
                    <td className="td-del">
                      <button
                        className="btn btn-ghost btn-sm btn-danger"
                        onClick={() => handleDeleteEntry(e._id)}
                        title="Delete entry"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state" style={{ padding: "20px 0" }}>
              No entries yet
            </div>
          )}

          {error && <div className="error-bar">{error}</div>}

          <div className="add-entry-form">
            <div className="form-group">
              <span className="form-label">Date</span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{ width: 140 }}
              />
            </div>
            <div className="form-group">
              <span className="form-label">Type</span>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                style={{ width: 110 }}
              >
                <option value="received">Received</option>
                <option value="issued">Issued</option>
              </select>
            </div>
            <div className="form-group">
              <span className="form-label">Quantity</span>
              <input
                type="number"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                placeholder="0"
                min="0"
                step="0.5"
                style={{ width: 90 }}
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <span className="form-label">Remarks</span>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Optional note"
                style={{ minWidth: 120 }}
                onKeyDown={(e) => e.key === "Enter" && handleAddEntry()}
              />
            </div>
            <button
              className="btn btn-accent btn-sm"
              onClick={handleAddEntry}
              disabled={saving}
              style={{ alignSelf: "flex-end" }}
            >
              {saving ? "Saving…" : "+ Log entry"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
