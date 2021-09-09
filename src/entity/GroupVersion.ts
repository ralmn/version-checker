import {Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import { Software } from "./Software";
import { Group } from "./Group";

@Entity()
export class GroupVersion {

    @ManyToOne(() => Group, {primary: true})
    group: Group;

    @ManyToOne(() => Software, {primary: true})
    software: Software;

    @Column({nullable: false})
    version: string;

}
