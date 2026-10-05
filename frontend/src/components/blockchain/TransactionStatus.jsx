export default function TransactionStatus({
  transaction,
}) {
  if (!transaction) {
    return (
      <div className="bg-white border rounded-xl p-6">
        <p className="text-gray-500">
          No transaction selected.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-5">
        Transaction Details
      </h2>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">
            Transaction Hash
          </p>

          <p className="font-mono text-sm break-all mt-1">
            {transaction.hash ||
              "Unavailable"}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Status
          </p>

          <p className="font-medium mt-1">
            {transaction.status ||
              "Pending"}
          </p>
        </div>

        {transaction.blockNumber !==
          undefined && (
          <div>
            <p className="text-sm text-gray-500">
              Block Number
            </p>

            <p className="font-medium mt-1">
              {transaction.blockNumber}
            </p>
          </div>
        )}

        {transaction.confirmations !==
          undefined && (
          <div>
            <p className="text-sm text-gray-500">
              Confirmations
            </p>

            <p className="font-medium mt-1">
              {transaction.confirmations}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}