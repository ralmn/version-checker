import semver from "semver";

export interface IGroup {
    id: number;
    name: string;
    softwares: ISoftware[];
}

export enum SoftwareType {
    GithubSoftware,
    CustomSoftware
}


export interface ISoftware {
    name?: string;
    type?: SoftwareType;
    versions?: string[];
    latestVersion?: string;
    groupVersion?: string;

}

export function softwareIsUpdated(software: ISoftware) {
    return semver.gt(software.groupVersion!, software.latestVersion!);
  }