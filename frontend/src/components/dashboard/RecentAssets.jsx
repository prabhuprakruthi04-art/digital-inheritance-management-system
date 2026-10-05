import { FileText, Landmark, Wallet, Shield } from "lucide-react";

const assets = [
  {
    id: 1,
    title: "Gmail Password",
    type: "Password",
    nominee: "Rahul",
    status: "Encrypted",
  },
  {
    id: 2,
    title: "SBI Bank",
    type: "Bank",
    nominee: "Anita",
    status: "Protected",
  },
  {
    id: 3,
    title: "Ethereum Wallet",
    type: "Crypto",
    nominee: "Rahul",
    status: "Encrypted",
  },
  {
    id: 4,
    title: "Property Documents",
    type: "Document",
    nominee: "Asha",
    status: "Stored",
  },
];

const getIcon = (type) => {
  switch (type) {
    case "Password":
      return <Shield size={18} />;
    case "Bank":
      return <Landmark size={18} />;
    case "Crypto":
      return <Wallet size={18} />;
    default:
      return <FileText size={18} />;
  }
};

export default function RecentAssets() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold">
          Recent Assets
        </h2>

        <button className="text-indigo-600 font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4">

        {assets.map((asset) => (

          <div
            key={asset.id}
            className="flex justify-between items-center border rounded-lg p-4 hover:bg-gray-50"
          >

            <div className="flex items-center gap-3">

              <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full">
                {getIcon(asset.type)}
              </div>

              <div>

                <h3 className="font-semibold">
                  {asset.title}
                </h3>

                <p className="text-sm text-gray-500">
                  {asset.type}
                </p>

              </div>

            </div>

            <div className="text-right">

              <p className="font-medium">
                {asset.nominee}
              </p>

              <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                {asset.status}
              </span>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}