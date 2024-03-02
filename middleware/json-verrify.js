import jwt from "jsonwebtoken";
import HttpError from "../init/http-error.js";

export const jsonVerify = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const auth = req.headers.authorization.split(" ")[0] === "Bearer";

    if (!auth) throw new HttpError("Token tidak valid atau kadaluwarsa", 401);

    if (!token) throw new HttpError("Token tidak valid atau kadaluwarsa", 401);
    const decode = jwt.verify(token, "rahasia_ilahi");
    req.userData = decode;
    next();
  } catch (err) {
    const error = new HttpError("Token tidak valid atau kadaluwarsa", 401);
    return next(error);
  }
};
