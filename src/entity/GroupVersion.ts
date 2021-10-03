import {Entity, JoinColumn, ManyToOne, OneToOne} from "typeorm";
import { Software } from "./Software";
import { Group } from "./Group";
import { Version } from "./versions/Version";

@Entity()
export class GroupVersion {

    @ManyToOne(() => Group, {primary: true, onDelete: "RESTRICT", onUpdate: "RESTRICT"})
    group: Group;

    @ManyToOne(() => Software, {primary: true, onDelete: "RESTRICT", onUpdate: "RESTRICT"})
    software: Software;

    @OneToOne(() => Version, {nullable: false})
    @JoinColumn({name: 'version', referencedColumnName: 'versionRaw'})
    version: Version;

}
