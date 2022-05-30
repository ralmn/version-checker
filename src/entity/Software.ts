import { Entity, Column, PrimaryColumn, TableInheritance, ValueTransformer, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne, JoinColumn } from "typeorm";
import { DefaultVersion } from "./versions/DefaultVersion";
import { buildVersion } from "./versions/versionsUtils";
import { Version } from "./versions/Version";
import { VersionType } from "./versions/VersionType";
import { SemVer } from "./versions/SemVer";
import { builtinModules } from "module";

@Entity()
@TableInheritance({ column: { type: "varchar", name: "type" } })
export abstract class Software {

    @PrimaryColumn()
    @JoinColumn({name: 'name', referencedColumnName:'softwareName'})
    name: string;

    @OneToMany(() => Version, v => v.software)
    versions: Version[];

    @OneToOne(() => Version, {nullable: true})
    @JoinColumn({name: 'latestVersion', referencedColumnName: 'versionRaw'})
    latestVersion?: Version;

    @CreateDateColumn({nullable: false})
    createdAt: Date;

    @UpdateDateColumn({ nullable: true})
    updatedAt: Date;

    @Column()
    type: string;

    @Column({type: 'varchar', enum: VersionType, default: VersionType.Default})
    versionType: VersionType;

    // constructor(name: string){
    //     this.name = name;
    // }

    public getName(){
        return this.name;
    }
    public getVersions(){
        return this.versions;
    }
    public addVersions(version: string){
        //this.versions.push(buildVersion(version, this.versionType));
    }

    public abstract scanVersions(): Promise<boolean>;

    public findLatestVersionFromRequirement(requirement: string) : SemVer | null {
        if(this.versionType != VersionType.SemVer){
            return null;
        }

        let versions = this.versions
            .filter(v => v.versionType == VersionType.SemVer)
            .map(v => v as SemVer)
            .filter(v => v.matchRequirement(requirement))
            .sort((a, b) => a.compare(b));
        
        if(versions.length){
            return versions[versions.length - 1];
        }
        return null;
    }

}