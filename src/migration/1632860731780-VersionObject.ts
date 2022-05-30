import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from "typeorm";
import { ColumnMetadata } from "typeorm/metadata/ColumnMetadata";
import { Software } from "../entity/Software";
import { DefaultVersion } from "../entity/versions/DefaultVersion";
import { SemVer } from "../entity/versions/SemVer";
import { Version } from "../entity/versions/Version";
import { buildVersion } from "../entity/versions/versionsUtils";
import { VersionType } from "../entity/versions/VersionType";

export class VersionObject1632860731780 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        const driver = queryRunner.connection.driver;

        let columnMetadataVersionType = new ColumnMetadata({
            connection: queryRunner.connection,
            entityMetadata: queryRunner.connection.getMetadata(Version),
            args: {
                mode: "regular",
                options: {},
                propertyName: "versionType",
                target: "versionType"
            }
        });
        columnMetadataVersionType.type = "varchar";
        columnMetadataVersionType.default =  VersionType.Default;

        await queryRunner.createTable(new Table({
            name: 'version',
            columns: [
                {name: 'softwareName', type: 'varchar', isPrimary: true},
                {name: 'versionRaw', type: 'varchar', isPrimary: true},
                {name: 'versionType', type: 'varchar', isNullable: false, default: queryRunner.connection.driver.normalizeDefault(columnMetadataVersionType)},
                {name: 'major', type: 'integer', isNullable: true, default: null},
                {name: 'minor', type: 'integer', isNullable: true, default: null},
                {name: 'patch', type: 'integer', isNullable: true, default: null},
                {name: "createdAt", type: driver.mappedDataTypes.createDate.toString(), default: driver.mappedDataTypes.createDateDefault, isNullable: false},
                {name: "updatedAt", type: driver.mappedDataTypes.updateDate.toString(), default: driver.mappedDataTypes.updateDateDefault, isNullable: true},

            ],
            foreignKeys: [
                {referencedTableName: 'software', columnNames: ['softwareName'], referencedColumnNames: ['name']}
            ]
        }));

        const sRepo = queryRunner.connection.getRepository(Software);
        const vRepo = queryRunner.connection.getRepository(SemVer);

        
        let needCommitAtEnd = true;
        if(queryRunner.isTransactionActive){
            console.log('commit transac 1 ');
            await queryRunner.commitTransaction();
            needCommitAtEnd = false;
        }
        await queryRunner.startTransaction();

        let softwares = await queryRunner.connection.query('select "name", "versions", "latestVersion", "type" from software');

        let toSavedVersions : any[] = [];
        let toSavedSoft : any[] = [];


        for(let s of softwares){
            console.log(s);
            let vers : Version[] = s.versions.split(',').map(v => {
                let sv = buildVersion(v, VersionType.SemVer) as SemVer;
                return {software: s.name, versionRaw: v, major: sv.major, minor: sv.minor, patch: sv.patch }
            });
            toSavedVersions.push(...vers);
            //s.versions = [vers[0]];
            if(s.latestVersion){
                let latest = vers.find(v => v.versionRaw == (s.latestVersion as any));
                if(latest){
                    toSavedSoft.push({software:  s.name, latestVersion: latest.versionRaw});
                }
            }
            // break;
        }
        

        await queryRunner.dropColumn('software', 'latestVersion');
        await queryRunner.dropColumn('software', 'versions');

        await queryRunner.addColumn('software', new TableColumn({
            type: 'varchar',
            name: 'latestVersion',
            isNullable: true
        }));

        await queryRunner.addColumn('software', new TableColumn({
            type: 'varchar',
            name: 'versionType',
            isNullable: false,
            default: queryRunner.connection.driver.normalizeDefault(columnMetadataVersionType)
        }));

        await queryRunner.createForeignKey('software', new TableForeignKey({
            name: 'FK_software_latest_version',
            referencedTableName: 'version',
            columnNames: ['latestVersion', 'name'],
            referencedColumnNames: ['versionRaw', 'softwareName']
        }));

        console.log('commit transac 2');
        await queryRunner.commitTransaction();
        await queryRunner.startTransaction();

        await vRepo.createQueryBuilder('v').insert().values(toSavedVersions).execute();
        for(let tss of toSavedSoft){
            await sRepo.createQueryBuilder('s').where('name = :name', {name: tss.software}).update().set({latestVersion: tss.latestVersion}).execute()
        }
        for(let s of softwares) {
            await sRepo.createQueryBuilder('s').where('name = :name', {name: s.name}).update().set({versionType: VersionType.SemVer}).execute()
        }

        if(needCommitAtEnd){
            console.log('commit transac final');
            await queryRunner.commitTransaction();
        }

    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        throw new Error("Sorry but, it's to hard to rollback !");

    }

}
