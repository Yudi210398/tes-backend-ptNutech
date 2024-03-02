/* eslint-disable no-undef */
import cloudinary from "cloudinary";
const dataFuncCloudinary = cloudinary.v2;

// Konfigurasi Cloudinary
await dataFuncCloudinary.config({
  cloud_name: "dymv3cmhq",
  api_key: "668146521133731",
  api_secret: "XgsP4ZTsA1Zn0Ja6KjuhQwZ5piE",
});

export default dataFuncCloudinary;
