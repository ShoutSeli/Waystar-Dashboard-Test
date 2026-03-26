import React, { useState } from "react";
import Layout from "./Layout";

interface ClaimStatus {
  claimId: string;
  patientName: string;
  status: "Approved" | "Rejected" | "Pending";
  reason: string;
  date: string;
}

const ClaimStatusMonitor: React.FC = () => {
  const [filter, setFilter] = useState<"All" | "Approved" | "Rejected" | "Pending">("All");

  const claims: ClaimStatus[] = [
    { claimId: "C-6001", patientName: "Aurelia Koomson", status: "Rejected", reason: "Missing documentation", date: "2026-03-20" },
    { claimId: "C-6002", patientName: "Kwabena Owusu", status: "Approved", reason: "All requirements met", date: "2026-03-21" },
    { claimId: "C-6003", patientName: "Zainab Alhassan", status: "Pending", reason: "Awaiting insurer response", date: "2026-03-22" },
    { claimId: "C-6004", patientName: "Kojo Mensah", status: "Rejected", reason: "Invalid patient ID", date: "2026-03-23" },
    { claimId: "C-6005", patientName: "Ama Boateng", status: "Approved", reason: "Verified successfully", date: "2026-03-24" },
    { claimId: "C-6006", patientName: "Yaw Darko", status: "Pending", reason: "Policy expired, awaiting update", date: "2026-03-25" },
    { claimId: "C-6007", patientName: "Efua Sackey", status: "Rejected", reason: "Incorrect billing code", date: "2026-03-25" },
    { claimId: "C-6008", patientName: "Kwesi Adjei", status: "Approved", reason: "Coverage confirmed", date: "2026-03-25" },
    { claimId: "C-6009", patientName: "Akua Nkrumah", status: "Pending", reason: "Insurer system delay", date: "2026-03-26" },
    { claimId: "C-6010", patientName: "Selorm Tetteh", status: "Rejected", reason: "Duplicate claim submission", date: "2026-03-26" },
    { claimId: "C-6011", patientName: "Kwame Agyeman", status: "Approved", reason: "Insurer confirmed eligibility", date: "2026-03-27" },
    { claimId: "C-6012", patientName: "Akosua Bediako", status: "Pending", reason: "Awaiting patient verification", date: "2026-03-27" },
    { claimId: "C-6013", patientName: "Nii Lamptey", status: "Rejected", reason: "Policy not active", date: "2026-03-28" },
    { claimId: "C-6014", patientName: "Adwoa Sarpong", status: "Approved", reason: "All documents valid", date: "2026-03-28" },
    { claimId: "C-6015", patientName: "Kojo Antwi", status: "Pending", reason: "Insurer review in progress", date: "2026-03-29" },
    { claimId: "C-6016", patientName: "Ama Ofori", status: "Rejected", reason: "Incorrect claim format", date: "2026-03-29" },
    { claimId: "C-6017", patientName: "Yaw Asante", status: "Approved", reason: "Coverage confirmed", date: "2026-03-30" },
    { claimId: "C-6018", patientName: "Efua Addo", status: "Pending", reason: "Awaiting insurer system update", date: "2026-03-30" },
    { claimId: "C-6019", patientName: "Kwesi Tetteh", status: "Rejected", reason: "Duplicate submission detected", date: "2026-03-31" },
    { claimId: "C-6020", patientName: "Akua Mensima", status: "Approved", reason: "Verified successfully", date: "2026-03-31" },
  ];

  const filteredClaims = filter === "All" ? claims : claims.filter((c) => c.status === filter);

  const approvedCount = claims.filter((c) => c.status === "Approved").length;
  const rejectedCount = claims.filter((c) => c.status === "Rejected").length;
  const pendingCount = claims.filter((c) => c.status === "Pending").length;

  return (
    <Layout currentPage="Claim Status Monitor">
      <h2 className="text-2xl font-semibold mb-6">Claim Status Monitor</h2>

      {/* Summary Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h3 className="text-base sm:text-lg font-semibold text-gray-700">Approved</h3>
          <p className="text-xl sm:text-2xl font-bold text-green-600 mt-2">{approvedCount}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h3 className="text-base sm:text-lg font-semibold text-gray-700">Rejected</h3>
          <p className="text-xl sm:text-2xl font-bold text-red-600 mt-2">{rejectedCount}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h3 className="text-base sm:text-lg font-semibold text-gray-700">Pending</h3>
          <p className="text-xl sm:text-2xl font-bold text-gray-600 mt-2">{pendingCount}</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="mb-4 flex flex-wrap gap-2">
        {["All", "Approved", "Rejected", "Pending"].map((option) => (
          <button
            key={option}
            onClick={() => setFilter(option as typeof filter)}
            className={`px-3 py-2 rounded-md border text-sm sm:text-base ${
              filter === option ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Responsive Table */}
      <div className="bg-white shadow rounded-lg p-4 overflow-x-auto">
        <table className="min-w-full text-left text-xs sm:text-sm md:text-base">
          <thead>
            <tr>
              <th className="px-2 sm:px-4 py-2 border-b">Claim ID</th>
              <th className="px-2 sm:px-4 py-2 border-b">Patient</th>
              <th className="px-2 sm:px-4 py-2 border-b">Status</th>
              <th className="px-2 sm:px-4 py-2 border-b">Reason</th>
              <th className="px-2 sm:px-4 py-2 border-b">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredClaims.map((c) => (
              <tr key={c.claimId}>
                <td className="px-2 sm:px-4 py-2 border-b">{c.claimId}</td>
                <td className="px-2 sm:px-4 py-2 border-b">{c.patientName}</td>
                <td
                  className={`px-2 sm:px-4 py-2 border-b font-semibold ${
                    c.status === "Approved"
                      ? "text-green-600"
                      : c.status === "Rejected"
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {c.status}
                </td>
                <td className="px-2 sm:px-4 py-2 border-b">{c.reason}</td>
                <td className="px-2 sm:px-4 py-2 border-b">{c.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default ClaimStatusMonitor;
