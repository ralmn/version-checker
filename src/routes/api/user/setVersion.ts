import { getConnection } from "typeorm";
import { GroupMemberRole } from "../../../entity/GroupMember";
import { GroupVersion } from "../../../entity/GroupVersion";

export async function setVersion(req, res) {

    let gvRepo = getConnection().getRepository(GroupVersion);

    let data = await gvRepo
        .createQueryBuilder('gv')
        .innerJoinAndSelect('gv.software', 'software')
        .leftJoinAndSelect('gv.version', 'version')
        .leftJoinAndSelect('software.versions', 'versions')
        .leftJoinAndSelect('software.latestVersion', 'latestVersion')
        .innerJoinAndSelect('gv.group', 'group', 'group.id = :gid', { gid: req.params.gId })
        .innerJoinAndSelect('group.members', 'members')
        .innerJoinAndSelect('members.user', 'user', 'user.id = :uid', { uid: req.user.id })
        .where('software.name = :name', { name: req.params.name })
        .getOne();

    if (data == null) {
        res.status(404);
        res.json({ ok: false, error: "No software found for this group" });
    } else {

        let currentMember = data.group.members.find(m => m.user.id == req.user.id);
        if(currentMember.role > GroupMemberRole.EDITOR) {
            res.status(403);
            res.json({ok: true, error: "You are not allowed to edit this software version"});
            return;
        }

        data.version = data.software.versions.find(v => v.versionRaw == req.body.version.versionRaw);

        data = await gvRepo.save(data);


        res.json({ ok: true, gv: data });
    }


}