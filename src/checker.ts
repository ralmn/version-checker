import { createConnection } from "typeorm";
import { loadConfig } from "./config";
import { Software } from "./entity/Software";
import { Version } from "./entity/versions/Version";
 

async function main() {
    await loadConfig();
    let connection = await createConnection();

    let repository = connection.getRepository(Software);
    let vRepo = connection.getRepository(Version);

    let softs = await repository
        .createQueryBuilder('s')
        .select()
        .addOrderBy('s.updatedAt', "ASC", 'NULLS FIRST')
        .leftJoinAndSelect('s.versions', 'version')
        .leftJoinAndSelect('version.software', 'vsoft')
        .leftJoinAndSelect('s.latestVersion', 'latestVersion')
        .leftJoinAndSelect('latestVersion.software', 'latestVersionSoft')
        .getMany();

    console.log(softs);

    let toSaves: Software[] = [];

    for (let soft of softs) {
        //break;
        let ok = await soft.scanVersions();
        if (ok) {
            toSaves.push(soft);
        }
    }
    if (toSaves.length > 0) {
        console.log("SAVE Versions");
        await connection.manager.save(toSaves.flatMap(s => s.versions));
        console.log("SAVE Software");
        await connection.manager.save(toSaves);
    } else {
        console.log("No updates");
    }

    await connection.close();
}

main().then(() => {

 }).catch((e) => {
    console.log('Uncatched error', e);
});

function listSofts(softs: Software[]) {
    throw new Error("Function not implemented.");
}

