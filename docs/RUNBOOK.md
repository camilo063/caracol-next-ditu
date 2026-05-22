# Runbook — Caracol Next + Ditu

Operaciones críticas del sistema. Mantener actualizado tras cada incidente o cambio de infra.

## Stack

| Componente | Detalle                                                                   |
| ---------- | ------------------------------------------------------------------------- |
| Framework  | Next.js 15.5.18 (App Router)                                              |
| CMS        | Payload 3.34.0 (monolito Next: admin en `/admin`, frontend en `/`)        |
| DB         | Postgres (Neon en prod actual; AWS RDS opcional si el cliente migra)      |
| Storage    | Vercel Blob (env `BLOB_READ_WRITE_TOKEN`); filesystem local si no está    |
| Email      | Resend (env `RESEND_API_KEY`) — TODO Fase post-MVP, sin configurar aún    |
| Analytics  | Vercel Analytics + Speed Insights (no-op fuera de Vercel)                 |
| Deploy     | Vercel Git integration. Build: `payload generate:importmap && next build` |

## Env vars críticas

```
PAYLOAD_SECRET          # 32+ hex chars random. Firma de tokens auth.
DATABASE_URI            # Postgres pooler URL (Neon pooler endpoint).
NEXT_PUBLIC_SITE_URL    # Frontend público, sin trailing slash.
PAYLOAD_PUBLIC_SERVER_URL # Server de Payload, mismo dominio en monolito.

# Opcionales
BLOB_READ_WRITE_TOKEN   # Vercel Blob. Si no está, uploads van a filesystem.
RESEND_API_KEY          # Resend para emails transaccionales.
RESEND_FROM_EMAIL       # Dirección "from" de Resend.
SEED_ADMIN_EMAIL        # Default admin@caracoltv.com.co.
SEED_ADMIN_PASSWORD     # Default CaracolCMS2026!. Rotar tras seed.
SEED_ADMIN_NAME         # Default "Admin Caracol".
```

Sincronizar local: `vercel env pull .env.local` (requiere `vercel link`).

## Deploy

### Deploy normal

1. Push a `main` (o branch que esté configurada como production en Vercel).
2. Vercel detecta el push, corre `npm install` + `npm run build`.
3. Si build pasa, deploy automático.
4. Verificar `/`, `/caracol-next`, `/ditu`, `/admin` responden 200 (o 307 admin → create-first-user).
5. Spot-check Lighthouse en `/`.

### Deploy + seed (entorno nuevo)

Primera vez en un entorno (preview branch o prod recién provisionado):

1. Deploy normal.
2. Conectarse a la DB del entorno y verificar tablas vacías.
3. Localmente:
   ```bash
   vercel env pull .env.production.local
   NODE_ENV=production npm run seed
   ```
4. `/admin/create-first-user` ya no aparece — usar `admin@caracoltv.com.co` + `CaracolCMS2026!`.
5. Login y **cambiar el password** desde `/admin/account` inmediatamente.

**No correr seed en cada deploy** — sobreescribe data del editor.

### Rollback

Vercel: `vercel rollback <deployment-id>` o desde el dashboard. Tarda ~30 segundos.

Si el rollback requiere también rollback de DB schema (raro), usar el branching de Neon (ver "Restore DB" abajo).

## Restore DB

### Neon Postgres

Neon tiene **point-in-time recovery** hasta 7 días en plan free, más en plan paid.

1. Dashboard de Neon → proyecto → `Branches`.
2. Crear branch desde el momento histórico deseado.
3. Copiar la connection string de ese branch.
4. Actualizar `DATABASE_URI` en Vercel (env del environment afectado).
5. Redeploy. Verificar.
6. Una vez verificado, podés mergear el branch restaurado al main de Neon, o renombrarlo.

### Snapshot manual

Antes de cambios riesgosos:

```bash
pg_dump $DATABASE_URI -F c -f backup-$(date +%Y%m%d-%H%M).dump
```

Restore desde dump:

```bash
pg_restore --clean --if-exists -d $DATABASE_URI backup-XXX.dump
```

## Rotación de `PAYLOAD_SECRET`

Ver `docs/SECURITY.md` → sección "Rotación de PAYLOAD_SECRET". Procedimiento sin downtime.

## Maintenance mode

Toggle desde `/admin/site-settings/Mantenimiento`. Ver `docs/CLIENT-HANDOFF.md` → sección 3.

Si el admin está inaccesible y necesitás activar maintenance mode urgente:

```sql
UPDATE site_settings_maintenance_mode SET enabled = true WHERE id IN
  (SELECT _parent_id FROM site_settings_maintenance_mode LIMIT 1);
-- Próximo request al frontend muestra la página de mantenimiento en < 5s
-- (revalidatePath dispara automáticamente desde el afterChange hook si fue via admin,
--  pero acá lo cambiamos directo en DB — hay que esperar al ISR expire 1h o
--  redeployar para forzar refresh inmediato).
```

## Logs

