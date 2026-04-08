import React, { useState } from "react";
import Layout from "./Layout";

interface BillingDetail {
  claimId: string;
  patientName: string;
  encounterId: string;
  serviceDate: string;
  amount: number;
  status: string;
  insurance: string;
  department: string;
  paymentMethod: string;
  transactionId?: string;
  payer: string;
  coveragePercent: number;
  notes: string;
}

const BillingDetails: React.FC = () => {
  const [details] = useState<BillingDetail[]>([
    {
      claimId: "C-5001",
      patientName: "Aurelia Koomson",
      encounterId: "E-701",
      serviceDate: "2026-03-15",
      amount: 1200,
      status: "Pending",
      insurance: "BlueCross",
      department: "Cardiology",
      paymentMethod: "Credit Card",
      transactionId: "TXN-987654",
      payer: "BlueCross Insurance",
      coveragePercent: 80,
      notes: "Awaiting insurance verification",
    },
    {
      claimId: "C-5002",
      patientName: "Kwabena Owusu",
      encounterId: "E-702",
      serviceDate: "2026-03-16",
      amount: 850,
      status: "Submitted",
      insurance: "Aetna",
      department: "Orthopedics",
      paymentMethod: "Bank Transfer",
      transactionId: "TXN-123456",
      payer: "Aetna Insurance",
      coveragePercent: 75,
      notes: "Submitted successfully",
    },
    {
      claimId: "C-5003",
      patientName: "Zainab Alhassan",
      encounterId: "E-703",
      serviceDate: "2026-03-17",
      amount: 1500,
      status: "Pending",
      insurance: "UnitedHealth",
      department: "Neurology",
      paymentMethod: "Cash",
      payer: "UnitedHealth Insurance",
      coveragePercent: 70,
      notes: "Pending approval",
    },
    {
      claimId: "C-5004",
      patientName: "Kojo Mensah",
      encounterId: "E-704",
      serviceDate: "2026-03-18",
      amount: 975,
      status: "Pending",
      insurance: "BlueCross",
      department: "Dermatology",
      paymentMethod: "Check",
      transactionId: "CHK-445566",
      payer: "BlueCross Insurance",
      coveragePercent: 65,
      notes: "Awaiting check clearance",
    },
    {
      claimId: "C-5005",
      patientName: "Ama Boateng",
      encounterId: "E-705",
      serviceDate: "2026-03-19",
      amount: 1100,
      status: "Submitted",
      insurance: "Aetna",
      department: "Pediatrics",
      paymentMethod: "Debit Card",
      transactionId: "TXN-778899",
      payer: "Aetna Insurance",
      coveragePercent: 85,
      notes: "Processed",
    },
    {
      claimId: "C-5006",
      patientName: "Yaw Darko",
      encounterId: "E-706",
      serviceDate: "2026-03-20",
      amount: 1320,
      status: "Pending",
      insurance: "UnitedHealth",
      department: "Oncology",
      paymentMethod: "Insurance Direct Pay",
      transactionId: "INS-223344",
      payer: "UnitedHealth Insurance",
      coveragePercent: 90,
      notes: "Pending insurer confirmation",
    },
    {
      claimId: "C-5007",
      patientName: "Efua Sackey",
      encounterId: "E-707",
      serviceDate: "2026-03-21",
      amount: 890,
      status: "Submitted",
      insurance: "BlueCross",
      department: "Gynecology",
      paymentMethod: "Credit Card",
      transactionId: "TXN-556677",
      payer: "BlueCross Insurance",
      coveragePercent: 78,
      notes: "Approved",
    },
    {
      claimId: "C-5008",
      patientName: "Kwesi Adjei",
      encounterId: "E-708",
      serviceDate: "2026-03-22",
      amount: 1450,
      status: "Pending",
      insurance: "Aetna",
      department: "Orthopedics",
      paymentMethod: "Bank Transfer",
      transactionId: "TXN-889900",
      payer: "Aetna Insurance",
      coveragePercent: 72,
      notes: "Awaiting insurance",
    },
    {
      claimId: "C-5009",
      patientName: "Akua Nkrumah",
      encounterId: "E-709",
      serviceDate: "2026-03-23",
      amount: 1025,
      status: "Submitted",
      insurance: "UnitedHealth",
      department: "Cardiology",
      paymentMethod: "Check",
      transactionId: "CHK-112233",
      payer: "UnitedHealth Insurance",
      coveragePercent: 68,
      notes: "Submitted successfully",
    },
    {
      claimId: "C-5010",
      patientName: "Selorm Tetteh",
      encounterId: "E-710",
      serviceDate: "2026-03-24",
      amount: 1180,
      status: "Pending",
      insurance: "BlueCross",
      department: "Neurology",
      paymentMethod: "Debit Card",
      transactionId: "TXN-334455",
      payer: "BlueCross Insurance",
      coveragePercent: 82,
      notes: "Pending approval",
    },
  ]);

  return (
    <Layout currentPage="Billing Details">
      <div className="bg-white m-10 dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="overflow-x-auto max-h-[500px]">
  <table className="min-w-full text-left text-sm sm:text-base border-collapse">
    <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
      <tr>
        <th className="px-4 py-2 border-b">Claim ID</th>
        <th className="px-4 py-2 border-b">Patient</th>
        <th className="px-4 py-2 border-b">Encounter ID</th>
        <th className="px-4 py-2 border-b">Service Date</th>
        <th className="px-4 py-2 border-b">Bill Amount ($)</th>
        <th className="px-4 py-2 border-b">Status</th>
        <th className="px-4 py-2 border-b">Insurance</th>
        <th className="px-4 py-2 border-b">Department</th>
        <th className="px-4 py-2 border-b">Payment Method</th>
        <th className="px-4 py-2 border-b">Transaction ID</th>
        <th className="px-4 py-2 border-b">Payer</th>
        <th className="px-4 py-2 border-b">Coverage %</th>
        <th className="px-4 py-2 border-b">Notes</th>
      </tr>
    </thead>
    <tbody>
      {details.map((d) => (
        <tr
          key={d.claimId}
          className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
        >
          <td className="px-4 py-2 border-b">{d.claimId}</td>
          <td className="px-4 py-2 border-b">{d.patientName}</td>
          <td className="px-4 py-2 border-b">{d.encounterId}</td>
          <td className="px-4 py-2 border-b">{d.serviceDate}</td>
          <td className="px-4 py-2 border-b font-semibold text-blue-600">
            ${d.amount.toLocaleString()}
          </td>
          <td
            className={`px-4 py-2 border-b font-semibold ${
              d.status === "Submitted" ? "text-green-600" : "text-gray-600"
            }`}
          >
            {d.status}
          </td>
          <td className="px-4 py-2 border-b">{d.insurance}</td>
          <td className="px-4 py-2 border-b">{d.department}</td>
          <td className="px-4 py-2 border-b">{d.paymentMethod}</td>
          <td className="px-4 py-2 border-b">
            {d.paymentMethod !== "Cash" ? d.transactionId : "—"}
          </td>
          <td className="px-4 py-2 border-b">{d.payer}</td>
          <td className="px-4 py-2 border-b">{d.coveragePercent}%</td>
          <td className="px-4 py-2 border-b">{d.notes}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

      </div>
    </Layout>
  );
};

export default BillingDetails;
