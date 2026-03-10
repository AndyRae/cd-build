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

## Use

```bash
demouser: "demo.user@domain.com"
demopass: "d3m0User_!"
```

Use the `COVID-19 Antibody CKD Dataset` to test queries.

NLP doesn't work yet, workinonit.
