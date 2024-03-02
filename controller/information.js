import HttpError from "../init/http-error.js";
import shemaInformation from "../model/shemaInformation.js";

export const getBaner = async (req, res, next) => {
  try {
    const getData = await shemaInformation.find({}, "-banner._id");
    if (getData[0].banner.length === 0)
      throw new HttpError("Baner tidak ada", 401);
    const benner = getData[0].banner;
    res.status(200).json({
      status: 200,
      message: "Sukses",
      data: benner,
    });
  } catch (err) {
    next(err);
  }
};

export const getService = async (req, res, next) => {
  try {
    const getData = await shemaInformation.find({}, "-service._id");
    if (getData[0].banner.length === 0)
      throw new HttpError("service tidak ada", 401);
    const service = getData[0].service;
    res.status(200).json({
      status: 200,
      message: "Sukses",
      data: service,
    });
  } catch (err) {
    next(err);
  }
};
