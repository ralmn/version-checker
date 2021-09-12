import { getConnection } from "typeorm";
import { Software } from "../../../entity/Software";

export async function list(req, res){

    let softwareRepository = getConnection().getRepository(Software);

    let softwares = await softwareRepository.find();
    res.json({ok: true, softwares: softwares});
} 