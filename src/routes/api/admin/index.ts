import { Router } from "express";
import { adminSoftwaresRouter } from "./softwares";


export const adminRouter = Router();

adminRouter.use('/softwares', adminSoftwaresRouter);

