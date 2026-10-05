import { useEffect, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import BlockchainStatus from "../components/blockchain/BlockchainStatus";
import TransactionStatus from "../components/blockchain/TransactionStatus";
import {
  getBlockchainStatus,
  getTransactions,
  getTransaction,
} from "../services/blockchainApi";

export default function Blockchain() {
  const [status, setStatus] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const loadBlockchainData = async () => {
    try {
      setLoading(true);
      setError("");

      const [statusResponse, transactionsResponse] = await Promise.all([
        getBlockchainStatus(),
        getTransactions(),
      ]);

      setStatus(statusResponse?.data || statusResponse || null);

      const txList =
        transactionsResponse?.transactions ||
        transactionsResponse?.data ||
        transactionsResponse ||
        [];
      setTransactions(Array.isArray(txList) ? txList : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load blockchain information."
      );
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTransactionSelect = async (transactionId) => {
    try {
      setTransactionLoading(true);
      setError("");

      const response = await getTransaction(transactionId);

      setSelectedTransaction(
        response?.transaction || response?.data || response || null
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load transaction details."
      );
    } finally {
      setTransactionLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto py-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Blockchain</h1>
          <p className="text-gray-500 mt-2">
            Monitor blockchain activity associated with your digital inheritance.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-100 text-red-700">
            {error}
          </div>
        )}

        <BlockchainStatus status={status} loading={loading} />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-5 text-gray-800">
              Transactions
            </h2>

            {loading ? (
              <p className="text-gray-500">Loading transactions...</p>
            ) : transactions.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-gray-500">
                  No blockchain transactions are available.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction) => {
                  const txId = transaction._id || transaction.id;
                  return (
                    <button
                      key={txId}
                      onClick={() => handleTransactionSelect(txId)}
                      className="w-full text-left border rounded-lg p-4 hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <p className="font-mono text-sm truncate text-gray-800">
                        {transaction.hash || transaction.txHash || txId}
                      </p>

                      <div className="flex justify-between mt-2 text-sm">
                        <span className="text-gray-500 capitalize">
                          {transaction.status || "Confirmed"}
                        </span>
                        <span className="text-indigo-600 font-medium">
                          View Details
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            {transactionLoading ? (
              <div className="bg-white border rounded-xl p-6 shadow-sm">
                <p className="text-gray-500">Loading transaction...</p>
              </div>
            ) : (
              <TransactionStatus transaction={selectedTransaction} />
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}