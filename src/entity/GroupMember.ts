import { group } from "console";
import {Column, Entity, ManyToMany, ManyToOne} from "typeorm";
import { Group } from "./Group";
import { User } from "./User";


export enum GroupMemberRole {
    ADMIN, EDITOR, VIEWER
}

@Entity()
export class GroupMember {

    @ManyToOne(() => Group, group => group.members ,{primary: true, onDelete: "RESTRICT", onUpdate: "RESTRICT"})
    group: Group;

    @ManyToOne(() => User, {primary: true, onDelete: "RESTRICT", onUpdate: "RESTRICT"})
    user: User;

    @Column()
    role: GroupMemberRole;
}
