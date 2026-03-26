import React, { useState } from "react";
import Layout from "./Layout";

interface ClaimStatus {
  claimId: string;
  patientName: string;
  status: string;
  reason: string;
  date: string;
}

const ClaimStatusMonitor: React.FC = () => {
  const [claims] = useState<ClaimStatus[]>([
    {
      claimId: "C-6001",
      patientName: "Aurelia Koomson",
      status: "Rejected",
      reason: "Missing documentation",
      date: "2026-03-20",
    },
    {
      claimId: "C-6002",
      patientName: "Kwabena Owusu",
      status: "Approved",
      reason: "All requirements met",
      date: "2026-03-21",
    },
    {
      claimId: "C-6003",
      patientName: "Zainab Alhassan",
      status: "Pending",
      reason: "Awaiting insurer response",
      date: "2026-03-22",
    },
    {
      claimId: "C-6004",
      patientName: "Kojo Mensah",
      status: "Rejected",
      reason: "Invalid patient ID",
      date: "2026-03-23",
    },
    {
      claimId: "C-6005",
      patientName: "Ama Boateng",
      status: "Approved",
      reason: "Verified successfully",
      date: "2026-03-24",
    },
    {
      claimId: "C-6006",
      patientName: "Yaw Darko",
      status: "Pending",
      reason: "Policy expired, awaiting update",
      date: "2026-03-25",
    },
    {
      claimId: "C-6007",
      patientName: "Efua Sackey",
      status: "Rejected",
      reason: "Incorrect billing code",
      date: "2026-03-25",
    },
    {
      claimId: "C-6008",
      patientName: "Kwesi Adjei",
      status: "Approved",
      reason: "Coverage confirmed",
      date: "2026-03-25",
    },
    {
      claimId: "C-6009",
      patientName: "Akua Nkrumah",
      status: "Pending",
      reason: "Insurer system delay",
      date: "2026-03-26",
    },
    {
      claimId: "C-6010",
      patientName: "Selorm Tetteh",
      status: "Rejected",
      reason: "Duplicate claim submission",
      date: "2026-03-26",
    },
  ]);

  return (
    <Layout currentPage="Claim Status Monitor">
      <h2 className="text-2xl font-semibold mb-6">Claim Status Monitor</h2>

      <div className="bg-white shadow rounded-lg p-6 overflow-x-auto">
        <table className="min-w-full text-left text-sm sm:text-base">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Claim ID</th>
              <th className="px-4 py-2 border-b">Patient</th>
              <th className="px-4 py-2 border-b">Status</th>
              <th className="px-4 py-2 border-b">Reason</th>
              <th className="px-4 py-2 border-b">Date</th>
            </tr>
          </thead>
          <tbody>
            {claims.map((c) => (
              <tr key={c.claimId}>
                <td className="px-4 py-2 border-b">{c.claimId}</td>
                <td className="px-4 py-2 border-b">{c.patientName}</td>
                <td
                  className={`px-4 py-2 border-b font-semibold ${
                    c.status === "Approved"
                      ? "text-green-600"
                      : c.status === "Rejected"
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {c.status}
                </td>
                <td className="px-4 py-2 border-b">{c.reason}</td>
                <td className="px-4 py-2 border-b">{c.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default ClaimStatusMonitor;
