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

  constructor(version: string){
    super(version);
    let s = semverLib.coerce(version, {loose: true, includePrerelease: true});
    if(s){
      this.major = s.major;
      this.minor = s.minor;
      this.patch = s.patch;
    }
  }

  compare(b: SemVer) {
    if (this.major != b.major) {
      return this.major < b.major ? -1 : 1;
    } else if (this.minor != b.minor) {
      return this.minor < b.minor ? -1 : 1;
    } else if (this.patch != b.patch) {
      return this.patch < b.patch ? -1 : 1;
    }
    return 0;
  }
}
