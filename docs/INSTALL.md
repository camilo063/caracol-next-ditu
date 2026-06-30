# Guía de instalación — Caracol Next + Ditu Mediakit

Instrucciones para levantar el proyecto desde cero en un servidor nuevo o
máquina de desarrollo. Seguir el orden exacto — cada paso depende del anterior.

---

## Prerequisitos del sistema

### Node.js

Versión mínima: **20.6.0** (requerida por `--env-file` y `--import` hooks).  
Versión recomendada: cualquier LTS >= 20.18.0 o >= 22.12.0.

```bash
# Con nvm (recomendado)
nvm install 22
nvm use 22
node --version   # debe mostrar v22.x.x

# Alternativa: instalar desde https://nodejs.org/
```

> **Por qué >= 20.6:** el script de seed usa `node --env-file` (introducido en
> Node 20.6) y `node --import tsx` (introducido en Node 20.6 para ESM hooks).
> Con Node < 20.6 el seed falla silenciosamente.

### pnpm

```bash
npm install -g pnpm@latest
pnpm --version   # debe mostrar 10.x
```

### Docker Desktop

Requerido para la base de datos local. Descargar de https://www.docker.com/products/docker-desktop.

### Neon CLI (solo para operaciones de staging/prod)

```bash
npm install -g neon
neon auth   # autenticar con la cuenta del proyecto
```

---

## Pasos de instalación

### 1. Clonar el repositorio

```bash
git clone <repo-url> caracol-next-ditu
cd caracol-next-ditu
```

### 2. Instalar dependencias

```bash
pnpm install
```

Esto instala todas las dependencias incluyendo `tsx` (en devDependencies),
que es el runtime TypeScript usado por el seed.

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Editar `.env` con los valores reales. Variables requeridas para arrancar:

| Variable                    | Descripción                                                     | Ejemplo                 |
| --------------------------- | --------------------------------------------------------------- | ----------------------- |
| `PAYLOAD_SECRET`            | Secret para firmar tokens de auth. Mínimo 32 chars.             | `openssl rand -hex 32`  |
| `DATABASE_URI`              | Connection string de PostgreSQL                                 | Ver paso 4              |
| `NEXT_PUBLIC_SITE_URL`      | URL pública del frontend (sin slash final)                      | `http://localhost:3000` |
| `PAYLOAD_PUBLIC_SERVER_URL` | URL del servidor Payload (en monolito = `NEXT_PUBLIC_SITE_URL`) | `http://localhost:3000` |

Variables opcionales (dejar vacías hasta que las integraciones estén activas):

| Variable                | Integración                                  |
| ----------------------- | -------------------------------------------- |
| `RESEND_API_KEY`        | Formulario de contacto (Resend)              |
| `RESEND_FROM_EMAIL`     | Email verificado en Resend                   |
| `AI_GATEWAY_API_KEY`    | Vercel AI Gateway (bloque de IA)             |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob (storage de media en producción) |
| `AUDIENCE_API_URL`      | API de audiencia (TBD con cliente)           |
| `NETWORKS_API_URL`      | API de redes sociales (TBD con cliente)      |

### 4. Levantar PostgreSQL con Docker

El proyecto **no incluye `docker-compose.yml`**. Arrancar el contenedor directamente:

```bash
docker run -d \
  --name caracol-pg \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=caracol_next_ditu \
  -p 5432:5432 \
  postgres:16
```

Agregar en `.env`:

```
DATABASE_URI=postgresql://postgres:postgres@127.0.0.1:5432/caracol_next_ditu
```

Verificar que el contenedor esté corriendo:

```bash
docker ps | grep caracol-pg
```

> **Sesiones siguientes:** el contenedor se detiene cuando Docker Desktop se
> cierra. Antes de cada sesión de desarrollo: `docker start caracol-pg`.

### 5. Aplicar migraciones

> **CRÍTICO: las migraciones NO corren automáticamente en el build ni en el
> arranque. Hay que correrlas a mano antes del primer arranque y antes de
> cualquier deploy que incluya cambios de schema.**

```bash
echo "y" | pnpm payload migrate
```

En una base de datos nueva y limpia deben correr las **10 migraciones** sin
errores. El output esperado es:

```
Migrating: 20260601_000530
Migrated:  20260601_000530
...
Migrating: 20260611_ditu_hero_cms_fields
Migrated:  20260611_ditu_hero_cms_fields
Done.
```

Si alguna migración falla, el error aparece aquí — no arrancar la app hasta
que todas pasen.

