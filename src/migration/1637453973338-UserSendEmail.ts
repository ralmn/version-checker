import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class UserSendEmail1637453973338 implements MigrationInterface {
    name = 'UserSendEmail1637453973338'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('user', new TableColumn({
            name: "email_weekly",
            type: "boolean",
            default: false,
            isNullable: false
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.dropColumn('user', 'email_weekly');
    }

}
