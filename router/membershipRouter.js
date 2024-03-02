import express from "express";
import {
  getProfile,
  loginUser,
  postUser,
  updateProfile,
  updateProfileImage,
} from "../controller/membership.js";
import {
  validasiDataUser,
  validasiDataUserUpdate,
} from "../func/validasiData.js";
import { jsonVerify } from "../middleware/json-verrify.js";
import { singleUploadMiddleware } from "../func/multer.js";

const routerMembership = express.Router();

routerMembership.post("/registration", validasiDataUser(false), postUser);

routerMembership.post("/login", validasiDataUser(true), loginUser);

routerMembership.get("/profile", jsonVerify, getProfile);

routerMembership.put(
  "/profile/update",
  validasiDataUserUpdate(),
  jsonVerify,
  updateProfile
);

routerMembership.put(
  "/profile/image",
  singleUploadMiddleware,
  jsonVerify,
  updateProfileImage
);

export default routerMembership;
