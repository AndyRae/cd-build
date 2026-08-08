# Cohort Discovery Service Quickly

Publishes release images for the [HDRUK Cohort Discovery Service](https://github.com/HDRUK/cohort-discovery-service-api).

Runs Cohort Discovery Service components:

- API
- Next.js UI
- NLP API
- MySQL
- Redis

And Bunny:

- OMOP DB
- OMOP-Lite
- Bunny Availability
- Bunny Distribution

## Run

`mv example.env .env`

`docker compose up`

On first run (or after any migration reset), seed the minimal OMOP concept
vocabulary the API and NLP use to resolve search terms - this is just the
public OHDSI terminology, not patient data, and is separate from the
Bunny/`omop-db` CDM instance:

```bash
docker compose exec api php artisan migrate --database omop --path database/migrations_omop
docker compose exec api php artisan db:seed --class MinimalOmopSeeder --database omop
```

## Use

```bash
demouser: "demo.user@domain.com"
demopass: "d3m0User_!"
```

Use the `COVID-19 Antibody CKD Dataset` to test queries.
