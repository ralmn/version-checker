import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class Group1631187107948 implements MigrationInterface {
    name = 'Group1631187107948'

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.createTable(new Table({
            name: 'group',
            columns: [
                {name: 'id', type: 'integer', isPrimary: true, isGenerated: true, generationStrategy: 'increment', isNullable: false},
                {name: 'name', type: 'varchar', isNullable: false}
            ]
        }), true, true, true);

        await queryRunner.createTable(new Table({
            name: 'group_member',
            columns: [
                {name: 'role', type: 'integer', isNullable: false},
                {name: 'groupId', type: 'integer', isNullable: false, isPrimary: true},
                {name: 'userId', type: 'integer', isNullable: false, isPrimary: true},
            ],
            foreignKeys: [
                {name: 'FK_goup_member_group', columnNames: ['groupId'], referencedTableName: 'group', referencedColumnNames: ['id'], onDelete: 'RESTRICT', onUpdate: 'RESTRICT'},
                {name: 'FK_goup_member_user', columnNames: ['userId'], referencedTableName: 'user', referencedColumnNames: ['id'], onDelete: 'RESTRICT', onUpdate: 'RESTRICT'}
            ],
            indices: []
        }), true, true, true);


        await queryRunner.createTable(new Table({
            name: 'group_version',
            columns: [
                {name: 'version', type: 'varchar', isNullable: false},
                {name: 'groupId', type: 'integer', isNullable: false, isPrimary: true},
                {name: 'softwareName', type: 'varchar', isNullable: false, isPrimary: true}
            ],
            foreignKeys: [
                {name: 'FK_goup_version_group', columnNames: ['groupId'], referencedTableName: 'group', referencedColumnNames: ['id'], onDelete: 'RESTRICT', onUpdate: 'RESTRICT'},
                {name: 'FK_goup_version_software', columnNames: ['softwareName'], referencedTableName: 'software', referencedColumnNames: ['name'], onDelete: 'RESTRICT', onUpdate: 'RESTRICT'}
            ]
        }), true, true, true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('group_version');
        await queryRunner.dropTable('group_member');
        await queryRunner.dropTable('group');
    }

}
