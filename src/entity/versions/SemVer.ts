import * as semverLib from "semver";
import { ChildEntity, Column } from "typeorm";
import { Version } from "./Version";
import { VersionType } from "./VersionType";

@ChildEntity(VersionType.SemVer)
export class SemVer extends Version {
  @Column()
  major: number;

  @Column()
  minor: number;

  @Column()
  patch: number;

  @Column()
  prerelease: boolean;

  constructor(version: string) {
    super(version);
    let s = semverLib.parse(version);
    if(s == null) {
      s = semverLib.coerce(version, { loose: true, includePrerelease: true });
    }
    if (s) {
      this.major = s.major;
      this.minor = s.minor;
      this.patch = s.patch;
      if(this.major == 2 && this.minor == 10){
        console.log(s);
      }
      this.prerelease = s.prerelease.length > 0;
    }
  }

  compare(b: SemVer) {
    if (b == null) return 1;
    if (this.major != b.major) {
      return this.major < b.major ? -1 : 1;
    } else if (this.minor != b.minor) {
      return this.minor < b.minor ? -1 : 1;
    } else if (this.patch != b.patch) {
      return this.patch < b.patch ? -1 : 1;
    }

    try {
      let compare = semverLib.compareLoose(this.versionRaw, b.versionRaw);
      if(compare != 0){
        return compare;
      }
      let semverA = semverLib.coerce(this.versionRaw, { loose: true, includePrerelease: true });
      let semverB = semverLib.coerce(b.versionRaw, { loose: true, includePrerelease: true });
      if (semverA && semverB) {
        return semverLib.compare(semverA, semverB);
      }
    } catch (e) {
      //nothing
    }

    return 0;
  }

  matchRequirement(requirement: string){
    return semverLib.satisfies(this.versionRaw, requirement);
  }
 
}
