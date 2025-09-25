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
        stage('creating identity and retreiving identities'){
            steps{
                sh '''
                az identity create --name myID --resource-group RnD-RaghavRG
                
                echo "retreiving id"
                principalId=$(az identity show --resource-group RnD-RaghavRG --name myID --query principalId --output tsv)
                registryId=$(az acr show --resource-group RnD-RaghavRG --name demoregistry74447 --query id --output tsv)
                '''
            }
        }
        stage('assigning role to identity'){
            steps{
                sh '''
                az role assignment create --assignee $principalId --scope $registryId --role "AcrPull"
                '''
            }
        }
        stage('webhook'){
            steps{
                sh '''
                echo "retreiving ci/cd url"
                cicdUrl=$(az webapp deployment container config --enable-cd true --name mywebapp74447 --resource-group RnD-RaghavRG --query CI_CD_URL --output tsv)
                
                echo "creating webhook"
                az acr webhook create --name my-webhook --registry demoregistry74447 --uri $cicdUrl --actions push --scope demoregistry74447.azurecr.io/nodeappdocker:latest
                '''
            }
        }
    }
}
