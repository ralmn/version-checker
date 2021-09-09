import {MigrationInterface, QueryRunner} from "typeorm";

export class Group1631187107948 implements MigrationInterface {
    name = 'Group1631187107948'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "group" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "group_member" ("role" integer NOT NULL, "groupId" integer NOT NULL, "userId" integer NOT NULL, PRIMARY KEY ("groupId", "userId"))`);
        await queryRunner.query(`CREATE TABLE "group_version" ("version" varchar NOT NULL, "groupId" integer NOT NULL, "softwareName" varchar NOT NULL, PRIMARY KEY ("groupId", "softwareName"))`);
        await queryRunner.query(`CREATE TABLE "temporary_group_member" ("role" integer NOT NULL, "groupId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "FK_44c8964c097cf7f71434d6d1122" FOREIGN KEY ("groupId") REFERENCES "group" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_9f209c217eef89b8c32bd077903" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("groupId", "userId"))`);
        await queryRunner.query(`INSERT INTO "temporary_group_member"("role", "groupId", "userId") SELECT "role", "groupId", "userId" FROM "group_member"`);
        await queryRunner.query(`DROP TABLE "group_member"`);
        await queryRunner.query(`ALTER TABLE "temporary_group_member" RENAME TO "group_member"`);
        await queryRunner.query(`CREATE TABLE "temporary_group_version" ("version" varchar NOT NULL, "groupId" integer NOT NULL, "softwareName" varchar NOT NULL, CONSTRAINT "FK_7f3b519d3af02f2451500117d68" FOREIGN KEY ("groupId") REFERENCES "group" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_7c0812f9bdf4f4c94c1a786904b" FOREIGN KEY ("softwareName") REFERENCES "software" ("name") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("groupId", "softwareName"))`);
        await queryRunner.query(`INSERT INTO "temporary_group_version"("version", "groupId", "softwareName") SELECT "version", "groupId", "softwareName" FROM "group_version"`);
        await queryRunner.query(`DROP TABLE "group_version"`);
        await queryRunner.query(`ALTER TABLE "temporary_group_version" RENAME TO "group_version"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group_version" RENAME TO "temporary_group_version"`);
        await queryRunner.query(`CREATE TABLE "group_version" ("version" varchar NOT NULL, "groupId" integer NOT NULL, "softwareName" varchar NOT NULL, PRIMARY KEY ("groupId", "softwareName"))`);
        await queryRunner.query(`INSERT INTO "group_version"("version", "groupId", "softwareName") SELECT "version", "groupId", "softwareName" FROM "temporary_group_version"`);
        await queryRunner.query(`DROP TABLE "temporary_group_version"`);
        await queryRunner.query(`ALTER TABLE "group_member" RENAME TO "temporary_group_member"`);
        await queryRunner.query(`CREATE TABLE "group_member" ("role" integer NOT NULL, "groupId" integer NOT NULL, "userId" integer NOT NULL, PRIMARY KEY ("groupId", "userId"))`);
        await queryRunner.query(`INSERT INTO "group_member"("role", "groupId", "userId") SELECT "role", "groupId", "userId" FROM "temporary_group_member"`);
        await queryRunner.query(`DROP TABLE "temporary_group_member"`);
        await queryRunner.query(`DROP TABLE "group_version"`);
        await queryRunner.query(`DROP TABLE "group_member"`);
        await queryRunner.query(`DROP TABLE "group"`);
    }

}
