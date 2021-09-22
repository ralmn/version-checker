import { getConnection } from "typeorm";
import { GroupMember } from "../../../entity/GroupMember";

export async function groups(req, res) {

    const groupMemberRepository = getConnection().getRepository(GroupMember);
    let data = await groupMemberRepository.find({
        'relations': ['group', 'group.versions', 'group.versions.software', 'user', 'group.members', 'group.members.user'],
        where: {
            user: {id: req.user.id}
        }
    })

    res.json({ok: true, data});

}