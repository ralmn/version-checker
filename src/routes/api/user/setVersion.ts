import { getConnection } from "typeorm";
import { GroupVersion } from "../../../entity/GroupVersion";

export async function setVersion(req, res) {

    let gvRepo = getConnection().getRepository(GroupVersion);


    console.log(req.params, req.user);

    let data = await gvRepo
        .createQueryBuilder('gv')
        .innerJoinAndSelect('gv.software', 'software')
        .innerJoinAndSelect('gv.group', 'group', 'group.id = :gid', { gid: req.params.gId })
        .innerJoinAndSelect('group.members', 'members')
        .innerJoinAndSelect('members.user', 'user', 'user.id = :uid', { uid: req.user.id })
        .where('software.name = :name', { name: req.params.name })

        .getOne();


    if (data == null) {
        res.status(404);
        res.json({ ok: false, error: "No software found for this group" });
    } else {

        data.version = req.body.version;

        data = await gvRepo.save(data);


        res.json({ ok: true, gv: data });
    }


}