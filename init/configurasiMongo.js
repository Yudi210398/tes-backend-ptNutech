/* eslint-disable no-undef */
import mongoose from "mongoose";

export const conekDb = async () => {
  try {
    await mongoose.connect(process?.env?.DB_URI ?? "");
    console.log("Berhasil terkoneksi ke MongoDB");
  } catch (err) {
    console.error("Koneksi MongoDB gagal:", err);
    process.exit(1);
  }
};
