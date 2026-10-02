import express from "express";
import multer from "multer";
import { createService, deleteService, getServiceById, getServices, updateService } from "../controllers/ServiceController.js";

import os from "os";

const upload = multer({ dest: os.tmpdir() });
const serviceRouter = express.Router();

serviceRouter.get("/", getServices);
serviceRouter.get("/:id", getServiceById);

serviceRouter.post('/', upload.single("image"), createService);
serviceRouter.put("/:id", upload.single('image'), updateService);

serviceRouter.delete("/:id", deleteService);

export default serviceRouter