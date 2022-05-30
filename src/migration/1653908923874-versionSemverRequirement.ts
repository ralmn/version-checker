import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class versionSemverRequirement1653908923874 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("group_version", new TableColumn({
            name: 'versionSemverRequirement',
            type: 'varchar', 
            isNullable: true
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("group_version", "versionSemverRequirement");
    }

}
