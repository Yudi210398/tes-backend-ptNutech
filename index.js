import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import routerMembership from "./router/membershipRouter.js";
import dotenv from "dotenv";
import { conekDb } from "./init/configurasiMongo.js";
import routerError from "./router/routerError.js";
import routerInformation from "./router/informationRouter.js";

import routerTransactions from "./router/transactionRouter.js";

const app = express();
dotenv.config();

(async () => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cors());

  app.use(routerMembership);
  app.use(routerInformation);
  app.use(routerTransactions);

  app.use(routerError);

  // eslint-disable-next-line no-unused-vars
  app.use(async (error, req, res, next) => {
    let pesan;
    let status;
    if (error.statusCode === 500) {
      status = error.statusCode;
      pesan = "server bermasalah";
      return await res
        .status(status)
        .json({ error: { pesan: `${pesan + "" + status}` } });
    }

    status = error.statusCode;
    pesan = error.message;
    return await res
      .status(status)
      .json({ status, message: pesan, data: null });
  });

  conekDb().then(() => {
    app.listen(3001);
  });
})();
