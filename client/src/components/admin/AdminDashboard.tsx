// frontend/components/AdminDashboard.tsx
import React, { useEffect, useState } from "react";

interface ModerationLog {
  action: string;
  moderator_id: string;
  user_id: string | null;
  reason: string;
  date: string;
}

interface Appeal {
  _id: string;
  user_id: string;
  reason: string;
  status: string;
}

interface Report {
  _id: string;
  reported_by: string;
  reason: string;
  status: string;
}

interface DailyStats {
  countLogs: number;
  countAppeals: number;
  countReports: number;
}

const AdminDashboard: React.FC = () => {
  const [logs, setLogs] = useState<ModerationLog[]>([]);
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState<DailyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    const [logsRes, appealsRes, reportsRes, statsRes] = await Promise.all([
      fetch("/api/admin/moderation-logs", { credentials: "include" }),
      fetch("/api/admin/pending-appeals", { credentials: "include" }),
      fetch("/api/admin/reports", { credentials: "include" }),
      fetch("/api/admin/stats/daily-summary", { credentials: "include" }),
    ]);

    setLogs(await logsRes.json());
    setAppeals(await appealsRes.json());
    setReports(await reportsRes.json());
    setStats(await statsRes.json());
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleApproveAppeal = async (appealId: string) => {
    if (confirm("Are you sure you want to approve this appeal?")) {
      await fetch("/api/admin/approve-appeal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ appealId, resolution: "Approved via dashboard" }),
      });
      setNotification("✅ Appeal approved successfully.");
      fetchDashboardData();
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    if (confirm("Are you sure you want to delete this report?")) {
      await fetch(`/api/admin/delete-report/${reportId}`, {
        method: "DELETE",
        credentials: "include",
      });
      setNotification("🗑️ Report deleted successfully.");
      fetchDashboardData();
    }
  };

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {notification && (
        <div className="bg-green-100 text-green-800 p-3 mb-4 rounded shadow">
          {notification}
          <button
            onClick={() => setNotification(null)}
            className="ml-4 text-red-500 hover:text-red-700"
          >
            ✖
          </button>
        </div>
      )}

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Daily Stats</h2>
        <p>Moderation Actions: {stats?.countLogs}</p>
        <p>Pending Appeals: {stats?.countAppeals}</p>
        <p>Active Reports: {stats?.countReports}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Recent Moderation Logs</h2>
        {logs.map((log) => (
          <div key={log.date} className="border-b py-2">
            <p>
              <strong>{log.action}</strong> by {log.moderator_id} | {new Date(log.date).toLocaleString()}
            </p>
            <p>Reason: {log.reason}</p>
          </div>
        ))}
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Pending Appeals</h2>
        {appeals.map((appeal) => (
          <div key={appeal._id} className="border-b py-2">
            <p>
              Appeal by User {appeal.user_id} | Status: {appeal.status}
            </p>
            <p>Reason: {appeal.reason}</p>
            <button
              onClick={() => handleApproveAppeal(appeal._id)}
              className="mt-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 shadow"
            >
              Approve Appeal
            </button>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Active Reports</h2>
        {reports.map((report) => (
          <div key={report._id} className="border-b py-2">
            <p>
              Report by {report.reported_by} | Status: {report.status}
            </p>
            <p>Reason: {report.reason}</p>
            <button
              onClick={() => handleDeleteReport(report._id)}
              className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 shadow"
            >
              Delete Report
            </button>
          </div>
        ))}
      </section>
    </div>
  );
};

export default AdminDashboard;