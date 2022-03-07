import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCreatedAtAndUpdatedAtFields1621449178124
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("SET SQL_MODE='ALLOW_INVALID_DATES';");

    // users
    await queryRunner.query(
      'ALTER TABLE `users` MODIFY COLUMN `created_at` datetime NULL;',
    );
    await queryRunner.query(
      'ALTER TABLE `users` MODIFY COLUMN `updated_at` datetime NULL;',
    );
    await queryRunner.query(
      'ALTER TABLE `users` ALTER `created_at` SET DEFAULT null;',
    );
    await queryRunner.query(
      'ALTER TABLE `users` ALTER `updated_at` SET DEFAULT null;',
    );

    // roles
    await queryRunner.query(
      'ALTER TABLE `roles` MODIFY COLUMN `created_at` datetime NULL;',
    );
    await queryRunner.query(
      'ALTER TABLE `roles` MODIFY COLUMN `updated_at` datetime NULL;',
    );
    await queryRunner.query(
      'ALTER TABLE `roles` ALTER `created_at` SET DEFAULT null;',
    );
    await queryRunner.query(
      'ALTER TABLE `roles` ALTER `updated_at` SET DEFAULT null;',
    );

    // activities
    await queryRunner.query(
      'ALTER TABLE `activities` MODIFY COLUMN `created_at` datetime NULL;',
    );
    await queryRunner.query(
      'ALTER TABLE `activities` MODIFY COLUMN `updated_at` datetime NULL;',
    );
    await queryRunner.query(
      'ALTER TABLE `activities` ALTER `created_at` SET DEFAULT null;',
    );
    await queryRunner.query(
      'ALTER TABLE `activities` ALTER `updated_at` SET DEFAULT null;',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
