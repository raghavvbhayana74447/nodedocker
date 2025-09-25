pipeline {
    agent { label 'cloud-agent' }

    environment {
        imagename = "nodeappdocker"
        tag = "latest"
        acrName = "demoregistry74447"
        acrLoginServer = "demoregistry74447.azurecr.io"
    }

    stages {
        stage('Pulling Git repo') {
            steps {
                git url: 'https://github.com/raghavvbhayana74447/nodedocker.git', branch: 'main'
            }
        }

        stage('Build Docker image') {
            steps {
                sh '''
                docker build -t $imagename:$tag .
                '''
            }
        }

        stage('Login to Azure & ACR') {
            steps {
                withCredentials([azureServicePrincipal(credentialsId: 'AzureServicePrincipal')]) {
                    sh '''
                    az login --service-principal -u $AZURE_CLIENT_ID -p $AZURE_CLIENT_SECRET -t $AZURE_TENANT_ID
                    az account set --subscription $AZURE_SUBSCRIPTION_ID
                    az acr login --name $acrName
                    '''
                }
            }
        }

        stage('Tag & Push to ACR') {
            steps {
                sh '''
                docker tag $imagename:$tag $acrLoginServer/$imagename:$tag
                docker push $acrLoginServer/$imagename:$tag
                '''
            }
        }
    }
}
