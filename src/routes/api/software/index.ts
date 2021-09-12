import { Router } from "express";
import { addGithub } from "./addGithub";
import { list } from "./list";

export const softwareRouter = Router();

softwareRouter.get('/list', list);
softwareRouter.post('/add/github', addGithub);

