import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import Layout from "./Layout";
import { useNotifications } from "../context/NotificationContext";

interface Claim { id: string; patient: string; amount: number; status: string; }

// ─── Shared design tokens ──────────────────────────────────────────────────
const CARD  = "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200";
const TH    = "px-4 py-3 text-left text-base font-medium text-slate-800 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap";
const TD    = "px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-300";
const TDM   = "px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-100";
const FOOT  = "px-4 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/30 text-xs text-slate-400 dark:text-slate-500";
const INPUT = "w-full px-3 py-2 text-sm font-medium border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600 transition";

const ROW_EVEN = { backgroundColor: "#f2f2f2" };
const ROW_ODD  = { backgroundColor: "#5114961c" };

const ACTIONS_BTN = "inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-500 bg-white border border-red-500 rounded-lg hover:bg-red-700 hover:text-white hover:border-red-700 transition-colors dark:bg-slate-800 dark:hover:bg-red-700";
const BTN_PRIMARY = "inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-opacity shadow-sm disabled:opacity-40 disabled:cursor-not-allowed";
// ──────────────────────────────────────────────────────────────────────────

const ActionsDropdown: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (
        btnRef.current && !btnRef.current.contains(e.target as Node) &&
        menuRef.current && !menuRef.current.contains(e.target as Node)
      ) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleOpen = () => {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setCoords({ top: r.bottom + window.scrollY + 4, left: r.left + window.scrollX, width: r.width });
    }
    setOpen(o => !o);
  };

  return (
    <div className="relative inline-block">
      <button ref={btnRef} onClick={handleOpen} className={ACTIONS_BTN}>
        Actions
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && ReactDOM.createPortal(
        <div
          ref={menuRef}
          onClick={() => setOpen(false)}
          style={{ position: "absolute", top: coords.top, left: coords.left, minWidth: coords.width, zIndex: 9999 }}
          className="w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg py-1"
        >
          {children}
        </div>,
        document.body
      )}
    </div>
  );
};

const DropdownItem: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
  <button onClick={onClick} className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-slate-700 transition-colors">
    {icon}{label}
  </button>
);

const MoreDetailsIcon = <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const EditIcon        = <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>;
const DeleteIcon      = <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const ReviewIcon      = <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;

