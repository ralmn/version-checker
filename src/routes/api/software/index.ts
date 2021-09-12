import { Router } from "express";
import { list } from "./list";

export const softwareRouter = Router();

softwareRouter.get('/list', list);

