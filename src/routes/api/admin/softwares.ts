import { Router } from "express";
import { getConnection } from "typeorm";
import { Software } from "../../../entity/Software";


export const adminSoftwaresRouter = Router();

adminSoftwaresRouter.get('/list', async (req, res) => {

    let softwareRepository = getConnection().getRepository(Software);

    let softwares = await softwareRepository.find({relations: ["versions"]});
    res.json({ok: true, softwares: softwares});
});

