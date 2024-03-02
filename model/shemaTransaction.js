import mongoose from "mongoose";

const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
  nameTransaksionMember: { type: Schema.Types.ObjectId, ref: "Membership" },

  produkServices: { type: Schema.Types.ObjectId, ref: "Informations" },

  record: [
    {
      invoice_number: String,
      transaction_type: String,
      description: String,
      total_amount: Number,
      created_on: Date,
    },
  ],
});

export default mongoose.model("Transaction", TransactionSchema);
