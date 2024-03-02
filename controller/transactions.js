import mongoose from "mongoose";
import HttpError from "../init/http-error.js";
import shemaMembership from "../model/shemaMembership.js";
import shemaTransaction from "../model/shemaTransaction.js";
import { v4 as uuidv4 } from "uuid";
import { refaktorResponeTopup } from "../func/fungsiRefactor.js";
import { validationResult } from "express-validator";
import shemaInformation from "../model/shemaInformation.js";

export const getBalance = async (req, res, next) => {
  try {
    const getData = await shemaMembership
      .findOne(
        {
          email: req.userData.email,
        },
        "balance -_id"
      )
      .sort("balance");

    if (!getData) throw new HttpError("User tidak ditemukan", 401);

    res.status(200).json({
      status: 200,
      message: "Sukses",
      data: getData,
    });
  } catch (err) {
    next(err);
  }
};

export const topUp = async (req, res, next) => {
  try {
    const { top_up_amount } = req.body;

    //* Cari user membership by email
    const findUser = await shemaMembership.find({
      email: req.userData.email,
    });

    if (!findUser[0]) throw new HttpError("user tidak ditemukan", 400);

    // * cari semua data di shema transaktion
    const findTransaksionUser = await shemaTransaction
      .find()
      .populate("nameTransaksionMember");

    //* filter data transaktion by email user membership
    const filterDataUserMember = findTransaksionUser.filter(
      (dataEmail) =>
        dataEmail?.nameTransaksionMember?.email === req.userData.email
    );

    const error = validationResult(req);

    if (!error.isEmpty()) throw new HttpError(error.array()[0 ?? 1].msg, 400);

    // //* Cek jika user didata transaction tidak ditemukan maka buat user didata transaktion, jika ditemukan hanya push record data top up dari data user itu sendiri

    if (!filterDataUserMember[0]) {
      const session = await mongoose.startSession();
      try {
        await session.startTransaction();

        await new shemaTransaction({
          nameTransaksionMember: findUser[0]._id,
          record: [
            {
              invoice_number: uuidv4(),
              transaction_type: "TOPUP",
              description: "Top Up Balance",
              total_amount: top_up_amount,
              created_on: new Date(),
            },
          ],
        }).save({ session });

        findUser[0].balance = (await +top_up_amount) + +findUser[0].balance;

        await findUser[0].save({ session });
        await session.commitTransaction();

        refaktorResponeTopup(res, findUser);
      } catch (err) {
        await session.abortTransaction();
        next(err);
      } finally {
        await session.endSession();
      }
    } else {
      const session = await mongoose.startSession();

      try {
        await session.startTransaction();

        await filterDataUserMember[0].record.push({
          invoice_number: uuidv4(),
          transaction_type: "TOPUP",
          description: "Top Up Balance",
          total_amount: top_up_amount,
          created_on: new Date(),
        });

        await filterDataUserMember[0].save({ session });

        findUser[0].balance = (await +top_up_amount) + +findUser[0].balance;

        await findUser[0].save({ session });
        await session.commitTransaction();

        refaktorResponeTopup(res, findUser);
      } catch (err) {
        next(err);
      } finally {
        await session.endSession();
      }
    }
  } catch (err) {
    next(err);
  }
};

export const transaction = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    await session.startTransaction();
    const { service_code } = req.body;

    const error = validationResult(req);

    if (!error.isEmpty()) throw new HttpError(error.array()[0 ?? 1].msg, 400);

    // * Filter service dengan service_code

    const temukanService = await shemaInformation.find();

    const filterService = temukanService[0].service.filter(
      (data) => data.service_code === service_code?.toUpperCase()
    );

    if (!filterService[0])
      throw new HttpError("Service atau Layanan tidak ditemukan", 400);

    //* cek balance mencukupi saat pembelian service

    const cariMember = await shemaMembership.find({
      email: req.userData.email,
    });

    if (+cariMember[0].balance < +filterService[0].service_tariff)
      throw new HttpError("Balance/Saldo tidak mencukupi", 400);

    // *handle error jika akun member balance 0 dan melum pernah topup tidak bisa melakukan transaksi ini

    const findTransaksionUser = await shemaTransaction
      .find()
      .populate("nameTransaksionMember");

    const filterDataUserMember = findTransaksionUser.filter(
      (dataEmail) =>
        dataEmail?.nameTransaksionMember?.email === req.userData.email
    );

    if (!filterDataUserMember[0])
      throw new HttpError(
        "Saldo balance Anda 0, harap top up terlebih dahulu",
        400
      );

    //* save update saldo pembelian

    cariMember[0].balance =
      (await +cariMember[0].balance) - +filterService[0].service_tariff;
    await cariMember[0].save();

    //* Push record user transaction
    await filterDataUserMember[0].record.push({
      invoice_number: uuidv4(),
      transaction_type: "PAYMENT",
      description: filterService[0].service_name,
      total_amount: filterService[0].service_tariff,
      created_on: new Date(),
    });
    await filterDataUserMember[0].save();
    await session.commitTransaction();

    res.status(200).json({
      status: 200,
      message: "Sukses",
      data: {
        invoice_number: uuidv4(),
        service_code: service_code,
        service_name: filterService[0].service_name,
        transaction_type: "PAYMENT",
        total_amount: filterService[0].service_tariff,
        created_on: new Date(),
      },
    });
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    await session.endSession();
  }
};

export const getHistoryTransaction = async (req, res, next) => {
  try {
    const { offset, limit } = req.query;

    const findTransaksionUser = await shemaTransaction
      .find()
      .populate("nameTransaksionMember");

    const filterDataUserMember = findTransaksionUser.filter(
      (dataEmail) =>
        dataEmail?.nameTransaksionMember?.email === req.userData.email
    );

    if (!filterDataUserMember[0])
      throw new HttpError("belum ada history Transaksi", 400);

    const start = offset;
    const end = offset + limit;
    const hasil =
      limit === 0 || !limit
        ? filterDataUserMember[0].record.reverse()
        : filterDataUserMember[0].record.reverse().slice(start, end);

    res.status(200).json({
      status: 200,
      message: "Sukses",
      data: hasil,
    });
  } catch (err) {
    next(err);
  }
};
