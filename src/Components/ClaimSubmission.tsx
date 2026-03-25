import React, { useState } from "react";
import Layout from "./Layout";

interface Claim {
  id: string;
  patient: string;
  amount: number;
  status: string;
}

const ClaimSubmission: React.FC = () => {
  const [claims, setClaims] = useState<Claim[]>([
    { id: "C-2001", patient: "Stephen Dogbe", amount: 1200, status: "Pending" },
    { id: "C-2002", patient: "Abigail Adjei", amount: 850, status: "Pending" },
    { id: "C-2003", patient: "Samuel Effah", amount: 1500, status: "Pending" },
    { id: "C-2004", patient: "Timothy Henson", amount: 2000, status: "Pending" },
    { id: "C-2005", patient: "David Brown", amount: 1800, status: "Pending" },
    { id: "C-2006", patient: "Lisa Davis", amount: 1600, status: "Pending" },
    { id: "C-2007", patient: "James Wilson", amount: 2200, status: "Pending" },
    { id: "C-2008", patient: "Emily Taylor", amount: 1400, status: "Pending" },
    { id: "C-2009", patient: "Robert Anderson", amount: 1900, status: "Pending" },
    { id: "C-2010", patient: "Jessica Martinez", amount: 1700, status: "Pending" },
    { id: "C-2011", patient: "Patricia Love", amount: 1200, status: "Pending" },
    { id: "C-2012", patient: "Thomas Gblonya", amount: 2000, status: "Pending" },
    { id: "C-2013", patient: "Jennifer Alhassan", amount: 1300, status: "Pending" },
  ]);

  const submitClaim = (id: string) => {
    setClaims((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: "Submitted" } : c
      )
    );
  };

  return (
    <Layout currentPage="Claim Submission">
      <h2 className="text-2xl font-semibold mb-6">Claim Submission</h2>

      <div className="bg-white shadow rounded-lg p-6 overflow-x-auto">
        <table className="min-w-full text-left text-sm sm:text-base">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Claim ID</th>
              <th className="px-4 py-2 border-b">Patient</th>
              <th className="px-4 py-2 border-b">Bill Amount ($)</th>
              <th className="px-4 py-2 border-b">Status</th>
              <th className="px-4 py-2 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {claims.map((claim) => (
              <tr key={claim.id}>
                <td className="px-4 py-2 border-b">{claim.id}</td>
                <td className="px-4 py-2 border-b">{claim.patient}</td>
                <td className="px-4 py-2 border-b font-semibold text-blue-600">
                  ${claim.amount.toLocaleString()}
                </td>
                <td
                  className={`px-4 py-2 border-b font-semibold ${
                    claim.status === "Submitted"
                      ? "text-green-600"
                      : "text-gray-600"
                  }`}
                >
                  {claim.status}
                </td>
                <td className="px-4 py-2 border-b">
                  {claim.status === "Pending" ? (
                    <button
                      onClick={() => submitClaim(claim.id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      Submit
                    </button>
                  ) : (
                    <span className="text-sm text-gray-500">✓ Submitted</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default ClaimSubmission;
