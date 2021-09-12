import { profile } from "./profile";
import { Router } from "express";
import { groups } from "./groups";
import { groupSoftware } from "./groupSoftware";
import { addSoftware } from "./addSoftware";
import { setVersion } from "./setVersion";

export const userRouter = Router();

userRouter.get('/profile', profile);
userRouter.get('/groups', groups);
userRouter.get('/group/:gId/software/:name', groupSoftware);
userRouter.post('/group/:gId/software/:name/version', setVersion);
userRouter.post('/group/:gId/software/add', addSoftware);
