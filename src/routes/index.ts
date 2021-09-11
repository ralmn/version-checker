import {Router, static as expressStatic} from "express";
import { apiRouter } from "./api";
import * as history from "connect-history-api-fallback";

export const mainRouter = Router();

mainRouter.use('/api', apiRouter);

mainRouter.use(expressStatic('./front'))
mainRouter.use(history({
    index: '/index.html'
}));
mainRouter.use(expressStatic('./front'))