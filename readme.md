# Cohort Discovery Service Quickly

Publishes release images for the [HDRUK Cohort Discovery Service](https://github.com/HDRUK/cohort-discovery-service-api).

Runs Cohort Discovery Service components:

- API
- Next.js UI
- NLP API
- MySQL
- Redis

And a data node:

- OMOP CDM Postgres
- OMOP-Lite (populates with synthetic data)
- Bunny Availability
- Bunny Distribution

## Build

CI (`.github/workflows/build.api.yml`) checks daily for a new upstream release of each source repo and, if found, builds and publishes a matching image to GHCR.

The UI build is pulled out into its own step (`frontend/`), patching the upstream build to work around [HDRUK/cohort-discovery-service-web#246](https://github.com/HDRUK/cohort-discovery-service-web/issues/246) and [#245](https://github.com/HDRUK/cohort-discovery-service-web/issues/245).

## Run

`cp example.env .env`

`docker compose up`

`REBUILD_DB=0` (see docker-compose.yml) means the API only runs plain
migrations on start, not a full reset - so the two seed commands below are
one-time, run once against a fresh `./db/data`, and your data (demo state,
OMOP vocab, anything you create) survives future `docker compose up`/restarts.

Seed the demo user, demo collection and Bunny host credentials:

```bash
docker compose exec api php artisan db:seed --class DevDatabaseSeeder
```

Seed the minimal OMOP concept vocabulary the API and NLP use to resolve
search terms - this is just the public OHDSI terminology, not patient data,
and is separate from the Bunny/`omop-db` CDM instance:

```bash
docker compose exec api php artisan migrate --database omop --path database/migrations_omop
docker compose exec api php artisan db:seed --class MinimalOmopSeeder --database omop
```

## Use

Login:
```bash
demouser: "demo.user@domain.com"
demopass: "d3m0User_!"
```

Use the `COVID-19 Antibody CKD Dataset` to test queries.

