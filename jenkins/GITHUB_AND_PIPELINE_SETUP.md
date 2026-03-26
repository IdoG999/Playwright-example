# Jenkins: Connect GitHub and Create Pipeline (Step-by-Step)

---

## Part 1: Connect GitHub to Jenkins

"Connecting GitHub to Jenkins" means Jenkins can:
- Read your repositories and check out code
- Optionally create webhooks so builds run automatically when you push

You do this in three steps: install the plugin, add your GitHub token, and register the GitHub server.

---

### Before You Start

**1. Jenkins must be running.** Open http://localhost:8080 in your browser. If Jenkins is in Docker:

```bash
cd /Users/idogalon/Playwright-example/jenkins
docker compose up -d
```

**2. Create a GitHub Personal Access Token:**

1. Go to https://github.com/settings/tokens
2. Click **Generate new token** > **Generate new token (classic)**
3. Give it a name (e.g. `Jenkins`)
4. Set an expiration (e.g. 90 days)
5. Under **Select scopes**, check:
   - **repo** (full control of private repositories)
   - **admin:repo_hook** (manage repository hooks)
6. Click **Generate token**
7. Copy the token and save it somewhere safe. You will paste it into Jenkins.

---

### Step 1.1: Install the GitHub Plugin

This plugin lets Jenkins talk to GitHub (checkout code, manage webhooks).

1. In the Jenkins left sidebar, click **Manage Jenkins**
2. On the Manage Jenkins page, click **Manage Plugins**
3. At the top, you will see tabs: **Available** | **Installed** | **Updates**. Click **Available**
4. In the filter/search box, type: `GitHub`
5. In the list, find the row for **GitHub** (or **GitHub Plugin**)
6. Check the box on the left of that row
7. At the bottom, click **Install without restart** (or **Download now and install after restart**)
8. Wait for the progress bar. When it says "Success" or "No errors", you are done. Restart Jenkins if the page asks you to.

---

### Step 1.2: Add Your GitHub Token as a Credential

Jenkins needs your token to call GitHub’s API. You store it as a credential.

1. In the left sidebar, click **Manage Jenkins**
2. Click **Credentials**
3. You will see **Stores scoped to Jenkins**. Under it, click **System**
4. Under **Domain: (global)**, click **Global credentials (unrestricted)**
5. On the left, click **Add Credentials**
6. Fill in the form:
   - **Kind**: Choose **Secret text** from the dropdown
   - **Secret**: Paste your GitHub Personal Access Token (the one you created earlier)
   - **ID**: Type `github-token` (this is how you will recognize it later)
   - **Description**: Type `GitHub PAT for IdoG999` (optional but helpful)
7. Click **Create**

You should see your credential in the list. Jenkins will use it when talking to GitHub.

---

### Step 1.3: Add the GitHub Server

Tell Jenkins where GitHub is and which credential to use.

1. In the left sidebar, click **Manage Jenkins**
2. Click **Configure System**
3. Scroll down until you see a section named **GitHub**
4. Click **Add GitHub Server**
5. A form appears. Fill it in:
   - **Name**: Leave as `GitHub` or type a name you like
   - **API URL**: Leave as `https://api.github.com`
   - **Credentials**: Open the dropdown and select the credential you added (e.g. `github-token`)
6. Click **Advanced** (under the Credentials field) to expand more options
7. Check the box **Manage hooks**
   - This lets Jenkins add a webhook to your repo so builds can run when you push (useful if Jenkins is reachable from the internet)
8. Click **Apply** at the bottom
9. Click **Save**

GitHub is now connected to Jenkins. You can proceed to create the Pipeline job (Part 2).

---

## Part 2: Create the Pipeline Job

### Step 2.1: Create a New Pipeline

1. On the Jenkins home page, click **New Item**
2. Enter a name: `Playwright-example` (or any name you prefer)
3. Select **Pipeline**
4. Click **OK**

### Step 2.2: General Settings

1. Under **General**, check **GitHub project**
2. In **Project url**, enter: `https://github.com/IdoG999/Playwright-example`
3. Optionally add a description, e.g. `Playwright E2E tests for IdoG999/Playwright-example`

### Step 2.3: Pipeline Definition (Use Jenkinsfile from Repo)

1. Scroll to **Pipeline**
2. Under **Definition**, select **Pipeline script from SCM**
3. Under **SCM**, select **Git**
4. Configure the Git repository:
   - **Repository URL**: `https://github.com/IdoG999/Playwright-example.git`
   - **Credentials**: If the repo is public, leave empty. If private, add credentials (Username+password with PAT, or SSH key)
   - **Branch**: `*/main` (this repo uses `main` as default branch; do **not** use `*/master`)
5. Leave **Script Path** as `Jenkinsfile` (the repo must have a Jenkinsfile at the root)
6. Click **Apply** then **Save**

### Step 2.4: Enable GitHub Webhook Trigger (Optional but Recommended)

1. Open your pipeline job > **Configure**
2. Under **Build Triggers**, check **GitHub hook trigger for GITScm polling**
3. Click **Save**

