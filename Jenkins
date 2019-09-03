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
            withCredentials([[$class: 'StringBinding', credentialsId: 'CMS_Objectstore_key', variable: 'CMS_OBJECTSTORE_PASSWORD']]) {
                sh "docker-compose -p static-files -f static-files/docker-compose.yml build && " +
                   "docker-compose -p static-files -f static-files/docker-compose.yml run -u root -e environment=ACC --rm static-files"
        }, {
            sh "docker-compose -p ds_demo -f static-files//docker-compose.yml down"
        }
    }

//    stage('Check and build static content on PROD') {
//        tryStep "PROD", {
//            withCredentials([[$class: 'StringBinding', credentialsId: 'CMS_Objectstore_key', variable: 'CMS_OBJECTSTORE_PASSWORD']]) {
//                sh "docker-compose -p static-files -f static-files/docker-compose.yml build && " +
//                   "docker-compose -p static-files -f static-files/docker-compose.yml run -u root -e environment=PROD -e http_proxy=${JENKINS_HTTP_PROXY_STRING} -e https_proxy=${JENKINS_HTTP_PROXY_STRING} --rm static-files"
//        }, {
//            sh "docker-compose -p ds_demo -f static-files//docker-compose.yml down"
//        }
//    }
}