- **Vercel runtime logs**: dashboard → `<project>` → Logs. Filtros por function, status, time.
- **Build logs**: dashboard → Deployments → click un deployment → Build Logs.
- **Payload application logs**: actualmente van a stdout de la function. Si necesitamos retención, considerar log drain a Datadog o similar.

## Debug deploy fallido

### Build error

1. Vercel → Deployments → deployment failed → Build Logs.
2. Buscar el primer error de `npm run build`.
3. Reproducir localmente: `npm install && npm run build`. Si pasa local pero falla Vercel, sospechar:
   - Env vars distintas (revisar `vercel env ls`).
   - Cache de Vercel corrupto (Settings → Build & Output → Clear Build Cache).
   - Node version mismatch (revisar `package.json.engines`).

### Runtime 500 en una ruta

1. Vercel Logs filtrar por `status: 500`.
2. Buscar la stack trace.
3. Si la causa es DB: ver "DB down" abajo.
4. Si la causa es un import roto: rollback al deployment anterior.

### DB down

Síntomas: `/admin` 500, las landings devuelven contenido viejo (cached) por algunos minutos, luego 500.

1. Neon dashboard → status del proyecto. Si el endpoint está "Idle" o "Suspended", reactivar.
2. Verificar `DATABASE_URI` en Vercel env (la pooler URL no debería cambiar).
3. Si el problema persiste: contactar soporte Neon.
4. Mitigación temporal: activar maintenance mode (ver arriba). Aunque las landings se sirvan estáticas, los `getPayload({ config })` en SSR fallan.

## Escalar Postgres

Si la DB se vuelve lenta o falla por carga:

### Neon

1. Dashboard → Settings → Compute. Aumentar tier (afecta CU + memoria).
2. Si las queries son lentas: revisar slow query log + agregar indices.
3. Para múltiples regiones: Neon Read Replicas (paid). Configurar como `DATABASE_URI_READ` y wrappear Payload Local API en read-only queries — non-trivial, dejar como deuda hasta que se necesite.

### Indices recomendados

Si Lighthouse/Speed Insights muestra TTFB alto en las landings:

```sql
-- Pages: lookup por (landing, slug) ya tiene index unique compound.
-- Media: lookup por filename para idempotencia del seed.
CREATE INDEX IF NOT EXISTS media_filename_idx ON media(filename);

-- Si form-submissions crece mucho:
CREATE INDEX IF NOT EXISTS form_submissions_created_at_idx ON form_submissions(created_at DESC);
```

## Procedure: agregar dominio custom

1. Vercel → Settings → Domains → Add. Pegar el dominio (ej. `mediakit.caracoltv.com.co`).
2. Configurar el CNAME/A record en el provider DNS según indique Vercel.
3. Esperar verificación (puede tomar 30 min).
4. Actualizar env vars en Vercel:
   - `NEXT_PUBLIC_SITE_URL=https://mediakit.caracoltv.com.co`
   - `PAYLOAD_PUBLIC_SERVER_URL=https://mediakit.caracoltv.com.co`
5. Actualizar `payload.config.ts` → agregar el nuevo dominio a `cors` + `csrf` arrays.
6. Redeploy.
7. Verificar HTTPS funciona (Vercel emite cert auto).
8. Submit a Google Search Console + Bing Webmaster Tools con el nuevo dominio.

## Migración a AWS (escenario futuro)

Si el cliente decide hostear en AWS en lugar de Vercel:

1. **Storage**: reemplazar `@payloadcms/storage-vercel-blob` por `@payloadcms/storage-s3`. Misma API, solo cambia el plugin + env vars (`S3_BUCKET`, `S3_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`).
2. **Deploy target**:
   - Opción A: AWS ECS Fargate con Docker. Build local: `docker build -t caracol-next .` (Dockerfile pendiente — crear con el template oficial de Next).
   - Opción B: AWS Amplify (similar a Vercel UX, soporta Next.js App Router).
   - Opción C: AWS App Runner.
3. **DB**: Neon sigue funcionando desde cualquier host; o migrar a AWS RDS Postgres (`pg_dump` + `pg_restore`).
4. **Analytics**: `@vercel/analytics` y `@vercel/speed-insights` son no-op fuera de Vercel — los datos no se reportan pero no rompen nada. Considerar Plausible o Umami como reemplazo.
5. **WAF**: Vercel WAF deja de aplicar. Configurar AWS WAF si se necesita rate limiting custom.
6. **Vercel ISR + revalidate**: en AWS, depende del target:
   - ECS/App Runner: `unstable_cache` funciona en memoria/region. `revalidatePath` funciona dentro del proceso pero NO se propaga entre instancias (en plataformas multi-instance, usar Vercel-style cache requiere shared cache layer como Redis).
   - Amplify: tiene su propio ISR equivalente.

**Recomendación**: no migrar a AWS hasta que el cliente justifique la complejidad. Vercel es lower-friction para Next + Payload.

## Contactos

- **Tech lead Nivelics**: Camilo Villanueva — `camilo.villanueva@nivelics.com`
- **Vercel project owner**: <pendiente>
- **Neon project owner**: <pendiente>
- **DNS provider del cliente**: <pendiente — completar al ir a custom domain>
