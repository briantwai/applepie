"use client";
import { useState } from "react";

export default function PublicLeadForm() {
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "" });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please upload your Resume/CV");
    setLoading(true);
    setMessage("");
    

    const data = new FormData();
    data.append("first_name", formData.firstName);
    data.append("last_name", formData.lastName);
    data.append("email", formData.email);
    data.append("resume", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/public/leads", {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        setMessage("🎉 Application received successfully!");
        setFormData({ firstName: "", lastName: "", email: "" });
        setFile(null);
      } else {
        setMessage("❌ Something went wrong. Please try again.");
      }
    } catch (error) {
      setMessage("❌ Cannot connect to the backend server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto py-12 px-6 bg-white shadow-md rounded-lg mt-10 border border-gray-100 text-gray-900">
      <h1 className="text-2xl font-bold mb-2 text-blue-900">Submit Your Case Information</h1>
      <p className="text-sm text-gray-600 mb-6">Please fill out the details below and upload your CV/Resume.</p>
      
      {message && (
        <div className={`p-3 rounded mb-4 text-sm font-medium ${message.includes("🎉") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <input type="text" required value={formData.firstName} className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 text-black bg-white" onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <input type="text" required value={formData.lastName} className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 text-black bg-white" onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input type="email" required value={formData.email} className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 text-black bg-white" onChange={(e) => setFormData({...formData, email: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Resume / CV</label>
          <input type="file" required accept=".pdf,.doc,.docx" className="w-full border border-gray-300 p-2 rounded text-black bg-white" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded transition-colors disabled:opacity-50">
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </main>
  );
}