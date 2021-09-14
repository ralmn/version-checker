import {MigrationInterface, QueryRunner, Table} from "typeorm";
import { ColumnMetadata } from "typeorm/metadata/ColumnMetadata";
import { GithubSoftware } from "../entity/Githubsoftware";

export class FirstMigration1000000000000 implements MigrationInterface {
    name = 'FirstMigration1000000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {


        const driver = queryRunner.connection.driver;

        await queryRunner.createTable(new Table({
            name: "user",
            columns: [
                {name: "id", type: "integer", isPrimary: true, isGenerated: true, generationStrategy: 'increment'},
                {name: "username", type: "varchar", isNullable: false, isUnique: true},
                {name: "password", type: "varchar", isNullable: false},
            ]
        }), true, true, true);
        
        let columnMetadataUseReleaseTag = new ColumnMetadata({
            connection: queryRunner.connection,
            entityMetadata: queryRunner.connection.getMetadata(GithubSoftware),
            args: {
                mode: "regular",
                options: {},
                propertyName: "useReleaseTag",
                target: "useReleaseTag"
            }
        });
        columnMetadataUseReleaseTag.type = "boolean";
        columnMetadataUseReleaseTag.default =  true;
        await queryRunner.createTable(new Table({
            name: "software",
            columns: [
                {name: "name", type: "varchar", isPrimary: true, isNullable: false},
                {name: "versions", type: "text", isNullable: false, default: `''`},
                {name: "latestVersion", type:"varchar", isNullable: true},
                {name: "createdAt", type: driver.mappedDataTypes.createDate.toString(), default: driver.mappedDataTypes.createDateDefault, isNullable: false},
                {name: "updatedAt", type: driver.mappedDataTypes.updateDate.toString(), default: driver.mappedDataTypes.updateDateDefault, isNullable: true},
                {name: "file", type: "varchar", isNullable: true},
                {name: "repository", type: "varchar", isNullable: true},
                {name: "useReleaseTag", type: "boolean", isNullable: true, default: driver.normalizeDefault(columnMetadataUseReleaseTag)},
                {name: "type", type: "varchar", isNullable: false},
                {name: "data", type: "text", isNullable: true}
            ],
            indices: [
                {columnNames: ['type']}
            ]
        }), true, true, true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("user");
        await queryRunner.dropTable("software");
    }

}
