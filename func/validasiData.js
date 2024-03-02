import { body } from "express-validator";
import shemaMembership from "../model/shemaMembership.js";
import HttpError from "../init/http-error.js";

export const validasiDataUser = (login) => {
  if (!login)
    return [
      body("email")
        .notEmpty()
        .isEmail()
        .normalizeEmail()
        .withMessage("Paramter email tidak sesuai format")
        .toLowerCase()
        .trim()
        .custom(async (value) => {
          const data = await shemaMembership.findOne({ email: value });
          if (data) throw new HttpError("email sudah terdaftar", 404);
          return true;
        }),

      body("first_name")
        .notEmpty()
        .withMessage("first name harus diisi")
        .trim(),

      body("last_name").notEmpty().withMessage("last name harus diisi").trim(),

      body("password")
        .isLength({ min: 8 })
        .withMessage("Panjang Password minimal 8 karakter")
        .trim(),
    ];
  else {
    return [
      body("email")
        .notEmpty()
        .isEmail()
        .normalizeEmail()
        .withMessage("email tidak sesuai format")
        .toLowerCase()
        .trim(),
      body("password")
        .isLength({ min: 8 })
        .withMessage("Panjang Password minimal 8 karakter")
        .trim(),
    ];
  }
};

export const validasiDataUserUpdate = () => {
  return [
    body("first_name").notEmpty().withMessage("first name harus diisi").trim(),

    body("last_name").notEmpty().withMessage("last name harus diisi").trim(),
  ];
};

export const validasiDataAddTopUp = () => {
  return [
    body("top_up_amount")
      .notEmpty()
      .isNumeric()
      .withMessage(
        "paramater tidak boleh kosong, tidak boleh huruf dan berupa angka"
      )
      .trim()
      .custom(async (value) => {
        const data = value <= 0 ? true : false;
        if (data)
          throw new HttpError(
            "Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0",
            400
          );
        return true;
      }),
  ];
};

export const validasiServiceCode = () => {
  return [
    body("service_code")
      .notEmpty()
      .isString()
      .withMessage("paramater service_code tidak boleh kosong atau angka")
      .trim(),
  ];
};
