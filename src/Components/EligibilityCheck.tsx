import React, { useState } from "react";
import Layout from "./Layout";

interface Patient {
  id: string;
  name: string;
  status: string;
}

const EligibilityCheck: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([
    { id: "P-1001", name: "Samuel Johnson", status: "Pending" },
    { id: "P-1002", name: "Jane Smith", status: "Pending" },
    { id: "P-1003", name: "Ebenezer Mensah", status: "Pending" },
    { id: "P-1004", name: "Amina Mohammed", status: "Pending" },
    { id: "P-1005", name: "Kwame Asante", status: "Pending" },
    { id: "P-1006", name: "Yaa Asantewaa", status: "Pending" },
    { id: "P-1007", name: "Gabriel Goodison", status: "Pending" },
    { id: "P-1008", name: "Grace Osei", status: "Pending" },
    { id: "P-1009", name: "Lisa Payet", status: "Pending" },
    { id: "P-1010", name: "Michael Thompson", status: "Pending" },
  ]);

  // Simulate sending eligibility request
  const sendCheck = (id: string) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: "Checking..." } : p
      )
    );

    // Simulate real-time response after 2 seconds
    setTimeout(() => {
      const approved = Math.random() > 0.5;
      setPatients((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, status: approved ? "Eligible" : "Not Eligible" }
            : p
        )
      );
    }, 2000);
  };

  return (
    <Layout currentPage="Eligibility Check">
      <div className="bg-white ml-10 shadow rounded-lg p-6 overflow-x-auto">
        <table className="min-w-full text-left text-sm sm:text-base">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Patient ID</th>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Status</th>
              <th className="px-4 py-2 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td className="px-4 py-2 border-b">{patient.id}</td>
                <td className="px-4 py-2 border-b">{patient.name}</td>
                <td
                  className={`px-4 py-2 border-b font-semibold ${
                    patient.status === "Eligible"
                      ? "text-green-600"
                      : patient.status === "Not Eligible"
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {patient.status}
                </td>
                <td className="px-4 py-2 border-b">
                  <button
                    onClick={() => sendCheck(patient.id)}
                    className="px-3 py-1 bg-color-1 text-white rounded hover:bg-blue-700 transition"
                  >
                    Check
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default EligibilityCheck;
