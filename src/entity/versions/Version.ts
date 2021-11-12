import { Column, CreateDateColumn, Entity, ManyToOne, TableInheritance, UpdateDateColumn } from "typeorm";
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
    
    @UpdateDateColumn({ nullable: true})
    updatedAt: Date;

    constructor(version: string){
        this.versionRaw = version;
    }


    @Column({name: 'versionType', type: 'varchar'})
    versionType: VersionType;
    
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