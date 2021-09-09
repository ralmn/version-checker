import { json } from "stream/consumers";
import { getConnection } from "typeorm";
import { User } from "../../../entity/User";

export async function profile(req, res) {
    const userRepository  = getConnection().getRepository(User);
    let user = await userRepository.findOne(req.user.id);
    delete user.password;
    res.json({ok: user != null, user});
}