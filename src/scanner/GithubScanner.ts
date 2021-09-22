import axios from "axios";
import { GithubSoftware } from "../entity/Githubsoftware";
import { sortVersion } from "../utils";
import * as semver from "semver";
import { IScanner } from "./IScanner";


const RATELIMIT_MINIMUM = 20;
const DISABLED = true;

let reaming: number = null;
let nextReset: Date = null;
let rateLimitTotal = -1;


function parseHeadersRateLimit(headers: any) {
    reaming = parseInt(headers['x-ratelimit-remaining']) || 60;
    rateLimitTotal = headers['x-ratelimit-limit']
    nextReset = new Date(parseInt(headers['x-ratelimit-reset']) * 1000);
    console.log(`github api : ${reaming} calls reaming of ${rateLimitTotal}. Reset at ${nextReset}`)
}

function parseTagVersion(version: string): string {
    return semver.valid(version) ? semver.clean(version) : semver.coerce(version, {loose: true, includePrerelease: true}).format()
}

function isPreRelease(version: string): boolean {
    return (semver.prerelease(version) || []).length > 0;
}

export class GithubScanner implements IScanner<GithubSoftware> {




    async scanVersions(software: GithubSoftware): Promise<boolean> {
        console.log(`Scanning github ${software.scanTags ? 'tags': 'realses'} for ${software.name}`);


        if (DISABLED) {
            console.log('Github scanner disabled');
            return false;
        }

        if (reaming != null && reaming <= RATELIMIT_MINIMUM) {
            console.log(`Skip, github rate limit is over (reaming ${reaming}/${rateLimitTotal}), next reset at ${nextReset}`)
            return false;
        }

        try {

            let requestHeaders = {
                'Accept': 'application/vnd.github.v3+json'
            }
            const url = `https://api.github.com/repos/${software.repository}/${software.scanTags ? 'tags' : 'releases'}?per_page=99&page=1`;
            console.log(url);
            let { data, headers } = await axios.get(url, {
                headers: requestHeaders
            })
            // console.log(headers);
            parseHeadersRateLimit(headers)
            //console.log(data);

            let versions : string[];
            let forLatest: string[];

            if(software.scanTags){
                versions = (data as any[])
                    .map(tag => tag.name)
                    .filter(v => /^([0-9]|v[0-9])/.test(v))
                    .map(v => parseTagVersion(v))
                    .filter(e => e != '' && e != null);

                forLatest = versions.filter(version => !isPreRelease(version)).sort(sortVersion).reverse();
            }else{
                versions = (data as any[])
                    .map(release => software.useReleaseTag ? release.tag_name : release.name)
                    .map(v => parseTagVersion(v))
                    .filter(e => e != '' && e != null);

                forLatest = (data as any[])
                    .filter(e => e.prerelease == false && e.draft == false)
                    .map(release => software.useReleaseTag ? release.tag_name : release.name)
                    .map(v => parseTagVersion(v))
                    .filter(e => e != '' && e != null)
                    .filter(version => !isPreRelease(version))
                    .sort(sortVersion)
                    .reverse();
                console.log(forLatest);
            }
            let edited = false;

            for (let version of versions) {
                if (!software.versions.includes(version)) {
                    software.versions.push(version);
                    edited = true;
                }
            }
            if (edited) {
                software.versions = software.versions.sort(sortVersion);
            }


            if (forLatest.length && forLatest[0] != software.latestVersion) {
                software.latestVersion = forLatest[0];
                edited = true;
                console.log('new latest version');
            }
            return edited;
        } catch (e) {
            console.error(`Failed to load github release for ${software.name}`, e.toString());
        }
        return false;
    }
}