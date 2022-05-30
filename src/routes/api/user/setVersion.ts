import { getConnection } from "typeorm";
import { GroupMemberRole } from "../../../entity/GroupMember";
import { GroupVersion } from "../../../entity/GroupVersion";
import { Version } from "../../../entity/versions/Version";

export async function setVersion(req, res) {

    let gvRepo = getConnection().getRepository(GroupVersion);

    let data = await gvRepo
        .createQueryBuilder('gv')
        .innerJoinAndSelect('gv.software', 'software')
        .leftJoinAndMapOne('gv.version', Version, 'version', 'gv.software = version.software and gv.version = version.versionRaw')
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

        if(req.body.versionSemverRequirement != null){
            data.versionSemverRequirement = req.body.versionSemverRequirement;
        }

        data = await gvRepo.save(data);
        data = await gvRepo
        .createQueryBuilder('gv')
        .innerJoinAndSelect('gv.software', 'software')
        .leftJoinAndMapOne('gv.version', Version, 'version', 'gv.software = version.software and gv.version = version.versionRaw')
        .leftJoinAndSelect('software.versions', 'versions')
        .leftJoinAndSelect('software.latestVersion', 'latestVersion')
        .innerJoinAndSelect('gv.group', 'group', 'group.id = :gid', { gid: req.params.gId })
        .innerJoinAndSelect('group.members', 'members')
        .innerJoinAndSelect('members.user', 'user', 'user.id = :uid', { uid: req.user.id })
        .where('software.name = :name', { name: req.params.name })
        .getOne();

        res.json({ ok: true, gv: data });
    }


}