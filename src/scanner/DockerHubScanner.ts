import axios from "axios";
import { version } from "os";
import { off } from "process";
import { config } from "../config";
import { DockerHubSoftware } from "../entity/DockerHubSoftware";
import { Version } from "../entity/versions/Version";
import { buildVersion } from "../entity/versions/versionsUtils";
import { VersionType } from "../entity/versions/VersionType";
import { IScanner } from "./IScanner";


const RATELIMIT_MINIMUM = 5;
const DISABLED = false;

let reaming: number = null;
let nextReset: Date = null;
let rateLimitTotal = -1;


function parseHeadersRateLimit(headers: any) {
    reaming = parseInt(headers['x-ratelimit-remaining']) || 60;
    rateLimitTotal = headers['x-ratelimit-limit']
    nextReset = new Date(parseInt(headers['x-ratelimit-reset']) * 1000);
    console.log(`github api : ${reaming} calls reaming of ${rateLimitTotal}. Reset at ${nextReset}`)
}

export class DockerHubScanner implements IScanner<DockerHubSoftware> {

    constructor() {
    }


    async login(software: DockerHubSoftware) {
        let url = `https://auth.docker.io/token?service=registry.docker.io&scope=repository:${software.repository}:pull`;

        let { data } = await axios.get(url, {
            // username: config.dockerhub.user,
            // password: config.dockerhub.access_token
        });

        return data.token;
    }

    async scanVersions(software: DockerHubSoftware): Promise<boolean> {


        console.log(`Scanning dockerhub for ${software.name}`);

        if (DISABLED) {
            console.log(`Dockerhub disabled`);
            return false;
        }

        if (config.dockerhub == null) {
            console.log(`Dockerhub not configured`);
            return false;
        }

        let authToken = await this.login(software);

        let url = `https://registry-1.docker.io/v2/${software.repository}/tags/list`

        let { data } = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        let tags = data.tags;

        let versions: Version[] = tags
            .map(tag => buildVersion(tag, VersionType.Default))
            .sort((a, b) => a.compare(b));

        let edited = false;

        //software.versions = versions;
        versions.forEach(version => {
            if (software.versions.find(v => v.equals(version)) == null) {
                software.versions.push(version);
                version.software = software;
                edited = true;
            }
        });

        software.versions.sort((a, b) => a.compare(b));

        let latest = software.versions.length > 0 ? software.versions[software.versions.length - 1] : null;
        if (latest && !latest.equals(software.latestVersion)) {
            software.latestVersion = latest;
            edited = true;
        }


        return edited;
    }

}