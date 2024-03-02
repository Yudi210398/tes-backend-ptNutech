import { validationResult } from "express-validator";
import shemaMembership from "../model/shemaMembership.js";
import HttpError from "../init/http-error.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import getDataUri from "../middleware/dataUri.js";
import dataFuncCloudinary from "../middleware/cloudinary.js";

//! belum selesai

export const postUser = async (req, res, next) => {
  try {
    const { email, first_name, last_name, password } = req.body;
    const error = validationResult(req);

    if (!error.isEmpty()) throw new HttpError(error.array()[0 ?? 1].msg, 400);

    await bcrypt.hash(password, 10, async (err, hash) => {
      try {
        if (err) throw new HttpError("Tidak bisa encrype password", 400);
        else {
          await new shemaMembership({
            email,
            last_name,
            first_name,
            password: hash,
          }).save();

          res.status(200).json({
            status: 200,
            message: "Registrasi berhasil silahkan login",
            data: null,
          });
        }
      } catch (err) {
        next(err);
      }
    });
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const error = validationResult(req);
    if (!error.isEmpty()) throw new HttpError(error.array()[0 ?? 1].msg, 400);

    const dataEmail = await shemaMembership.findOne({ email });
    if (!dataEmail) throw new HttpError(`email tidak ditemukan`, 401);

    await bcrypt.compare(password, dataEmail.password, (err, result) => {
      try {
        if (!result) throw new HttpError("Password Salah", 401);
        else {
          const token = jwt.sign({ email: dataEmail.email }, "rahasia_ilahi", {
            expiresIn: "12h",
          });

          res.status(200).json({
            status: 200,
            message: "Login Sukses",
            data: { token },
          });
        }
      } catch (err) {
        next(err);
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const getData = await shemaMembership.findOne(
      {
        email: req.userData.email,
      },
      "-password -_id -balance"
    );

    if (!getData) throw new HttpError("User tidak ditemukan", 400);

    res.status(200).json({
      status: 200,
      message: "Sukses",
      data: getData,
    });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { first_name, last_name } = req.body;

    const error = validationResult(req);

    if (!error.isEmpty()) throw new HttpError(error.array()[0 ?? 1].msg, 400);

    const getData = await shemaMembership.find();

    const filterData = getData.filter(
      (data) => data.email === req.userData.email
    )[0];
    if (!filterData) throw new HttpError("User tidak ditemukan", 404);

    filterData.first_name = await first_name;
    filterData.last_name = await last_name;

    await filterData.save();

    res.status(200).json({
      status: 200,
      message: "Sukses",
      data: {
        first_name: filterData.first_name,
        last_name: filterData.last_name,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const updateProfileImage = async (req, res, next) => {
  try {
    const getData = await shemaMembership.find();
    const filterData = getData.filter(
      (data) => data.email === req.userData.email
    )[0];
    if (!filterData) throw new HttpError("User tidak ditemukan", 404);

    const gambarCloudUri = getDataUri(req.file);
    const uploadImageCloud = await dataFuncCloudinary.uploader.upload(
      gambarCloudUri.content,
      { folder: "dummy" },
      (err) => {
        try {
          if (err) throw new HttpError("gagal upload diCloudinary", 400);
        } catch (err) {
          next(err);
        }
      }
    );

    filterData.profile_image = uploadImageCloud.secure_url;

    await filterData.save();

    res.status(200).json({
      status: 200,
      message: "Sukses",
      data: {
        email: filterData.email,
        first_name: filterData.first_name,
        last_name: filterData.last_name,
        profile_image: filterData.profile_image,
      },
    });
  } catch (err) {
    next(err);
  }
};
