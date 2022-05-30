import {Column, Entity, JoinColumn, ManyToOne, OneToOne} from "typeorm";
import { Software } from "./Software";
import { Group } from "./Group";
import { Version } from "./versions/Version";
import { VersionType } from "./versions/VersionType";
import { SemVer } from "./versions/SemVer";

@Entity()
export class GroupVersion {

    @ManyToOne(() => Group, {primary: true, onDelete: "RESTRICT", onUpdate: "RESTRICT"})
    group: Group;

    @ManyToOne(() => Software, {primary: true, onDelete: "RESTRICT", onUpdate: "RESTRICT"})
    software: Software;

    @OneToOne(() => Version, {nullable: true})
    @JoinColumn({name: 'version', referencedColumnName: 'versionRaw'})
    version: Version;

    @Column({
        nullable: true,
    })
    versionSemverRequirement: string | null;

    get isUpdated() : boolean {
        if(this.version == null || this.software.latestVersion == null) return true;
        if(this.version.versionType == VersionType.SemVer && this.software.versionType == VersionType.SemVer && this.versionSemverRequirement != null){
            let latestVersionFromSemverRequirements = this.software.findLatestVersionFromRequirement(this.versionSemverRequirement);
            if(latestVersionFromSemverRequirements != null){
                return latestVersionFromSemverRequirements.compare(this.version as SemVer) <= 0;
            }
        }
        return this.software.latestVersion.compare(this.version) <= 0;
    }

    set isUpdated(val: boolean) {
        //nothing
    }

}
