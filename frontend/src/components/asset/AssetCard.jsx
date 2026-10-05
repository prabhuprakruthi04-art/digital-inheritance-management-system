import {
  FileText,
  KeyRound,
  Landmark,
  Wallet,
  MoreVertical,
} from "lucide-react";

const iconMap = {
  Document: <FileText size={20} />,
  Password: <KeyRound size={20} />,
  "Bank Account": <Landmark size={20} />,
  "Crypto Wallet": <Wallet size={20} />,
};

export default function AssetCard({
  asset,
  onEdit,
  onDelete,
}) {
  return (
    <div className="bg-white rounded-xl shadow p-5 flex justify-between items-center">

      <div className="flex items-center gap-4">

        <div className="bg-indigo-100 p-3 rounded-full text-indigo-600">
          {iconMap[asset.assetType] || <FileText />}
        </div>

        <div>

          <h2 className="font-semibold text-lg">
            {asset.title}
          </h2>

          <p className="text-gray-500">
            {asset.assetType}
          </p>

          <span className="inline-block mt-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs">
            {asset.encrypt ? "Encrypted" : "Normal"}
          </span>

        </div>

      </div>

      <div className="flex gap-3">

        <button
          onClick={() => onEdit(asset)}
          className="text-blue-600"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(asset._id)}
          className="text-red-600"
        >
          Delete
        </button>

        <MoreVertical />

      </div>

    </div>
  );
}