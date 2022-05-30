import {MigrationInterface, QueryRunner} from "typeorm";

export class GroupVersionVersionNullable1653903195683 implements MigrationInterface {
    name = 'GroupVersionVersionNullable1653903195683'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."group_version" ALTER COLUMN "version" drop not null`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."group_version" ALTER COLUMN "version" set not null`);
    }

}
