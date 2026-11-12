"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useMemo, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  Download,
  Eye,
  EyeOff,
  FileJson,
  FileSpreadsheet,
  Heart,
  Lock,
  LogOut,
  MapPin,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Search,
  Settings,
  Sparkles,
  Star,
  Trash2,
  X,
} from "lucide-react";
import {
  DEFAULT_SITE_SETTINGS,
  buildMapUrl,
  getFullVenue,
} from "../lib/eventData";
import type { BlessingRecord, SiteSettings } from "../lib/types";

interface AdminDashboardProps {
  initialAuthenticated: boolean;
  initialBlessings: BlessingRecord[];
  initialSettings: SiteSettings;
}

type AdminTab = "blessings" | "settings" | "overview";
type FilterMode = "all" | "approved" | "hidden" | "featured";

function formatTimestamp(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function escapeCsv(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

export function AdminDashboard({
  initialAuthenticated,
  initialBlessings,
  initialSettings,
}: AdminDashboardProps) {
  const [authenticated, setAuthenticated] = useState(initialAuthenticated);
  const [passcode, setPasscode] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<AdminTab>("blessings");
  const [blessings, setBlessings] = useState<BlessingRecord[]>(initialBlessings);
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState({ name: "", message: "" });

  const [addOpen, setAddOpen] = useState(false);
  const [newWish, setNewWish] = useState({
    name: "",
    message: "",
    featured: false,
  });
  const [adding, setAdding] = useState(false);

  const [savingSettings, setSavingSettings] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [statusBanner, setStatusBanner] = useState<string | null>(null);

  const flashBanner = useCallback((msg: string) => {
    setStatusBanner(msg);
    window.setTimeout(() => {
      setStatusBanner((prev) => (prev === msg ? null : prev));
    }, 2800);
  }, []);

  const loadAdminData = useCallback(async () => {
    setRefreshing(true);
    try {
      const [bRes, sRes] = await Promise.all([
        fetch("/api/admin/blessings", { cache: "no-store" }),
        fetch("/api/admin/settings", { cache: "no-store" }),
      ]);

      if (bRes.status === 401 || sRes.status === 401) {
        setAuthenticated(false);
        return;
      }

      if (bRes.ok) {
        const bJson = (await bRes.json()) as { blessings: BlessingRecord[] };
        setBlessings(bJson.blessings);
      }
      if (sRes.ok) {
        const sJson = (await sRes.json()) as { settings: SiteSettings };
        setSettings(sJson.settings);
      }
    } finally {
      setRefreshing(false);
    }
  }, []);

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!passcode.trim()) {
      setAuthError("Please enter the admin passcode.");
      return;
    }

    setAuthLoading(true);
    setAuthError(null);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });

      const data = (await res.json()) as {
        authenticated?: boolean;
        error?: string;
      };

      if (!res.ok || !data.authenticated) {
        setAuthError(data.error || "Invalid passcode.");
        return;
      }

      setAuthenticated(true);
      setPasscode("");
      await loadAdminData();
    } catch {
      setAuthError("Unable to reach the server. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setAuthenticated(false);
    setBlessings([]);
  }

  async function handleToggle(
    id: string,
    field: "approved" | "featured",
    currentValue: boolean
  ) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/blessings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: !currentValue }),
      });
      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }
      if (res.ok) {
        const data = (await res.json()) as { blessing: BlessingRecord };
        setBlessings((prev) =>
          prev.map((item) => (item.id === id ? data.blessing : item))
        );
        flashBanner(
          field === "featured"
            ? !currentValue
              ? "Marked as featured blessing"
              : "Removed featured highlight"
            : !currentValue
              ? "Blessing is now visible on site"
              : "Blessing hidden from public view"
        );
      }
    } finally {
      setBusyId(null);
    }
  }

  function startEdit(item: BlessingRecord) {
    setEditingId(item.id);
    setEditDraft({ name: item.name, message: item.message });
    setConfirmDeleteId(null);
  }

  async function saveEdit(id: string) {
    if (!editDraft.name.trim() || !editDraft.message.trim()) {
      flashBanner("Name and blessing message cannot be empty.");
      return;
    }

    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/blessings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editDraft.name.trim(),
          message: editDraft.message.trim(),
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as { blessing: BlessingRecord };
        setBlessings((prev) =>
          prev.map((item) => (item.id === id ? data.blessing : item))
        );
        setEditingId(null);
        flashBanner("Blessing updated");
      }
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: string) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/blessings/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setBlessings((prev) => prev.filter((item) => item.id !== id));
        setConfirmDeleteId(null);
        flashBanner("Blessing deleted from data/blessings.json");
      }
    } finally {
      setBusyId(null);
    }
  }

  async function handleAddManual(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!newWish.name.trim() || !newWish.message.trim()) {
      flashBanner("Both name and blessing message are required.");
      return;
    }
    setAdding(true);
    try {
      const res = await fetch("/api/admin/blessings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newWish.name.trim(),
          message: newWish.message.trim(),
          approved: true,
          featured: newWish.featured,
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as { blessing: BlessingRecord };
        setBlessings((prev) => [data.blessing, ...prev]);
        setNewWish({ name: "", message: "", featured: false });
        setAddOpen(false);
        flashBanner("Blessing added and saved to JSON");
      }
    } finally {
      setAdding(false);
    }
  }

  async function handleSaveSettings(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }
      if (res.ok) {
        const data = (await res.json()) as { settings: SiteSettings };
        setSettings(data.settings);
        flashBanner("Site settings saved to data/site-settings.json");
      } else {
        flashBanner("Could not save site settings.");
      }
    } finally {
      setSavingSettings(false);
    }
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(blessings, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "raja-nadhiya-blessings.json";
    a.click();
    URL.revokeObjectURL(url);
    flashBanner("Exported blessings JSON");
  }

  function exportCsv() {
    const header = ["ID", "Name", "Blessing Message", "Visible", "Featured", "Created At"];
    const rows = blessings.map((b) =>
      [
        escapeCsv(b.id),
        escapeCsv(b.name),
        escapeCsv(b.message),
        escapeCsv(b.approved ? "Yes" : "No"),
        escapeCsv(b.featured ? "Yes" : "No"),
        escapeCsv(b.createdAt),
      ].join(",")
    );
    const csv = [header.join(","), ...rows].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "raja-nadhiya-blessings.csv";
    a.click();
    URL.revokeObjectURL(url);
    flashBanner("Exported blessings CSV");
  }

  const stats = useMemo(() => {
    const approved = blessings.filter((b) => b.approved).length;
    const featured = blessings.filter((b) => b.featured).length;
    const diff = new Date(settings.eventIso).getTime() - Date.now();
    const daysLeft = Math.max(0, Math.ceil(diff / 86400000));
    return {
      total: blessings.length,
      approved,
      hidden: blessings.length - approved,
      featured,
      daysLeft,
    };
  }, [blessings, settings.eventIso]);

  const filteredBlessings = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return blessings.filter((item) => {
      if (filterMode === "approved" && !item.approved) return false;
      if (filterMode === "hidden" && item.approved) return false;
      if (filterMode === "featured" && !item.featured) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.message.toLowerCase().includes(q)
      );
    });
  }, [blessings, filterMode, searchQuery]);

  if (!authenticated) {
    return (
      <div className="admin-login-shell">
        <div className="admin-login-card">
          <div className="admin-login-crest">
            <Image
              src="/rn-logo.png"
              alt="R & N monogram"
              width={548}
              height={520}
              className="admin-logo-img"
              priority
            />
          </div>
          <p className="admin-kicker">Protected Workspace</p>
          <h1>Engagement Admin Panel</h1>
          <p className="admin-login-sub">
            Sign in with your passcode to manage guest blessings and site
            details for {settings.couple}.
          </p>

          <form className="admin-login-form" onSubmit={handleLogin}>
            <label className="blessing-label" htmlFor="admin-passcode-input">
              Admin Passcode
            </label>
            <div className="admin-pass-wrap">
              <Lock size={15} className="admin-pass-icon" />
              <input
                id="admin-passcode-input"
                type={showPasscode ? "text" : "password"}
                className="blessing-input admin-pass-input"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (authError) setAuthError(null);
                }}
                placeholder="Enter admin passcode"
                autoFocus
              />
              <button
                type="button"
                className="admin-pass-toggle"
                onClick={() => setShowPasscode((v) => !v)}
                aria-label={showPasscode ? "Hide passcode" : "Show passcode"}
              >
                {showPasscode ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {authError && (
              <p className="blessing-error" role="alert">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="primary-button admin-login-submit"
              disabled={authLoading}
            >
              {authLoading ? "Verifying..." : "Unlock Admin Panel"}
            </button>
          </form>

          <Link className="admin-back-link" href="/">
            <ArrowLeft size={14} /> Back to Invitation Site
          </Link>
        </div>
      </div>
    );
  }

  const fullVenue = getFullVenue(settings);
  const mapUrl = buildMapUrl(fullVenue);

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-header-inner">
          <div className="admin-brand">
            <span className="brand-logo-ring">
              <Image
                src="/rn-logo.png"
                alt="R & N Logo"
                width={548}
                height={520}
                className="brand-logo-img"
              />
            </span>
            <div>
              <strong>{settings.couple} Admin</strong>
              <small>Blessings &amp; Event Manager</small>
            </div>
          </div>

          <div className="admin-header-actions">
            <Link className="secondary-button admin-btn-sm" href="/">
              View Site <ArrowUpRight size={14} />
            </Link>
            <button
              type="button"
              className="secondary-button admin-btn-sm"
              onClick={handleLogout}
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="admin-container">
        {statusBanner && (
          <div className="admin-status-banner" role="status">
            <Sparkles size={14} />
            <span>{statusBanner}</span>
          </div>
        )}

        <section className="admin-stats-grid" aria-label="Summary statistics">
          <div className="admin-stat-card">
            <span className="admin-stat-label">Total Blessings</span>
            <strong className="admin-stat-value">{stats.total}</strong>
            <span className="admin-stat-hint">Saved in blessings.json</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-label">Public on Site</span>
            <strong className="admin-stat-value">{stats.approved}</strong>
            <span className="admin-stat-hint">
              {stats.hidden} private (sender &amp; admin)
            </span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-label">Featured Wishes</span>
            <strong className="admin-stat-value">{stats.featured}</strong>
            <span className="admin-stat-hint">Pinned at top of list</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-label">Countdown</span>
            <strong className="admin-stat-value">{stats.daysLeft}d</strong>
            <span className="admin-stat-hint">{settings.dateShort}</span>
          </div>
        </section>

        <nav className="admin-tabs" aria-label="Admin sections">
          <button
            type="button"
            className={`admin-tab ${activeTab === "blessings" ? "is-active" : ""}`}
            onClick={() => setActiveTab("blessings")}
          >
            <Heart size={15} /> Blessings ({stats.total})
          </button>
          <button
            type="button"
            className={`admin-tab ${activeTab === "settings" ? "is-active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <Settings size={15} /> Event &amp; Site Data
          </button>
          <button
            type="button"
            className={`admin-tab ${activeTab === "overview" ? "is-active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <FileJson size={15} /> Assets &amp; Storage
          </button>
        </nav>

        {activeTab === "blessings" && (
          <section className="admin-panel-card">
            <div className="admin-toolbar">
              <div className="admin-search-box">
                <Search size={15} />
                <input
                  type="search"
                  placeholder="Search by guest name or wish..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="admin-filter-pills">
                {(
                  [
                    ["all", `All (${stats.total})`],
                    ["approved", `Public (${stats.approved})`],
                    ["hidden", `Private (${stats.hidden})`],
                    ["featured", `Featured (${stats.featured})`],
                  ] as const
                ).map(([mode, label]) => (
                  <button
                    key={mode}
                    type="button"
                    className={`admin-filter-pill ${filterMode === mode ? "is-active" : ""}`}
                    onClick={() => setFilterMode(mode)}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="admin-toolbar-actions">
                <button
                  type="button"
                  className="primary-button admin-btn-sm"
                  onClick={() => setAddOpen((v) => !v)}
                >
                  <Plus size={14} /> Add Blessing
                </button>
                <button
                  type="button"
                  className="secondary-button admin-btn-sm"
                  onClick={loadAdminData}
                  disabled={refreshing}
                >
                  <RefreshCw
                    size={14}
                    className={refreshing ? "spin-icon" : ""}
                  />
                  Refresh
                </button>
                <button
                  type="button"
                  className="secondary-button admin-btn-sm"
                  onClick={exportJson}
                  disabled={blessings.length === 0}
                >
                  <FileJson size={14} /> JSON
                </button>
                <button
                  type="button"
                  className="secondary-button admin-btn-sm"
                  onClick={exportCsv}
                  disabled={blessings.length === 0}
                >
                  <FileSpreadsheet size={14} /> CSV
                </button>
              </div>
            </div>

            {addOpen && (
              <form className="admin-add-form" onSubmit={handleAddManual}>
                <div className="admin-add-head">
                  <strong>Add a Blessing Manually</strong>
                  <button
                    type="button"
                    className="admin-icon-btn"
                    onClick={() => setAddOpen(false)}
                    aria-label="Close add form"
                  >
                    <X size={15} />
                  </button>
                </div>
                <div className="admin-form-grid">
                  <div className="blessing-field-group">
                    <label className="blessing-label" htmlFor="admin-add-name">
                      Guest Name *
                    </label>
                    <input
                      id="admin-add-name"
                      type="text"
                      className="blessing-input"
                      value={newWish.name}
                      onChange={(e) =>
                        setNewWish((p) => ({ ...p, name: e.target.value }))
                      }
                      placeholder="e.g., Uncle Ramesh & Family"
                      maxLength={60}
                      required
                    />
                  </div>
                  <div className="blessing-field-group admin-checkbox-align">
                    <label className="admin-checkbox-label">
                      <input
                        type="checkbox"
                        checked={newWish.featured}
                        onChange={(e) =>
                          setNewWish((p) => ({
                            ...p,
                            featured: e.target.checked,
                          }))
                        }
                      />
                      <span>Feature at top of blessings list</span>
                    </label>
                  </div>
                </div>
                <div className="blessing-field-group">
                  <label className="blessing-label" htmlFor="admin-add-msg">
                    Blessing Message *
                  </label>
                  <textarea
                    id="admin-add-msg"
                    className="blessing-textarea"
                    rows={2}
                    value={newWish.message}
                    onChange={(e) =>
                      setNewWish((p) => ({ ...p, message: e.target.value }))
                    }
                    placeholder="Write the blessing message..."
                    maxLength={280}
                    required
                  />
                </div>
                <div className="admin-add-actions">
                  <button
                    type="submit"
                    className="primary-button admin-btn-sm"
                    disabled={adding}
                  >
                    <Save size={14} /> {adding ? "Saving..." : "Save Blessing"}
                  </button>
                </div>
              </form>
            )}

            {filteredBlessings.length === 0 ? (
              <div className="admin-empty-state">
                <Heart size={26} />
                <h3>No blessings match this view</h3>
                <p>
                  {blessings.length === 0
                    ? "Guest blessings submitted from the invitation popup will appear here and save to data/blessings.json."
                    : "Try clearing the search box or switching filter tabs."}
                </p>
              </div>
            ) : (
              <div className="admin-blessings-list">
                {filteredBlessings.map((item) => {
                  const isEditing = editingId === item.id;
                  const isConfirmingDelete = confirmDeleteId === item.id;
                  const isBusy = busyId === item.id;

                  return (
                    <article
                      key={item.id}
                      className={`admin-blessing-row ${!item.approved ? "is-hidden-item" : ""}`}
                    >
                      <div className="admin-blessing-main">
                        <div className="admin-blessing-meta">
                          <strong>{item.name}</strong>
                          <span
                            className={`admin-badge ${item.approved ? "badge-visible" : "badge-hidden"}`}
                          >
                            {item.approved ? "Public" : "Private"}
                          </span>
                          {item.featured && (
                            <span className="admin-badge badge-featured">
                              <Star size={11} fill="currentColor" /> Featured
                            </span>
                          )}
                          <span className="admin-time">
                            {formatTimestamp(item.createdAt)}
                          </span>
                        </div>

                        {isEditing ? (
                          <div className="admin-edit-fields">
                            <input
                              type="text"
                              className="blessing-input"
                              value={editDraft.name}
                              onChange={(e) =>
                                setEditDraft((d) => ({
                                  ...d,
                                  name: e.target.value,
                                }))
                              }
                              maxLength={60}
                            />
                            <textarea
                              className="blessing-textarea"
                              rows={2}
                              value={editDraft.message}
                              onChange={(e) =>
                                setEditDraft((d) => ({
                                  ...d,
                                  message: e.target.value,
                                }))
                              }
                              maxLength={280}
                            />
                          </div>
                        ) : (
                          <p className="admin-blessing-text">“{item.message}”</p>
                        )}
                      </div>

                      <div className="admin-row-actions">
                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              className="admin-action-btn is-primary"
                              onClick={() => saveEdit(item.id)}
                              disabled={isBusy}
                            >
                              <Check size={14} /> Save
                            </button>
                            <button
                              type="button"
                              className="admin-action-btn"
                              onClick={() => setEditingId(null)}
                            >
                              <X size={14} /> Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              className={`admin-action-btn ${item.featured ? "is-gold" : ""}`}
                              onClick={() =>
                                handleToggle(item.id, "featured", item.featured)
                              }
                              disabled={isBusy}
                              title="Toggle featured"
                            >
                              <Star
                                size={14}
                                fill={item.featured ? "currentColor" : "none"}
                              />
                              <span>{item.featured ? "Unstar" : "Feature"}</span>
                            </button>
                            <button
                              type="button"
                              className="admin-action-btn"
                              onClick={() =>
                                handleToggle(item.id, "approved", item.approved)
                              }
                              disabled={isBusy}
                              title={
                                item.approved
                                  ? "Restrict visibility to sender & admin only"
                                  : "Publish publicly on the invitation site"
                              }
                            >
                              {item.approved ? (
                                <EyeOff size={14} />
                              ) : (
                                <Eye size={14} />
                              )}
                              <span>
                                {item.approved ? "Make Private" : "Publish"}
                              </span>
                            </button>
                            <button
                              type="button"
                              className="admin-action-btn"
                              onClick={() => startEdit(item)}
                              disabled={isBusy}
                            >
                              <Pencil size={14} /> Edit
                            </button>
                            {isConfirmingDelete ? (
                              <button
                                type="button"
                                className="admin-action-btn is-danger"
                                onClick={() => handleDelete(item.id)}
                                disabled={isBusy}
                              >
                                Confirm?
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="admin-action-btn is-danger-ghost"
                                onClick={() => setConfirmDeleteId(item.id)}
                                disabled={isBusy}
                                aria-label="Delete blessing"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {activeTab === "settings" && (
          <section className="admin-panel-card">
            <form className="admin-settings-form" onSubmit={handleSaveSettings}>
              <div className="admin-section-intro">
                <div>
                  <h2>Event &amp; Invitation Data</h2>
                  <p>
                    Updates saved here persist to{" "}
                    <code>data/site-settings.json</code> and immediately update
                    the live invitation page.
                  </p>
                </div>
                <button
                  type="button"
                  className="secondary-button admin-btn-sm"
                  onClick={() => setSettings(DEFAULT_SITE_SETTINGS)}
                >
                  Reset Defaults
                </button>
              </div>

              <div className="admin-form-grid">
                <div className="blessing-field-group">
                  <label className="blessing-label" htmlFor="set-groom">
                    Groom Name
                  </label>
                  <input
                    id="set-groom"
                    className="blessing-input"
                    value={settings.groom}
                    onChange={(e) =>
                      setSettings((s) => ({ ...s, groom: e.target.value }))
                    }
                  />
                </div>
                <div className="blessing-field-group">
                  <label className="blessing-label" htmlFor="set-bride">
                    Bride Name
                  </label>
                  <input
                    id="set-bride"
                    className="blessing-input"
                    value={settings.bride}
                    onChange={(e) =>
                      setSettings((s) => ({ ...s, bride: e.target.value }))
                    }
                  />
                </div>
                <div className="blessing-field-group">
                  <label className="blessing-label" htmlFor="set-date-display">
                    Date Display
                  </label>
                  <input
                    id="set-date-display"
                    className="blessing-input"
                    value={settings.dateDisplay}
                    onChange={(e) =>
                      setSettings((s) => ({ ...s, dateDisplay: e.target.value }))
                    }
                  />
                </div>
                <div className="blessing-field-group">
                  <label className="blessing-label" htmlFor="set-time-display">
                    Time Display
                  </label>
                  <input
                    id="set-time-display"
                    className="blessing-input"
                    value={settings.timeDisplay}
                    onChange={(e) =>
                      setSettings((s) => ({ ...s, timeDisplay: e.target.value }))
                    }
                  />
                </div>
                <div className="blessing-field-group">
                  <label className="blessing-label" htmlFor="set-day">
                    Day Label
                  </label>
                  <input
                    id="set-day"
                    className="blessing-input"
                    value={settings.dayDisplay}
                    onChange={(e) =>
                      setSettings((s) => ({ ...s, dayDisplay: e.target.value }))
                    }
                  />
                </div>
                <div className="blessing-field-group">
                  <label className="blessing-label" htmlFor="set-date-short">
                    Short Date
                  </label>
                  <input
                    id="set-date-short"
                    className="blessing-input"
                    value={settings.dateShort}
                    onChange={(e) =>
                      setSettings((s) => ({ ...s, dateShort: e.target.value }))
                    }
                  />
                </div>
                <div className="blessing-field-group">
                  <label className="blessing-label" htmlFor="set-venue-name">
                    Venue Name
                  </label>
                  <input
                    id="set-venue-name"
                    className="blessing-input"
                    value={settings.venueName}
                    onChange={(e) =>
                      setSettings((s) => ({ ...s, venueName: e.target.value }))
                    }
                  />
                </div>
                <div className="blessing-field-group">
                  <label className="blessing-label" htmlFor="set-locality">
                    Venue Locality
                  </label>
                  <input
                    id="set-locality"
                    className="blessing-input"
                    value={settings.venueLocality}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        venueLocality: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="blessing-field-group">
                  <label className="blessing-label" htmlFor="set-region">
                    Region &amp; PIN
                  </label>
                  <input
                    id="set-region"
                    className="blessing-input"
                    value={settings.venueRegion}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        venueRegion: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="blessing-field-group">
                  <label className="blessing-label" htmlFor="set-iso">
                    Countdown Target (ISO)
                  </label>
                  <input
                    id="set-iso"
                    className="blessing-input"
                    value={settings.eventIso}
                    onChange={(e) =>
                      setSettings((s) => ({ ...s, eventIso: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="admin-toggle-box">
                <label className="admin-checkbox-label">
                  <input
                    type="checkbox"
                    checked={settings.showPublicBlessings}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        showPublicBlessings: e.target.checked,
                      }))
                    }
                  />
                  <span>
                    Allow admin-published blessings to appear publicly below the
                    &ldquo;Shower Your Blessings&rdquo; button (new guest wishes
                    stay private to sender &amp; admin unless published)
                  </span>
                </label>
              </div>

              <div className="blessing-field-group">
                <span className="blessing-label">
                  Quick-Pick Blessing Presets (shown in the popup)
                </span>
                <div className="admin-quick-list">
                  {settings.quickBlessings.map((wish, idx) => (
                    <input
                      key={idx}
                      type="text"
                      className="blessing-input"
                      value={wish}
                      onChange={(e) => {
                        const next = [...settings.quickBlessings];
                        next[idx] = e.target.value;
                        setSettings((s) => ({ ...s, quickBlessings: next }));
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="admin-settings-footer">
                <button
                  type="submit"
                  className="primary-button"
                  disabled={savingSettings}
                >
                  <Save size={15} />{" "}
                  {savingSettings ? "Saving Settings..." : "Save Site Settings"}
                </button>
              </div>
            </form>
          </section>
        )}

        {activeTab === "overview" && (
          <section className="admin-panel-card">
            <div className="admin-overview-grid">
              <div className="admin-overview-block">
                <h3>
                  <CalendarDays size={16} /> Active Ceremony Summary
                </h3>
                <dl className="admin-dl">
                  <div>
                    <dt>Couple</dt>
                    <dd>{settings.couple}</dd>
                  </div>
                  <div>
                    <dt>Date &amp; Time</dt>
                    <dd>
                      {settings.dateDisplay} &middot; {settings.timeDisplay}
                    </dd>
                  </div>
                  <div>
                    <dt>Venue</dt>
                    <dd>{fullVenue}</dd>
                  </div>
                  <div>
                    <dt>Local JSON Files</dt>
                    <dd>
                      <code>data/blessings.json</code> &amp;{" "}
                      <code>data/site-settings.json</code>
                    </dd>
                  </div>
                </dl>
                <a
                  className="secondary-button admin-btn-sm"
                  href={mapUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MapPin size={14} /> Open Venue in Maps{" "}
                  <ArrowUpRight size={13} />
                </a>
              </div>

              <div className="admin-overview-block">
                <h3>Media &amp; QR Assets</h3>
                <div className="admin-assets-grid">
                  <div className="admin-asset-card">
                    <Image
                      src="/rn-logo.png"
                      alt="RN Logo"
                      width={548}
                      height={520}
                      className="admin-asset-thumb"
                    />
                    <span>R &amp; N Monogram</span>
                    <a href="/rn-logo.png" download="RN-Logo.png">
                      <Download size={12} /> Download
                    </a>
                  </div>
                  <div className="admin-asset-card">
                    <Image
                      src="/location-qr.jpg"
                      alt="Venue Location QR"
                      width={433}
                      height={430}
                      className="admin-asset-thumb"
                    />
                    <span>Location QR</span>
                    <a
                      href="/location-qr.jpg"
                      download="Raja-Nadhiya-Location-QR.jpg"
                    >
                      <Download size={12} /> Download
                    </a>
                  </div>
                  <div className="admin-asset-card">
                    <Image
                      src="/engagement-invitation.png"
                      alt="Engagement Invitation"
                      width={1055}
                      height={1491}
                      className="admin-asset-thumb"
                    />
                    <span>Invitation Card</span>
                    <a
                      href="/engagement-invitation.png"
                      download="Raja-Nadhiya-Invitation.png"
                    >
                      <Download size={12} /> Download
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

