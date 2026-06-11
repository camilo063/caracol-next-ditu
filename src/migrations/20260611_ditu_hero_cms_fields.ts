import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_ditu_hero"
      ADD COLUMN IF NOT EXISTS "heading_line1"   varchar DEFAULT 'en todas las',
      ADD COLUMN IF NOT EXISTS "heading_line2"   varchar DEFAULT 'pantallas,',
      ADD COLUMN IF NOT EXISTS "heading_accent"  varchar DEFAULT 'en todo momento',
      ADD COLUMN IF NOT EXISTS "description"     varchar DEFAULT 'Somos ditu la plataforma OTT que integra lo mejor de Caracol Televisión en un ecosistema multiplataforma, desde la pantalla grande hasta el smartphone. Ofrecemos una experiencia gratuita de fácil acceso que se convierte en la vitrina estratégica ideal para que tu marca conecte con una audiencia masiva, fiel y comprometida.';

    ALTER TABLE "_pages_v_blocks_ditu_hero"
      ADD COLUMN IF NOT EXISTS "heading_line1"   varchar DEFAULT 'en todas las',
      ADD COLUMN IF NOT EXISTS "heading_line2"   varchar DEFAULT 'pantallas,',
      ADD COLUMN IF NOT EXISTS "heading_accent"  varchar DEFAULT 'en todo momento',
      ADD COLUMN IF NOT EXISTS "description"     varchar DEFAULT 'Somos ditu la plataforma OTT que integra lo mejor de Caracol Televisión en un ecosistema multiplataforma, desde la pantalla grande hasta el smartphone. Ofrecemos una experiencia gratuita de fácil acceso que se convierte en la vitrina estratégica ideal para que tu marca conecte con una audiencia masiva, fiel y comprometida.';
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "_pages_v_blocks_ditu_hero"
      DROP COLUMN IF EXISTS "description",
      DROP COLUMN IF EXISTS "heading_accent",
      DROP COLUMN IF EXISTS "heading_line2",
      DROP COLUMN IF EXISTS "heading_line1";

    ALTER TABLE "pages_blocks_ditu_hero"
      DROP COLUMN IF EXISTS "description",
      DROP COLUMN IF EXISTS "heading_accent",
      DROP COLUMN IF EXISTS "heading_line2",
      DROP COLUMN IF EXISTS "heading_line1";
  `);
}
