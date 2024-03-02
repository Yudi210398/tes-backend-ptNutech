import express from "express";
import {
  getBalance,
  getHistoryTransaction,
  topUp,
  transaction,
} from "../controller/transactions.js";
import { jsonVerify } from "../middleware/json-verrify.js";
import {
  validasiDataAddTopUp,
  validasiServiceCode,
} from "../func/validasiData.js";

const routerTransactions = express.Router();

routerTransactions.get("/balance", jsonVerify, getBalance);

routerTransactions.post("/topup", validasiDataAddTopUp(), jsonVerify, topUp);

routerTransactions.post(
  "/transaction",
  validasiServiceCode(),
  jsonVerify,
  transaction
);

routerTransactions.get(
  "/transaction/history",
  jsonVerify,
  getHistoryTransaction
);

export default routerTransactions;
