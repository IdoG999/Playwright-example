pipeline {
    agent any
    parameters {
        booleanParam(
            name: 'PUSH_REPORT_TO_GIT',
            defaultValue: true,
            description: 'Push Playwright report + CI summaries to GitHub branch ci/playwright-report (credential id: github-playwright-push)'
        )
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Test') {
            agent {
                docker {
                    image 'mcr.microsoft.com/playwright:v1.58.2-noble'
                    args '-u root'
                    reuseNode true
                }
            }
            environment {
                CI = 'true'
            }
            steps {
                sh 'npm ci'
                sh 'npm run test'
            }
        }
    }
    post {
        always {
            sh '''
                mkdir -p jenkins/build-artifacts
                rm -rf jenkins/build-artifacts/playwright-report
                if [ -d playwright-report ]; then
                  cp -R playwright-report jenkins/build-artifacts/playwright-report
                fi
                if [ -f test-results/junit.xml ]; then
                  cp test-results/junit.xml jenkins/build-artifacts/junit.xml
                else
                  rm -f jenkins/build-artifacts/junit.xml
                fi
                if [ -f test-results/results.json ]; then
                  cp test-results/results.json jenkins/build-artifacts/results.json
                else
                  rm -f jenkins/build-artifacts/results.json
                fi
            '''
            sh """
                echo "Build: #${env.BUILD_NUMBER}" > jenkins/build-artifacts/BUILD_INFO.txt
                echo "URL: ${env.BUILD_URL}" >> jenkins/build-artifacts/BUILD_INFO.txt
                echo "Result: ${currentBuild.result}" >> jenkins/build-artifacts/BUILD_INFO.txt
                date -u +"%Y-%m-%dT%H:%M:%SZ" >> jenkins/build-artifacts/BUILD_INFO.txt
            """
            publishHTML([
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Report',
                keepAll: true,
                alwaysLinkToLastBuild: true,
                allowMissing: true
            ])
            archiveArtifacts artifacts: 'jenkins/build-artifacts/**', allowEmptyArchive: true, fingerprint: true
            script {
                if (params.PUSH_REPORT_TO_GIT) {
                    try {
                        withCredentials([
                            usernamePassword(
                                credentialsId: 'github-playwright-push',
                                usernameVariable: 'GH_USER',
                                passwordVariable: 'GH_TOKEN'
                            )
                        ]) {
                            sh """
                                set +x
                                git config user.email "jenkins@localhost"
                                git config user.name "Jenkins CI"
                                git add -f jenkins/build-artifacts/playwright-report || true
                                git add -f jenkins/build-artifacts/junit.xml jenkins/build-artifacts/results.json || true
                                git add jenkins/build-artifacts/BUILD_INFO.txt jenkins/build-artifacts/README.md || true
                                if git diff --staged --quiet; then
                                  echo "No artifact changes to push"
                                  exit 0
                                fi
                                git commit -m "ci: Jenkins build #${env.BUILD_NUMBER} (${currentBuild.result})"
                                git push --force "https://\${GH_USER}:\${GH_TOKEN}@github.com/IdoG999/Playwright-example.git" HEAD:refs/heads/ci/playwright-report
                            """
                        }
                    } catch (err) {
                        def msg = err instanceof Throwable ? err.message : err.toString()
                        if (msg?.contains('Could not find credentials')) {
                            echo 'WARNING: Git push skipped — Jenkins has no credential with ID github-playwright-push.'
                            echo 'Add: Manage Jenkins → Credentials → Username with password (GitHub user + PAT, ID exactly github-playwright-push). See jenkins/GITHUB_AND_PIPELINE_SETUP.md'
                        } else {
                            throw err
                        }
                    }
                }
            }
        }
    }
}
