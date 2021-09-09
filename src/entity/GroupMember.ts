import {Column, Entity, ManyToMany, ManyToOne} from "typeorm";
import { Group } from "./Group";
import { User } from "./User";


export enum GroupMemberRole {
    ADMIN, EDITOR, VIEWER
}

@Entity()
export class GroupMember {

    @ManyToOne(() => Group, {primary: true})
    group: Group;

    @ManyToOne(() => User, {primary: true})
    user: User;

    @Column()
    role: GroupMemberRole;
}
