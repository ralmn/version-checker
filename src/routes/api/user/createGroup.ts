import { getConnection } from "typeorm";
import { Group } from "../../../entity/Group";
import { GroupMember, GroupMemberRole } from "../../../entity/GroupMember";
import { User } from "../../../entity/User";

export async function createGroup(req, res){
    let gRepo = getConnection().getRepository(Group);
    let uRepo = getConnection().getRepository(User);
    let em = getConnection().createEntityManager();

    let user = await uRepo.findOne(req.user.id);


    let group = await gRepo.createQueryBuilder('g')
        .innerJoinAndSelect('g.members', 'members')
        .innerJoinAndSelect('members.user', 'user', 'user.id = :uId', {uId: req.user.id})
        .where('LOWER(g.name) = LOWER(:gName)', {gName: req.body.name})
        .getOne();

    if(group){
        res.json({ok: false, error: 'Group already exists'});
        return;
    }

    let nGroup = new Group();
    nGroup.name = req.body.name;
    nGroup = await em.save(nGroup);
    let adminMember = new GroupMember();
    adminMember.user = user;
    adminMember.role = GroupMemberRole.ADMIN;
    adminMember.group = nGroup;
    await em.save(adminMember);

    res.json({ok: true, group: nGroup});



}