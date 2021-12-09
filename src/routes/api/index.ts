import { Router } from "express";
import { authRouter } from "./auth";
import * as _jwt from "express-jwt";
import { config } from "../../config";
import { userRouter } from "./user";
import { softwareRouter } from "./software";
import { adminRouter } from "./admin";

const jwt = _jwt({ secret: config.auth.jwt_secret, algorithms: ['HS256'] });

export const apiRouter = Router();

apiRouter.use('/admin', adminRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/software', jwt, softwareRouter);
apiRouter.use('/user', jwt, userRouter)