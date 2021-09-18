import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";
import { ColumnMetadata } from "typeorm/metadata/ColumnMetadata";
import { GithubSoftware } from "../entity/Githubsoftware";

export class AddGithubSoftwareScanTags1631635616739 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        let columnMetadataScanTags = new ColumnMetadata({
            connection: queryRunner.connection,
            entityMetadata: queryRunner.connection.getMetadata(GithubSoftware),
            args: {
                mode: "regular",
                options: {},
                propertyName: "scanTags",
                target: "scanTags"
            }
        });
        columnMetadataScanTags.type = "boolean";
        columnMetadataScanTags.default =  false;

        await queryRunner.addColumn('software', new TableColumn({
            name: 'scanTags',
            type: 'boolean',
            isNullable: false,
            default: queryRunner.connection.driver.normalizeDefault(columnMetadataScanTags)
        }));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('software', 'scanTags');
    }

}
