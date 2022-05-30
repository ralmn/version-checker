import { getConnection } from "typeorm";
import { Group } from "../../../entity/Group";
import { GroupMember, GroupMemberRole } from "../../../entity/GroupMember";
import { GroupVersion } from "../../../entity/GroupVersion";
import { User } from "../../../entity/User";

export async function removeSoftware(req, res) {
  const uRepo = getConnection().getRepository(User);
  const gRepo = getConnection().getRepository(Group);
  const gvRepo = getConnection().getRepository(GroupVersion);
  const member = req.body.member;
  const gId = req.params.gId;
  const software = req.params.name;

  try {
    let gv = await gvRepo.findOne({where: { group: {id: gId}, software: {name: software} }, relations: ['group', 'software']});
    if (gv == null) {
      res.status(404);
      res.json({ ok: false, error: "Software to remove not found" });
      return;
    }

    let result = await gvRepo.delete(gv);
    if(result.affected){
      res.json({ok: true, groupVersion: gv});
    }else{
      res.json({ok: false, error: 'Failed to delete group version'});
    }

    
  } catch (e) {
    res.status(500);
    res.json({ ok: false, error: e.toString() });
    console.log("Error on add member", e.toString());
    console.log(e);
  }
}
