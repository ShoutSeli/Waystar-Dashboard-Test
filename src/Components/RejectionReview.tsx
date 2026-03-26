import React, { useState } from "react";
import Layout from "./Layout";

interface Rejection {
  claimId: string;
  patientName: string;
  department: string;
  rejectionReason: string;
  rejectionDate: string;
  suggestedAction: string;
}

const RejectionReview: React.FC = () => {
  const [rejections] = useState<Rejection[]>([
    // ...10+ rejection records as before
  ]);

  return (
    <Layout currentPage="Rejection Review">
      <h2 className="text-2xl font-semibold mb-6">Rejection Review</h2>

      {/* Summary Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h3 className="text-base sm:text-lg font-semibold text-gray-700">Total Rejections</h3>
          <p className="text-xl sm:text-2xl font-bold text-red-600 mt-2">{rejections.length}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h3 className="text-base sm:text-lg font-semibold text-gray-700">Departments Affected</h3>
          <p className="text-xl sm:text-2xl font-bold text-blue-600 mt-2">
            {new Set(rejections.map((r) => r.department)).size}
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h3 className="text-base sm:text-lg font-semibold text-gray-700">Common Reason</h3>
          <p className="text-sm sm:text-md font-medium text-gray-600 mt-2">
            {rejections[0].rejectionReason}
          </p>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="bg-white shadow rounded-lg p-4 overflow-x-auto">
        <table className="min-w-full text-left text-xs sm:text-sm md:text-base">
          <thead>
            <tr>
              <th className="px-2 sm:px-4 py-2 border-b">Claim ID</th>
              <th className="px-2 sm:px-4 py-2 border-b">Patient</th>
              <th className="px-2 sm:px-4 py-2 border-b">Department</th>
              <th className="px-2 sm:px-4 py-2 border-b">Reason</th>
              <th className="px-2 sm:px-4 py-2 border-b">Date</th>
              <th className="px-2 sm:px-4 py-2 border-b">Suggested Action</th>
            </tr>
          </thead>
          <tbody>
            {rejections.map((r) => (
              <tr key={r.claimId}>
                <td className="px-2 sm:px-4 py-2 border-b">{r.claimId}</td>
                <td className="px-2 sm:px-4 py-2 border-b">{r.patientName}</td>
                <td className="px-2 sm:px-4 py-2 border-b">{r.department}</td>
                <td className="px-2 sm:px-4 py-2 border-b text-red-600 font-semibold">{r.rejectionReason}</td>
                <td className="px-2 sm:px-4 py-2 border-b">{r.rejectionDate}</td>
                <td className="px-2 sm:px-4 py-2 border-b text-blue-600">{r.suggestedAction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default RejectionReview;
