import { getConnection } from "typeorm"
import { compare as bcryptCompare } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { User } from "../../../entity/User";
import { config } from "../../../config";


export async function login(req, res) {

    if(req.body.username && req.body.password){

        const userRepository  = getConnection().getRepository(User);
        const user = await userRepository.createQueryBuilder('user')
            .select()
            .where('user.username = :username',  {username: req.body.username})
            .orWhere('user.email = :email', {email: req.body.username})
            .getOne();

        if(user == null){
            res.json({ok: false, error: 'User or password is invalid'});
            return;
        }

        const passwordOK = await bcryptCompare(req.body.password, user.password);
        if(!passwordOK){
            console.log(`${user.username} try to connect with invalid password`);
            res.json({ok: false, error: 'User or password is invalid'});
            return;
        }

        const token = jwt.sign({
            id: user.id,
            username: user.username
        }, config.auth.jwt_secret)

        res.json({ok: true, token: token});
        return;
    }

    res.json({ok: false, error: 'no username or password'})

}