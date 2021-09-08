import { versions } from "process";
import { BeforeInsert, createConnection, getConnection } from "typeorm";
import { CustomSoftware } from "./entity/CustomSoftware";
import { GithubSoftware } from "./entity/Githubsoftware";
import { Software } from "./entity/Software";


async function init() {
    let repository: any = getConnection().getRepository(GithubSoftware);


    let repos = [
        { name: "traefik", repo: "traefik/traefik" },
        { name: "prometheus", repo: "prometheus/prometheus" },
        { name: "grafana", repo: "grafana/grafana" },
    ]

    await repository.save(repos.map(r => {
        let gRepo = new GithubSoftware();
        gRepo.name = r.name;
        gRepo.repository = r.repo;
        return gRepo;
    }));


    repository = getConnection().getRepository(CustomSoftware);
    let versions = [8, 11, 16, 17];

    await repository.save(versions.map(r => {
        let cRepo = new CustomSoftware();
        cRepo.name = `OpenJdk ${r}`;
        cRepo.file = 'OpenJDKScanner';
        cRepo.data = { version: r };
        return cRepo;
    }));

}

async function main() {
    let connection = await createConnection();

    let repository = connection.getRepository(Software);

    await init();

    let softs = await repository
        .createQueryBuilder()
        .select()
        .addOrderBy('updatedAt', "DESC", 'NULLS FIRST')
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
        console.log("Save : ", toSaves.map(e => e.name).join(', '))
        await repository.save(toSaves);
    } else {
        console.log("No updates");
    }

}

main().then(() => { }).catch((e) => {
    console.log('Uncatched error', e);
})

