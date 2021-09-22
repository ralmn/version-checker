import { getConnection } from "typeorm";
import { Group } from "../../../entity/Group";
import { GroupMember, GroupMemberRole } from "../../../entity/GroupMember";
import { User } from "../../../entity/User";

export async function removeMember(req, res) {
  const gRepo = getConnection().getRepository(Group);
  const gmRepo = getConnection().getRepository(GroupMember);
  const uId = req.params.uId;
  const gId = req.params.gId;

  try {
    let group = await gRepo.findOne(gId, {
      relations: ["members", "members.user", 'members.group'],
    });
    if (group == null) {
      res.status(404);
      res.json({ ok: false, error: "Group doesn't exists." });
      return;
    }

    const userMember = group.members.find((m) => m.user.id == req.user.id);

    if (userMember) {
      if (userMember.role != GroupMemberRole.ADMIN) {
        res.status(403);
        res.json({ ok: false, error: "You are not allowed to add member" });
        return;
      }
    } else {
      res.status(404);
      res.json({ ok: false, error: "Group doesn't exists !" });
      return;
    }

    let gMember = group.members.find(m => m.user.id == uId);
    if(gMember){
      if(gMember.role == GroupMemberRole.ADMIN){
        res.status(403);
        res.json({ ok: false, error: "You canno't remove this admin member"});
        return;
      }
      await gmRepo.delete(gMember);
      res.json({ ok: true, member: gMember });
    }else{
      res.json({ok: false, error: 'Member are not in this group'});
    }
  } catch (e) {
    res.status(500);
    res.json({ ok: false, error: e.toString() });
    console.log("Error on add member", e.toString());
    console.log(e);
  }
}
