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

const InsurancePayerView: React.FC = () => {
  const [search, setSearch] = useState("");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [departmentFilter, setDepartmentFilter] = useState("All");

  const payers: PayerView[] = [
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
    }
  ];

  // Filter logic
  const filteredPayers = payers.filter(
    (p) =>
      (departmentFilter === "All" || p.department === departmentFilter) &&
      (p.patientName.toLowerCase().includes(search.toLowerCase()) ||
        p.insuranceCompany.toLowerCase().includes(search.toLowerCase()))
  );

  // Summary counts
  const totalClaims = payers.length;
  const uniqueInsurers = new Set(payers.map((p) => p.insuranceCompany)).size;
  const totalPatients = new Set(payers.map((p) => p.patientName)).size;

  // Export CSV
  const exportCSV = () => {
    const headers = [
      "Claim ID",
      "Patient",
      "Insurance Company",
      "Address",
      "Phone",
      "Email",
      "Department",
      "Fax",
      "Portal Link",
      "Representative",
    ];
    const rows = filteredPayers.map((p) => [
      p.claimId,
      p.patientName,
      p.insuranceCompany,
      p.address,
      p.phone,
      p.email,
      p.department,
      p.fax || "",
      p.portalLink || "",
      p.representative || "",
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "insurance_payer_view.csv";
    link.click();
  };

  // Collect unique departments for dropdown
  const departments = ["All", ...new Set(payers.map((p) => p.department))];

  return (
    <Layout currentPage="Insurance / Payer View">
      <h2 className="text-2xl font-semibold mb-6">Insurance / Payer View</h2>

      {/* Summary Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h3 className="text-base sm:text-lg font-semibold text-gray-700">Total Claims</h3>
          <p className="text-xl sm:text-2xl font-bold text-blue-600 mt-2">{totalClaims}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h3 className="text-base sm:text-lg font-semibold text-gray-700">Unique Insurers</h3>
          <p className="text-xl sm:text-2xl font-bold text-green-600 mt-2">{uniqueInsurers}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h3 className="text-base sm:text-lg font-semibold text-gray-700">Total Patients</h3>
          <p className="text-xl sm:text-2xl font-bold text-purple-600 mt-2">{totalPatients}</p>
        </div>
      </div>

      {/* Search + Filter + Export */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <input
          type="text"
          placeholder="Search by patient or insurance company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/3 px-3 py-2 border rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="w-full sm:w-1/4 px-3 py-2 border rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
        <button
          onClick={exportCSV}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm sm:text-base hover:bg-blue-700"
        >
          Export CSV
        </button>
      </div>

      {/* Responsive Table */}
      <div className="bg-white shadow rounded-lg p-4 overflow-x-auto">
        <table className="min-w-full text-left text-xs sm:text-sm md:text-base">
          <thead>
            <tr>
              <th className="px-2 sm:px-4 py-2 border-b">Claim ID</th>
              <th className="px-2 sm:px-4 py-2 border-b">Patient</th>
              <th className="px-2 sm:px-4 py-2 border-b">Insurance Company</th>
              <th className="px-2 sm:px-4 py-2 border-b">Department</th>
              <th className="px-2 sm:px-4 py-2 border-b">Address</th>
              <th className="px-2 sm:px-4 py-2 border-b">Phone</th>
              <th className="px-2 sm:px-4 py-2 border-b">Email</th>
              <th className="px-2 sm:px-4 py-2 border-b">Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayers.map((p) => (
              <>
                <tr key={p.claimId}>
                  <td className="px-2 sm:px-4 py-2 border-b">{p.claimId}</td>
                  <td className="px-2 sm:px-4 py-2 border-b">{p.patientName}</td>
                  <td className="px-2 sm:px-4 py-2 border-b">{p.insuranceCompany}</td>
                  <td className="px-2 sm:px-4 py-2 border-b">{p.department}</td>
                  <td className="px-2 sm:px-4 py-2 border-b">{p.address}</td>
                  <td className="px-2 sm:px-4 py-2 border-b">{p.phone}</td>
                  <td className="px-2 sm:px-4 py-2 border-b text-blue-600">{p.email}</td>
                  <td className="px-2 sm:px-4 py-2 border-b">
                    <button
                      onClick={() =>
                        setExpandedRow(expandedRow === p.claimId ? null : p.claimId)
                      }
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {expandedRow === p.claimId ? "Hide" : "View"}
                    </button>
                  </td>
                </tr>
                {expandedRow === p.claimId && (
                  <tr className="bg-gray-50">
                    <td colSpan={8} className="px-4 py-3 border-b">
                      <div className="space-y-2 text-sm sm:text-base">
                        <p>
                          <span className="font-semibold">Fax:</span> {p.fax || "N/A"}
                        </p>
                        <p>
                          <span className="font-semibold">Portal:</span>{" "}
                          {p.portalLink ? (
                            <a
                              href={p.portalLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline"
                            >
                              {p.portalLink}
                            </a>
                          ) : (
                            "N/A"
                          )}
                        </p>
                        <p>
                          <span className="font-semibold">Representative:</span>{" "}
                          {p.representative || "N/A"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default InsurancePayerView;