import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class UserAlternativeEmail1637454408703 implements MigrationInterface {
    name = 'UserAlternativeEmail1637454408703'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('user', new TableColumn({
            name: "alternativeEmail",
            type: "varchar",
            isNullable: true
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.dropColumn('user', 'alternativeEmail');
    }

}
