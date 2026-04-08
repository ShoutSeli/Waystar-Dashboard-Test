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
    { claimId: "R-7001", patientName: "Aurelia Koomson", department: "Cardiology", rejectionReason: "Missing documentation", rejectionDate: "2026-03-20", suggestedAction: "Upload required medical records" },
    { claimId: "R-7002", patientName: "Kwabena Owusu", department: "Orthopedics", rejectionReason: "Invalid billing code", rejectionDate: "2026-03-21", suggestedAction: "Correct CPT code and resubmit" },
    { claimId: "R-7003", patientName: "Zainab Alhassan", department: "Neurology", rejectionReason: "Policy expired", rejectionDate: "2026-03-22", suggestedAction: "Update insurance policy details" },
    { claimId: "R-7004", patientName: "Kojo Mensah", department: "Dermatology", rejectionReason: "Duplicate claim submission", rejectionDate: "2026-03-23", suggestedAction: "Remove duplicate and resubmit once" },
    { claimId: "R-7005", patientName: "Ama Boateng", department: "Pediatrics", rejectionReason: "Incorrect patient ID", rejectionDate: "2026-03-24", suggestedAction: "Verify patient demographics" },
    { claimId: "R-7006", patientName: "Yaw Darko", department: "Oncology", rejectionReason: "Coverage not applicable", rejectionDate: "2026-03-25", suggestedAction: "Confirm coverage with insurer" },
    { claimId: "R-7007", patientName: "Efua Sackey", department: "Gynecology", rejectionReason: "Incomplete claim form", rejectionDate: "2026-03-25", suggestedAction: "Fill missing fields and resubmit" },
    { claimId: "R-7008", patientName: "Kwesi Adjei", department: "Orthopedics", rejectionReason: "Insurer system error", rejectionDate: "2026-03-26", suggestedAction: "Retry submission after 24 hours" },
    { claimId: "R-7009", patientName: "Akua Nkrumah", department: "Cardiology", rejectionReason: "Exceeded coverage limit", rejectionDate: "2026-03-26", suggestedAction: "Request prior authorization" },
    { claimId: "R-7010", patientName: "Selorm Tetteh", department: "Neurology", rejectionReason: "Incorrect claim format", rejectionDate: "2026-03-27", suggestedAction: "Use correct claim template" },
    { claimId: "R-7011", patientName: "Kwame Agyeman", department: "Radiology", rejectionReason: "Missing physician signature", rejectionDate: "2026-03-27", suggestedAction: "Obtain signature and resubmit" },
    { claimId: "R-7012", patientName: "Akosua Bediako", department: "Pediatrics", rejectionReason: "Coverage limit exceeded", rejectionDate: "2026-03-28", suggestedAction: "Request insurer override" },
    { claimId: "R-7013", patientName: "Nii Lamptey", department: "Orthopedics", rejectionReason: "Incorrect patient DOB", rejectionDate: "2026-03-28", suggestedAction: "Correct demographics and resubmit" },
    { claimId: "R-7014", patientName: "Adwoa Sarpong", department: "Cardiology", rejectionReason: "Claim submitted late", rejectionDate: "2026-03-29", suggestedAction: "File appeal for late submission" },
    { claimId: "R-7015", patientName: "Kojo Antwi", department: "Neurology", rejectionReason: "Invalid insurer ID", rejectionDate: "2026-03-29", suggestedAction: "Update insurer details" },
    { claimId: "R-7016", patientName: "Ama Ofori", department: "Oncology", rejectionReason: "Incorrect billing format", rejectionDate: "2026-03-30", suggestedAction: "Use correct billing template" },
    { claimId: "R-7017", patientName: "Yaw Asante", department: "Dermatology", rejectionReason: "Missing lab results", rejectionDate: "2026-03-30", suggestedAction: "Attach lab results" },
    { claimId: "R-7018", patientName: "Efua Addo", department: "Gynecology", rejectionReason: "Coverage not active", rejectionDate: "2026-03-31", suggestedAction: "Verify active coverage" },
    { claimId: "R-7019", patientName: "Kwesi Tetteh", department: "Orthopedics", rejectionReason: "Duplicate patient record", rejectionDate: "2026-03-31", suggestedAction: "Merge records and resubmit" },
    { claimId: "R-7020", patientName: "Akua Mensima", department: "Cardiology", rejectionReason: "Incorrect insurer plan", rejectionDate: "2026-03-31", suggestedAction: "Update plan details" },
  ]);

  return (
    <Layout currentPage="Rejection Review">
      {/* Summary Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 m-10">
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
      <div className="bg-white m-10 shadow rounded-lg p-4 overflow-x-auto">
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
