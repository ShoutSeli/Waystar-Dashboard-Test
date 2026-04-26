import React, { useState } from "react";
import Layout from "./Layout";

interface PayerView {
  claimId: string; patientName: string; insuranceCompany: string;
  address: string; phone: string; email: string; department: string;
  fax?: string; portalLink?: string; representative?: string;
}

const EMPTY_FORM: PayerView = {
  claimId: "", patientName: "", insuranceCompany: "", address: "",
  phone: "", email: "", department: "", fax: "", portalLink: "", representative: "",
};

const DEPARTMENTS = ["Cardiology","Dermatology","Gynecology","Neurology","Oncology","Orthopedics","Pediatrics","Radiology"];
const INSURANCE_COMPANIES = ["Aetna","BlueCross BlueShield","Cigna","Humana","UnitedHealth"];

// ─── FIX: Field and inputCls live here at module level, NOT inside the
//     component. A component defined inside another component gets a brand-new
//     identity on every render → React unmounts + remounts the <input> on every
//     keystroke → focus is lost after every character typed.
//     At module level the reference is stable and inputs behave normally.

const inputCls = (err?: string) =>
  `px-3 py-2 text-sm border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-600 focus:outline-none focus:ring-2 transition ${
    err ? "border-red-400 focus:ring-red-300" : "border-gray-200 dark:border-gray-600 focus:ring-blue-400"
  }`;

interface FieldProps {
  label: string;
  field: keyof PayerView;
  required?: boolean;
  type?: string;
  datalist?: string[];
  placeholder?: string;
  formData: PayerView;
  formErrors: Partial<Record<keyof PayerView, string>>;
  onFieldChange: (field: keyof PayerView, value: string) => void;
}

