import { useEffect, useState } from "react";
import AssetTypeSelect from "./AssetTypeSelect";
import FileUpload from "./FileUpload";
import EncryptionToggle from "./EncryptionToggle";
import { getNominees } from "../../services/nomineeService";

export default function AssetForm({
  initialData = {},
  onSubmit,
  loading = false,
}) {
  const [nominees, setNominees] = useState([]);

  const [formData, setFormData] = useState({
    title: initialData.title || "",
    assetType: initialData.assetType || "",
    description: initialData.description || "",
    sensitiveData: initialData.sensitiveData || "",
    nominee: initialData.nominee || "",
    encrypt: initialData.encrypt ?? true,
  });

  const [file, setFile] = useState(null);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadNominees();
  }, []);

  const loadNominees = async () => {
    try {
      const data = await getNominees();
      setNominees(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.type === "checkbox"
          ? e.target.checked
          : e.target.value,
    }));
  };

  const validate = () => {
    let validationErrors = {};

    if (!formData.title.trim()) {
      validationErrors.title = "Asset title is required";
    }

    if (!formData.assetType) {
      validationErrors.assetType = "Select an asset type";
    }

    if (!formData.nominee) {
      validationErrors.nominee = "Select a nominee";
    }

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const submitForm = (e) => {
    e.preventDefault();

    if (!validate()) return;

    onSubmit(formData, file);
  };

  return (
    <form
      onSubmit={submitForm}
      className="bg-white rounded-xl shadow-lg p-8 space-y-6"
    >
      <h2 className="text-2xl font-bold">
        Digital Asset Information
      </h2>

      {/* Asset Title */}

      <div>
        <label className="block mb-2 font-medium">
          Asset Title
        </label>

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Example: Gmail Account"
          className="w-full border rounded-lg p-3"
        />

        {errors.title && (
          <p className="text-red-500 text-sm mt-1">
            {errors.title}
          </p>
        )}
      </div>

      {/* Asset Type */}

      <AssetTypeSelect
        value={formData.assetType}
        onChange={handleChange}
        error={errors.assetType}
      />

      {/* Description */}

      <div>

        <label className="block mb-2 font-medium">
          Description
        </label>

        <textarea
          rows="4"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
          placeholder="Describe this asset..."
        />

      </div>

      {/* Sensitive Information */}

      <div>

        <label className="block mb-2 font-medium">
          Sensitive Information
        </label>

        <textarea
          rows="3"
          name="sensitiveData"
          value={formData.sensitiveData}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
          placeholder="Password, recovery phrase, notes..."
        />

      </div>

      {/* Nominee */}

      <div>

        <label className="block mb-2 font-medium">
          Nominee
        </label>

        <select
          name="nominee"
          value={formData.nominee}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        >

          <option value="">
            Select Nominee
          </option>

          {nominees.map((nominee) => (

            <option
              key={nominee._id}
              value={nominee._id}
            >
              {nominee.name}
            </option>

          ))}

        </select>

        {errors.nominee && (
          <p className="text-red-500 text-sm mt-1">
            {errors.nominee}
          </p>
        )}

      </div>

      {/* Upload */}

      <FileUpload
        file={file}
        onFileChange={setFile}
      />

      {/* Encryption */}

      <EncryptionToggle
        checked={formData.encrypt}
        onChange={() =>
          setFormData((prev) => ({
            ...prev,
            encrypt: !prev.encrypt,
          }))
        }
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition"
      >
        {loading ? "Saving..." : "Save Asset"}
      </button>

    </form>
  );
}