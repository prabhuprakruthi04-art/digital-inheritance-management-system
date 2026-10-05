import BlockchainTransaction from "../models/BlockchainTransaction.js";
import { asyncHandler } from "../middleware/errorHandler.js";

export const listTransactions = asyncHandler(async (req, res) => {
  const { ownerId, relatedEntityType } = req.query;
  const filter = {};
  if (ownerId) filter.ownerId = ownerId;
  if (relatedEntityType) filter.relatedEntityType = relatedEntityType;

  const transactions = await BlockchainTransaction.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, data: transactions });
});

export const getTransaction = asyncHandler(async (req, res) => {
  const tx = await BlockchainTransaction.findOne({
    $or: [{ _id: req.params.id }, { txHash: req.params.id }],
  });
  if (!tx) {
    const err = new Error("Transaction not found");
    err.statusCode = 404;
    throw err;
  }
  res.json({ success: true, data: tx });
});

export const createTransaction = asyncHandler(async (req, res) => {
  const tx = await BlockchainTransaction.create(req.body);
  res.status(201).json({ success: true, data: tx });
});
