import { Column, Entity, ManyToOne, TableInheritance } from "typeorm";
import { Software } from "../Software";
import { VersionType } from "./VersionType";


@Entity()
@TableInheritance({ column: { type: "varchar", name: "versionType", enum: VersionType } })
export abstract class Version {

    @ManyToOne(() => Software ,{primary: true, onDelete: "RESTRICT", onUpdate: "RESTRICT"})
    software: Software;

    @Column({primary: true})
    versionRaw: string;

    constructor(version: string){
        this.versionRaw = version;
    }

    abstract compare(b:Version): number;

    toString(){
        return this.versionRaw;
    }
    
    equals(b: Version): boolean {
        return this.versionRaw == b.versionRaw;
    }

}