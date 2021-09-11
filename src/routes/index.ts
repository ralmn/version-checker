import {Router, static as expressStatic} from "express";
import { apiRouter } from "./api";

export const mainRouter = Router();

mainRouter.use('/api', apiRouter);

mainRouter.use('/',expressStatic('./front'))