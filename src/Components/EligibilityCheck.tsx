import React, { useState } from "react";
import Layout from "./Layout";
import { useNotifications } from "../context/NotificationContext";

interface Patient { id: string; name: string; status: string; }

const EligibilityCheck: React.FC = () => {
  const { addNotification } = useNotifications();

  const [patients, setPatients] = useState<Patient[]>([
    { id:"P-1001", name:"Samuel Johnson",   status:"Pending" },
    { id:"P-1002", name:"Jane Smith",        status:"Pending" },
    { id:"P-1003", name:"Ebenezer Mensah",   status:"Pending" },
    { id:"P-1004", name:"Amina Mohammed",    status:"Pending" },
    { id:"P-1005", name:"Kwame Asante",      status:"Pending" },
    { id:"P-1006", name:"Yaa Asantewaa",     status:"Pending" },
    { id:"P-1007", name:"Gabriel Goodison",  status:"Pending" },
    { id:"P-1008", name:"Grace Osei",        status:"Pending" },
    { id:"P-1009", name:"Lisa Payet",        status:"Pending" },
    { id:"P-1010", name:"Michael Thompson",  status:"Pending" },
  ]);

  const [expandedRow, setExpandedRow]         = useState<string | null>(null);
  const [editingPatient, setEditingPatient]   = useState<Patient | null>(null);
  const [editName, setEditName]               = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [successBanner, setSuccessBanner]     = useState<string | null>(null);

  const showSuccess = (msg: string) => { setSuccessBanner(msg); setTimeout(() => setSuccessBanner(null), 3500); };

  const sendCheck = (id: string) => {
    // Capture current name before state changes
    const patient = patients.find(p => p.id === id);
    setPatients(prev => prev.map(p => p.id === id ? { ...p, status:"Checking..." } : p));
    setTimeout(() => {
      const eligible = Math.random() > 0.5;
      const newStatus = eligible ? "Eligible" : "Not Eligible";
      setPatients(prev => prev.map(p => p.id === id ? { ...p, status:newStatus } : p));
      addNotification({
        type: eligible ? "success" : "error",
        title: `Eligibility ${eligible ? "Confirmed" : "Denied"}`,
        message: `${patient?.name ?? id} has been marked as ${newStatus}.`,
        claimId: id,
      });
    }, 2000);
  };

  const checkAll = () => {
    const pending = patients.filter(p => p.status === "Pending");
    pending.forEach(p => sendCheck(p.id));
    if (pending.length > 0) {
      addNotification({ type:"info", title:"Bulk Eligibility Check Started",
        message:`Checking eligibility for ${pending.length} patient${pending.length!==1?"s":""}…` });
    }
  };

  const openEdit = (patient: Patient) => { setEditingPatient(patient); setEditName(patient.name); };

  const saveEdit = () => {
    if (!editingPatient) return;
    setPatients(prev => prev.map(p => p.id === editingPatient.id ? { ...p, name:editName } : p));
    showSuccess(`Patient ${editingPatient.id} updated.`);
    addNotification({ type:"info", title:"Patient Record Updated", claimId:editingPatient.id,
      message:`Patient ${editingPatient.id} name updated to "${editName}".` });
    setEditingPatient(null);
  };

  const handleDelete = (id: string) => {
    const patient = patients.find(p => p.id === id);
    setPatients(prev => prev.filter(p => p.id !== id));
    if (expandedRow === id) setExpandedRow(null);
    showSuccess(`Patient record ${id} deleted.`);
    addNotification({ type:"warning", title:"Patient Record Deleted", claimId:id,
      message:`Record for ${patient?.name ?? id} has been permanently removed.` });
    setDeleteConfirmId(null);
  };

  const eligibleCount    = patients.filter(p => p.status === "Eligible").length;
  const notEligibleCount = patients.filter(p => p.status === "Not Eligible").length;
  const pendingCount     = patients.filter(p => p.status === "Pending" || p.status === "Checking...").length;

  const statusConfig: Record<string, { pill:string; dot:string; label:string }> = {
    Eligible:       { pill:"bg-emerald-50 text-emerald-700", dot:"bg-emerald-500",             label:"Eligible"      },
    "Not Eligible": { pill:"bg-red-50 text-red-700",         dot:"bg-red-500",                 label:"Not Eligible"  },
    "Checking...":  { pill:"bg-amber-50 text-amber-700",     dot:"bg-amber-400 animate-pulse", label:"Checking…"     },
    Pending:        { pill:"bg-gray-100 text-gray-600",      dot:"bg-gray-400",                label:"Pending"       },
  };

  return (
    <Layout currentPage="Eligibility Check">
      {successBanner && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
          {successBanner}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 m-10">
        {[
          { label:"Eligible",           value:eligibleCount,    color:"text-emerald-600", bg:"bg-emerald-50", icon:"M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
          { label:"Not Eligible",       value:notEligibleCount, color:"text-red-600",     bg:"bg-red-50",     icon:"M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" },
          { label:"Pending / Checking", value:pendingCount,     color:"text-amber-600",   bg:"bg-amber-50",   icon:"M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
        ].map(({ label, value, color, bg, icon }) => (
          <div key={label} className="bg-white shadow-sm border border-gray-100 rounded-xl p-5 flex items-center gap-4">
            <div className={`${bg} p-3 rounded-lg`}><svg className={`w-6 h-6 ${color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={icon}/></svg></div>
            <div><p className="text-sm text-gray-500 font-medium">{label}</p><p className={`text-2xl font-bold ${color}`}>{value}</p></div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between m-10">
        <p className="text-sm text-gray-500">{patients.length} patients · click <span className="font-medium text-gray-700">Check</span> to verify eligibility in real time</p>
        <button onClick={checkAll} disabled={pendingCount===0}
          className="flex items-center gap-2 px-4 py-2 bg-color-1 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition shadow-sm disabled:opacity-40 disabled:cursor-not-allowed">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
          Check All Pending
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden m-10">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Patient ID","Name","Status","Actions"].map(h=>(
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {patients.map(patient => {
                const cfg = statusConfig[patient.status] ?? statusConfig["Pending"];
                const isChecking = patient.status === "Checking...";
                const isDone     = patient.status === "Eligible" || patient.status === "Not Eligible";
                return (
                  <React.Fragment key={patient.id}>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">{patient.id}</span></td>
                      <td className="px-4 py-3 font-medium text-gray-800">{patient.name}</td>
                      <td className="px-4 py-3"><span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.pill}`}><span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}/>{cfg.label}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {/* Expand */}
                          <button onClick={() => setExpandedRow(expandedRow===patient.id?null:patient.id)} title="View details" className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={expandedRow===patient.id?"M5 15l7-7 7 7":"M19 9l-7 7-7-7"}/></svg>
                          </button>
                          {/* Edit */}
                          <button onClick={() => openEdit(patient)} title="Edit patient" className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                          </button>
                          {/* Delete */}
                          <button onClick={() => setDeleteConfirmId(patient.id)} title="Delete patient" className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                          </button>
                          {/* Check / Verified */}
                          {isDone
                            ? <span className="flex items-center gap-1 text-sm text-gray-400 ml-2"><svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>Verified</span>
                            : <button onClick={() => sendCheck(patient.id)} disabled={isChecking}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-color-1 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed ml-2">
                                {isChecking
                                  ? <><svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Checking…</>
                                  : <><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>Check</>}
                              </button>}
                        </div>
                      </td>
                    </tr>
                    {expandedRow===patient.id && (
                      <tr className="bg-blue-50/40"><td colSpan={4} className="px-6 py-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                          {[{label:"Patient ID",value:patient.id},{label:"Full Name",value:patient.name},{label:"Status",value:cfg.label}].map(({label,value})=>(
                            <div key={label}><p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{label}</p><p className="text-gray-700">{value}</p></div>
                          ))}
                        </div>
                      </td></tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-400">{patients.length} total patients</div>
      </div>

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-start gap-4"><div className="bg-red-100 p-2 rounded-full shrink-0"><svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg></div>
              <div><h3 className="text-base font-semibold text-gray-800 mb-1">Delete Patient Record</h3><p className="text-sm text-gray-500">Are you sure you want to delete <span className="font-medium text-gray-700">{deleteConfirmId}</span>? This cannot be undone.</p></div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setDeleteConfirmId(null)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirmId)} className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3"><div className="bg-blue-100 p-2 rounded-lg"><svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg></div><div><h2 className="text-base font-semibold text-gray-800">Edit Patient</h2><p className="text-xs text-gray-400">{editingPatient.id}</p></div></div>
              <button onClick={() => setEditingPatient(null)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg></button>
            </div>
            <div className="px-6 py-5"><label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Full Name</label><input type="text" value={editName} onChange={e=>setEditName(e.target.value)} className="mt-1 w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"/></div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <button onClick={() => setEditingPatient(null)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 bg-white rounded-lg hover:bg-gray-50 transition font-medium">Cancel</button>
              <button onClick={saveEdit} className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default EligibilityCheck;