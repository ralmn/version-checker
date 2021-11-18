import semver from "semver";
import { Version } from "./Version";

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

  constructor(data?: any) {
    if (data) {
      if (data.name) this.name = data.name;
      if (data.type) this.type = data.type;
      if (data.versions) this.versions = data.versions;
      if (data.latestVersion) this.latestVersion = data.latestVersion;
      if (data.groupVersion) this.groupVersion = data.groupVersion;
      if (data.repository) this.repository = data.repository;
    }
  }

  isUpdated(): boolean {
    if (this.latestVersion == null || this.groupVersion == null) {
      return true;
    }
    return this.groupVersion.compare(this.latestVersion) >= 0;
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
