export enum VersionType {
  SemVer = "SemVer",
  Default = "DefaultVersion",
}

export abstract class Version {
  versionRaw: string;
  versionType: VersionType;

  constructor(data: IVersion) {
    this.versionRaw = data.versionRaw;
    this.versionType = data.versionType;
  }

  abstract compare(b: Version): number;

  equals(b: Version) {
    return this.versionRaw == b.versionRaw;
  }
}

export class DefaultVersion extends Version {
  compare(b: DefaultVersion) {
    return this.versionRaw.localeCompare(b.versionRaw);
  }
}

interface IVersion {
  versionRaw: string;
  versionType: VersionType;
}

interface ISemVer extends IVersion {
  major: number;
  minor: number;
  patch: number;
}

export class SemVer extends Version implements ISemVer {
  major: number;
  minor: number;
  patch: number;

  constructor(data: ISemVer) {
    super(data);
    this.major = data.major;
    this.minor = data.minor;
    this.patch = data.patch;
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

export function castVersionData(raw: any): Version | null {
  //console.log('castVersionData', raw);
  if (raw == null) return null;
  switch (raw.versionType) {
    case VersionType.SemVer:
      return new SemVer(raw as ISemVer);
    case VersionType.Default:
      return new DefaultVersion(raw as IVersion);
    default:
      return null;
  }
}
