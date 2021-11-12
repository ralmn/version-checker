import { getConnection } from "typeorm";
import { Group } from "../../../entity/Group";
import { GroupMember } from "../../../entity/GroupMember";
import { GroupVersion } from "../../../entity/GroupVersion";
import { Software } from "../../../entity/Software";
import { Version } from "../../../entity/versions/Version";

export async function groups(req, res) {

    const groupMemberRepository = getConnection().getRepository(GroupMember);

    let data = await groupMemberRepository.createQueryBuilder('gm')
        .innerJoinAndMapOne('gm.group', Group, 'group' , 'gm.groupId = group.id')
        .innerJoinAndMapMany('group.versions', GroupVersion ,'gv', 'group.id = gv.groupId')
        .innerJoinAndMapOne('gv.software', Software, 'software', 'gv.software = software.name')
        .leftJoinAndMapOne('gv.version', Version, 'version', 'gv.software = version.software and gv.version = version.versionRaw')
        .leftJoinAndMapMany('software.versions', Version, 's_versions', 'software.name = version.software')
        .leftJoinAndMapOne('software.latestVersion', Version, 's_latestVersion', 'software.name = s_latestVersion.software and software.latestVersion = s_latestVersion.versionRaw')
        .where('gm.userId = :userId', {userId: req.user.id})
        //.select()
        .getMany();

    // console.log(data[0].group.versions[0].version);

    // let data = await groupMemberRepository.find({
    //     'relations': ['group', 'group.versions', 'group.versions.software', 'group.versions.version', 'user', 'group.members', 'group.members.user'],
    //     where: {
    //         user: {id: req.user.id}
    //     }
    // })

    res.json({ok: true, data});

}