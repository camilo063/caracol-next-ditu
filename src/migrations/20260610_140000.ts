import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TYPE "public"."enum_footer_caracol_next_tone" ADD VALUE 'minimal' BEFORE 'dark';
    EXCEPTION WHEN others THEN NULL; END $$;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // PostgreSQL does not support dropping individual enum values.
}
