#!groovy

def tryStep(String message, Closure block, Closure tearDown = null) {
    try {
        block();
    }
    catch (Throwable t) {
        slackSend message: "${env.JOB_NAME}: ${message} failure ${env.BUILD_URL}", channel: '#ci-channel', color: 'danger'

        throw t;
    }
    finally {
        if (tearDown) {
            tearDown();
        }
    }
}


node {
    stage("Checkout") {
        checkout scm
    }

    stage('Check and build static content on ACC') {
        tryStep "ACC", {
            withCredentials([[$class: 'StringBinding', credentialsId: 'CMS_OBJECTSTORE_PASSWORD', variable: 'CMS_OBJECTSTORE_PASSWORD']]) {
                sh "docker-compose -p static-files -f static-files/docker-compose.yml build && " +
                   "docker-compose -p static-files -f static-files/docker-compose.yml run -u root -e environment=ACC --rm static-files"
            }
         }
    }

    stage('Waiting for approval') {
        slackSend channel: '#ci-channel', color: 'warning', message: 'Schemas are waiting for Production Release - please confirm'
        input "Deploy to Production?"
    }

    stage('Upload static content to PROD') {
        tryStep "PROD", {
            withCredentials([[$class: 'StringBinding', credentialsId: 'CMS_OBJECTSTORE_PASSWORD', variable: 'CMS_OBJECTSTORE_PASSWORD']]) {
                sh "docker-compose -p static-files -f static-files/docker-compose.yml run -u root -e environment=PROD --rm prod-upload"
        }, {
            sh "docker-compose -p static-files -f static-files//docker-compose.yml down"
        }
    }

}