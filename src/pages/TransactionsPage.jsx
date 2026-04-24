import { useState, useEffect, useCallback } from "react";
import { api } from "../api/api";
import { fmt } from "../components/Shared";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getTransactions({ search, type, from, to });
      setTransactions(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search, type, from, to]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  const totalReceived = transactions
    .filter((t) => t.type === "received")
    .reduce((s, t) => s + t.quantity, 0);
  const totalIssued = transactions
    .filter((t) => t.type === "issued")
    .reduce((s, t) => s + t.quantity, 0);

  function clearFilters() {
    setSearch("");
    setType("all");
    setFrom("");
    setTo("");
  }

  const hasFilters = search || type !== "all" || from || to;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-title">Transaction History</div>
          <div className="page-sub">
            All ledger entries · {transactions.length} records
          </div>
        </div>
        {hasFilters && (
          <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
            Clear filters
          </button>
        )}
      </div>

      <div className="stats-row" style={{ marginBottom: 20 }}>
        <div className="stat-card">
          <div className="stat-label">Entries shown</div>
          <div className="stat-value accent">{transactions.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total received</div>
          <div className="stat-value" style={{ color: "var(--green)" }}>
            {fmt(totalReceived)}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total issued</div>
          <div className="stat-value" style={{ color: "var(--red)" }}>
            {fmt(totalIssued)}
          </div>
        </div>
      </div>

      <div className="filter-row">
        <div className="search-input-wrap" style={{ flex: 2, minWidth: 180 }}>
          <span className="search-icon">⌕</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search item or remarks…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="form-group">
          <span className="form-label">Type</span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={{ width: 120 }}
          >
            <option value="all">All types</option>
            <option value="received">Received</option>
            <option value="issued">Issued</option>
          </select>
        </div>
        <div className="form-group">
          <span className="form-label">From date</span>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            style={{ width: 145 }}
          />
        </div>
        <div className="form-group">
          <span className="form-label">To date</span>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            style={{ width: 145 }}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading…</div>
      ) : transactions.length === 0 ? (
        <div className="empty-state">No transactions found</div>
      ) : (
        <div className="tx-table-wrap">
          <table className="tx-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Particular</th>
                <th>Type</th>
                <th style={{ textAlign: "right" }}>Quantity</th>
                <th>Unit</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx._id}>
                  <td className="td-mono">{tx.date}</td>
                  <td style={{ fontWeight: 500 }}>{tx.itemName}</td>
                  <td>
                    <span
                      className={`type-pill ${tx.type === "received" ? "type-received" : "type-issued"}`}
                    >
                      {tx.type}
                    </span>
                  </td>
                  <td className="td-mono" style={{ textAlign: "right" }}>
                    <span
                      className={tx.type === "received" ? "td-green" : "td-red"}
                    >
                      {tx.type === "received" ? "+" : "−"}
                      {fmt(tx.quantity)}
                    </span>
                  </td>
                  <td className="td-dim" style={{ fontSize: 12 }}>
                    {tx.itemUnit}
                  </td>
                  <td className="td-dim" style={{ fontSize: 12 }}>
                    {tx.remarks || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
