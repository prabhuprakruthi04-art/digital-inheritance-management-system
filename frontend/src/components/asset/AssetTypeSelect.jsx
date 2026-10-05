const assetTypes = [
  "Document",
  "Password",
  "Bank Account",
  "Crypto Wallet",
  "Property",
  "Social Media",
  "Insurance",
  "Investment",
  "Other",
];

export default function AssetTypeSelect({
  value,
  onChange,
  error,
}) {
  return (
    <div>
      <label className="block mb-2 font-medium text-gray-700">
        Asset Type
      </label>

      <select
        name="assetType"
        value={value}
        onChange={onChange}
        className={`w-full rounded-lg border p-3 focus:outline-none focus:ring-2 ${
          error
            ? "border-red-500 focus:ring-red-300"
            : "border-gray-300 focus:ring-indigo-400"
        }`}
      >
        <option value="">Select Asset Type</option>

        {assetTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}