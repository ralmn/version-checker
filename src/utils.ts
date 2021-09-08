import * as semver from "semver";

export function sortVersion(version1: string, version2:string){

    if(version1 == version2) return 0;
    return semver.lt(version1, version2) ? -1 : 1;

}