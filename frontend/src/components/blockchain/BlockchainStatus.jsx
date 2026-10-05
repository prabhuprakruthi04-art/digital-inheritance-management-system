export default function BlockchainStatus({
  status,
  loading,
}) {
  if (loading) {
    return (
      <div className="bg-white border rounded-xl p-6">
        <p className="text-gray-500">
          Checking blockchain status...
        </p>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="bg-white border rounded-xl p-6">
        <p className="text-gray-500">
          Blockchain status is currently unavailable.
        </p>
      </div>
    );
  }

  const isConnected =
    status.connected === true;

  return (
    <div className="bg-white border rounded-xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            Blockchain Network
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Current blockchain connection status
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            isConnected
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {isConnected
            ? "Connected"
            : "Disconnected"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">
            Network
          </p>

          <p className="font-medium mt-1">
            {status.network || "Unavailable"}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">
            Contract
          </p>

          <p className="font-medium mt-1 break-all">
            {status.contractAddress ||
              "Not configured"}
          </p>
        </div>
      </div>
    </div>
  );
}