const Field: React.FC<FieldProps> = ({
  label, field, required, type = "text", datalist, placeholder,
  formData, formErrors, onFieldChange,
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
      {label}{required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {datalist ? (
      <>
        <input
          list={`dl-${field}`}
          value={(formData[field] as string) || ""}
          onChange={e => onFieldChange(field, e.target.value)}
          placeholder={placeholder || `Select or type ${label.toLowerCase()}`}
          className={inputCls(formErrors[field])}
        />
        <datalist id={`dl-${field}`}>{datalist.map(v => <option key={v} value={v} />)}</datalist>
      </>
    ) : (
      <input
        type={type}
        value={(formData[field] as string) || ""}
        onChange={e => onFieldChange(field, e.target.value)}
        placeholder={placeholder}
        className={inputCls(formErrors[field])}
      />
    )}
    {formErrors[field] && <p className="text-xs text-red-500 mt-0.5">{formErrors[field]}</p>}
  </div>
);

const InsurancePayerView: React.FC = () => {
  const [search, setSearch] = useState("");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingClaimId, setEditingClaimId] = useState<string | null>(null);
  const [formData, setFormData] = useState<PayerView>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof PayerView, string>>>({});
  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [payers, setPayers] = useState<PayerView[]>([
    { claimId:"C-8001", patientName:"Aurelia Koomson",  insuranceCompany:"BlueCross BlueShield", address:"123 Health Ave, Chicago, IL 60601",       phone:"(312) 555-1234", email:"support@bluecross.com",          department:"Cardiology",  fax:"(312) 555-4321", portalLink:"https://bluecross.com/claims",          representative:"John Smith"     },
    { claimId:"C-8002", patientName:"Kwabena Owusu",    insuranceCompany:"Aetna",                address:"456 Wellness Blvd, Hartford, CT 06103",    phone:"(860) 555-5678", email:"claims@aetna.com",               department:"Orthopedics", fax:"(860) 555-8765", portalLink:"https://aetna.com/claims",              representative:"Mary Johnson"   },
    { claimId:"C-8003", patientName:"Zainab Alhassan",  insuranceCompany:"UnitedHealth",         address:"789 Care Lane, Minnetonka, MN 55345",      phone:"(952) 555-9876", email:"support@unitedhealthcare.com",   department:"Neurology",   fax:"(952) 555-6789", portalLink:"https://unitedhealthcare.com/claims",   representative:"David Brown"    },
    { claimId:"C-8004", patientName:"Kojo Mensah",      insuranceCompany:"Cigna",                address:"321 Medical Dr, Philadelphia, PA 19103",   phone:"(215) 555-2468", email:"claims@cigna.com",               department:"Pediatrics",  fax:"(215) 555-8642", portalLink:"https://cigna.com/claims",              representative:"Sarah Davis"    },
    { claimId:"C-8005", patientName:"Ama Boateng",      insuranceCompany:"Humana",               address:"654 Health Plaza, Louisville, KY 40202",   phone:"(502) 555-1357", email:"support@humana.com",             department:"Oncology",    fax:"(502) 555-7531", portalLink:"https://humana.com/claims",             representative:"Michael Wilson" },
    { claimId:"C-8006", patientName:"Yaw Darko",        insuranceCompany:"BlueCross BlueShield", address:"987 Insurance Ave, Boston, MA 02109",      phone:"(617) 555-3579", email:"support@bluecross.com",          department:"Dermatology", fax:"(617) 555-9753", portalLink:"https://bluecross.com/claims",          representative:"Jennifer Lee"   },
    { claimId:"C-8007", patientName:"Efua Sackey",      insuranceCompany:"Aetna",                address:"456 Wellness Blvd, Hartford, CT 06103",    phone:"(860) 555-5678", email:"claims@aetna.com",               department:"Gynecology",  fax:"(860) 555-8765", portalLink:"https://aetna.com/claims",              representative:"Mary Johnson"   },
    { claimId:"C-8008", patientName:"Kwesi Adjei",      insuranceCompany:"UnitedHealth",         address:"789 Care Lane, Minnetonka, MN 55345",      phone:"(952) 555-9876", email:"support@unitedhealthcare.com",   department:"Cardiology",  fax:"(952) 555-6789", portalLink:"https://unitedhealthcare.com/claims",   representative:"David Brown"    },
    { claimId:"C-8009", patientName:"Akua Nkrumah",     insuranceCompany:"Cigna",                address:"321 Medical Dr, Philadelphia, PA 19103",   phone:"(215) 555-2468", email:"claims@cigna.com",               department:"Radiology",   fax:"(215) 555-8642", portalLink:"https://cigna.com/claims",              representative:"Sarah Davis"    },
    { claimId:"C-8010", patientName:"Selorm Tetteh",    insuranceCompany:"Humana",               address:"654 Health Plaza, Louisville, KY 40202",   phone:"(502) 555-1357", email:"support@humana.com",             department:"Orthopedics", fax:"(502) 555-7531", portalLink:"https://humana.com/claims",             representative:"Michael Wilson" },
    { claimId:"C-8011", patientName:"Kofi Asante",      insuranceCompany:"BlueCross BlueShield", address:"123 Health Ave, Chicago, IL 60601",        phone:"(312) 555-1234", email:"support@bluecross.com",          department:"Neurology",   fax:"(312) 555-4321", portalLink:"https://bluecross.com/claims",          representative:"John Smith"     },
    { claimId:"C-8012", patientName:"Esi Frimpong",     insuranceCompany:"Aetna",                address:"456 Wellness Blvd, Hartford, CT 06103",    phone:"(860) 555-5678", email:"claims@aetna.com",               department:"Pediatrics",  fax:"(860) 555-8765", portalLink:"https://aetna.com/claims",              representative:"Mary Johnson"   },
    { claimId:"C-8013", patientName:"Nana Osei",        insuranceCompany:"UnitedHealth",         address:"789 Care Lane, Minnetonka, MN 55345",      phone:"(952) 555-9876", email:"support@unitedhealthcare.com",   department:"Oncology",    fax:"(952) 555-6789", portalLink:"https://unitedhealthcare.com/claims",   representative:"David Brown"    },
    { claimId:"C-8014", patientName:"Abena Owusu",      insuranceCompany:"Cigna",                address:"321 Medical Dr, Philadelphia, PA 19103",   phone:"(215) 555-2468", email:"claims@cigna.com",               department:"Cardiology",  fax:"(215) 555-8642", portalLink:"https://cigna.com/claims",              representative:"Sarah Davis"    },
    { claimId:"C-8015", patientName:"Kwamina Poku",     insuranceCompany:"Humana",               address:"654 Health Plaza, Louisville, KY 40202",   phone:"(502) 555-1357", email:"support@humana.com",             department:"Dermatology", fax:"(502) 555-7531", portalLink:"https://humana.com/claims",             representative:"Michael Wilson" },
    { claimId:"C-8016", patientName:"Ama Mensah",       insuranceCompany:"BlueCross BlueShield", address:"987 Insurance Ave, Boston, MA 02109",      phone:"(617) 555-3579", email:"support@bluecross.com",          department:"Radiology",   fax:"(617) 555-9753", portalLink:"https://bluecross.com/claims",          representative:"Jennifer Lee"   },
    { claimId:"C-8017", patientName:"Yoofi Adjei",      insuranceCompany:"Aetna",                address:"456 Wellness Blvd, Hartford, CT 06103",    phone:"(860) 555-5678", email:"claims@aetna.com",               department:"Gynecology",  fax:"(860) 555-8765", portalLink:"https://aetna.com/claims",              representative:"Mary Johnson"   },
    { claimId:"C-8018", patientName:"Akosua Boateng",   insuranceCompany:"UnitedHealth",         address:"789 Care Lane, Minnetonka, MN 55345",      phone:"(952) 555-9876", email:"support@unitedhealthcare.com",   department:"Orthopedics", fax:"(952) 555-6789", portalLink:"https://unitedhealthcare.com/claims",   representative:"David Brown"    },
    { claimId:"C-8019", patientName:"Kwasi Oduor",      insuranceCompany:"Cigna",                address:"321 Medical Dr, Philadelphia, PA 19103",   phone:"(215) 555-2468", email:"claims@cigna.com",               department:"Neurology",   fax:"(215) 555-8642", portalLink:"https://cigna.com/claims",              representative:"Sarah Davis"    },
    { claimId:"C-8020", patientName:"Nadia Hassan",     insuranceCompany:"Humana",               address:"654 Health Plaza, Louisville, KY 40202",   phone:"(502) 555-1357", email:"support@humana.com",             department:"Pediatrics",  fax:"(502) 555-7531", portalLink:"https://humana.com/claims",             representative:"Michael Wilson" },
  ]);

  const showSuccess = (msg: string) => { setSuccessBanner(msg); setTimeout(() => setSuccessBanner(null), 3500); };

  const generateClaimId = () => {
    const max = payers.reduce((acc, p) => { const n = parseInt(p.claimId.replace("C-", ""), 10); return n > acc ? n : acc; }, 8000);
    return `C-${max + 1}`;
  };

  const validate = (data: PayerView): Partial<Record<keyof PayerView, string>> => {
    const errs: Partial<Record<keyof PayerView, string>> = {};
    if (!data.patientName.trim())     errs.patientName     = "Patient name is required.";
    if (!data.insuranceCompany.trim())errs.insuranceCompany= "Insurance company is required.";
    if (!data.address.trim())         errs.address         = "Address is required.";
    if (!data.phone.trim())           errs.phone           = "Phone number is required.";
    if (!data.email.trim())           errs.email           = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.email = "Enter a valid email address.";
    if (!data.department.trim())      errs.department      = "Department is required.";
    return errs;
  };

  const openAddModal  = () => { setEditingClaimId(null); setFormData({ ...EMPTY_FORM, claimId: generateClaimId() }); setFormErrors({}); setShowModal(true); };
  const openEditModal = (p: PayerView) => { setEditingClaimId(p.claimId); setFormData({ ...p }); setFormErrors({}); setShowModal(true); };
  const closeModal    = () => { setShowModal(false); setEditingClaimId(null); setFormErrors({}); };

  const handleSave = () => {
    const errs = validate(formData);
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }
    if (editingClaimId) {
      setPayers(prev => prev.map(p => p.claimId === editingClaimId ? { ...formData } : p));
      showSuccess(`Record for ${formData.patientName} updated.`);
    } else {
      setPayers(prev => [formData, ...prev]);
      showSuccess(`New record for ${formData.patientName} added.`);
    }
    closeModal();
  };

  const handleDelete = (claimId: string) => {
    const payer = payers.find(p => p.claimId === claimId);
    setPayers(prev => prev.filter(p => p.claimId !== claimId));
    setDeleteConfirmId(null);
    if (expandedRow === claimId) setExpandedRow(null);
    showSuccess(`Record ${claimId}${payer ? ` (${payer.patientName})` : ""} deleted.`);
  };

  const handleFieldChange = (field: keyof PayerView, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const filteredPayers = payers.filter(p =>
    (departmentFilter === "All" || p.department === departmentFilter) &&
    (p.patientName.toLowerCase().includes(search.toLowerCase()) || p.insuranceCompany.toLowerCase().includes(search.toLowerCase()))
  );

  const totalClaims   = payers.length;
  const uniqueInsurers = new Set(payers.map(p => p.insuranceCompany)).size;
  const totalPatients  = new Set(payers.map(p => p.patientName)).size;
  const departments    = ["All", ...new Set(payers.map(p => p.department))];

  const exportCSV = () => {
    const headers = ["Claim ID","Patient","Insurance Company","Address","Phone","Email","Department","Fax","Portal Link","Representative"];
    const rows = filteredPayers.map(p => [p.claimId,p.patientName,p.insuranceCompany,p.address,p.phone,p.email,p.department,p.fax||"",p.portalLink||"",p.representative||""]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers,...rows].map(e => e.join(",")).join("\n");
    const link = document.createElement("a"); link.href = encodeURI(csvContent); link.download = "insurance_payer_view.csv"; link.click();
  };

  return (
    <Layout currentPage="Insurance/Payer View">
      {successBanner && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium w-[calc(100%-2rem)] max-w-md">
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          <span className="truncate">{successBanner}</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 m-4 sm:m-6 lg:m-10">
        {[
          { label:"Total Claims",   value:totalClaims,    color:"text-blue-600",    bg:"bg-blue-50 dark:bg-blue-900/20",    icon:"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
          { label:"Unique Insurers",value:uniqueInsurers, color:"text-emerald-600", bg:"bg-emerald-50 dark:bg-emerald-900/20", icon:"M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
          { label:"Total Patients", value:totalPatients,  color:"text-violet-600",  bg:"bg-violet-50 dark:bg-violet-900/20",  icon:"M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
        ].map(({ label, value, color, bg, icon }) => (
          <div key={label} className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-xl p-4 flex items-center gap-4">
            <div className={`${bg} p-2.5 rounded-lg shrink-0`}><svg className={`w-5 h-5 ${color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={icon} /></svg></div>
            <div><p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</p><p className={`text-base font-bold ${color}`}>{value}</p></div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 mx-4 sm:mx-6 lg:mx-10 mb-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Search patient or insurer…" value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 dark:placeholder-gray-500" />
          </div>
          <select value={departmentFilter} onChange={e => setDepartmentFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>CSV
          </button>
          <button onClick={openAddModal} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-color-1 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition shadow-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>Add Insurance Record
          </button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden mx-4 sm:mx-6 lg:mx-10">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-100 dark:border-gray-600">
                {["Claim ID","Patient","Insurance Company","Department","Phone","Email","Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredPayers.length === 0 && (<tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400 dark:text-gray-500 text-sm">No records found.</td></tr>)}
              {filteredPayers.map(p => (
                <React.Fragment key={p.claimId}>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">{p.claimId}</span></td>
                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">{p.patientName}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{p.insuranceCompany}</td>
                    <td className="px-4 py-3"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">{p.department}</span></td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300 text-xs">{p.phone}</td>
                    <td className="px-4 py-3"><a href={`mailto:${p.email}`} className="text-blue-600 dark:text-blue-400 hover:underline text-xs">{p.email}</a></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setExpandedRow(expandedRow === p.claimId ? null : p.claimId)} title="View details"
                          className="p-1.5 rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={expandedRow === p.claimId ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} /></svg>
                        </button>
                        <button onClick={() => openEditModal(p)} title="Edit"
                          className="p-1.5 rounded-lg text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button onClick={() => setDeleteConfirmId(p.claimId)} title="Delete"
                          className="p-1.5 rounded-lg text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedRow === p.claimId && (
                    <tr className="bg-blue-50/40 dark:bg-blue-900/10">
                      <td colSpan={7} className="px-6 py-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                          {[{ label:"Address", value:p.address },{ label:"Fax", value:p.fax||"—" },{ label:"Representative", value:p.representative||"—" }].map(({ label, value }) => (
                            <div key={label}><p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">{label}</p><p className="text-gray-700 dark:text-gray-300">{value}</p></div>
                          ))}
                          <div className="sm:col-span-2">
                            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">Portal</p>
                            {p.portalLink ? <a href={p.portalLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline break-all text-xs">{p.portalLink}</a> : <p className="text-gray-700 dark:text-gray-300">—</p>}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 text-xs text-gray-400 dark:text-gray-500">Showing {filteredPayers.length} of {payers.length} records</div>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden grid grid-cols-1 gap-3 mx-4 mb-6">
        {filteredPayers.length === 0 && (<div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center text-gray-400 dark:text-gray-500 text-sm border border-gray-100 dark:border-gray-700">No records found.</div>)}
        {filteredPayers.map(p => (
          <div key={p.claimId} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">{p.claimId}</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">{p.department}</span>
            </div>
            <div><p className="font-medium text-gray-800 dark:text-gray-100">{p.patientName}</p><p className="text-xs text-gray-500 dark:text-gray-400">{p.insuranceCompany}</p></div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><p className="text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wide mb-0.5">Phone</p><p className="text-gray-700 dark:text-gray-300">{p.phone}</p></div>
              <div><p className="text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wide mb-0.5">Email</p><a href={`mailto:${p.email}`} className="text-blue-600 dark:text-blue-400 hover:underline break-all">{p.email}</a></div>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
              <button onClick={() => openEditModal(p)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>Edit
              </button>
              <button onClick={() => setDeleteConfirmId(p.claimId)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-4"><div className="bg-red-100 dark:bg-red-900/40 p-2 rounded-full shrink-0"><svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></div>
              <div><h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-1">Delete Record</h3><p className="text-sm text-gray-500 dark:text-gray-400">Delete record <span className="font-medium text-gray-700 dark:text-gray-200">{deleteConfirmId}</span>? This cannot be undone.</p></div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirmId)} className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-red-600 dark:bg-red-700 rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-2 sm:p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] flex flex-col border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3"><div className="bg-blue-100 dark:bg-blue-900/40 p-2 rounded-lg"><svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={editingClaimId ? "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" : "M12 4v16m8-8H4"} /></svg></div>
                <div><h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">{editingClaimId ? "Edit Insurance Record" : "Add New Insurance Record"}</h2><p className="text-xs text-gray-400 dark:text-gray-500">{editingClaimId ? `Editing ${editingClaimId}` : `New record · ${formData.claimId}`}</p></div>
              </div>
              <button onClick={closeModal} className="p-1.5 rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <div className="overflow-y-auto px-5 py-5 flex-1 space-y-5">
              <div>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Core Information</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Patient Name"      field="patientName"      required placeholder="e.g. Aurelia Koomson"   formData={formData} formErrors={formErrors} onFieldChange={handleFieldChange} />
                  <Field label="Insurance Company" field="insuranceCompany" required datalist={INSURANCE_COMPANIES}        formData={formData} formErrors={formErrors} onFieldChange={handleFieldChange} />
                  <Field label="Department"        field="department"       required datalist={DEPARTMENTS}                 formData={formData} formErrors={formErrors} onFieldChange={handleFieldChange} />
                  <Field label="Representative"    field="representative"            placeholder="e.g. John Smith"          formData={formData} formErrors={formErrors} onFieldChange={handleFieldChange} />
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Contact Details</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Phone"       field="phone"       required type="tel"   placeholder="(000) 000-0000"             formData={formData} formErrors={formErrors} onFieldChange={handleFieldChange} />
                  <Field label="Fax"         field="fax"                  type="tel"   placeholder="(000) 000-0000"             formData={formData} formErrors={formErrors} onFieldChange={handleFieldChange} />
                  <div className="sm:col-span-2"><Field label="Email"       field="email"       required type="email" placeholder="e.g. support@insurer.com" formData={formData} formErrors={formErrors} onFieldChange={handleFieldChange} /></div>
                  <div className="sm:col-span-2"><Field label="Address"     field="address"     required             placeholder="Street, City, State ZIP"   formData={formData} formErrors={formErrors} onFieldChange={handleFieldChange} /></div>
                  <div className="sm:col-span-2"><Field label="Portal Link" field="portalLink"           type="url"   placeholder="https://insurer.com/claims" formData={formData} formErrors={formErrors} onFieldChange={handleFieldChange} /></div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-b-2xl">
              <p className="text-xs text-gray-400 dark:text-gray-500"><span className="text-red-500">*</span> Required</p>
              <div className="flex gap-2">
                <button onClick={closeModal} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition font-medium">Cancel</button>
                <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 dark:bg-blue-700 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition shadow-sm">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  {editingClaimId ? "Save Changes" : "Add Record"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default InsurancePayerView;