"use client";
import { useEffect, useState } from "react";

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  resume_url: string;
  status: "PENDING" | "REACHED_OUT";
  created_at: string;
}

export default function AttorneyDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState("");

  // 1. Handle Mock Login System
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setToken(data.access_token);
        setIsAuthenticated(true);
      } else {
        setError("Invalid email credentials or password.");
      }
    } catch (err) {
      setError("Cannot reach authentication server.");
    }
  };

  // 2. Fetch Leads from Backend Protected Endpoint
  useEffect(() => {
    if (!isAuthenticated || !token) return;

    fetch("http://127.0.0.1:8000/api/internal/leads", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setLeads(Array.isArray(data) ? data : []))
      .catch(() => setError("Failed to fetch leads records."));
  }, [isAuthenticated, token]);

  // 3. Update Status Transition (PENDING -> REACHED_OUT)
  const markAsReachedOut = async (id: string) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/internal/leads/${id}/status?status=REACHED_OUT`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (res.ok) {
        setLeads(leads.map((l) => (l.id === id ? { ...l, status: "REACHED_OUT" } : l)));
      }
    } catch (err) {
      alert("Error updating status.");
    }
  };

  // --- RENDERING ROUTE: LOGIN WALL ---
  if (!isAuthenticated) {
    return (
      <main className="max-w-md mx-auto mt-20 p-6 bg-white shadow-md rounded-lg border border-gray-100 text-gray-900">
        <h1 className="text-xl font-bold text-blue-950 mb-2">Internal Attorney Gateway</h1>
        <p className="text-xs text-gray-500 mb-6">Authorized internal network access only.</p>
        
        {error && <div className="p-2 mb-4 bg-red-100 text-red-800 rounded text-xs">{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700">Attorney Email</label>
            <input type="email" required placeholder="attorney@almalaw.com" className="w-full border p-2 mt-1 rounded text-sm bg-white" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700">Security Password</label>
            <input type="password" required placeholder="password123" className="w-full border p-2 mt-1 rounded text-sm bg-white" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="w-full bg-blue-900 hover:bg-blue-950 text-white text-sm py-2 rounded font-medium transition-colors">
            Verify & Authenticate
          </button>
        </form>
      </main>
    );
  }

  // --- RENDERING ROUTE: PROTECTED TRACKER ---
  return (
    <div className="p-8 max-w-6xl mx-auto text-gray-900">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Incoming Leads Registry</h1>
          <p className="text-sm text-gray-500">Pipeline status interface for legal intake managers.</p>
        </div>
        <button onClick={() => setIsAuthenticated(false)} className="text-xs border px-3 py-1.5 rounded hover:bg-gray-50 text-gray-600">
          Secure Logout
        </button>
      </div>

      {leads.length === 0 ? (
        <p className="text-sm text-gray-500 bg-gray-50 p-6 text-center border rounded">No candidate prospects found in the queue.</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg shadow-sm">
          <table className="w-full text-sm text-left bg-white">
            <thead className="bg-gray-50 border-b text-gray-700 font-medium">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email Contact</th>
                <th className="p-4">Resume Asset</th>
                <th className="p-4">Current State</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">{lead.first_name} {lead.last_name}</td>
                  <td className="p-4 text-gray-600">{lead.email}</td>
                  <td className="p-4">
                    <a href={lead.resume_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
                      View Document ↗
                    </a>
                  </td>
                  <td className="p-4">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${lead.status === "PENDING" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {lead.status === "PENDING" ? (
                      <button onClick={() => markAsReachedOut(lead.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 rounded transition-colors">
                        Mark Reached Out
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}