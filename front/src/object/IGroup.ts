import semver from "semver";

export interface IGroup {
  id: number;
  name: string;
  softwares: ISoftware[];
  members: IMember[];
}

export enum SoftwareType {
  GithubSoftware,
  CustomSoftware,
}

export interface ISoftware {
  name?: string;
  type?: SoftwareType;
  versions?: string[];
  latestVersion?: string;
  groupVersion?: string;
}

export enum Role {
  ADMIN = 0, EDITOR = 1, VIEWER = 2
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

export function softwareIsUpdated(software: ISoftware) {
  if (software.groupVersion && software.latestVersion) {
    return semver.compare(software.groupVersion!, software.latestVersion!) >= 0;
  } else {
    return true;
  }
}
