# Jenkins build artifacts (Playwright report)

After each Jenkins pipeline run, outputs are copied here:

- `playwright-report/` — full HTML report (same as `playwright-report/` at repo root after tests)
- `junit.xml` / `results.json` — when `CI=true`, Playwright also writes these under `test-results/`; Jenkins copies them here for archiving and optional Git push
- `BUILD_INFO.txt` — Jenkins build number, URL, **Result** (SUCCESS / FAILURE / …), UTC timestamp

## Why this folder exists

- Keeps a **known path** under the repo so you can find outputs in the Jenkins workspace.
- Lets you **download** the folder from Jenkins (**Build** → **Artifacts**) if `archiveArtifacts` is enabled in the Jenkinsfile.
- Lets you **commit to GitHub** only when you want a snapshot (see below).

## Git and GitHub

Generated HTML is **ignored by Git** by default (see root `.gitignore`) so the repo stays small.

To **publish a report snapshot** to GitHub:

1. Run the pipeline (or copy files locally from Jenkins).
2. Optionally remove `jenkins/build-artifacts/playwright-report/` from `.gitignore` for that commit, or use:
   ```bash
   git add -f jenkins/build-artifacts/playwright-report/
   git add jenkins/build-artifacts/BUILD_INFO.txt
   git commit -m "chore: archive Playwright report from build N"
   git push
   ```

**GitHub:** With credential **`github-playwright-push`** and **`PUSH_REPORT_TO_GIT`** (default on), Jenkins pushes this folder to branch **`ci/playwright-report`** after every build. Prefer Jenkins **Artifacts** / **Playwright Report** for interactive review; use the GitHub branch for a shared, durable link to the latest run.
