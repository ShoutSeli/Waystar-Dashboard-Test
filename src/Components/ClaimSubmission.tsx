import React, { useState } from "react";
import Layout from "./Layout";
import { useNotifications } from "../context/NotificationContext";

interface Claim { id: string; patient: string; amount: number; status: string; }

const ClaimSubmission: React.FC = () => {
  const { addNotification } = useNotifications();

  const [claims, setClaims] = useState<Claim[]>([
    { id:"C-2001", patient:"Stephen Dogbe",     amount:1200, status:"Pending" },
    { id:"C-2002", patient:"Abigail Adjei",     amount:850,  status:"Pending" },
    { id:"C-2003", patient:"Samuel Effah",      amount:1500, status:"Pending" },
    { id:"C-2004", patient:"Timothy Henson",    amount:2000, status:"Pending" },
    { id:"C-2005", patient:"David Brown",       amount:1800, status:"Pending" },
    { id:"C-2006", patient:"Lisa Davis",        amount:1600, status:"Pending" },
    { id:"C-2007", patient:"James Wilson",      amount:2200, status:"Pending" },
    { id:"C-2008", patient:"Emily Taylor",      amount:1400, status:"Pending" },
    { id:"C-2009", patient:"Robert Anderson",   amount:1900, status:"Pending" },
    { id:"C-2010", patient:"Jessica Martinez",  amount:1700, status:"Pending" },
    { id:"C-2011", patient:"Patricia Love",     amount:1200, status:"Pending" },
    { id:"C-2012", patient:"Thomas Gblonya",    amount:2000, status:"Pending" },
    { id:"C-2013", patient:"Jennifer Alhassan", amount:1300, status:"Pending" },
  ]);

  const [selectedClaim, setSelectedClaim]     = useState<Claim | null>(null);
  const [expandedRow, setExpandedRow]         = useState<string | null>(null);
  const [editingClaim, setEditingClaim]       = useState<Claim | null>(null);
  const [editForm, setEditForm]               = useState({ patient:"", amount:"" });
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [successBanner, setSuccessBanner]     = useState<string | null>(null);

  const pendingCount   = claims.filter(c => c.status === "Pending").length;
  const submittedCount = claims.filter(c => c.status === "Submitted").length;
  const totalAmount    = claims.reduce((s, c) => s + c.amount, 0);

  const showSuccess = (msg: string) => { setSuccessBanner(msg); setTimeout(() => setSuccessBanner(null), 3500); };

  const confirmSubmission = () => {
    if (!selectedClaim) return;
    setClaims(prev => prev.map(c => c.id === selectedClaim.id ? { ...c, status:"Submitted" } : c));
    showSuccess(`Claim ${selectedClaim.id} submitted successfully.`);
    addNotification({ type:"success", title:"Claim Submitted", claimId:selectedClaim.id,
      message:`Claim for ${selectedClaim.patient} ($${selectedClaim.amount.toLocaleString()}) has been submitted to the insurer.` });
    setSelectedClaim(null);
  };

  const submitAll = () => {
    const pending = claims.filter(c => c.status === "Pending");
    if (!pending.length) return;
    setClaims(prev => prev.map(c => ({ ...c, status:"Submitted" })));
    showSuccess(`${pending.length} pending claims submitted successfully.`);
    addNotification({ type:"success", title:"Bulk Submission Complete",
      message:`${pending.length} pending claim${pending.length !== 1 ? "s" : ""} have been submitted to the insurer for processing.` });
  };

  const openEdit = (claim: Claim) => { setEditingClaim(claim); setEditForm({ patient:claim.patient, amount:String(claim.amount) }); };

  const saveEdit = () => {
    if (!editingClaim) return;
    setClaims(prev => prev.map(c => c.id === editingClaim.id ? { ...c, patient:editForm.patient, amount:Number(editForm.amount)||c.amount } : c));
    showSuccess(`Claim ${editingClaim.id} updated.`);
    addNotification({ type:"info", title:"Claim Updated", claimId:editingClaim.id,
      message:`Details for claim ${editingClaim.id} (${editForm.patient}) have been updated.` });
    setEditingClaim(null);
  };

  const handleDelete = (id: string) => {
    const claim = claims.find(c => c.id === id);
    setClaims(prev => prev.filter(c => c.id !== id));
    if (expandedRow === id) setExpandedRow(null);
    showSuccess(`Claim ${id} deleted.`);
    addNotification({ type:"warning", title:"Claim Deleted", claimId:id,
      message:`Claim ${id}${claim ? ` for ${claim.patient}` : ""} has been permanently removed.` });
    setDeleteConfirmId(null);
  };

  return (
    <Layout currentPage="Claim Submission">
      {successBanner && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          {successBanner}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 m-10">
        {[
          { label:"Total Billed", value:`$${totalAmount.toLocaleString()}`, color:"text-blue-600",    bg:"bg-blue-50",    icon:"M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
          { label:"Pending",      value:pendingCount,                       color:"text-amber-600",   bg:"bg-amber-50",   icon:"M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
          { label:"Submitted",    value:submittedCount,                     color:"text-emerald-600", bg:"bg-emerald-50", icon:"M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
        ].map(({ label, value, color, bg, icon }) => (
          <div key={label} className="bg-white shadow-sm border border-gray-100 rounded-xl p-5 flex items-center gap-4">
            <div className={`${bg} p-3 rounded-lg`}><svg className={`w-6 h-6 ${color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={icon} /></svg></div>
            <div><p className="text-sm text-gray-500 font-medium">{label}</p><p className={`text-2xl font-bold ${color}`}>{value}</p></div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between m-10">
        <p className="text-sm text-gray-500">{pendingCount} claim{pendingCount!==1?"s":""} awaiting submission</p>
        <button onClick={submitAll} disabled={pendingCount===0}
          className="flex items-center gap-2 px-4 py-2 bg-color-1 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition shadow-sm disabled:opacity-40 disabled:cursor-not-allowed">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
          Submit All Pending
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden m-10">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Claim ID","Patient","Bill Amount","Status","Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {claims.map(claim => (
                <React.Fragment key={claim.id}>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${claim.status==="Submitted"?"bg-emerald-50 text-emerald-700":"bg-blue-50 text-blue-700"}`}>{claim.id}</span></td>
                    <td className="px-4 py-3 font-medium text-gray-800">{claim.patient}</td>
                    <td className="px-4 py-3 font-semibold text-blue-700">${claim.amount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      {claim.status==="Submitted"
                        ? <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"/>Submitted</span>
                        : <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700"><span className="w-1.5 h-1.5 rounded-full bg-amber-400"/>Pending</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {/* Expand */}
                        <button onClick={() => setExpandedRow(expandedRow===claim.id?null:claim.id)} title="View details" className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={expandedRow===claim.id?"M5 15l7-7 7 7":"M19 9l-7 7-7-7"} /></svg>
                        </button>
                        {/* Edit */}
                        <button onClick={() => openEdit(claim)} title="Edit claim" className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        {/* Delete */}
                        <button onClick={() => setDeleteConfirmId(claim.id)} title="Delete claim" className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                        {/* Review & Submit / Submitted */}
                        {claim.status==="Pending"
                          ? <button onClick={() => setSelectedClaim(claim)} className="flex items-center gap-1.5 px-3 py-1.5 bg-color-1 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition ml-2">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                              Review & Submit
                            </button>
                          : <span className="flex items-center gap-1 text-sm text-gray-400 ml-2"><svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>Submitted</span>}
                      </div>
                    </td>
                  </tr>
                  {expandedRow===claim.id && (
                    <tr className="bg-blue-50/40"><td colSpan={5} className="px-6 py-4">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                        {[{label:"Claim ID",value:claim.id},{label:"Patient",value:claim.patient},{label:"Amount",value:`$${claim.amount.toLocaleString()}`},{label:"Status",value:claim.status}].map(({label,value})=>(
                          <div key={label}><p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{label}</p><p className="text-gray-700">{value}</p></div>
                        ))}
                      </div>
                    </td></tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-400">{claims.length} total claims · {submittedCount} submitted · {pendingCount} pending</div>
      </div>

      {/* Review Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3"><div className="bg-blue-100 p-2 rounded-lg"><svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg></div><div><h2 className="text-base font-semibold text-gray-800">Review Claim</h2><p className="text-xs text-gray-400">Confirm before submitting</p></div></div>
              <button onClick={() => setSelectedClaim(null)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg></button>
            </div>
            <div className="px-6 py-5 space-y-3">
              {[{label:"Claim ID",value:selectedClaim.id},{label:"Patient",value:selectedClaim.patient},{label:"Amount",value:`$${selectedClaim.amount.toLocaleString()}`},{label:"Status",value:selectedClaim.status}].map(({label,value})=>(
                <div key={label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"><span className="text-sm text-gray-500 font-medium">{label}</span><span className={`text-sm font-semibold ${label==="Amount"?"text-blue-700":"text-gray-800"}`}>{value}</span></div>
              ))}
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg flex items-start gap-2"><svg className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg><p className="text-xs text-amber-700">Once submitted, this claim will be forwarded to the insurer for processing and cannot be recalled.</p></div>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <button onClick={() => setSelectedClaim(null)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 bg-white rounded-lg hover:bg-gray-50 transition font-medium">Cancel</button>
              <button onClick={confirmSubmission} className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>Confirm Submit</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3"><div className="bg-blue-100 p-2 rounded-lg"><svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg></div><div><h2 className="text-base font-semibold text-gray-800">Edit Claim</h2><p className="text-xs text-gray-400">{editingClaim.id}</p></div></div>
              <button onClick={() => setEditingClaim(null)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div><label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Patient Name</label><input type="text" value={editForm.patient} onChange={e => setEditForm(f=>({...f,patient:e.target.value}))} className="mt-1 w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"/></div>
              <div><label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Bill Amount ($)</label><input type="number" value={editForm.amount} onChange={e => setEditForm(f=>({...f,amount:e.target.value}))} className="mt-1 w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"/></div>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <button onClick={() => setEditingClaim(null)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 bg-white rounded-lg hover:bg-gray-50 transition font-medium">Cancel</button>
              <button onClick={saveEdit} className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-start gap-4"><div className="bg-red-100 p-2 rounded-full shrink-0"><svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg></div>
              <div><h3 className="text-base font-semibold text-gray-800 mb-1">Delete Claim</h3><p className="text-sm text-gray-500">Are you sure you want to delete claim <span className="font-medium text-gray-700">{deleteConfirmId}</span>? This cannot be undone.</p></div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setDeleteConfirmId(null)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirmId)} className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition">Delete</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ClaimSubmission;