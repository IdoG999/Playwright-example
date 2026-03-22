# Jenkins on Docker

## Quick Start

```bash
cd jenkins
docker compose up -d
```

Jenkins will be available at **http://localhost:8080**.

## First-Time Setup

1. Get the initial admin password:
   ```bash
   docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
   ```

2. Complete the setup wizard and install suggested plugins.

3. Install **Docker Pipeline** and **HTML Publisher** plugins:
   - Manage Jenkins > Manage Plugins > Available
   - Search for "Docker Pipeline" and "HTML Publisher", install both

4. Create a pipeline job pointing to this repo. See [GITHUB_AND_PIPELINE_SETUP.md](GITHUB_AND_PIPELINE_SETUP.md) for step-by-step instructions.

## Stop Jenkins

```bash
cd jenkins
docker compose down
```

Data persists in the `jenkins_home` volume. Use `docker compose down -v` to remove the volume and start fresh.