const ClaimSubmission: React.FC = () => {
  const { addNotification } = useNotifications();
  const [claims, setClaims] = useState<Claim[]>([
    { id: "C-2001", patient: "Stephen Dogbe",     amount: 1200, status: "Pending" },
    { id: "C-2002", patient: "Abigail Adjei",     amount: 850,  status: "Pending" },
    { id: "C-2003", patient: "Samuel Effah",      amount: 1500, status: "Pending" },
    { id: "C-2004", patient: "Timothy Henson",    amount: 2000, status: "Pending" },
    { id: "C-2005", patient: "David Brown",       amount: 1800, status: "Pending" },
    { id: "C-2006", patient: "Lisa Davis",        amount: 1600, status: "Pending" },
    { id: "C-2007", patient: "James Wilson",      amount: 2200, status: "Pending" },
    { id: "C-2008", patient: "Emily Taylor",      amount: 1400, status: "Pending" },
    { id: "C-2009", patient: "Robert Anderson",   amount: 1900, status: "Pending" },
    { id: "C-2010", patient: "Jessica Martinez",  amount: 1700, status: "Pending" },
    { id: "C-2011", patient: "Patricia Love",     amount: 1200, status: "Pending" },
    { id: "C-2012", patient: "Thomas Gblonya",    amount: 2000, status: "Pending" },
    { id: "C-2013", patient: "Jennifer Alhassan", amount: 1300, status: "Pending" },
  ]);

  const [selectedClaim, setSelectedClaim]     = useState<Claim | null>(null);
  const [expandedRow, setExpandedRow]         = useState<string | null>(null);
  const [editingClaim, setEditingClaim]       = useState<Claim | null>(null);
  const [editForm, setEditForm]               = useState({ patient: "", amount: "" });
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [successBanner, setSuccessBanner]     = useState<string | null>(null);

  const pendingCount   = claims.filter(c => c.status === "Pending").length;
  const submittedCount = claims.filter(c => c.status === "Submitted").length;
  const totalAmount    = claims.reduce((s, c) => s + c.amount, 0);

  const showSuccess = (msg: string) => { setSuccessBanner(msg); setTimeout(() => setSuccessBanner(null), 3500); };

  const confirmSubmission = () => {
    if (!selectedClaim) return;
    setClaims(prev => prev.map(c => c.id === selectedClaim.id ? { ...c, status: "Submitted" } : c));
    showSuccess(`Claim ${selectedClaim.id} submitted.`);
    addNotification({ type: "success", title: "Claim Submitted", claimId: selectedClaim.id,
      message: `Claim for ${selectedClaim.patient} ($${selectedClaim.amount.toLocaleString()}) submitted.` });
    setSelectedClaim(null);
  };

  const submitAll = () => {
    const pending = claims.filter(c => c.status === "Pending");
    if (!pending.length) return;
    setClaims(prev => prev.map(c => ({ ...c, status: "Submitted" })));
    showSuccess(`${pending.length} claims submitted.`);
    addNotification({ type: "success", title: "Bulk Submission Complete", message: `${pending.length} claim(s) submitted.` });
  };

  const openEdit = (claim: Claim) => { setEditingClaim(claim); setEditForm({ patient: claim.patient, amount: String(claim.amount) }); };
  const saveEdit = () => {
    if (!editingClaim) return;
    setClaims(prev => prev.map(c => c.id === editingClaim.id ? { ...c, patient: editForm.patient, amount: Number(editForm.amount) || c.amount } : c));
    showSuccess(`Claim ${editingClaim.id} updated.`);
    addNotification({ type: "info", title: "Claim Updated", claimId: editingClaim.id, message: `Claim ${editingClaim.id} updated.` });
    setEditingClaim(null);
  };
  const handleDelete = (id: string) => {
    const claim = claims.find(c => c.id === id);
    setClaims(prev => prev.filter(c => c.id !== id));
    if (expandedRow === id) setExpandedRow(null);
    showSuccess(`Claim ${id} deleted.`);
    addNotification({ type: "warning", title: "Claim Deleted", claimId: id, message: `Claim ${id}${claim ? ` for ${claim.patient}` : ""} removed.` });
    setDeleteConfirmId(null);
  };

  const summaryCards = [
    { label: "Total Billed", value: `$${totalAmount.toLocaleString()}`, color: "#ef4444", icon: <><path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 01-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004zM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 01-.921.42z" /><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v.816a3.836 3.836 0 00-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 01-.921-.421l-.879-.66a.75.75 0 00-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 001.5 0v-.81a4.124 4.124 0 001.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 00-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 00.933-1.175l-.415-.33a3.836 3.836 0 00-1.719-.755V6z" clipRule="evenodd" /></> },
    { label: "Pending",      value: pendingCount,                       color: "#f97316", icon: <><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" /></> },
    { label: "Submitted",    value: submittedCount,                     color: "#22c55e", icon: <><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" /></> },
  ];

  return (
    <Layout currentPage="Claim Submission">
      {successBanner && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-slate-800 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium w-[calc(100%-2rem)] max-w-md">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          <span className="truncate">{successBanner}</span>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 mb-6">
        {summaryCards.map(({ label, value, icon, color }) => (
          <div key={label} className={`${CARD} p-5 flex items-center gap-4`}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" style={{ color }}>
                {icon}
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-base font-medium mb-1" style={{ color }}>{label}</p>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-slate-800 dark:text-slate-400">{pendingCount} claim{pendingCount !== 1 ? "s" : ""} awaiting submission</p>
        <button onClick={submitAll} disabled={pendingCount === 0} className={BTN_PRIMARY}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
          Submit All Pending
        </button>
      </div>

      {/* Desktop Table */}
      <div className={`${CARD} overflow-hidden hidden sm:block`}>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                {["Claim ID", "Patient", "Amount", "Status", "Actions"].map(h => <th key={h} className={TH}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {claims.map((claim, idx) => (
                <React.Fragment key={claim.id}>
                  <tr style={idx % 2 === 0 ? ROW_ODD : ROW_EVEN} className="hover:opacity-90 transition-opacity">
                    <td className="px-4 py-3 text-sm font-medium text-slate-800 tabular-nums">{claim.id}</td>
                    <td className={TDM}>{claim.patient}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-100">${claim.amount.toLocaleString()}</td>
                    <td className={TD}>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium text-slate-800 ${claim.status === "Submitted" ? "dark:bg-slate-200 dark:text-slate-800" : "dark:bg-slate-700 dark:text-slate-300"}`}>
                        {claim.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <ActionsDropdown>
                        <DropdownItem icon={MoreDetailsIcon} label="More Details" onClick={() => setExpandedRow(expandedRow === claim.id ? null : claim.id)} />
                        <DropdownItem icon={EditIcon}        label="Edit"         onClick={() => openEdit(claim)} />
                        <DropdownItem icon={DeleteIcon}      label="Delete"       onClick={() => setDeleteConfirmId(claim.id)} />
                        {claim.status === "Pending" && (
                          <DropdownItem icon={ReviewIcon} label="Review & Submit" onClick={() => setSelectedClaim(claim)} />
                        )}
                      </ActionsDropdown>
                    </td>
                  </tr>
                  {expandedRow === claim.id && (
                    <tr className="bg-slate-50/60 dark:bg-slate-700/20">
                      <td colSpan={5} className="px-6 py-4">
                        <div className="grid grid-cols-4 gap-6 text-sm">
                          {[{ l: "Claim ID", v: claim.id }, { l: "Patient", v: claim.patient }, { l: "Amount", v: `$${claim.amount.toLocaleString()}` }, { l: "Status", v: claim.status }].map(({ l, v }) => (
                            <div key={l}><p className="text-sm font-medium text-slate-800 uppercase tracking-wide mb-1 dark:text-white">{l}</p><p className="text-sm font-medium text-slate-800 dark:text-slate-300">{v}</p></div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <div className={FOOT}>{claims.length} total · {submittedCount} submitted · {pendingCount} pending</div>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden space-y-3">
        {claims.map(claim => (
          <div key={claim.id} className={`${CARD} p-4 space-y-3`}>
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-slate-800 tabular-nums">{claim.id}</span>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${claim.status === "Submitted" ? "text-slate-800 dark:bg-slate-200" : "text-slate-800 dark:bg-slate-700"}`}>{claim.status}</span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{claim.patient}</p>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100">${claim.amount.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
              {claim.status === "Pending" && (
                <button onClick={() => setSelectedClaim(claim)} className={`flex-1 ${BTN_PRIMARY} justify-center`}>Review &amp; Submit</button>
              )}
              <button onClick={() => openEdit(claim)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-red-500 bg-white border border-red-500 rounded-lg hover:bg-red-700 hover:text-white transition">
                {EditIcon} Edit
              </button>
              <button onClick={() => setDeleteConfirmId(claim.id)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-red-500 bg-white border border-red-500 rounded-lg hover:bg-red-700 hover:text-white transition">
                {DeleteIcon} Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Review Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
              <div><h2 className="text-sm font-medium text-slate-800 dark:text-slate-100">Review Claim</h2><p className="text-sm font-medium text-slate-800 dark:text-white">Confirm before submitting</p></div>
              <button onClick={() => setSelectedClaim(null)} className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="px-6 py-5 space-y-3">
              {[{ l: "Claim ID", v: selectedClaim.id }, { l: "Patient", v: selectedClaim.patient }, { l: "Amount", v: `$${selectedClaim.amount.toLocaleString()}` }].map(({ l, v }) => (
                <div key={l} className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-700 last:border-0">
                  <span className="text-sm font-medium text-slate-800 dark:text-white">{l}</span>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{v}</span>
                </div>
              ))}
              <p className="text-sm font-medium text-slate-800 pt-2 dark:text-white">Once submitted, this claim will be forwarded to the insurer and cannot be recalled.</p>
            </div>
            <div className="flex gap-2 px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-b-2xl">
              <button onClick={() => setSelectedClaim(null)} className="flex-1 px-4 py-2 text-sm font-medium text-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg hover:bg-slate-50 transition">Cancel</button>
              <button onClick={confirmSubmission} className={`flex-1 ${BTN_PRIMARY} justify-center`}>Confirm Submit</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingClaim && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
              <div><h2 className="text-sm font-medium text-slate-800 dark:text-slate-100">Edit Claim</h2><p className="text-sm font-medium text-slate-800 dark:text-white">{editingClaim.id}</p></div>
              <button onClick={() => setEditingClaim(null)} className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div><label className="text-sm font-medium text-slate-800 uppercase tracking-wide block mb-1.5 dark:text-white">Patient Name</label><input type="text" value={editForm.patient} onChange={e => setEditForm(f => ({ ...f, patient: e.target.value }))} className={INPUT} /></div>
              <div><label className="text-sm font-medium text-slate-800 uppercase tracking-wide block mb-1.5 dark:text-white">Bill Amount ($)</label><input type="number" value={editForm.amount} onChange={e => setEditForm(f => ({ ...f, amount: e.target.value }))} className={INPUT} /></div>
            </div>
            <div className="flex gap-2 px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-b-2xl">
              <button onClick={() => setEditingClaim(null)} className="flex-1 px-4 py-2 text-sm font-medium text-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg hover:bg-slate-50 transition">Cancel</button>
              <button onClick={saveEdit} className={`flex-1 ${BTN_PRIMARY} justify-center`}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-medium text-slate-800 dark:text-slate-100 mb-2">Delete Claim</h3>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-400 mb-5">Delete <span className="font-semibold dark:text-slate-200">{deleteConfirmId}</span>? This cannot be undone.</p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 px-4 py-2 text-sm font-medium text-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 transition">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirmId)} className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-700 transition">Delete</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ClaimSubmission;