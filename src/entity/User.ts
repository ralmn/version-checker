import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import { Group } from "./Group";
import { GroupMember } from "./GroupMember";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    username: string;

    @Column()
    password: string;

    @Column({unique: true})
    email: string;

    @OneToMany(() => GroupMember, groupMember => groupMember.user)
    groupMembers: GroupMember[]

}
