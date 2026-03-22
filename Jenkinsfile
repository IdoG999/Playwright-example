pipeline {
    agent any
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
            publishHTML([
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Report',
                keepAll: true,
                alwaysLinkToLastBuild: true,
                allowMissing: true
            ])
        }
    }
}
