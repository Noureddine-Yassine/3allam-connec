"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search, Eye, UserCheck, UserX, BarChart3, FileText, X,
  Download, Calendar, MapPin, Phone, Mail, Briefcase,
  AlertCircle, TrendingUp, Users, ClipboardList, LogOut,
  ChevronRight, Activity, Clock, Star, Shield, CheckCircle,
  XCircle, AlertTriangle, Play, Filter, MoreHorizontal
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { adminApi, apiConfig, unwrapListResponse } from "@/lib/api";

interface Provider {
  id: number | string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  createdAt: string;
  status?: string;
}

export default function AdminDashboardPage() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("demandes");
  const [activeSubTab, setActiveSubTab] = useState("demandes-clients");
  const [pendingProviders, setPendingProviders] = useState<Provider[]>([]);
  const [allProviders, setAllProviders] = useState<any[]>([]);
  const [allRequests, setAllRequests] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken') || localStorage.getItem('token');
    const storedUser = localStorage.getItem('userData') || localStorage.getItem('user');
    const hasValidAuth = isAuthenticated || (storedToken && storedUser);
    if (!hasValidAuth) { router.push('/login'); return; }
    let userRole = user?.role;
    if (!userRole && storedUser) {
      try { const userData = JSON.parse(storedUser); userRole = userData.role; } catch {}
    }
    if (userRole !== 'admin') { router.push('/login'); return; }
    fetchStats(); fetchPendingProviders(); fetchAllProviders(); fetchAllRequests();
  }, [isAuthenticated, user, router]);

  const fetchStats = async () => { try { const data = await adminApi.getStats(); setStats(data); } catch {} };
  const fetchAllProviders = async () => {
    try {
      const data = await adminApi.getProviders();
      setAllProviders(unwrapListResponse(data));
    } catch { setAllProviders([]); }
  };
  const fetchAllRequests = async () => {
    try {
      const data = await adminApi.getRequests();
      setAllRequests(unwrapListResponse(data));
    } catch { setAllRequests([]); }
  };
  const fetchPendingProviders = async () => {
    try {
      const data = await adminApi.getProviders('PENDING');
      setPendingProviders(unwrapListResponse<Provider>(data));
    } catch { setPendingProviders([]); }
  };

  const handleViewProvider = async (id: number | string) => {
    try { const result = await adminApi.getProviderDetail(id.toString()); setSelectedProvider(result); setIsModalOpen(true); } catch {}
  };
  const handleViewRequest = (request: any) => { setSelectedRequest(request); setIsRequestModalOpen(true); };
  const handleApprove = async (id: number | string) => {
    try {
      await adminApi.validateProvider(id.toString());
      setPendingProviders(prev => prev.filter(p => p.id !== id));
      setAllProviders(prev => prev.map(p => p.id === id ? { ...p, status: "VALIDATED" } : p));
      if (selectedProvider?.id === id) setSelectedProvider((prev: any) => prev ? { ...prev, status: "VALIDATED" } : null);
      alert("Prestataire approuvé avec succès");
      setTimeout(() => { fetchPendingProviders(); fetchAllProviders(); }, 500);
    } catch { alert("Erreur lors de l'approbation"); }
  };
  const handleReject = async (id: number | string, reason: string) => {
    try {
      await adminApi.rejectProvider(id.toString());
      setPendingProviders(prev => prev.filter(p => p.id !== id));
      setAllProviders(prev => prev.map(p => p.id === id ? { ...p, status: "REJECTED" } : p));
      if (selectedProvider?.id === id) { setSelectedProvider((prev: any) => prev ? { ...prev, status: "REJECTED" } : null); setIsModalOpen(false); }
      alert("Prestataire rejeté");
      setTimeout(() => { fetchPendingProviders(); fetchAllProviders(); }, 500);
    } catch { alert("Erreur lors du rejet"); }
  };
  const handleDelete = async (id: number | string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce prestataire?')) {
      try {
        await adminApi.deleteProvider(id.toString());
        setPendingProviders(prev => prev.filter(p => p.id !== id));
        setAllProviders(prev => prev.filter(p => p.id !== id));
        if (selectedProvider?.id === id) { setIsModalOpen(false); setSelectedProvider(null); }
        alert("Prestataire supprimé avec succès");
      } catch { alert("Erreur lors de la suppression"); }
    }
  };
  const handleLogout = () => { logout(); router.push('/'); };
  const assetUrl = (path: string) =>
    path.startsWith("http") ? path : `${apiConfig.baseURL}${path}`;
  const handleViewDocument = (url: string, title: string) =>
    window.open(assetUrl(url), "_blank");
  const handleDownloadDocument = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = assetUrl(url);
    link.download = filename;
    link.click();
  };

  const prestataires = allProviders.filter(p => ['VALIDATED', 'APPROVED', 'Validé'].includes(p.status));

  const kpiCards = [
    { title: "Total demandes", value: stats?.totalRequests?.toString() || "0", icon: ClipboardList, color: "#f27405", bg: "rgba(242,116,5,0.12)", change: null },
    { title: "Ce mois-ci", value: stats?.monthlyRequests?.toString() || "0", icon: TrendingUp, color: "#16a34a", bg: "rgba(22,163,74,0.12)", change: "+12%" },
    { title: "Prestataires actifs", value: stats?.activeProviders?.toString() || prestataires.length.toString(), icon: Users, color: "#0b2c5e", bg: "rgba(11,44,94,0.1)", change: null },
    { title: "En attente", value: stats?.pendingProviders?.toString() || pendingProviders.length.toString(), icon: Clock, color: "#d97706", bg: "rgba(217,119,6,0.12)", change: "À traiter" },
  ];

  const getUrgencyBadge = (level: string) => {
    const map: any = { STANDARD: { label: "Standard", cls: "badge-green" }, URGENT: { label: "Urgent", cls: "badge-orange" }, VERY_URGENT: { label: "Très urgent", cls: "badge-red" } };
    return map[level] || { label: "Standard", cls: "badge-green" };
  };
  const getStatusBadge = (status: string) => {
    const map: any = { PENDING: { label: "Nouvelle", cls: "badge-blue" }, ASSIGNED: { label: "En cours", cls: "badge-orange" }, COMPLETED: { label: "Terminée", cls: "badge-gray" } };
    return map[status] || { label: status, cls: "badge-gray" };
  };
  const getProviderBadge = (status: string) => {
    const map: any = { VALIDATED: { label: "Validé", cls: "badge-green" }, APPROVED: { label: "Validé", cls: "badge-green" }, PENDING: { label: "En attente", cls: "badge-yellow" }, REJECTED: { label: "Rejeté", cls: "badge-red" } };
    return map[status] || { label: status, cls: "badge-gray" };
  };

  const getCityFromCoordinates = (lat?: number, lng?: number) => {
    if (!lat || !lng) return '—';
    if (Math.abs(lat - 33.5731) < 0.5 && Math.abs(lng - (-7.5898)) < 0.5) return 'Casablanca';
    if (Math.abs(lat - 34.0209) < 0.5 && Math.abs(lng - (-6.8416)) < 0.5) return 'Rabat';
    if (Math.abs(lat - 33.9716) < 0.5 && Math.abs(lng - (-6.8423)) < 0.5) return 'Fès';
    if (Math.abs(lat - 31.6295) < 0.5 && Math.abs(lng - (-7.9811)) < 0.5) return 'Marrakech';
    if (Math.abs(lat - 35.7595) < 0.5 && Math.abs(lng - (-5.8340)) < 0.5) return 'Tanger';
    return 'Autre';
  };

  return (
    <div className="flex flex-col min-h-screen">
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg-base: #f1f5f9;
          --bg-surface: #ffffff;
          --bg-elevated: #f8fafc;
          --bg-card: #ffffff;
          --bg-hover: #e8eef4;
          --border: #e2e8f0;
          --border-light: #cbd5e1;
          --accent: #f27405;
          --accent-dim: rgba(242, 116, 5, 0.14);
          --accent-glow: rgba(242, 116, 5, 0.22);
          --text-primary: #0f172a;
          --text-secondary: #475569;
          --text-muted: #64748b;
          --green: #16a34a;
          --green-dim: rgba(22, 163, 74, 0.12);
          --blue: #0b2c5e;
          --blue-dim: rgba(11, 44, 94, 0.1);
          --yellow: #d97706;
          --yellow-dim: rgba(217, 119, 6, 0.12);
          --red: #dc2626;
          --red-dim: rgba(220, 38, 38, 0.1);
          --radius: 12px;
          --radius-lg: 16px;
          --shadow: 0 4px 24px rgba(15, 23, 42, 0.08);
          --shadow-glow: 0 0 32px rgba(242, 116, 5, 0.12);
        }

        .dash-root {
          font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 45%, #f1f5f9 100%);
          min-height: 100vh;
          color: var(--text-primary);
        }

        /* ─── NAVBAR ─────────────────────────────────────────── */
        .navbar {
          background: var(--bg-surface);
          border-bottom: 1px solid var(--border);
          height: 64px;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
        }
        .navbar-inner {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .brand { display: flex; align-items: center; gap: 10px; }
        .brand-icon {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, #f27405, #d96504);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 18px; color: white;
          box-shadow: 0 4px 14px rgba(242, 116, 5, 0.35);
        }
        .brand-name { font-size: 18px; font-weight: 700; color: var(--text-primary); }
        .brand-name span { color: var(--accent); }

        .navbar-badge {
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          color: var(--text-secondary);
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }

        .navbar-right { display: flex; align-items: center; gap: 12px; }
        .avatar {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, var(--accent), #d96504);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 14px; color: white;
        }
        .navbar-name { font-size: 14px; font-weight: 600; color: var(--text-primary); }
        .btn-logout {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 14px;
          background: var(--red-dim);
          border: 1px solid rgba(239,68,68,0.2);
          color: var(--red);
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }
        .btn-logout:hover { background: rgba(239,68,68,0.2); box-shadow: 0 0 12px rgba(239,68,68,0.15); }

        /* ─── MAIN LAYOUT ─────────────────────────────────────── */
        .main-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 32px 24px;
        }

        /* ─── PAGE HEADER ─────────────────────────────────────── */
        .page-header { margin-bottom: 32px; }
        .page-title { font-size: 28px; font-weight: 700; color: var(--text-primary); letter-spacing: -0.5px; }
        .page-subtitle { font-size: 14px; color: var(--text-secondary); margin-top: 4px; }
        .page-header-dot {
          display: inline-block;
          width: 8px; height: 8px;
          border-radius: 50%;
          background: var(--green);
          margin-right: 8px;
          box-shadow: 0 0 8px var(--green);
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        /* ─── KPI CARDS ───────────────────────────────────────── */
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 28px;
        }
        @media (max-width: 1024px) { .kpi-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { .kpi-grid { grid-template-columns: 1fr; } }

        .kpi-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 24px;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s, border-color 0.2s;
        }
        .kpi-card:hover { transform: translateY(-2px); border-color: var(--border-light); }
        .kpi-card::before {
          content: '';
          position: absolute;
          top: 0; right: 0;
          width: 80px; height: 80px;
          border-radius: 50%;
          opacity: 0.04;
          transform: translate(20px, -20px);
        }
        .kpi-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; }
        .kpi-icon-wrap {
          width: 44px; height: 44px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
        }
        .kpi-value { font-size: 36px; font-weight: 700; letter-spacing: -1px; color: var(--text-primary); }
        .kpi-label { font-size: 13px; color: var(--text-secondary); margin-top: 4px; font-weight: 400; }
        .kpi-change { font-size: 12px; font-weight: 600; margin-top: 8px; }

        /* ─── TAB BAR ─────────────────────────────────────────── */
        .tab-bar {
          display: flex;
          gap: 4px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 4px;
          margin-bottom: 20px;
          width: fit-content;
        }
        .tab-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
          color: var(--text-secondary);
          background: transparent;
        }
        .tab-btn:hover { color: var(--text-primary); background: var(--bg-hover); }
        .tab-btn.active {
          color: var(--accent);
          background: var(--accent-dim);
          border: 1px solid rgba(249,115,22,0.25);
        }
        .tab-btn svg { width: 15px; height: 15px; }

        /* ─── PANEL ───────────────────────────────────────────── */
        .panel {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }
        .panel-header {
          padding: 20px 24px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .panel-title { font-size: 16px; font-weight: 600; color: var(--text-primary); }

        /* ─── SUB TAB ─────────────────────────────────────────── */
        .sub-tab-bar { display: flex; gap: 0; border-bottom: 1px solid var(--border); padding: 0 24px; }
        .sub-tab-btn {
          padding: 14px 20px;
          font-size: 13px;
          font-weight: 500;
          color: var(--text-secondary);
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
        }
        .sub-tab-btn:hover { color: var(--text-primary); }
        .sub-tab-btn.active { color: var(--accent); border-bottom-color: var(--accent); }
        .sub-tab-count {
          display: inline-flex; align-items: center; justify-content: center;
          background: var(--accent-dim);
          color: var(--accent);
          border: 1px solid rgba(249,115,22,0.2);
          width: 20px; height: 20px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          margin-left: 6px;
        }

        /* ─── SEARCH ──────────────────────────────────────────── */
        .search-wrap { position: relative; }
        .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted); width: 15px; height: 15px; }
        .search-input {
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 9px 12px 9px 36px;
          font-size: 13px;
          color: var(--text-primary);
          font-family: inherit;
          width: 280px;
          transition: border-color 0.2s;
          outline: none;
        }
        .search-input::placeholder { color: var(--text-muted); }
        .search-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-dim); }

        /* ─── TABLE ───────────────────────────────────────────── */
        .table-wrap { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; }
        thead tr { background: var(--bg-elevated); }
        thead th {
          padding: 12px 16px;
          text-align: left;
          font-size: 11px;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.8px;
          white-space: nowrap;
        }
        tbody tr {
          border-top: 1px solid var(--border);
          transition: background 0.15s;
        }
        tbody tr:hover { background: var(--bg-hover); }
        tbody td { padding: 14px 16px; font-size: 13px; color: var(--text-secondary); white-space: nowrap; }
        .td-primary { color: var(--text-primary) !important; font-weight: 500; }
        .td-mono { font-family: ui-monospace, monospace; font-size: 12px; color: var(--text-muted); }

        /* ─── BADGES ──────────────────────────────────────────── */
        .badge {
          display: inline-flex; align-items: center;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.3px;
          white-space: nowrap;
        }
        .badge-green { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
        .badge-orange { background: #ffedd5; color: #c2410c; border: 1px solid #fed7aa; }
        .badge-red { background: #fee2e2; color: #b91c1c; border: 1px solid #fecaca; }
        .badge-blue { background: #e0e7ff; color: #1e3a8a; border: 1px solid #c7d2fe; }
        .badge-yellow { background: #fef3c7; color: #b45309; border: 1px solid #fde68a; }
        .badge-gray { background: #f1f5f9; color: var(--text-secondary); border: 1px solid var(--border); }

        /* ─── ACTION BUTTONS ──────────────────────────────────── */
        .actions { display: flex; align-items: center; gap: 4px; }
        .action-btn {
          width: 30px; height: 30px;
          border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.15s;
          background: transparent;
          font-family: inherit;
        }
        .action-btn svg { width: 13px; height: 13px; }
        .action-btn-blue { color: var(--blue); }
        .action-btn-blue:hover { background: var(--blue-dim); border-color: rgba(11, 44, 94, 0.18); }
        .action-btn-green { color: var(--green); }
        .action-btn-green:hover { background: var(--green-dim); border-color: rgba(34,197,94,0.2); }
        .action-btn-red { color: var(--red); }
        .action-btn-red:hover { background: var(--red-dim); border-color: rgba(239,68,68,0.2); }
        .action-btn-gray { color: var(--text-muted); }
        .action-btn-gray:hover { background: var(--bg-hover); border-color: var(--border); }

        .action-text { font-size: 12px; font-weight: 500; padding: 5px 10px; border-radius: 6px; cursor: pointer; border: none; background: transparent; font-family: inherit; transition: all 0.15s; }
        .action-text-blue { color: var(--blue); }
        .action-text-blue:hover { background: var(--blue-dim); }
        .action-text-green { color: var(--green); }
        .action-text-green:hover { background: var(--green-dim); }
        .action-text-red { color: var(--red); }
        .action-text-red:hover { background: var(--red-dim); }
        .action-text-gray { color: var(--text-muted); }
        .action-text-gray:hover { background: var(--bg-hover); }

        /* ─── PROVIDER AVATAR ─────────────────────────────────── */
        .p-avatar {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700; color: var(--text-secondary);
          border: 1px solid var(--border);
          flex-shrink: 0;
          overflow: hidden;
        }
        .p-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .p-info { display: flex; align-items: center; gap: 10px; }
        .p-name { font-size: 13px; font-weight: 600; color: var(--text-primary); }

        /* ─── EMPTY STATE ─────────────────────────────────────── */
        .empty-state {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 64px 24px;
          gap: 12px;
        }
        .empty-icon {
          width: 56px; height: 56px;
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          color: var(--text-muted);
        }
        .empty-title { font-size: 15px; font-weight: 600; color: var(--text-primary); }
        .empty-sub { font-size: 13px; color: var(--text-muted); text-align: center; }
        .btn-retry {
          margin-top: 8px;
          padding: 9px 20px;
          background: var(--accent-dim);
          border: 1px solid rgba(249,115,22,0.2);
          color: var(--accent);
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
        }
        .btn-retry:hover { background: rgba(249,115,22,0.2); }

        /* ─── PAGINATION ──────────────────────────────────────── */
        .pagination {
          display: flex; align-items: center; gap: 6px;
          justify-content: flex-end;
          padding: 16px 24px;
          border-top: 1px solid var(--border);
        }
        .page-btn {
          height: 32px; min-width: 32px;
          padding: 0 10px;
          border-radius: 7px;
          border: 1px solid var(--border);
          background: var(--bg-elevated);
          color: var(--text-secondary);
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
        }
        .page-btn:hover { border-color: var(--border-light); color: var(--text-primary); }
        .page-btn.active { background: var(--accent); border-color: var(--accent); color: white; }
        .page-count { font-size: 12px; color: var(--text-muted); margin-right: 8px; }

        /* ─── STATS TAB ───────────────────────────────────────── */
        .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 768px) { .stats-grid { grid-template-columns: 1fr; } }
        .stats-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 24px;
        }
        .stats-full { grid-column: 1 / -1; }
        .stats-title { font-size: 15px; font-weight: 600; color: var(--text-primary); margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
        .chart-placeholder {
          height: 200px;
          background: var(--bg-elevated);
          border: 1px dashed var(--border-light);
          border-radius: 10px;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 8px;
          color: var(--text-muted);
        }
        .chart-placeholder svg { color: var(--text-muted); opacity: 0.5; }
        .chart-placeholder p { font-size: 13px; }

        .metric-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-top: 16px; }
        @media (max-width: 768px) { .metric-row { grid-template-columns: repeat(2, 1fr); } }
        .metric-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 20px;
        }
        .metric-value { font-size: 28px; font-weight: 700; color: var(--accent); letter-spacing: -0.5px; }
        .metric-label { font-size: 12px; color: var(--text-muted); margin-top: 4px; }
        .metric-bar { margin-top: 12px; height: 3px; background: var(--border); border-radius: 99px; overflow: hidden; }
        .metric-bar-fill { height: 100%; background: linear-gradient(90deg, var(--accent), #d96504); border-radius: 99px; }

        /* ─── MODAL ───────────────────────────────────────────── */
        .modal-overlay {
          position: fixed; inset: 0; z-index: 200;
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .modal {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 20px;
          width: 100%;
          max-width: 900px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.18);
          animation: slideUp 0.25s ease;
        }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

        .modal-header {
          position: sticky; top: 0;
          background: var(--bg-card);
          border-bottom: 1px solid var(--border);
          padding: 20px 24px;
          display: flex; align-items: center; justify-content: space-between;
          z-index: 10;
        }
        .modal-title { font-size: 18px; font-weight: 700; color: var(--text-primary); }
        .modal-close {
          width: 32px; height: 32px;
          border-radius: 8px;
          border: 1px solid var(--border);
          background: var(--bg-elevated);
          color: var(--text-secondary);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all 0.15s;
        }
        .modal-close:hover { background: var(--red-dim); border-color: rgba(239,68,68,0.2); color: var(--red); }
        .modal-close svg { width: 14px; height: 14px; }
        .modal-body { padding: 24px; }

        .profile-banner {
          background: linear-gradient(135deg, #f8fafc, #fff7ed);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 24px;
          margin-bottom: 20px;
          display: flex; align-items: flex-start; gap: 16px;
        }
        .profile-avatar-lg {
          width: 64px; height: 64px;
          background: linear-gradient(135deg, var(--accent), #ef4444);
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; font-weight: 700; color: white;
          flex-shrink: 0;
          box-shadow: 0 6px 20px rgba(242, 116, 5, 0.28);
        }
        .profile-details { flex: 1; }
        .profile-name { font-size: 20px; font-weight: 700; color: var(--text-primary); margin-bottom: 10px; }
        .profile-meta { display: flex; flex-wrap: wrap; gap: 16px; }
        .profile-meta-item { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--text-secondary); }
        .profile-meta-item svg { width: 14px; height: 14px; }

        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
        @media (max-width: 640px) { .info-grid { grid-template-columns: 1fr; } }
        .info-card {
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 16px;
        }
        .info-card-title {
          font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px;
          color: var(--text-muted); margin-bottom: 12px;
          display: flex; align-items: center; gap: 6px;
        }
        .info-card-title svg { width: 12px; height: 12px; }
        .info-row { display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid var(--border); }
        .info-row:last-child { border-bottom: none; }
        .info-key { font-size: 12px; color: var(--text-muted); }
        .info-val { font-size: 13px; font-weight: 500; color: var(--text-primary); }

        .docs-section {
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 20px;
          margin-bottom: 20px;
        }
        .docs-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .docs-title { font-size: 14px; font-weight: 600; color: var(--text-primary); display: flex; align-items: center; gap: 8px; }
        .docs-actions { display: flex; gap: 8px; }

        .docs-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        @media (max-width: 640px) { .docs-grid { grid-template-columns: repeat(2, 1fr); } }
        .doc-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 10px;
          overflow: hidden;
          transition: border-color 0.2s, transform 0.2s;
        }
        .doc-card:hover { border-color: var(--border-light); transform: translateY(-1px); }
        .doc-card-header { padding: 10px 12px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
        .doc-card-label { font-size: 11px; font-weight: 600; color: var(--text-secondary); }
        .doc-card-actions { display: flex; gap: 2px; }
        .doc-img-wrap {
          height: 120px; overflow: hidden; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          background: #f1f5f9;
          position: relative;
        }
        .doc-img-wrap img { width: 100%; height: 100%; object-fit: contain; }
        .doc-img-overlay {
          position: absolute; inset: 0;
          background: rgba(0,0,0,0);
          transition: background 0.2s;
          display: flex; align-items: center; justify-content: center;
        }
        .doc-img-wrap:hover .doc-img-overlay { background: rgba(15, 23, 42, 0.35); }
        .doc-img-overlay svg { opacity: 0; transition: opacity 0.2s; color: white; }
        .doc-img-wrap:hover .doc-img-overlay svg { opacity: 1; }

        .no-docs {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 40px;
          color: var(--text-muted);
          gap: 10px;
        }
        .no-docs p { font-size: 13px; }

        .modal-footer {
          display: flex; justify-content: flex-end; gap: 10px;
          padding: 20px 24px;
          border-top: 1px solid var(--border);
        }
        .btn-primary {
          padding: 10px 20px;
          background: var(--green);
          border: none;
          border-radius: 8px;
          color: white;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          display: flex; align-items: center; gap: 6px;
          transition: all 0.2s;
        }
        .btn-primary:hover { opacity: 0.9; box-shadow: 0 4px 16px rgba(34,197,94,0.3); }
        .btn-danger {
          padding: 10px 20px;
          background: var(--red-dim);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 8px;
          color: var(--red);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          display: flex; align-items: center; gap: 6px;
          transition: all 0.2s;
        }
        .btn-danger:hover { background: rgba(239,68,68,0.2); }
        .btn-approve-all {
          padding: 8px 14px;
          background: rgba(34,197,94,0.1);
          border: 1px solid rgba(34,197,94,0.2);
          border-radius: 8px;
          color: var(--green);
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          display: flex; align-items: center; gap: 5px;
          transition: all 0.2s;
        }
        .btn-approve-all:hover { background: rgba(34,197,94,0.18); }
        .btn-reject-all {
          padding: 8px 14px;
          background: var(--red-dim);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 8px;
          color: var(--red);
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          display: flex; align-items: center; gap: 5px;
          transition: all 0.2s;
        }
        .btn-reject-all:hover { background: rgba(239,68,68,0.15); }

        /* ─── VIDEO ───────────────────────────────────────────── */
        .video-section {
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 20px;
          margin-bottom: 20px;
        }
        .video-section video { width: 100%; border-radius: 8px; }

        /* ─── MAP LINK ────────────────────────────────────────── */
        .map-section {
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 20px;
          margin-bottom: 20px;
        }
        .map-placeholder {
          height: 100px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          color: var(--text-muted);
          gap: 8px;
          font-size: 13px;
        }
        .btn-maps {
          display: inline-flex; align-items: center; gap: 6px;
          margin-top: 12px;
          padding: 9px 16px;
          background: var(--blue-dim);
          border: 1px solid rgba(11, 44, 94, 0.15);
          border-radius: 8px;
          color: var(--blue);
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
        }
        .btn-maps:hover { background: rgba(11, 44, 94, 0.12); }

        /* ─── DESCRIPTION BOX ─────────────────────────────────── */
        .desc-box {
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 16px;
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.7;
        }

        /* ─── SCROLLBAR ───────────────────────────────────────── */
        .dash-root ::-webkit-scrollbar { width: 8px; height: 8px; }
        .dash-root ::-webkit-scrollbar-track { background: var(--bg-elevated); }
        .dash-root ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }
        .dash-root ::-webkit-scrollbar-thumb:hover { background: var(--border-light); }
      `}</style>

      <div className="dash-root">
        {/* ── NAVBAR ── */}
        <nav className="navbar">
          <div className="navbar-inner">
            <div className="brand">
              <div className="brand-icon">M</div>
              <div className="brand-name">M3allam<span>Connect</span></div>
            </div>
            <div className="navbar-badge">
              <span className="page-header-dot" />
              Tableau de bord admin
            </div>
            <div className="navbar-right">
              <div className="avatar">A</div>
              <span className="navbar-name">Admin</span>
              <button className="btn-logout" onClick={handleLogout}>
                <LogOut size={13} />
                Déconnexion
              </button>
            </div>
          </div>
        </nav>

        {/* ── MAIN ── */}
        <div className="main-content">
          <div className="page-header">
            <h1 className="page-title">Vue d'ensemble</h1>
            <p className="page-subtitle">Gestion des demandes, prestataires et statistiques de la plateforme</p>
          </div>

          {/* KPI Cards */}
          <div className="kpi-grid">
            {kpiCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <div className="kpi-card" key={i}>
                  <div className="kpi-top">
                    <div className="kpi-icon-wrap" style={{ background: card.bg }}>
                      <Icon size={20} color={card.color} />
                    </div>
                  </div>
                  <div className="kpi-value">{card.value}</div>
                  <div className="kpi-label">{card.title}</div>
                  {card.change && (
                    <div className="kpi-change" style={{ color: card.change === "À traiter" ? "var(--yellow)" : "var(--green)" }}>
                      {card.change === "À traiter" ? <AlertTriangle size={11} style={{ display: "inline", marginRight: 4 }} /> : <TrendingUp size={11} style={{ display: "inline", marginRight: 4 }} />}
                      {card.change}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Tab Bar */}
          <div className="tab-bar">
            {[
              { id: "demandes", label: "Demandes clients", icon: ClipboardList },
              { id: "prestataires", label: "Prestataires", icon: Users },
              { id: "statistiques", label: "Statistiques", icon: BarChart3 },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} className={`tab-btn ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>
                  <Icon />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* ── TAB: DEMANDES ── */}
          {activeTab === "demandes" && (
            <div className="panel">
              <div className="sub-tab-bar">
                <button className={`sub-tab-btn ${activeSubTab === "demandes-clients" ? "active" : ""}`} onClick={() => setActiveSubTab("demandes-clients")}>
                  Demandes clients
                </button>
                <button className={`sub-tab-btn ${activeSubTab === "demandes-providers" ? "active" : ""}`} onClick={() => setActiveSubTab("demandes-providers")}>
                  Providers en attente
                  {pendingProviders.length > 0 && <span className="sub-tab-count">{pendingProviders.length}</span>}
                </button>
              </div>

              {/* Sub-tab: Demandes clients */}
              {activeSubTab === "demandes-clients" && (
                <>
                  <div className="panel-header">
                    <span className="panel-title">Toutes les demandes</span>
                    <div className="search-wrap">
                      <Search className="search-icon" />
                      <input className="search-input" placeholder="Rechercher une demande..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                  </div>
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Client</th>
                          <th>Téléphone</th>
                          <th>Ville</th>
                          <th>Service</th>
                          <th>Urgence</th>
                          <th>Vidéo</th>
                          <th>Date</th>
                          <th>Statut</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allRequests.length > 0 ? allRequests.map((req) => {
                          const urg = getUrgencyBadge(req.urgencyLevel);
                          const sta = getStatusBadge(req.status);
                          const name = req.firstName && req.lastName ? `${req.firstName} ${req.lastName}` : req.client?.firstName ? `${req.client.firstName} ${req.client.lastName}` : 'Inconnu';
                          return (
                            <tr key={req.id}>
                              <td><span className="td-mono">{req.id}</span></td>
                              <td className="td-primary">{name}</td>
                              <td>{req.clientPhone || req.phone || '—'}</td>
                              <td>{getCityFromCoordinates(req.latitude, req.longitude)}</td>
                              <td><span className="badge badge-orange">{req.serviceType}</span></td>
                              <td><span className={`badge ${urg.cls}`}>{urg.label}</span></td>
                              <td>
                                {req.videoUrl
                                  ? <span className="badge badge-green"><Play size={9} style={{ marginRight: 3 }} />Oui</span>
                                  : <span style={{ color: "var(--text-muted)" }}>—</span>}
                              </td>
                              <td>{req.createdAt ? new Date(req.createdAt).toLocaleDateString('fr-FR') : '—'}</td>
                              <td><span className={`badge ${sta.cls}`}>{sta.label}</span></td>
                              <td>
                                <div className="actions">
                                  <button className="action-btn action-btn-blue" title="Voir" onClick={() => handleViewRequest(req)}><Eye /></button>
                                  <button className="action-btn action-btn-green" title="Assigner"><UserCheck /></button>
                                  <button className="action-btn action-btn-red" title="Rejeter"><UserX /></button>
                                </div>
                              </td>
                            </tr>
                          );
                        }) : (
                          <tr>
                            <td colSpan={10}>
                              <div className="empty-state">
                                <div className="empty-icon"><AlertCircle size={22} /></div>
                                <div className="empty-title">Aucune demande disponible</div>
                                <div className="empty-sub">Vérifiez la connexion au backend</div>
                                <button className="btn-retry" onClick={fetchAllRequests}>Réessayer</button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  {allRequests.length > 0 && (
                    <div className="pagination">
                      <span className="page-count">{allRequests.length} résultats</span>
                      <button className="page-btn">Précédent</button>
                      <button className="page-btn active">1</button>
                      <button className="page-btn">2</button>
                      <button className="page-btn">3</button>
                      <button className="page-btn">Suivant</button>
                    </div>
                  )}
                </>
              )}

              {/* Sub-tab: Providers en attente */}
              {activeSubTab === "demandes-providers" && (
                <>
                  <div className="panel-header">
                    <span className="panel-title">Prestataires en attente de validation</span>
                    <div className="search-wrap">
                      <Search className="search-icon" />
                      <input className="search-input" placeholder="Rechercher un prestataire..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                  </div>
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Prestataire</th>
                          <th>Email</th>
                          <th>Téléphone</th>
                          <th>Ville</th>
                          <th>Date</th>
                          <th>Statut</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingProviders.filter(p => !searchTerm || p.fullName.toLowerCase().includes(searchTerm.toLowerCase())).map(p => {
                          const badge = getProviderBadge(p.status || 'PENDING');
                          return (
                            <tr key={p.id}>
                              <td><span className="td-mono">{p.id}</span></td>
                              <td>
                                <div className="p-info">
                                  <div className="p-avatar">{p.fullName?.substring(0, 2).toUpperCase()}</div>
                                  <div className="p-name">{p.fullName}</div>
                                </div>
                              </td>
                              <td>{p.email}</td>
                              <td>{p.phone}</td>
                              <td>{p.city}</td>
                              <td>{new Date(p.createdAt).toLocaleDateString('fr-FR')}</td>
                              <td><span className={`badge ${badge.cls}`}>{badge.label}</span></td>
                              <td>
                                <div className="actions">
                                  <button className="action-text action-text-blue" onClick={() => handleViewProvider(p.id)}>Voir</button>
                                  <button className="action-text action-text-green" onClick={() => handleApprove(p.id)}>Approuver</button>
                                  <button className="action-text action-text-red" onClick={() => { const r = prompt("Raison du rejet:"); if (r) handleReject(p.id, r); }}>Rejeter</button>
                                  <button className="action-text action-text-gray" onClick={() => handleDelete(p.id)}>Sup.</button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {pendingProviders.length === 0 && (
                      <div className="empty-state">
                        <div className="empty-icon"><CheckCircle size={22} /></div>
                        <div className="empty-title">Aucun prestataire en attente</div>
                        <div className="empty-sub">Tous les prestataires ont été traités</div>
                      </div>
                    )}
                  </div>
                  {pendingProviders.length > 0 && (
                    <div className="pagination">
                      <span className="page-count">{pendingProviders.length} en attente</span>
                      <button className="page-btn">Précédent</button>
                      <button className="page-btn active">1</button>
                      <button className="page-btn">Suivant</button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ── TAB: PRESTATAIRES ── */}
          {activeTab === "prestataires" && (
            <div className="panel">
              <div className="panel-header">
                <span className="panel-title">Tous les prestataires</span>
                <div className="search-wrap">
                  <Search className="search-icon" />
                  <input className="search-input" placeholder="Rechercher par nom..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Prestataire</th>
                      <th>Email</th>
                      <th>Ville</th>
                      <th>Services</th>
                      <th>Tarif</th>
                      <th>Documents</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prestataires.filter((p: any) => !searchTerm || [p.fullName, p.name, p.email].some(f => f?.toLowerCase().includes(searchTerm.toLowerCase()))).map((p: any) => {
                      const badge = getProviderBadge(p.status);
                      const tarif = p.rate || p.hourlyRate || p.pricePerHour;
                      const docsOk = p.cinDocumentUrl || p.documents?.length > 0;
                      return (
                        <tr key={p.id}>
                          <td>
                            <div className="p-info">
                              <div className="p-avatar">
                                {p.documents?.[0]?.profilePhotoUrl
                                  ? <img src={assetUrl(p.documents[0].profilePhotoUrl)} alt="" />
                                  : (p.fullName || p.name)?.substring(0, 2).toUpperCase() || 'P'}
                              </div>
                              <div className="p-name">{p.fullName || p.name || `${p.firstName || ''} ${p.lastName || ''}`.trim() || 'Inconnu'}</div>
                            </div>
                          </td>
                          <td>{p.email || '—'}</td>
                          <td>{p.city || '—'}</td>
                          <td>
                            {p.services?.length > 0
                              ? p.services.slice(0, 2).map((s: any, i: number) => (
                                  <span key={i} className="badge badge-gray" style={{ marginRight: 3 }}>{typeof s === 'string' ? s : s?.serviceCode || s?.name || 'Service'}</span>
                                ))
                              : <span style={{ color: "var(--text-muted)" }}>—</span>}
                          </td>
                          <td>{tarif ? <span className="td-primary">{tarif} <span style={{ color: "var(--text-muted)", fontSize: 11 }}>MAD/h</span></span> : '—'}</td>
                          <td><span className={`badge ${docsOk ? "badge-green" : "badge-yellow"}`}>{docsOk ? "Complet" : "Incomplet"}</span></td>
                          <td><span className={`badge ${badge.cls}`}>{badge.label}</span></td>
                          <td>
                            <div className="actions">
                              <button className="action-btn action-btn-blue" title="Voir" onClick={() => handleViewProvider(p.id)}><Eye /></button>
                              {p.status === "PENDING" && <button className="action-btn action-btn-green" title="Approuver" onClick={() => handleApprove(p.id)}><UserCheck /></button>}
                              <button className="action-btn action-btn-red" title="Rejeter" onClick={() => { const r = prompt("Raison du rejet:"); if (r) handleReject(p.id, r); }}><UserX /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {prestataires.length === 0 && (
                  <div className="empty-state">
                    <div className="empty-icon"><Users size={22} /></div>
                    <div className="empty-title">Aucun prestataire validé</div>
                    <div className="empty-sub">Les prestataires approuvés apparaîtront ici</div>
                  </div>
                )}
              </div>
              <div className="pagination">
                <span className="page-count">{allProviders.length} prestataires</span>
                <button className="page-btn">Précédent</button>
                <button className="page-btn active">1</button>
                <button className="page-btn">2</button>
                <button className="page-btn">Suivant</button>
              </div>
            </div>
          )}

          {/* ── TAB: STATISTIQUES ── */}
          {activeTab === "statistiques" && (
            <>
              <div className="stats-grid">
                <div className="stats-card stats-full">
                  <div className="stats-title"><Activity size={16} color="var(--accent)" />Demandes par mois</div>
                  <div className="chart-placeholder">
                    <BarChart3 size={32} />
                    <p>Graphique linéaire des demandes mensuelles</p>
                  </div>
                </div>
                <div className="stats-card">
                  <div className="stats-title"><Star size={16} color="var(--yellow)" />Top services demandés</div>
                  <div className="chart-placeholder" style={{ height: 160 }}>
                    <BarChart3 size={28} />
                    <p>Graphique en barres horizontales</p>
                  </div>
                </div>
                <div className="stats-card">
                  <div className="stats-title"><MapPin size={16} color="var(--blue)" />Répartition par ville</div>
                  <div className="chart-placeholder" style={{ height: 160 }}>
                    <BarChart3 size={28} />
                    <p>Graphique en donut</p>
                  </div>
                </div>
              </div>
              <div className="metric-row">
                {[
                  { value: "94%", label: "Taux de satisfaction", bar: 94 },
                  { value: "1h 45m", label: "Temps de réponse moyen", bar: null },
                  { value: "67%", label: "Demandes avec vidéo", bar: 67 },
                  { value: "78%", label: "Taux de conversion", bar: 78 },
                ].map((m, i) => (
                  <div className="metric-card" key={i}>
                    <div className="metric-value">{m.value}</div>
                    <div className="metric-label">{m.label}</div>
                    {m.bar && (
                      <div className="metric-bar">
                        <div className="metric-bar-fill" style={{ width: `${m.bar}%` }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* ── MODAL: PROVIDER DETAILS ── */}
        {isModalOpen && selectedProvider && (
          <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}>
            <div className="modal">
              <div className="modal-header">
                <div className="modal-title">Détails du prestataire</div>
                <button className="modal-close" onClick={() => setIsModalOpen(false)}><X /></button>
              </div>
              <div className="modal-body">
                {/* Profile banner */}
                <div className="profile-banner">
                  <div className="profile-avatar-lg">{selectedProvider.fullName?.substring(0, 2).toUpperCase() || 'PR'}</div>
                  <div className="profile-details">
                    <div className="profile-name">{selectedProvider.fullName}</div>
                    <div className="profile-meta">
                      <div className="profile-meta-item"><Mail size={14} />{selectedProvider.user?.email || selectedProvider.email || '—'}</div>
                      <div className="profile-meta-item"><Phone size={14} />{selectedProvider.phone || '—'}</div>
                      <div className="profile-meta-item"><MapPin size={14} />{selectedProvider.city || '—'}</div>
                    </div>
                  </div>
                  <span className={`badge ${getProviderBadge(selectedProvider.status).cls}`}>{getProviderBadge(selectedProvider.status).label}</span>
                </div>

                {/* Info grid */}
                <div className="info-grid">
                  <div className="info-card">
                    <div className="info-card-title"><Briefcase />Infos professionnelles</div>
                    <div className="info-row"><span className="info-key">Expérience</span><span className="info-val">{selectedProvider.experience || '—'}</span></div>
                    <div className="info-row"><span className="info-key">Tarif horaire</span><span className="info-val">{selectedProvider.rate ? `${selectedProvider.rate} MAD/h` : '—'}</span></div>
                    <div className="info-row"><span className="info-key">Services</span><span className="info-val">{selectedProvider.services?.map((s: any) => s.serviceCode || s).join(', ') || '—'}</span></div>
                  </div>
                  <div className="info-card">
                    <div className="info-card-title"><Calendar />Inscription</div>
                    <div className="info-row"><span className="info-key">Date</span><span className="info-val">{selectedProvider.createdAt ? new Date(selectedProvider.createdAt).toLocaleDateString('fr-FR') : '—'}</span></div>
                    <div className="info-row"><span className="info-key">ID</span><span className="info-val td-mono">{selectedProvider.id}</span></div>
                  </div>
                </div>

                {/* Documents */}
                <div className="docs-section">
                  <div className="docs-header">
                    <div className="docs-title"><FileText size={15} color="var(--accent)" />Documents</div>
                    <div className="docs-actions">
                      <button className="btn-approve-all" onClick={() => handleApprove(selectedProvider.id)}><CheckCircle size={12} />Approuver</button>
                      <button className="btn-reject-all" onClick={() => { const r = prompt("Raison du rejet:"); if (r) handleReject(selectedProvider.id, r); }}><XCircle size={12} />Rejeter</button>
                    </div>
                  </div>
                  {(selectedProvider.profilePhotoUrl || selectedProvider.cinDocumentUrl || selectedProvider.certificateUrl || selectedProvider.documents?.length > 0)
                    ? (
                      <div className="docs-grid">
                        {selectedProvider.profilePhotoUrl && (
                          <div className="doc-card">
                            <div className="doc-card-header">
                              <span className="doc-card-label">Photo de profil</span>
                              <div className="doc-card-actions">
                                <button className="action-btn action-btn-blue" onClick={() => handleViewDocument(selectedProvider.profilePhotoUrl, '')}><Eye /></button>
                                <button className="action-btn action-btn-green" onClick={() => handleDownloadDocument(selectedProvider.profilePhotoUrl, 'photo.jpg')}><Download /></button>
                              </div>
                            </div>
                            <div className="doc-img-wrap" onClick={() => handleViewDocument(selectedProvider.profilePhotoUrl, '')}>
                              <img src={assetUrl(selectedProvider.profilePhotoUrl)} alt="" />
                              <div className="doc-img-overlay"><Eye size={20} /></div>
                            </div>
                          </div>
                        )}
                        {selectedProvider.cinDocumentUrl && (
                          <div className="doc-card">
                            <div className="doc-card-header">
                              <span className="doc-card-label">Carte d'identité (CIN)</span>
                              <div className="doc-card-actions">
                                <button className="action-btn action-btn-blue" onClick={() => handleViewDocument(selectedProvider.cinDocumentUrl, '')}><Eye /></button>
                                <button className="action-btn action-btn-green" onClick={() => handleDownloadDocument(selectedProvider.cinDocumentUrl, 'cin.jpg')}><Download /></button>
                              </div>
                            </div>
                            <div className="doc-img-wrap" onClick={() => handleViewDocument(selectedProvider.cinDocumentUrl, '')}>
                              <img src={assetUrl(selectedProvider.cinDocumentUrl)} alt="" />
                              <div className="doc-img-overlay"><Eye size={20} /></div>
                            </div>
                          </div>
                        )}
                        {selectedProvider.certificateUrl && (
                          <div className="doc-card">
                            <div className="doc-card-header">
                              <span className="doc-card-label">Certificat / Diplôme</span>
                              <div className="doc-card-actions">
                                <button className="action-btn action-btn-blue" onClick={() => handleViewDocument(selectedProvider.certificateUrl, '')}><Eye /></button>
                                <button className="action-btn action-btn-green" onClick={() => handleDownloadDocument(selectedProvider.certificateUrl, 'cert.jpg')}><Download /></button>
                              </div>
                            </div>
                            <div className="doc-img-wrap" onClick={() => handleViewDocument(selectedProvider.certificateUrl, '')}>
                              <img src={assetUrl(selectedProvider.certificateUrl)} alt="" />
                              <div className="doc-img-overlay"><Eye size={20} /></div>
                            </div>
                          </div>
                        )}
                        {selectedProvider.documents?.map((doc: any, idx: number) => doc.cinUrl && (
                          <div className="doc-card" key={idx}>
                            <div className="doc-card-header">
                              <span className="doc-card-label">Document {idx + 1}</span>
                              <div className="doc-card-actions">
                                <button className="action-btn action-btn-blue" onClick={() => handleViewDocument(doc.cinUrl, '')}><Eye /></button>
                                <button className="action-btn action-btn-green" onClick={() => handleDownloadDocument(doc.cinUrl, `doc-${idx}.jpg`)}><Download /></button>
                              </div>
                            </div>
                            <div className="doc-img-wrap" onClick={() => handleViewDocument(doc.cinUrl, '')}>
                              <img src={assetUrl(doc.cinUrl)} alt="" />
                              <div className="doc-img-overlay"><Eye size={20} /></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="no-docs">
                        <FileText size={28} />
                        <p>Aucun document téléchargé</p>
                      </div>
                    )}
                </div>
              </div>
              {selectedProvider.status === 'PENDING' && (
                <div className="modal-footer">
                  <button className="btn-danger" onClick={() => { const r = prompt("Raison du rejet:"); if (r) handleReject(selectedProvider.id, r); }}><XCircle size={14} />Rejeter</button>
                  <button className="btn-primary" onClick={() => handleApprove(selectedProvider.id)}><CheckCircle size={14} />Approuver</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── MODAL: REQUEST DETAILS ── */}
        {isRequestModalOpen && selectedRequest && (
          <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setIsRequestModalOpen(false); }}>
            <div className="modal">
              <div className="modal-header">
                <div className="modal-title">Détails de la demande</div>
                <button className="modal-close" onClick={() => setIsRequestModalOpen(false)}><X /></button>
              </div>
              <div className="modal-body">
                {/* Client banner */}
                <div className="profile-banner" style={{ background: "linear-gradient(135deg, #ecfdf5, #f0fdf4)", borderColor: "#bbf7d0" }}>
                  <div className="profile-avatar-lg" style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)" }}>
                    {selectedRequest.clientFirstName?.substring(0, 2).toUpperCase() || 'CL'}
                  </div>
                  <div className="profile-details">
                    <div className="profile-name">{selectedRequest.clientFirstName} {selectedRequest.clientLastName}</div>
                    <div className="profile-meta">
                      <div className="profile-meta-item"><Phone size={14} />{selectedRequest.clientPhone || '—'}</div>
                      <div className="profile-meta-item"><Mail size={14} />{selectedRequest.clientEmail || '—'}</div>
                      <div className="profile-meta-item"><MapPin size={14} />{selectedRequest.clientCity || '—'}</div>
                    </div>
                  </div>
                  <span className={`badge ${getStatusBadge(selectedRequest.status).cls}`}>{getStatusBadge(selectedRequest.status).label}</span>
                </div>

                <div className="info-grid">
                  <div className="info-card">
                    <div className="info-card-title"><Briefcase />Service</div>
                    <div className="info-row"><span className="info-key">Type</span><span className="info-val">{selectedRequest.serviceType || '—'}</span></div>
                    <div className="info-row">
                      <span className="info-key">Urgence</span>
                      <span className={`badge ${getUrgencyBadge(selectedRequest.urgencyLevel).cls}`}>{getUrgencyBadge(selectedRequest.urgencyLevel).label}</span>
                    </div>
                    <div className="info-row"><span className="info-key">ID</span><span className="info-val td-mono">{selectedRequest.id}</span></div>
                  </div>
                  <div className="info-card">
                    <div className="info-card-title"><Calendar />Temporel</div>
                    <div className="info-row"><span className="info-key">Créée le</span><span className="info-val">{selectedRequest.createdAt ? new Date(selectedRequest.createdAt).toLocaleString('fr-FR') : '—'}</span></div>
                  </div>
                </div>

                {selectedRequest.description && (
                  <div className="info-card" style={{ marginBottom: 12 }}>
                    <div className="info-card-title"><FileText />Description du problème</div>
                    <div className="desc-box">{selectedRequest.description}</div>
                  </div>
                )}

                {selectedRequest.videoUrl && (
                  <div className="video-section">
                    <div className="info-card-title" style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px", color: "var(--text-muted)" }}>
                      <Play size={12} />Vidéo du problème
                    </div>
                    <video controls src={assetUrl(selectedRequest.videoUrl)}>Vidéo non supportée.</video>
                  </div>
                )}

                {selectedRequest.latitude && selectedRequest.longitude && (
                  <div className="map-section">
                    <div className="info-card-title" style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px", color: "var(--text-muted)" }}>
                      <MapPin size={12} />Localisation
                    </div>
                    <div className="map-placeholder">
                      <MapPin size={16} />
                      {selectedRequest.latitude.toFixed(4)}, {selectedRequest.longitude.toFixed(4)}
                    </div>
                    <a className="btn-maps" href={`https://www.google.com/maps?q=${selectedRequest.latitude},${selectedRequest.longitude}`} target="_blank" rel="noopener noreferrer">
                      <MapPin size={13} />Voir sur Google Maps
                    </a>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn-danger" onClick={() => setIsRequestModalOpen(false)}><X size={13} />Fermer</button>
                {selectedRequest.status === 'PENDING' && (
                  <>
                    <button className="btn-primary" style={{ background: "var(--accent)" }}><UserCheck size={13} />Assigner</button>
                    <button className="btn-primary"><CheckCircle size={13} />Accepter</button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>  
    </div>
  );
}