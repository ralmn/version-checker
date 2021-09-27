import { getConnection, GridFSBucket } from "typeorm";
import { Group } from "../../../entity/Group";
import { GroupMember, GroupMemberRole } from "../../../entity/GroupMember";
import { GroupVersion } from "../../../entity/GroupVersion";
import { Software } from "../../../entity/Software";

export async function addSoftware(req, res) {
    let gvRepo = getConnection().getRepository(GroupVersion);
    let gmRepo = getConnection().getRepository(GroupMember);
    let gRepo = getConnection().getRepository(Group);
    let sRepo = getConnection().getRepository(Software);

    let gm = await gmRepo.createQueryBuilder('gm')
        .innerJoinAndSelect('gm.user', 'user', 'user.id = :uId', { uId: req.user.id })
        .innerJoinAndSelect('gm.group', 'group', 'group.id = :gId', { gId: req.params.gId })
        //TODO validate role
        .getOne();

    if (gm == null) {
        res.status(403);
        res.json({ ok: false, error: 'You are not in this group' })
        return;
    }else if(gm.role > GroupMemberRole.EDITOR) {
        res.status(403);
        res.json({ ok: false, error: 'You are not allowed to add software in this group' })
        return;
    }

    let gv = await gvRepo.createQueryBuilder('gv')
        .innerJoinAndSelect('gv.group', 'group', 'group.id = :gId', { gId: req.params.gId })
        .innerJoinAndSelect('gv.software', 'software', 'software.name = :name', { name: req.body.name })
        .getOne()

    if (gv != null) {
        res.json({ ok: false, error: 'Software already added' });
        return;
    }

    let g = await gRepo.findOne(req.params.gId);
    let software = await sRepo.findOne(req.body.name);

    let i = await gvRepo.createQueryBuilder()
        .insert()
        .into(GroupVersion)
        .values([{
            group: g,
            software: software,
            version: ''
        }]).execute();

    gv = await gvRepo.createQueryBuilder('gv')
        .innerJoinAndSelect('gv.group', 'group', 'group.id = :gId', { gId: req.params.gId })
        .innerJoinAndSelect('gv.software', 'software', 'software.name = :name', { name: req.body.name })
        .getOne()


    res.json({
        ok: true, gv: gv
    });

}