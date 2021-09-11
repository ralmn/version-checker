import { group } from "console";
import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import { GroupMember } from "./GroupMember";
import { GroupVersion } from "./GroupVersion";

@Entity()
export class Group {


    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => GroupMember, GroupMember => GroupMember.group)
    members: GroupMember[];

    @OneToMany(() => GroupVersion, gv => gv.group)
    versions: GroupVersion[];
}
