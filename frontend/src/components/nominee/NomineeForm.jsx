import { useState } from "react";

export default function NomineeForm({
  initialData = {},
  onSubmit,
  loading = false,
}) {
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    email: initialData.email || "",
    phone: initialData.phone || "",
    relationship: initialData.relationship || "",
    address: initialData.address || "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.relationship)
      newErrors.relationship = "Relationship is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-lg p-8 space-y-6"
    >
      <h2 className="text-2xl font-bold">
        Nominee Information
      </h2>

      <div>
        <label className="block mb-2 font-medium">
          Full Name
        </label>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        />

        {errors.name && (
          <p className="text-red-500 text-sm mt-1">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Email
        </label>

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        />

        {errors.email && (
          <p className="text-red-500 text-sm mt-1">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Phone Number
        </label>

        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        />

        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">
            {errors.phone}
          </p>
        )}
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Relationship
        </label>

        <select
          name="relationship"
          value={formData.relationship}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        >
          <option value="">Select</option>
          <option>Parent</option>
          <option>Spouse</option>
          <option>Sibling</option>
          <option>Child</option>
          <option>Friend</option>
          <option>Other</option>
        </select>

        {errors.relationship && (
          <p className="text-red-500 text-sm mt-1">
            {errors.relationship}
          </p>
        )}
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Address
        </label>

        <textarea
          rows="3"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg"
      >
        {loading ? "Saving..." : "Save Nominee"}
      </button>
    </form>
  );
}