### 6. Seed de contenido (opcional, recomendado en dev)

Carga el contenido por defecto para ambas landings (Caracol Next y Ditu) con
todos los bloques, imágenes y configuración de header/footer.

```bash
pnpm seed
```

El seed hace `upsert` — es seguro correrlo múltiples veces. Requiere que las
migraciones (paso 5) ya estén aplicadas.

### 7. Servidor de desarrollo

```bash
pnpm dev
```

| URL                         | Descripción          |
| --------------------------- | -------------------- |
| http://localhost:3000       | Landing Caracol Next |
| http://localhost:3000/ditu  | Landing Ditu         |
| http://localhost:3000/admin | Admin Payload        |

La **primera vez** que se abre `/admin`, Payload pide crear el usuario
administrador inicial. Usar un email y contraseña seguros.

---

## Build de producción

```bash
pnpm build    # genera el build optimizado
pnpm start    # sirve el build
```

El comando `build` ejecuta `payload generate:importmap && next build`.  
**No incluye `migrate`** — ver sección siguiente.

---

## Deploy a producción

### Orden obligatorio

```
1. pnpm payload migrate   ← contra la DB de producción ANTES del deploy
2. git push / vercel deploy
3. (Vercel ejecuta automáticamente) pnpm build
4. Arranque de la app
```

Si se saltea el paso 1 y hay migraciones pendientes, la app arranca pero puede
fallar en operaciones de escritura (publish de páginas, edición de globals).

### Migrate contra producción (Neon)

```bash
# Obtener la URI de prod desde Vercel env vars o Neon dashboard
export DATABASE_URI="postgresql://neondb_owner:<pass>@<host>/neondb?sslmode=require"
echo "y" | pnpm payload migrate
```

### Staging seguro antes de tocar prod

Crear una branch de Neon desde production para validar:

```bash
# IDs del proyecto
# Proyecto Neon: flat-rice-42779922
# Branch producción: br-sweet-smoke-aqmhmaxf

neon branches create \
  --project-id flat-rice-42779922 \
  --parent br-sweet-smoke-aqmhmaxf \
  --name staging-<nombre>

# Migrate contra la branch de staging
export DATABASE_URI="<uri-de-la-branch>"
echo "y" | pnpm payload migrate

# Si pasa sin errores → merge → migrate prod → deploy
```

---

## Agregar nuevas migraciones

Cuando se cambia el schema (un `config.ts` de Block, Collection o Global):

```bash
# 1. Crear el archivo de migración en src/migrations/
#    (escribir manualmente — payload migrate:create es interactivo y no
#    funciona bien en CI)

# 2. Registrar en src/migrations/index.ts

# 3. Aplicar localmente
echo "y" | pnpm payload migrate

# 4. Regenerar tipos
pnpm generate:types

# 5. Verificar type-check
pnpm type-check
```

---

## Solución de problemas frecuentes

### El dev server no conecta a la DB

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

El contenedor Docker no está corriendo:

```bash
docker start caracol-pg
```

### Caché de Next.js rota

```bash
pnpm devsafe   # equivale a: rm -rf .next && pnpm dev
```

### Error de hidratación en el admin

Causado por extensiones del navegador (ej. Grammarly) que inyectan atributos
en `<body>`. No es un bug del código — deshabilitar la extensión para el
dominio `localhost` o ignorar el warning.

### El seed falla con "Cannot find module"

Verificar que tsx esté instalado:

```bash
pnpm list tsx   # debe mostrar tsx 4.x.x
```

Si no aparece: `pnpm install` para sincronizar con el lockfile.

### Migración falla con "column already exists"

Las migraciones usan `ADD COLUMN IF NOT EXISTS` y guardas idempotentes — si
falla con "already exists" es porque hubo un cambio manual en la DB que no
pasó por una migración. Resolver manualmente o recrear la DB.

---

## Resumen rápido (cheatsheet)

```bash
# Setup inicial en máquina nueva
git clone <url> && cd caracol-next-ditu
pnpm install
cp .env.example .env   # → editar con PAYLOAD_SECRET y DATABASE_URI
docker run -d --name caracol-pg -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=caracol_next_ditu \
  -p 5432:5432 postgres:16
echo "y" | pnpm payload migrate
pnpm seed              # opcional
pnpm dev

# Cada sesión siguiente
docker start caracol-pg
pnpm dev

# Antes de un deploy con cambios de schema
export DATABASE_URI="<prod-uri>"
echo "y" | pnpm payload migrate
```
