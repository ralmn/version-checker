import {MigrationInterface, QueryRunner, TableForeignKey} from "typeorm";

export class GroupVersionFK1633268604090 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createForeignKey('group_version', new TableForeignKey({
            referencedTableName: 'version',
            columnNames: ['softwareName', 'version'],
            referencedColumnNames: ['softwareName', 'versionRaw']
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
