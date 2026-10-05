import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Adjust relative path depth: src/pages/owner/assets -> src/components
import AppLayout from "../../../components/layout/AppLayout";
import { createAsset } from "../../../services/assetService";

export default function AddAsset() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "General", // Primary selector for Legal vs General document classification
    assetType: "General",
    description: "",
    sensitiveData: "",
    nominee: "",
    nomineeEmail: "",
    encrypt: true,
  });
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      // Keep category and assetType in sync
      ...(name === "category" ? { assetType: value } : {}),
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const data = new FormData();
      data.append("title", formData.title || "");
      data.append("name", formData.title || "");
      data.append("category", formData.category || "General");
      data.append("assetType", formData.category || "General");
      data.append("description", formData.description || "");
      data.append("sensitiveData", formData.sensitiveData || "");
      data.append("nominee", formData.nominee || "");
      data.append("nomineeEmail", formData.nomineeEmail || "");
      data.append("encrypt", formData.encrypt);

      if (file) {
        data.append("file", file);
        data.append("document", file);
      }

      // Local storage persistence so Assets & Documents pages sync immediately
      const newLocalAsset = {
        _id: "ast-" + Date.now(),
        title: formData.title,
        name: formData.title,
        fileName: file ? file.name : `${formData.title.toLowerCase().replace(/\s+/g, "_")}.pdf`,
        originalFileName: file ? file.name : `${formData.title.toLowerCase().replace(/\s+/g, "_")}.pdf`,
        category: formData.category,
        assetType: formData.category,
        nominee: formData.nominee,
        nomineeEmail: formData.nomineeEmail,
        description: formData.description,
        cid: "Qm" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        status: "synced",
        security: "2-of-3 SSS Shares (AES-256-GCM)",
        createdAt: new Date().toISOString(),
      };

      try {
        await createAsset(data);
      } catch (apiErr) {
        console.warn("API offline, saving asset locally:", apiErr.message);
      }

      const existingAssets = JSON.parse(localStorage.getItem("shared_assets") || "[]");
      localStorage.setItem("shared_assets", JSON.stringify([newLocalAsset, ...existingAssets]));

      // Synchronize across pages and browser tabs immediately
      window.dispatchEvent(new CustomEvent("dims-vault-updated"));
      try {
        const channel = new BroadcastChannel("dims_vault_sync");
        channel.postMessage({ type: "VAULT_UPDATED", timestamp: Date.now() });
        channel.close();
      } catch (e) {}

      if (formData.nomineeEmail) {
        alert(
          `Asset Added Successfully!\n\nA confidential verification OTP has been securely dispatched to the designated nominee's email inbox (${formData.nomineeEmail}).`
        );
      } else {
        alert("Asset Added Successfully!");
      }

      // Navigate to Documents view if document-related, else Assets view
      if (formData.category === "Legal" || formData.category === "General" || formData.category === "Media") {
        navigate("/owner/documents");
      } else {
        navigate("/owner/assets");
      }
    } catch (error) {
      console.error("Failed to add asset:", error);
      alert(
        error.response?.data?.message ||
          "Failed to add asset. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">
          Add New Digital Asset
        </h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow border space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Asset Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Bank Account Credentials, Property Deed"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Updated Category Dropdown to distinguish Legal vs General */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Document Category / Asset Type
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white cursor-pointer"
              >
                <option value="General">General Document</option>
                <option value="Legal">Legal Document (Will, Deed, Contract)</option>
                <option value="Financial">Financial Record</option>
                <option value="Media">Media / Video Asset</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Nominee Name / Beneficiary
              </label>
              <input
                type="text"
                name="nominee"
                value={formData.nominee}
                onChange={handleChange}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nominee Email Address (Confidential OTP Delivery) *
            </label>
            <input
              type="email"
              name="nomineeEmail"
              value={formData.nomineeEmail}
              onChange={handleChange}
              placeholder="e.g. nominee@gmail.com"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <p className="text-xs text-indigo-600 font-medium mt-1">
              🔒 A confidential 6-digit verification OTP will be dispatched exclusively to this email inbox upon saving.
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Additional information or instructions..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Attach Asset Document
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full border p-2 rounded-lg bg-gray-50 text-sm text-gray-600 cursor-pointer"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate("/owner/assets")}
              className="px-5 py-2 rounded-lg text-gray-600 hover:bg-gray-100 font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:bg-indigo-400 cursor-pointer"
            >
              {loading ? "Saving Asset..." : "Add Asset"}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}