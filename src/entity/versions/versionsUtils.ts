import { Version } from "./Version";
import { SemVer } from "./SemVer";
import { DefaultVersion } from "./DefaultVersion";
import { VersionType } from "./VersionType";



export function buildVersion(version: string, type: VersionType): Version {
    switch(type){
        case VersionType.SemVer:
            return new SemVer(version);
        default:
            return new DefaultVersion(version);
    }
}
