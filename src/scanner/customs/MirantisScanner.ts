import axios from "axios";
import { CustomSoftware } from "../../entity/CustomSoftware";
import { Software } from "../../entity/Software";
import { sortVersion } from "../../utils";
import { IScanner } from "../IScanner";
import * as cheerio from "cheerio";
import { isJsxOpeningFragment } from "typescript";
import * as semver from "semver";

const domain = `https://docs.mirantis.com`;

let versionRegex = /\/([0-9]+\.[0-9]+)\//;

export class MirantisScanner implements IScanner<CustomSoftware> {
  private async parseMajorVersion(
    majorVersion: string,
    code: string
  ): Promise<string[]> {
    console.log(`[MirantisScanner] getting versions for ${majorVersion}`);

    let urlReleaseNotes = `${domain}/${code}/${majorVersion}/rn-${majorVersion.replace(
      /\./g,
      "-"
    )}.html`;
    console.log(urlReleaseNotes);
    const { data } = await axios.get(urlReleaseNotes);
    let $ = cheerio.load(data);

    let elems = $(".toctree-wrapper.compound ul li a");

    let versions: string[] = [];

    for (let elem of elems) {
      let $elem = $(elem);
      let text = $elem.text();
      let version = semver.coerce(text, {loose: true});
      if(version){
        versions.push(version.format());
      }else{
          console.log('failed to parse', text);
      }
    }
    return versions;
  }

  async scanVersions(software: CustomSoftware): Promise<boolean> {
    console.log(
      `[MirantisScanner] scan ${software.name} with data`,
      software.data
    );
    if (!("code" in software.data)) {
      console.log("Missing code...");
      return false;
    }

    let code = software.data.code;

    let url = `${domain}/${code}`;

    try {
      let res = await axios.get(url);
      let urlRedirected = res.request.path;
      let regexData = versionRegex.exec(urlRedirected);
      let currentVersionGlobal = regexData[1];
      let versions = [];
      versions.push(
        ...(await this.parseMajorVersion(currentVersionGlobal, code))
      );

      let $ = cheerio.load(res.data);

      let elems = $(".version-dropdown ul.dropdown-menu li a");

      for (let elem of elems) {
        let $elem = $(elem);
        let majorVersion = $elem.text().trim();
        versions.push(...(await this.parseMajorVersion(majorVersion, code)));
      }

      versions = versions.sort(sortVersion).reverse();

      let edited = false;

      if (software.latestVersion != versions[0]) {
        software.latestVersion = versions[0];
        edited = true;
      }

      let newVersion = false;

      for (let v of versions) {
        if (!software.versions.includes(v)) {
          software.versions.push(v);
          newVersion;
        }
      }

      if (newVersion) {
        software.versions = software.versions.sort(sortVersion);
        edited = true;
      }

      return edited;
    } catch (e) {
      console.log("[MirantisScanner] error on getting data", e.toString());
    }

    return false;
  }
}
