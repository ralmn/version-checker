import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";
import { ColumnMetadata } from "typeorm/metadata/ColumnMetadata";
import { User } from "../entity/User";

export class AddUserAdminFlag_1639070428688 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        let columnMetadataAdmin = new ColumnMetadata({
            connection: queryRunner.connection,
            entityMetadata: queryRunner.connection.getMetadata(User),
            args: {
                mode: "regular",
                options: {},
                propertyName: "admin",
                target: "admin"
            }
        });
        columnMetadataAdmin.type = "boolean";
        columnMetadataAdmin.default =  false;

        await queryRunner.addColumn("user", new TableColumn({
            name: "admin",
            type: "boolean",
            default: queryRunner.connection.driver.normalizeDefault(columnMetadataAdmin)
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("user", "admin");
    }

}
