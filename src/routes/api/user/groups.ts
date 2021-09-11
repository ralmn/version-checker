import { getConnection } from "typeorm";
import { GroupMember } from "../../../entity/GroupMember";

export async function groups(req, res) {

    const groupMemberRepository = getConnection().getRepository(GroupMember);

    // let data = await groupMemberRepository.createQueryBuilder('gm')
    //     .select()
    //     //.where("gm.userId = :userId", {userId: req.user.id})
    //     .innerJoin('gm.user', 'user', 'user.id = :userId', {userId: req.user.id})
    //     .leftJoinAndMapOne('gm.group', 'gm.group', 'group')
    //     .leftJoinAndMapMany('gm.group.versions', 'group.versions', 'versions')
    //     //.leftJoinAndMapMany('group')
    //     .execute();
    console.log(req.user);
    let data = await groupMemberRepository.find({
        'relations': ['group', 'group.versions', 'group.versions.software', 'user'],
        where: {
            user: {id: req.user.id}
        }
    })

    res.json({ok: true, data});

}