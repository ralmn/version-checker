import { getConnection } from "typeorm";
import { Group } from "../../../entity/Group";
import { GroupMember, GroupMemberRole } from "../../../entity/GroupMember";
import { User } from "../../../entity/User";

export async function addMember(req, res) {
  const uRepo = getConnection().getRepository(User);
  const gRepo = getConnection().getRepository(Group);
  const gmRepo = getConnection().getRepository(GroupMember);
  const name = req.body.name;
  const gId = req.params.gId;

  try {
    let group = await gRepo.findOne(gId, {
      relations: ["members", "members.user"],
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
        res.json({ ok: false, error: "Your a not allowed to add member" });
        return;
      }
    } else {
      res.status(404);
      res.json({ ok: false, error: "Group doesn't exists !" });
      return;
    }

    let user = await uRepo
      .createQueryBuilder("u")
      .where("u.username = :name or u.email = :name", { name })
      .getOne();

    if (user == null) {
      res.json({ ok: false, error: "User doesn't exists." });
      return;
    }

    let requestMember = group.members.find((m) => m.user.id == user.id);

    if (requestMember) {
      res.json({ ok: false, error: "This user is already a member" });
      return;
    }

    let newMember = new GroupMember();
    newMember.role = GroupMemberRole.VIEWER;
    newMember.user = user;
    newMember.group = group;

    newMember = await gmRepo.save(newMember);

    res.json({ ok: true, member: newMember });
  } catch (e) {
    res.status(500);
    res.json({ ok: false, error: e.toString() });
    console.log("Error on add member", e.toString());
    console.log(e);
  }
}
