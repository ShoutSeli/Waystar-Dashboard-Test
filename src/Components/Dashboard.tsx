import React, { useState, useEffect } from "react";
import { useSettings } from "../context/SettingsContext";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import Layout from "./Layout";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
);

const Dashboard: React.FC = () => {
  const [claimsData, setClaimsData] = useState({
    submitted: 1245,
    rejected: 320,
    approved: 925,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setClaimsData((prev) => ({
        submitted: prev.submitted + Math.floor(Math.random() * 5),
        rejected: prev.rejected + Math.floor(Math.random() * 2),
        approved: prev.approved + Math.floor(Math.random() * 3),
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const pieData = {
    labels: ["Submitted", "Rejected", "Approved"],
    datasets: [
      {
        data: [claimsData.submitted, claimsData.rejected, claimsData.approved],
        backgroundColor: ["#3B82F6", "#EF4444", "#10B981"],
        borderColor: ["#ffffff", "#ffffff", "#ffffff"],
        borderWidth: 2,
      },
    ],
  };

  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Submitted",
        data: [500, 700, 800, 900, 1100, claimsData.submitted],
        borderColor: "#3B82F6",
        backgroundColor: "#3B82F6",
        tension: 0.3,
      },
      {
        label: "Approved",
        data: [400, 600, 700, 800, 950, claimsData.approved],
        borderColor: "#10B981",
        backgroundColor: "#10B981",
        tension: 0.3,
      },
      {
        label: "Rejected",
        data: [100, 120, 150, 200, 250, claimsData.rejected],
        borderColor: "#EF4444",
        backgroundColor: "#EF4444",
        tension: 0.3,
      },
    ],
  };

  const { theme } = useSettings();

  return (
    <Layout currentPage="Dashboard">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            Submitted Claims
          </h3>
          <p className="text-3xl font-bold text-blue-600 mt-4">
            {claimsData.submitted}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Updated in real-time
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            Rejected Claims
          </h3>
          <p className="text-3xl font-bold text-red-600 mt-4">
            {claimsData.rejected}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Updated in real-time
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            Approved Claims
          </h3>
          <p className="text-3xl font-bold text-green-600 mt-4">
            {claimsData.approved}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Updated in real-time
          </p>
        </div>
      </div>

      {/* Pie Chart */}
      {/* Charts Section */}
<section className="mb-10">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* Pie Chart Card */}
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-5">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">
        Claim Distribution
      </h3>
      <div className="flex justify-center">
        <div className="w-full max-w-xs sm:max-w-sm">
          <Pie data={pieData} />
        </div>
      </div>
    </div>

    {/* Line Chart Card */}
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-5">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">
        Monthly Claim Trends
      </h3>
      <Line data={lineData} />
    </div>
  </div>
</section>


      {/* Top Payers */}
      <section className="mb-10">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
            Top Payers
          </h3>
          <ul className="space-y-2 text-gray-700 dark:text-gray-200 text-sm sm:text-base">
            <li className="flex justify-between">
              <span>BlueCross</span>
              <span className="font-semibold">540</span>
            </li>
            <li className="flex justify-between">
              <span>Aetna</span>
              <span className="font-semibold">420</span>
            </li>
            <li className="flex justify-between">
              <span>UnitedHealth</span>
              <span className="font-semibold">310</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Recent Rejections */}
      <section className="mb-20">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 overflow-x-auto">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
            Recent Rejections
          </h3>
          <table className="min-w-full text-left text-sm sm:text-base">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 border-b">Claim ID</th>
                <th className="px-4 py-2 border-b">Reason</th>
                <th className="px-4 py-2 border-b">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-4 py-2 border-b">C-10234</td>
                <td className="px-4 py-2 border-b">Missing documentation</td>
                <td className="px-4 py-2 border-b">2026-03-20</td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-4 py-2 border-b">C-10235</td>
                <td className="px-4 py-2 border-b">Invalid patient ID</td>
                <td className="px-4 py-2 border-b">2026-03-21</td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-4 py-2 border-b">C-10236</td>
                <td className="px-4 py-2 border-b">Policy expired</td>
                <td className="px-4 py-2 border-b">2026-03-22</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </Layout>
  );
};

export default Dashboard;
