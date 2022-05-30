import semver from "semver";
import { SemVer, Version, VersionType } from "./Version";

export interface IGroup {
  id: number;
  name: string;
  softwares: ISoftware[];
  members: IMember[];
  yourRole?: Role;
}

export enum SoftwareType {
  GithubSoftware,
  CustomSoftware,
}

export class ISoftware {
  name?: string;
  type?: SoftwareType;
  versions?: Version[];
  latestVersion?: Version;
  groupVersion?: Version;
  repository?: string;
  versionType?: VersionType;
  versionSemverRequirement?: string;

  constructor(data?: any) {
    if (data) {
      if (data.name) this.name = data.name;
      if (data.type) this.type = data.type;
      if (data.versions) this.versions = data.versions;
      if (data.latestVersion) this.latestVersion = data.latestVersion;
      if (data.groupVersion) this.groupVersion = data.groupVersion;
      if (data.repository) this.repository = data.repository;
      if (data.versionType) this.versionType = data.versionType;
      if (data.versionSemverRequirement) this.versionSemverRequirement = data.versionSemverRequirement;
    }
  }

  isUpdated(): boolean {
    if (this.latestVersionWithRequirements == null || this.groupVersion == null) {
      return true;
    }
    if(this.versionType == VersionType.SemVer && this.versionSemverRequirement != null){
    }
    return this.groupVersion.compare(this.latestVersionWithRequirements) >= 0;
  }

  get latestVersionWithRequirements() : Version | null {
    if(this.versionType == VersionType.SemVer && this.versionSemverRequirement != null){
      const vers = (this.versions || [] as Version[])
        .filter(v => v.versionType == VersionType.SemVer)
        .map(v => v as SemVer)
        .filter(v => v.matchRequirement(this.versionSemverRequirement!))
        .sort();
      if(vers.length > 0){
        return vers[vers.length -1];
      }
    }
    return this.latestVersion || null;

  }

}

export enum Role {
  ADMIN = 0,
  EDITOR = 1,
  VIEWER = 2,
}

export interface IMember {
  user: IUser;
  role: Role;
}

export interface IUser {
  id: number;
  username: string;
  email: string;
}
