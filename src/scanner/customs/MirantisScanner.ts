import axios from "axios";
import { CustomSoftware } from "../../entity/CustomSoftware";
import { Software } from "../../entity/Software";
import { sortVersion } from "../../utils";
import { IScanner } from "../IScanner";
import * as cheerio from "cheerio";
import * as semver from "semver";
import { buildVersion } from "../../entity/versions/versionsUtils";
import { SemVer } from "../../entity/versions/SemVer";

const domain = `https://docs.mirantis.com`;

let versionURLRegex = /\/([0-9]+\.[0-9]+)\//;
let versionRegex = /^([0-9]+\.[0-9]+)/;

export class MirantisScanner implements IScanner<CustomSoftware> {

  private async newParseMajorVersion($, majorVersion: string, code: string): Promise<string[]> {

    let elems = $("#release-notes .card .card-header .card-text");

    let versions: string[] = [];

    for (let elem of elems) {
      let $elem = $(elem);
      let text = $elem.text().toLowerCase();
      if (text.startsWith(code.toLowerCase())) {
        text = text.substring(code.length + 1).replace(/current/, '').trim();
        let version = semver.coerce(text, { loose: true });
        if (version) {
          versions.push(version.format());
        } else {
          console.log('[MirantisScanner] failed to parse', text);
        }
      }
    }
    return versions;

  }

  private async parserMajorVersionV3(majorVersion: string, code: string): Promise<string[]>{
    console.log('[MirantisScanner]  try parser v3');

    let urlReleaseNotes = `${domain}/${code}/${majorVersion}/release-notes.html`;
    console.log(`[MirantisScanner] ${urlReleaseNotes}`);
    const { data } = await axios.get(urlReleaseNotes);
    let $ = cheerio.load(data);

    return await this.newParseMajorVersion($, majorVersion, code);
  }

  private async parseMajorVersion(
    majorVersion: string,
    code: string
  ): Promise<string[]> {
    console.log(`[MirantisScanner] getting versions for ${majorVersion}`);

    let urlReleaseNotes = `${domain}/${code}/${majorVersion}/rn-${majorVersion.replace(
      /\./g,
      "-"
    )}.html`;
    console.log(`[MirantisScanner] ${urlReleaseNotes}`);
    try {

      const { data } = await axios.get(urlReleaseNotes);
      let $ = cheerio.load(data);

      let elems = $(".toctree-wrapper.compound ul li a");

      if (elems.length == 0) {
        return this.newParseMajorVersion($, majorVersion, code);
      }

      let versions: string[] = [];

      for (let elem of elems) {
        let $elem = $(elem);
        let text = $elem.text();
        let version = semver.coerce(text, { loose: true });
        if (version) {
          versions.push(version.format());
        } else {
          console.log('[MirantisScanner] failed to parse', text);
        }
      }
      return versions;

    } catch (e) {
      if(e.response.status == 404){
        return await this.parserMajorVersionV3(majorVersion, code);
      }else{
        throw e;
      }
    }
  }

  async scanVersions(software: CustomSoftware): Promise<boolean> {
    console.log(
      `[MirantisScanner] scan ${software.name} with data`,
      software.data
    );
    if (!("code" in software.data)) {
      console.log("[MirantisScanner] Missing code...");
      return false;
    }

    let code = software.data.code;

    let url = `${domain}/${code}`;

    try {
      let res = await axios.get(url);
      let urlRedirected = res.request.path;
      let regexData = versionURLRegex.exec(urlRedirected);
      let currentVersionGlobal = regexData[1];
      console.log('Current version', currentVersionGlobal);
      let versions = [];
      versions.push(
        ...(await this.parseMajorVersion(currentVersionGlobal, code))
      );

      let $ = cheerio.load(res.data);

      let elems = $(".version-dropdown ul.dropdown-menu li a");

      for (let elem of elems) {
        let $elem = $(elem);
        let majorVersion = $elem.text().trim();
        
        let majorVersionRegexData = versionRegex.exec(majorVersion);
        console.log(`Another version : "${majorVersion}"`)
        versions.push(...(await this.parseMajorVersion(majorVersionRegexData[1], code)));
      }

      versions = versions.sort(sortVersion).reverse();

      let edited = false;

      if (software.latestVersion != versions[0]) {
        software.latestVersion = versions[0];
        edited = true;
      }

      let newVersion = false;

      for (let v of versions) {
        if (!software.versions.find(vB => vB.versionRaw == v)) {
          const ver = buildVersion(v, software.versionType);
          ver.software = software;
          software.versions.push(ver);
          newVersion = true;
        }
      }

      if (newVersion) {
        software.versions = software.versions.sort((a, b) => a.compare(b));
        edited = true;
      }

      return edited;
    } catch (e) {
      console.log("[MirantisScanner] error on getting data", e.toString());
    }

    return false;
  }
}
