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
    name: string;
    type: SoftwareType;
    versions: string[];
    latestVersion: string;
    groupVersion: String;
}