import { Router } from "express";
import { authRouter } from "./auth";
import * as jwt from "express-jwt";
import { config } from "../../config";
import { userRouter } from "./user";

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/user', jwt({ secret: config.auth.jwt_secret, algorithms: ['HS256'] }), userRouter)