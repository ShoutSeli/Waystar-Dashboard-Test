import React, { useState } from "react";
import Layout from "./Layout";

interface PayerView {
  claimId: string;
  patientName: string;
  insuranceCompany: string;
  address: string;
  phone: string;
  email: string;
  department: string;
  fax?: string;
  portalLink?: string;
  representative?: string;
}

const EMPTY_FORM: PayerView = {
  claimId: "",
  patientName: "",
  insuranceCompany: "",
  address: "",
  phone: "",
  email: "",
  department: "",
  fax: "",
  portalLink: "",
  representative: "",
};

const DEPARTMENTS = [
  "Cardiology",
  "Dermatology",
  "Gynecology",
  "Neurology",
  "Oncology",
  "Orthopedics",
  "Pediatrics",
  "Radiology",
];

const INSURANCE_COMPANIES = [
  "Aetna",
  "BlueCross BlueShield",
  "Cigna",
  "Humana",
  "UnitedHealth",
];

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
    {
      claimId: "C-8001",
      patientName: "Aurelia Koomson",
      insuranceCompany: "BlueCross BlueShield",
      address: "123 Health Ave, Chicago, IL 60601",
      phone: "(312) 555-1234",
      email: "support@bluecross.com",
      department: "Cardiology",
      fax: "(312) 555-4321",
      portalLink: "https://bluecross.com/claims",
      representative: "John Smith",
    },
    {
      claimId: "C-8002",
      patientName: "Kwabena Owusu",
      insuranceCompany: "Aetna",
      address: "456 Wellness Blvd, Hartford, CT 06103",
      phone: "(860) 555-5678",
      email: "claims@aetna.com",
      department: "Orthopedics",
      fax: "(860) 555-8765",
      portalLink: "https://aetna.com/claims",
      representative: "Mary Johnson",
    },
    {
      claimId: "C-8003",
      patientName: "Zainab Alhassan",
      insuranceCompany: "UnitedHealth",
      address: "789 Care Lane, Minnetonka, MN 55345",
      phone: "(952) 555-9876",
      email: "support@unitedhealthcare.com",
      department: "Neurology",
      fax: "(952) 555-6789",
      portalLink: "https://unitedhealthcare.com/claims",
      representative: "David Brown",
    },
    {
      claimId: "C-8004",
      patientName: "Kojo Mensah",
      insuranceCompany: "Cigna",
      address: "321 Medical Dr, Philadelphia, PA 19103",
      phone: "(215) 555-2468",
      email: "claims@cigna.com",
      department: "Pediatrics",
      fax: "(215) 555-8642",
      portalLink: "https://cigna.com/claims",
      representative: "Sarah Davis",
    },
    {
      claimId: "C-8005",
      patientName: "Ama Boateng",
      insuranceCompany: "Humana",
      address: "654 Health Plaza, Louisville, KY 40202",
      phone: "(502) 555-1357",
      email: "support@humana.com",
      department: "Oncology",
      fax: "(502) 555-7531",
      portalLink: "https://humana.com/claims",
      representative: "Michael Wilson",
    },
    {
      claimId: "C-8006",
      patientName: "Yaw Darko",
      insuranceCompany: "BlueCross BlueShield",
      address: "987 Insurance Ave, Boston, MA 02109",
      phone: "(617) 555-3579",
      email: "support@bluecross.com",
      department: "Dermatology",
      fax: "(617) 555-9753",
      portalLink: "https://bluecross.com/claims",
      representative: "Jennifer Lee",
    },
    {
      claimId: "C-8007",
      patientName: "Efua Sackey",
      insuranceCompany: "Aetna",
      address: "456 Wellness Blvd, Hartford, CT 06103",
      phone: "(860) 555-5678",
      email: "claims@aetna.com",
      department: "Gynecology",
      fax: "(860) 555-8765",
      portalLink: "https://aetna.com/claims",
      representative: "Mary Johnson",
    },
    {
      claimId: "C-8008",
      patientName: "Kwesi Adjei",
      insuranceCompany: "UnitedHealth",
      address: "789 Care Lane, Minnetonka, MN 55345",
      phone: "(952) 555-9876",
      email: "support@unitedhealthcare.com",
      department: "Cardiology",
      fax: "(952) 555-6789",
      portalLink: "https://unitedhealthcare.com/claims",
      representative: "David Brown",
    },
    {
      claimId: "C-8009",
      patientName: "Akua Nkrumah",
      insuranceCompany: "Cigna",
      address: "321 Medical Dr, Philadelphia, PA 19103",
      phone: "(215) 555-2468",
      email: "claims@cigna.com",
      department: "Radiology",
      fax: "(215) 555-8642",
      portalLink: "https://cigna.com/claims",
      representative: "Sarah Davis",
    },
    {
      claimId: "C-8010",
      patientName: "Selorm Tetteh",
      insuranceCompany: "Humana",
      address: "654 Health Plaza, Louisville, KY 40202",
      phone: "(502) 555-1357",
      email: "support@humana.com",
      department: "Orthopedics",
      fax: "(502) 555-7531",
      portalLink: "https://humana.com/claims",
      representative: "Michael Wilson",
    },
    {
      claimId: "C-8011",
      patientName: "Kofi Asante",
      insuranceCompany: "BlueCross BlueShield",
      address: "123 Health Ave, Chicago, IL 60601",
      phone: "(312) 555-1234",
      email: "support@bluecross.com",
      department: "Neurology",
      fax: "(312) 555-4321",
      portalLink: "https://bluecross.com/claims",
      representative: "John Smith",
    },
    {
      claimId: "C-8012",
      patientName: "Esi Frimpong",
      insuranceCompany: "Aetna",
      address: "456 Wellness Blvd, Hartford, CT 06103",
      phone: "(860) 555-5678",
      email: "claims@aetna.com",
      department: "Pediatrics",
      fax: "(860) 555-8765",
      portalLink: "https://aetna.com/claims",
      representative: "Mary Johnson",
    },
    {
      claimId: "C-8013",
      patientName: "Nana Osei",
      insuranceCompany: "UnitedHealth",
      address: "789 Care Lane, Minnetonka, MN 55345",
      phone: "(952) 555-9876",
      email: "support@unitedhealthcare.com",
      department: "Oncology",
      fax: "(952) 555-6789",
      portalLink: "https://unitedhealthcare.com/claims",
      representative: "David Brown",
    },
    {
      claimId: "C-8014",
      patientName: "Abena Owusu",
      insuranceCompany: "Cigna",
      address: "321 Medical Dr, Philadelphia, PA 19103",
      phone: "(215) 555-2468",
      email: "claims@cigna.com",
      department: "Cardiology",
      fax: "(215) 555-8642",
      portalLink: "https://cigna.com/claims",
      representative: "Sarah Davis",
    },
    {
      claimId: "C-8015",
      patientName: "Kwamina Poku",
      insuranceCompany: "Humana",
      address: "654 Health Plaza, Louisville, KY 40202",
      phone: "(502) 555-1357",
      email: "support@humana.com",
      department: "Dermatology",
      fax: "(502) 555-7531",
      portalLink: "https://humana.com/claims",
      representative: "Michael Wilson",
    },
    {
      claimId: "C-8016",
      patientName: "Ama Mensah",
      insuranceCompany: "BlueCross BlueShield",
      address: "987 Insurance Ave, Boston, MA 02109",
      phone: "(617) 555-3579",
      email: "support@bluecross.com",
      department: "Radiology",
      fax: "(617) 555-9753",
      portalLink: "https://bluecross.com/claims",
      representative: "Jennifer Lee",
    },
    {
      claimId: "C-8017",
      patientName: "Yoofi Adjei",
      insuranceCompany: "Aetna",
      address: "456 Wellness Blvd, Hartford, CT 06103",
      phone: "(860) 555-5678",
      email: "claims@aetna.com",
      department: "Gynecology",
      fax: "(860) 555-8765",
      portalLink: "https://aetna.com/claims",
      representative: "Mary Johnson",
    },
    {
      claimId: "C-8018",
      patientName: "Akosua Boateng",
      insuranceCompany: "UnitedHealth",
      address: "789 Care Lane, Minnetonka, MN 55345",
      phone: "(952) 555-9876",
      email: "support@unitedhealthcare.com",
      department: "Orthopedics",
      fax: "(952) 555-6789",
      portalLink: "https://unitedhealthcare.com/claims",
      representative: "David Brown",
    },
    {
      claimId: "C-8019",
      patientName: "Kwasi Oduor",
      insuranceCompany: "Cigna",
      address: "321 Medical Dr, Philadelphia, PA 19103",
      phone: "(215) 555-2468",
      email: "claims@cigna.com",
      department: "Neurology",
      fax: "(215) 555-8642",
      portalLink: "https://cigna.com/claims",
      representative: "Sarah Davis",
    },
    {
      claimId: "C-8020",
      patientName: "Nadia Hassan",
      insuranceCompany: "Humana",
      address: "654 Health Plaza, Louisville, KY 40202",
      phone: "(502) 555-1357",
      email: "support@humana.com",
      department: "Pediatrics",
      fax: "(502) 555-7531",
      portalLink: "https://humana.com/claims",
      representative: "Michael Wilson",
    },
  ]);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const showSuccess = (msg: string) => {
    setSuccessBanner(msg);
    setTimeout(() => setSuccessBanner(null), 3500);
  };

  const generateClaimId = () => {
    const max = payers.reduce((acc, p) => {
      const n = parseInt(p.claimId.replace("C-", ""), 10);
      return n > acc ? n : acc;
    }, 8000);
    return `C-${max + 1}`;
  };

  // ── Form validation ───────────────────────────────────────────────────────
  const validate = (data: PayerView): Partial<Record<keyof PayerView, string>> => {
    const errs: Partial<Record<keyof PayerView, string>> = {};
    if (!data.patientName.trim()) errs.patientName = "Patient name is required.";
    if (!data.insuranceCompany.trim()) errs.insuranceCompany = "Insurance company is required.";
    if (!data.address.trim()) errs.address = "Address is required.";
    if (!data.phone.trim()) errs.phone = "Phone number is required.";
    if (!data.email.trim()) {
      errs.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errs.email = "Enter a valid email address.";
    }
    if (!data.department.trim()) errs.department = "Department is required.";
    return errs;
  };

  // ── Modal open/close ──────────────────────────────────────────────────────
  const openAddModal = () => {
    setEditingClaimId(null);
    setFormData({ ...EMPTY_FORM, claimId: generateClaimId() });
    setFormErrors({});
    setShowModal(true);
  };

  const openEditModal = (payer: PayerView) => {
    setEditingClaimId(payer.claimId);
    setFormData({ ...payer });
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingClaimId(null);
    setFormErrors({});
  };

  // ── Save handler ──────────────────────────────────────────────────────────
  const handleSave = () => {
    const errs = validate(formData);
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }
    if (editingClaimId) {
      setPayers((prev) =>
        prev.map((p) => (p.claimId === editingClaimId ? { ...formData } : p))
      );
      showSuccess(`Record for ${formData.patientName} updated successfully.`);
    } else {
      setPayers((prev) => [formData, ...prev]);
      showSuccess(`New record for ${formData.patientName} added successfully.`);
    }
    closeModal();
  };

  // ── Delete handler ────────────────────────────────────────────────────────
  const handleDelete = (claimId: string) => {
    const payer = payers.find((p) => p.claimId === claimId);
    setPayers((prev) => prev.filter((p) => p.claimId !== claimId));
    setDeleteConfirmId(null);
    if (expandedRow === claimId) setExpandedRow(null);
    showSuccess(`Record ${claimId}${payer ? ` (${payer.patientName})` : ""} deleted.`);
  };

  const handleFieldChange = (
    field: keyof PayerView,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // ── Derived data ──────────────────────────────────────────────────────────
  const filteredPayers = payers.filter(
    (p) =>
      (departmentFilter === "All" || p.department === departmentFilter) &&
      (p.patientName.toLowerCase().includes(search.toLowerCase()) ||
        p.insuranceCompany.toLowerCase().includes(search.toLowerCase()))
  );

  const totalClaims = payers.length;
  const uniqueInsurers = new Set(payers.map((p) => p.insuranceCompany)).size;
  const totalPatients = new Set(payers.map((p) => p.patientName)).size;

  const exportCSV = () => {
    const headers = [
      "Claim ID", "Patient", "Insurance Company", "Address",
      "Phone", "Email", "Department", "Fax", "Portal Link", "Representative",
    ];
    const rows = filteredPayers.map((p) => [
      p.claimId, p.patientName, p.insuranceCompany, p.address,
      p.phone, p.email, p.department, p.fax || "", p.portalLink || "", p.representative || "",
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "insurance_payer_view.csv";
    link.click();
  };

  const departments = ["All", ...new Set(payers.map((p) => p.department))];

  // ── Field component ───────────────────────────────────────────────────────
  const Field = ({
    label,
    field,
    required,
    type = "text",
    datalist,
    placeholder,
  }: {
    label: string;
    field: keyof PayerView;
    required?: boolean;
    type?: string;
    datalist?: string[];
    placeholder?: string;
  }) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {datalist ? (
        <>
          <input
            list={`dl-${field}`}
            value={(formData[field] as string) || ""}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            placeholder={placeholder || `Select or type ${label.toLowerCase()}`}
            className={`px-3 py-2 text-sm border rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 transition
              ${formErrors[field] ? "border-red-400 focus:ring-red-300" : "border-gray-200 focus:ring-blue-400"}`}
          />
          <datalist id={`dl-${field}`}>
            {datalist.map((v) => <option key={v} value={v} />)}
          </datalist>
        </>
      ) : (
        <input
          type={type}
          value={(formData[field] as string) || ""}
          onChange={(e) => handleFieldChange(field, e.target.value)}
          placeholder={placeholder}
          className={`px-3 py-2 text-sm border rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 transition
            ${formErrors[field] ? "border-red-400 focus:ring-red-300" : "border-gray-200 focus:ring-blue-400"}`}
        />
      )}
      {formErrors[field] && (
        <p className="text-xs text-red-500 mt-0.5 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {formErrors[field]}
        </p>
      )}
    </div>
  );

  return (
    <Layout currentPage="Insurance/Payer View">

      {/* ── Success Banner ────────────────────────────────────────────────── */}
      {successBanner && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium animate-fade-in-down">
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          {successBanner}
        </div>
      )}

      {/* ── Summary Cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 m-10">
        {[
          { label: "Total Claims", value: totalClaims, color: "text-blue-600", bg: "bg-blue-50", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
          { label: "Unique Insurers", value: uniqueInsurers, color: "text-emerald-600", bg: "bg-emerald-50", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
          { label: "Total Patients", value: totalPatients, color: "text-violet-600", bg: "bg-violet-50", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
        ].map(({ label, value, color, bg, icon }) => (
          <div key={label} className="bg-white shadow-sm border border-gray-100 rounded-xl p-5 flex items-center gap-4">
            <div className={`${bg} p-3 rounded-lg`}>
              <svg className={`w-6 h-6 ${color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{label}</p>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 m-10">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search patient or insurer…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            />
          </div>
          {/* Department filter */}
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-color-1 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Insurance Record
          </button>
        </div>
      </div>

      {/* ── Table ─────────────────────────────────────────────────────────── */}
      <div className="bg-white m-10 shadow-sm border border-gray-100 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Claim ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Insurance Company</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredPayers.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400 text-sm">
                    No records found. Try adjusting your filters or add a new record.
                  </td>
                </tr>
              )}
              {filteredPayers.map((p) => (
                <React.Fragment key={p.claimId}>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {p.claimId}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">{p.patientName}</td>
                    <td className="px-4 py-3 text-gray-600">{p.insuranceCompany}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {p.department}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{p.phone}</td>
                    <td className="px-4 py-3">
                      <a href={`mailto:${p.email}`} className="text-blue-600 hover:underline">{p.email}</a>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {/* Details toggle */}
                        <button
                          onClick={() => setExpandedRow(expandedRow === p.claimId ? null : p.claimId)}
                          title="View details"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={expandedRow === p.claimId ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                          </svg>
                        </button>
                        {/* Edit */}
                        <button
                          onClick={() => openEditModal(p)}
                          title="Edit record"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        {/* Delete */}
                        <button
                          onClick={() => setDeleteConfirmId(p.claimId)}
                          title="Delete record"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded details row */}
                  {expandedRow === p.claimId && (
                    <tr className="bg-blue-50/40">
                      <td colSpan={7} className="px-6 py-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Address</p>
                            <p className="text-gray-700">{p.address}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Fax</p>
                            <p className="text-gray-700">{p.fax || "—"}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Representative</p>
                            <p className="text-gray-700">{p.representative || "—"}</p>
                          </div>
                          <div className="sm:col-span-2">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Portal</p>
                            {p.portalLink
                              ? <a href={p.portalLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">{p.portalLink}</a>
                              : <p className="text-gray-700">—</p>}
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

        {/* Table footer */}
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-400">
          Showing {filteredPayers.length} of {payers.length} records
        </div>
      </div>

      {/* ── Delete Confirmation Dialog ────────────────────────────────────── */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-start gap-4">
              <div className="bg-red-100 p-2 rounded-full shrink-0">
                <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-800 mb-1">Delete Record</h3>
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete record <span className="font-medium text-gray-700">{deleteConfirmId}</span>? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add / Edit Modal ──────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d={editingClaimId
                        ? "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        : "M12 4v16m8-8H4"} />
                  </svg>
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-800">
                    {editingClaimId ? "Edit Insurance Record" : "Add New Insurance Record"}
                  </h2>
                  <p className="text-xs text-gray-400">
                    {editingClaimId ? `Editing ${editingClaimId}` : `New record · ${formData.claimId}`}
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal body */}
            <div className="overflow-y-auto px-6 py-5 flex-1">
              {/* Section: Core Info */}
              <div className="mb-5">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="inline-block w-4 h-px bg-gray-300" />
                  Core Information
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Patient Name" field="patientName" required placeholder="e.g. Aurelia Koomson" />
                  <Field label="Insurance Company" field="insuranceCompany" required datalist={INSURANCE_COMPANIES} />
                  <Field label="Department" field="department" required datalist={DEPARTMENTS} />
                  <Field label="Representative" field="representative" placeholder="e.g. John Smith" />
                </div>
              </div>

              {/* Section: Contact */}
              <div className="mb-5">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="inline-block w-4 h-px bg-gray-300" />
                  Contact Details
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Phone" field="phone" required type="tel" placeholder="(000) 000-0000" />
                  <Field label="Fax" field="fax" type="tel" placeholder="(000) 000-0000" />
                  <div className="sm:col-span-2">
                    <Field label="Email" field="email" required type="email" placeholder="e.g. support@insurer.com" />
                  </div>
                  <div className="sm:col-span-2">
                    <Field label="Address" field="address" required placeholder="Street, City, State ZIP" />
                  </div>
                  <div className="sm:col-span-2">
                    <Field label="Portal Link" field="portalLink" type="url" placeholder="https://insurer.com/claims" />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <p className="text-xs text-gray-400">
                <span className="text-red-500">*</span> Required fields
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-200 bg-white rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
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