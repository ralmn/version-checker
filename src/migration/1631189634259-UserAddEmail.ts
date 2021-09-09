import {MigrationInterface, QueryRunner} from "typeorm";

export class UserAddEmail1631189634259 implements MigrationInterface {
    name = 'UserAddEmail1631189634259'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar NOT NULL, "password" varchar NOT NULL, "email" varchar NOT NULL, CONSTRAINT "UQ_ed766a9782779b8390a2a81f444" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "temporary_user"("id", "username", "password") SELECT "id", "username", "password" FROM "user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
        await queryRunner.query(`CREATE TABLE "temporary_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar NOT NULL, "password" varchar NOT NULL, "email" varchar NOT NULL, CONSTRAINT "UQ_ed766a9782779b8390a2a81f444" UNIQUE ("email"), CONSTRAINT "UQ_3021ae0235cf9c4a6d59663f859" UNIQUE ("username"))`);
        await queryRunner.query(`INSERT INTO "temporary_user"("id", "username", "password", "email") SELECT "id", "username", "password", "email" FROM "user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar NOT NULL, "password" varchar NOT NULL, "email" varchar NOT NULL, CONSTRAINT "UQ_ed766a9782779b8390a2a81f444" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "user"("id", "username", "password", "email") SELECT "id", "username", "password", "email" FROM "temporary_user"`);
        await queryRunner.query(`DROP TABLE "temporary_user"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar NOT NULL, "password" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "user"("id", "username", "password") SELECT "id", "username", "password" FROM "temporary_user"`);
        await queryRunner.query(`DROP TABLE "temporary_user"`);
    }

}
