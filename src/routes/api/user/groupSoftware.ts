import { getConnection } from "typeorm";
import { GroupVersion } from "../../../entity/GroupVersion";

export async function groupSoftware(req, res){

    let gvRepo = getConnection().getRepository(GroupVersion);

    // let data = await gvRepo.find({
    //     relations: ['software', 'group', 'group.members', 'group.members.user'],
    //     where: {
    //         group: {
    //             members: {
    //                 user: {
    //                     id: req.user.id
    //                 }
    //             }
    //         },
    //         software: {
    //             name: req.params.name
    //         }
    //     }
    // });

    console.log(req.params, req.user);

    let data = await gvRepo
    .createQueryBuilder('gv')
        .innerJoinAndSelect('gv.software', 'software')
        .innerJoinAndSelect('gv.group', 'group', 'group.id = :gid', {gid: req.params.gId})
        .innerJoinAndSelect('group.members', 'members')
        .innerJoinAndSelect('members.user', 'user', 'user.id = :uid', {uid: req.user.id})
        .where('software.name = :name', {name: req.params.name})

        .getOne();

    if(data == null){
        res.status(404);
        res.json({ok: false, error: "No software found for this group"});
    }else{
        res.json({ok: true, gv: data});
    }
    

}