This allows Jenkins to run builds automatically when you push to GitHub. For Jenkins running on localhost, you must either:
- Use a tunnel like [ngrok](https://ngrok.com) so GitHub can reach your Jenkins, or
- Trigger builds manually with **Build Now**

### Step 2.5: Run the Pipeline

1. Open the pipeline job
2. Click **Build Now**
3. The first build will check out the repo and run `npm ci` and `npx playwright test` inside a Playwright Docker container
4. View the **Playwright Report** from the build (after **HTML Publisher** plugin is installed)

---

---

## Troubleshooting

### Webhook failed to register: "failed to be registered or was removed"

Jenkins runs on localhost, so GitHub cannot reach it to deliver webhook events. Jenkins shows this warning when it cannot manage webhooks for the repo.

**Fix (silence the warning):** Add the repo to the ignore list so Jenkins stops trying to manage its webhook.

1. Go to **Manage Jenkins** > **Configure System**
2. Scroll to the **GitHub** section
3. Click your **GitHub Server** entry to expand it
4. Click **Advanced**
5. Find **Additional actions** > **Add to hooks ignore list**
6. In the input, enter: `IdoG999/Playwright-example`
7. Click **Apply** then **Save**

The warning will disappear. You can still trigger builds manually with **Build Now**.

---

### Build fails: "couldn't find remote ref refs/heads/master"

Your repo uses `main` as the default branch, but the pipeline is configured for `master`.

**Fix:** Open the pipeline job > **Configure** > scroll to **Pipeline** > under **Branch Specifier** change `*/master` to `*/main` > **Save**. Run **Build Now** again.

---

### Build fails: "Unable to find Jenkinsfile from git"

The Jenkinsfile was not in the repo when Jenkins checked out the code.

**Fix:** Ensure the Jenkinsfile is committed and pushed to the root of your repo on the `main` branch. Then run **Build Now** again.

---

### Build fails: publishHTML "Missing required parameter: keepAll"

Newer versions of the HTML Publisher plugin require `keepAll`, `alwaysLinkToLastBuild`, and `allowMissing`.

**Fix:** The Jenkinsfile in this repo already includes these parameters. If you maintain your own Jenkinsfile, add them to the publishHTML block.

---

## Push Jenkins build results to GitHub

By default the Jenkinsfile pushes **`jenkins/build-artifacts/`** to branch **`ci/playwright-report`** after **every** build (success or failure), so the latest Playwright HTML report and CI summaries are always on GitHub.

What gets pushed:

- `playwright-report/` — HTML report (when tests produced it)
- `junit.xml` and `results.json` — CI-only machine-readable summaries (from `playwright.config.ts` when `CI=true`)
- `BUILD_INFO.txt` — build number, Jenkins URL, **Result** (SUCCESS / FAILURE / etc.), UTC time

### 1. Create a Jenkins credential (do not put passwords in the repo)

1. **Manage Jenkins** → **Credentials** → add **Username with password**.
2. **Username**: your GitHub username (e.g. `ido`).
3. **Password**: a **GitHub Personal Access Token (classic)** with `repo` scope — not your GitHub account password.  
   Create one: GitHub → **Settings** → **Developer settings** → **Personal access tokens**.
4. **ID**: must be exactly **`github-playwright-push`** (matches the Jenkinsfile).

Your **Jenkins login password** is separate; it is not stored in Git and is not used for `git push`.

### 2. Parameter `PUSH_REPORT_TO_GIT`

Default is **off** so builds succeed before you add **`github-playwright-push`**. After the credential exists, use **Build with Parameters** and enable **`PUSH_REPORT_TO_GIT`** (or change the default in the job if you always want pushes).

If push is **on** but the credential is still missing, the pipeline logs a **WARNING** and skips the push instead of failing.

The pipeline uses **`git push --force`** to that branch so each run replaces the previous snapshot. Review on GitHub under branch **`ci/playwright-report`** (open `jenkins/build-artifacts/playwright-report/index.html` in the tree or raw view as needed).

---

## Build artifacts folder (`jenkins/build-artifacts/`)

After each run, the pipeline copies the Playwright HTML report into `jenkins/build-artifacts/playwright-report/` and writes `BUILD_INFO.txt` (build number, URL, time). Jenkins also **archives** that folder so you can download it from the build page under **Artifacts**.

The HTML output is **gitignored** by default so the repo does not grow. To commit a snapshot to GitHub, see [build-artifacts/README.md](build-artifacts/README.md).

---

## Summary Checklist

**Connect GitHub:**
- [ ] Install GitHub plugin
- [ ] Add PAT as Secret text credential
- [ ] Add GitHub Server with API URL and credentials, enable Manage hooks

**Create Pipeline:**
- [ ] New Item > Pipeline
- [ ] GitHub project URL
- [ ] Pipeline from SCM > Git > repo URL, branch */main
- [ ] Script Path: Jenkinsfile
- [ ] Optional: GitHub hook trigger
- [ ] Build Now
