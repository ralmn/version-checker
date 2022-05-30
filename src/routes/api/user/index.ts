import { profile } from "./profile";
import { Router } from "express";
import { groups } from "./groups";
import { groupSoftware } from "./groupSoftware";
import { addSoftware } from "./addSoftware";
import { setVersion } from "./setVersion";
import { createGroup } from "./createGroup";
import { addMember } from "./addMember";
import { editMember } from "./editMember";
import { removeMember } from "./removeMember";
import { removeSoftware } from "./removeSoftware";

export const userRouter = Router();

let regexName = "([a-zA-Z0-9\- _%]+\/[a-zA-Z0-9\-\\. _%]+)";

userRouter.get('/profile', profile);
userRouter.get('/groups', groups);
userRouter.get('/group/:gId/software/:name', groupSoftware);
userRouter.get(`/group/:gId/software/:name${regexName}`, groupSoftware);
userRouter.post('/group/add', createGroup);
userRouter.post('/group/:gId/software/:name/version', setVersion);
userRouter.delete(`/group/:gId/software/:name${regexName}`, removeSoftware);
userRouter.post(`/group/:gId/software/:name${regexName}/version`, setVersion);
userRouter.post('/group/:gId/software/add', addSoftware);
userRouter.put(`/group/:gId/members/add`, addMember);
userRouter.post(`/group/:gId/members/edit`, editMember);
userRouter.delete(`/group/:gId/members/remove/:uId`, removeMember);
