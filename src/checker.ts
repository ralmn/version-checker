import { createConnection } from "typeorm";
import { Software } from "./entity/Software";
 

async function main() {
    let connection = await createConnection();

    let repository = connection.getRepository(Software);

    let softs = await repository
        .createQueryBuilder()
        .select()
        .addOrderBy('Software.updatedAt', "ASC", 'NULLS FIRST')
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

