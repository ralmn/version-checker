import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

export class VersionCreatedAt1632949534717 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const driver = queryRunner.connection.driver;
    await queryRunner.addColumn(
      "version",
      new TableColumn({
        name: "createdAt",
        type: driver.mappedDataTypes.createDate.toString(),
        default: driver.mappedDataTypes.createDateDefault,
        isNullable: false,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("version", "createdAt");
  }
}
