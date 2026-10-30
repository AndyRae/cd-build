# Cohort Discovery Service Quickly

Publishes release images for the [HDRUK Cohort Discovery Service](https://github.com/HDRUK/cohort-discovery-service-api).

Runs Cohort Discovery Service components:

- API
- Next.js UI
- NLP API
- MySQL
- Redis
- Keycloak (OIDC single sign-on, realm auto-imported)

And a data node:

- OMOP CDM Postgres
- OMOP-Lite (populates with synthetic data)
- Bunny Availability
- Bunny Distribution

## Build

CI (`.github/workflows/build.api.yml`) checks daily for a new upstream release of each source repo and, if found, builds and publishes a matching image to GHCR.

The UI build is pulled out into its own step (`frontend/`), patching the upstream build to work around [HDRUK/cohort-discovery-service-web#246](https://github.com/HDRUK/cohort-discovery-service-web/issues/246) and [#245](https://github.com/HDRUK/cohort-discovery-service-web/issues/245).

To build an upstream branch instead of the latest release (OIDC/SSO is only on
upstream `dev` so far), run the workflow manually with a `ref`. The images are
tagged with the ref name (`:dev`) and `:latest` is left alone:

```bash
gh workflow run build.api.yml -f ref=dev
```

## Run

```bash
cp example.env .env
docker compose up
```

That's it. On a fresh `./db/data`, the one-shot `seed` service seeds the demo
users, demo collection and Bunny host credentials (`DevDatabaseSeeder`) plus
the minimal OMOP concept vocabulary the API and NLP use to resolve search
terms (`MinimalOmopSeeder`: public OHDSI terminology, not patient data, and
separate from the Bunny/`omop-db` CDM instance). The Bunnies wait for it.
Each step is skipped when its data is already there, so later `up`s don't
touch your data. `REBUILD_DB=0` means the API itself only runs plain
migrations on start.

Delete `./db/data` and `./redis/data` to start from a clean state. Keycloak
keeps no state outside its container: its realm is re-imported from
`./keycloak/cohort-discovery-realm.json` whenever the container is recreated.

## Use

UI: http://localhost:3000. Sign in with **Keycloak** or with email/password.
All accounts use the password `d3m0User_!`:

| Account | Keycloak | Email/password | What you get |
|---|---|---|---|
| `demo.user@domain.com` | ✓ | ✓ | Admin, custodian of the demo collection |
| `demo.researcher@domain.com` | ✓ | ✓ | Researcher (`UK-RESEARCH` workgroup) |
| `new.user@domain.com` | ✓ | | Created on first SSO login (`DEFAULT` workgroup, `user` role) |

Keycloak logins link to the seeded account with the same (verified) email.
Keycloak admin console: http://localhost:8180/admin (`admin` / `admin`).

Use the `COVID-19 Antibody CKD Dataset` to test queries.

### How the SSO wiring works

The API refuses an OIDC provider whose discovered endpoints aren't on the
issuer's origin, so the browser and the API container must both reach
Keycloak at `http://localhost:8180`. The UI similarly hands `API_BASE_URL` to
the browser (SSO button, logout), so it must be `http://localhost:8080`.
Two tiny `socat` containers, `api-net` and `ui-net`, own the `api` and `ui`
network namespaces (pod-style: they publish the ports, `api` joins
`api-net`) and forward the localhost port to the real service. `api` and `ui`
can be restarted or recreated on their own. If you restart `api-net` or
`ui-net`, restart the service that joins it too.
