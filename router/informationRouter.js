import express from "express";
import { getBaner, getService } from "../controller/information.js";
import { jsonVerify } from "../middleware/json-verrify.js";

const routerInformation = express.Router();

routerInformation.get("/banner", jsonVerify, getBaner);
routerInformation.get("/services", jsonVerify, getService);

export default routerInformation;
