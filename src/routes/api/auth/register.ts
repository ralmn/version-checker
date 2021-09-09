import { getConnection } from "typeorm";
import { User } from "../../../entity/User";
import * as bcrypt from "bcrypt";


export async function register(req, res) {
    let userRepository =  getConnection().getRepository(User);
    if(req.body.username && req.body.password && req.body.email){
        let user = await userRepository.createQueryBuilder('user')
            .where('LOWER(user.username) = LOWER(:username)', {username: req.body.username})
            .getOne();
        if(user != null){
            console.log(user);
            res.json({ok: false, error: `User ${req.body.username} already exists`});
            return;
        }
        user = await userRepository.createQueryBuilder('user')
            .where('LOWER(user.email) = LOWER(:email)', {email: req.body.email})
            .getOne();
        if(user != null){
            console.log(user);
            res.json({ok: false, error: `Email ${req.body.email} already exists`});
            return;
        }

        user = new User();
        user.username = req.body.username;
        user.email = req.body.email;
        user.password = await bcrypt.hash(req.body.password, 10);
        await userRepository.save(user);
        res.json({ok: true, message: `User ${user.username} created`});
    }else{
        res.json({ok: false, error: 'missing username, password or email'});
    }
};