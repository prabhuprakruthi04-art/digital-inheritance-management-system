import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../../components/layout/AppLayout";
import { createNominee } from "../../../services/nomineeService";

export default function AddNominee() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    relationship: "Family",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Extract ownerId from logged-in user in localStorage
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const ownerId = user._id || user.id;

      if (!ownerId) {
        alert("Session expired. Please log in again.");
        setLoading(false);
        return;
      }

      // Attach ownerId to payload sent to backend
      await createNominee({
        ...formData,
        ownerId,
      });

      alert("Nominee added successfully!");
      navigate("/owner/nominees");
    } catch (err) {
      console.error("Failed to add nominee:", err);
      alert(
        err.response?.data?.message ||
          "Failed to add nominee. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Nominee</h1>
          <p className="text-sm text-gray-500 mt-1">
            Register a beneficiary to receive asset access keys.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow border space-y-5"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Mithila"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="nominee@example.com"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Relationship
            </label>
            <select
              name="relationship"
              value={formData.relationship}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="Family">Family</option>
              <option value="Spouse">Spouse</option>
              <option value="Child">Child</option>
              <option value="Friend">Friend</option>
              <option value="Legal Advisor">Legal Advisor</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate("/owner/nominees")}
              className="px-5 py-2 rounded-lg text-gray-600 hover:bg-gray-100 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:bg-indigo-400"
            >
              {loading ? "Saving Nominee..." : "Save Nominee"}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}