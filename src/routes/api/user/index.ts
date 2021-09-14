import { profile } from "./profile";
import { Router } from "express";
import { groups } from "./groups";
import { groupSoftware } from "./groupSoftware";
import { addSoftware } from "./addSoftware";
import { setVersion } from "./setVersion";
import { createGroup } from "./createGroup";

export const userRouter = Router();

let regexName = "([a-zA-Z0-9\- _%]+/[a-zA-Z0-9\-\\. _%]+)";

userRouter.get('/profile', profile);
userRouter.get('/groups', groups);
userRouter.get('/group/:gId/software/:name', groupSoftware);
userRouter.get(`/group/:gId/software/:name${regexName}`, groupSoftware);
userRouter.post('/group/add', createGroup);
userRouter.post('/group/:gId/software/:name/version', setVersion);
userRouter.post(`/group/:gId/software/:name${regexName}/version`, setVersion);
userRouter.post('/group/:gId/software/add', addSoftware);
