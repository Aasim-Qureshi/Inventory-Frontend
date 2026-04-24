import { useState, useEffect, useCallback } from "react";
import { api } from "../api/api";
import ItemCard from "../components/ItemCard";
import { AddItemModal, fmt } from "../components/Shared";

export default function InventoryPage() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await api.getItems(search);
      setItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  async function handleAddItem(body) {
    await api.addItem(body);
    await load();
  }

  async function handleDeleteItem(id) {
    try {
      await api.deleteItem(id);
      await load();
    } catch (e) {
      alert(e.message);
    }
  }

  const totalItems = items.length;
  const totalReceived = items.reduce((s, i) => s + i.totalReceived, 0);
  const totalIssued = items.reduce((s, i) => s + i.totalIssued, 0);
  const lowStockCount = items.filter((i) => i.balance < 50).length;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-title">Stock Register</div>
          <div className="page-sub">Cement Factory · Inventory Ledger</div>
        </div>
        <button className="btn btn-accent" onClick={() => setShowModal(true)}>
          + Add item
        </button>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">Total items</div>
          <div className="stat-value accent">{totalItems}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total received</div>
          <div className="stat-value">{fmt(totalReceived)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total issued</div>
          <div className="stat-value">{fmt(totalIssued)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Low stock alerts</div>
          <div
            className="stat-value"
            style={{
              color: lowStockCount > 0 ? "var(--accent)" : "var(--text)",
            }}
          >
            {lowStockCount}
          </div>
        </div>
      </div>

      <div className="search-row">
        <div className="search-input-wrap">
          <span className="search-icon">⌕</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search items…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading…</div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          {search
            ? "No items match your search"
            : "No items yet — add one to get started"}
        </div>
      ) : (
        <div className="items-list">
          {items.map((item) => (
            <ItemCard
              key={item._id}
              item={item}
              onRefresh={load}
              onDelete={handleDeleteItem}
            />
          ))}
        </div>
      )}

      {showModal && (
        <AddItemModal
          onClose={() => setShowModal(false)}
          onAdd={handleAddItem}
        />
      )}
    </div>
  );
}
