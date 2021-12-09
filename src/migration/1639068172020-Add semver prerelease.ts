import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";
import { ColumnMetadata } from "typeorm/metadata/ColumnMetadata";
import { SemVer } from "../entity/versions/SemVer";

export class AddSemverPrerelease1639068172020 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        let columnMetadataPreRelease = new ColumnMetadata({
            connection: queryRunner.connection,
            entityMetadata: queryRunner.connection.getMetadata(SemVer),
            args: {
                mode: "regular",
                options: {},
                propertyName: "prerelease",
                target: "prerelease"
            }
        });
        columnMetadataPreRelease.type = "boolean";
        columnMetadataPreRelease.default =  false;

        await queryRunner.addColumn("version", new TableColumn({
            name: "prerelease",
            type: "boolean",
            default: queryRunner.connection.driver.normalizeDefault(columnMetadataPreRelease)
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("version", "prerelease");
    }

}
