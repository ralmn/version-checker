import {Router} from "express";
import { login } from "./login";
import { register } from "./register";


export const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);