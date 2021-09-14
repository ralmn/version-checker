import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class UserAddEmail1631189634259 implements MigrationInterface {
    name = 'UserAddEmail1631189634259'

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.addColumn('user',  new TableColumn({
            name: 'email',
            type: 'varchar',
            isNullable: false,
            isUnique: true
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('user', 'email'); 
    }

}
