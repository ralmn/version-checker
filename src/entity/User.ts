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

    @Column({nullable: true})
    alternativeEmail: string;

    @Column({default: false, nullable: false})
    admin: boolean;

    @OneToMany(() => GroupMember, groupMember => groupMember.user)
    groupMembers: GroupMember[]

    @Column({nullable: false, default: false})
    email_weekly: boolean

}
