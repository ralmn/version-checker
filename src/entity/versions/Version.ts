import { Column, CreateDateColumn, Entity, ManyToOne, TableInheritance } from "typeorm";
import { Software } from "../Software";
import { VersionType } from "./VersionType";


@Entity()
@TableInheritance({ column: { type: "varchar", name: "versionType", enum: VersionType } },)
export abstract class Version {

    @ManyToOne(() => Software ,{primary: true, onDelete: "RESTRICT", onUpdate: "RESTRICT"})
    software: Software;

    @Column({primary: true})
    versionRaw: string;
    
    @CreateDateColumn({nullable: false})
    createdAt: Date;

    constructor(version: string){
        this.versionRaw = version;
    }

    //abstract compare(b:Version): number;

    compare( b: Version): number {
        return this.versionRaw.localeCompare(b.versionRaw);
    }

    toString(){
        return this.versionRaw;
    }
    
    equals(b: Version): boolean {
        return this.versionRaw == b.versionRaw;
    }

}