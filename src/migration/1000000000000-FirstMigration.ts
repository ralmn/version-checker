import {MigrationInterface, QueryRunner} from "typeorm";

export class FirstMigration1000000000000 implements MigrationInterface {
    name = 'FirstMigration1000000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "software" ("name" varchar PRIMARY KEY NOT NULL, "versions" text NOT NULL DEFAULT (''), "latestVersion" varchar, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime DEFAULT (datetime('now')), "file" varchar, "data" text, "repository" varchar, "useReleaseTag" boolean DEFAULT (1), "type" varchar NOT NULL)`);
        await queryRunner.query(`CREATE INDEX "IDX_d0c2a80b41a6d56b81a6ba802d" ON "software" ("type") `);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar NOT NULL, "password" varchar NOT NULL)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP INDEX "IDX_d0c2a80b41a6d56b81a6ba802d"`);
        await queryRunner.query(`DROP TABLE "software"`);
    }

}
