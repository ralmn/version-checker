import semver from "semver";

export interface IGroup {
  id: number;
  name: string;
  softwares: ISoftware[];
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

export function softwareIsUpdated(software: ISoftware) {
  if (software.groupVersion && software.latestVersion) {
    return semver.compare(software.groupVersion!, software.latestVersion!) >= 0;
  } else {
    return true;
  }
}
