import axios from "axios";
import { GithubSoftware } from "../entity/Githubsoftware";
import { sortVersion } from "../utils";
import * as semver from "semver";
import { IScanner } from "./IScanner";


const RATELIMIT_MINIMUM = 20;
const DISABLED = false;

export class GithubScanner implements IScanner<GithubSoftware> {

    reaming?: number
    nextReset?: Date;
    rateLimitTotal = -1;

    private parseHeadersRateLimit(headers: any) {
        this.reaming = parseInt(headers['x-ratelimit-remaining']) || 60;
        this.rateLimitTotal = headers['x-ratelimit-limit']
        this.nextReset = new Date(parseInt(headers['x-ratelimit-reset']) * 1000);
        console.log(`github api : ${this.reaming} calls reaming of ${this.rateLimitTotal}. Reset at ${this.nextReset}`)
    }


    async scanVersions(software: GithubSoftware): Promise<boolean> {
        console.log(`Scanning github release for ${software.name}`);


        if (DISABLED) {
            console.log('Github scanner disabled');
            return false;
        }

        if (this.reaming != null && this.reaming <= RATELIMIT_MINIMUM) {
            console.log(`Skip, github rate limit is over (reaming ${this.reaming}/${this.rateLimitTotal}), next reset at ${this.nextReset}`)
            return false;
        }

        try {

            let requestHeaders = {
                'Accept': 'application/vnd.github.v3+json'
            }

            let { data, headers } = await axios.get(`https://api.github.com/repos/${software.repository}/releases?per_page=99&page=1`, {
                headers: requestHeaders
            })
            // console.log(headers);
            this.parseHeadersRateLimit(headers)
            //console.log(data);
            let versions = (data as any[])
                .map(release => software.useReleaseTag ? release.tag_name : release.name)
                .map(v => semver.coerce(v).format())
                .filter(e => e != '' && e != null);

            let forLatest = (data as any[])
                .filter(e => e.prerelease == false && e.draft == false)
                .map(release => software.useReleaseTag ? release.tag_name : release.name)
                .map(v => semver.coerce(v).format())
                .filter(e => e != '' && e != null)
                .sort(sortVersion)
                .reverse();
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