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

  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

  const confirmSubmission = () => {
    if (selectedClaim) {
      setClaims((prev) =>
        prev.map((c) =>
          c.id === selectedClaim.id ? { ...c, status: "Submitted" } : c
        )
      );
      setSelectedClaim(null);
    }
  };

  return (
    <Layout currentPage="Claim Submission">
      <div className="bg-white m-10 shadow rounded-lg p-6 overflow-x-auto">
        <table className="min-w-full text-left text-sm sm:text-base">
          <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
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
              <tr key={claim.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
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
                      onClick={() => setSelectedClaim(claim)}
                      className="px-3 py-1 bg-color-1 text-white rounded hover:bg-blue-700 transition"
                    >
                      Review & Submit
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

      {/* Review Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-4">
              Review Claim Before Submitting
            </h2>
            <div className="space-y-3 text-gray-700 dark:text-gray-200">
              <p><strong>Claim ID:</strong> {selectedClaim.id}</p>
              <p><strong>Patient:</strong> {selectedClaim.patient}</p>
              <p><strong>Bill Amount:</strong> ${selectedClaim.amount.toLocaleString()}</p>
              <p><strong>Status:</strong> {selectedClaim.status}</p>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setSelectedClaim(null)}
                className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmSubmission}
                className="px-4 py-2 rounded-md bg-color-1 text-white hover:bg-blue-700 transition"
              >
                Confirm Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ClaimSubmission;
