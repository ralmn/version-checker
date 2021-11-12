import axios from "axios";
import { CustomSoftware } from "../../entity/CustomSoftware";
import { Software } from "../../entity/Software"
import { buildVersion } from "../../entity/versions/versionsUtils";
import { sortVersion } from "../../utils";
import { IScanner } from "../IScanner";


export class OpenJDKScanner implements IScanner<CustomSoftware> {
    async scanVersions(software: CustomSoftware): Promise<boolean> {
        console.log(`[OpenJDKScanner] scan ${software.name} with data`, software.data);
        if (!('version' in software.data)) {
            console.log('Missing version...');
            return false;
        }

        let url = `https://api.adoptium.net/v3/assets/latest/${software.data.version}/hotspot?vendor=adoptium`;
        console.log(url);
        try {
            let { data } = await axios.get(url, {
                headers: {
                    'accept': 'application/json'
                }
            });

            let versions = (data as any[])
                .map(release => release.release_name)
                .filter(e => e != '' && e != null) as string[];

            let edited = false;

            for (let version of versions) {
                if (!software.versions.find(v => v.versionRaw == version)) {
                    const ver = buildVersion(version, software.versionType);
                    ver.software = software;
                    software.versions.push(ver);
                    edited = true;
                }
            }
            if (edited) {
                software.versions = software.versions.sort((a, b) => a.compare(b));
            }


            if (software.versions.length && software.versions[0] != software.latestVersion) {
                software.latestVersion = software.versions[0];
                edited = true;
                console.log('new latest version');
            }
            return edited;

        } catch (e) {
            console.log(`Failed to call adoptium api`, e.toString());
        }

        return false;
    }
}