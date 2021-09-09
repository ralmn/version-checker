import {Router} from "express";
import { apiRouter } from "./api";

export const mainRouter = Router();

mainRouter.use('/api', apiRouter);
