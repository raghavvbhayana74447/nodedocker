pipeline {
    agent { label 'cloud-agent' }

    environment {
        imagename = "nodeappdocker"
        tag = "latest"
        acrName = "demoregistry74447"
        acrLoginServer = "demoregistry74447.azurecr.io"
        resourceGroup = "RnD-RaghavRG"
        appServicePlan = "myAppServicePlan"
        appName = "mywebapp74447"
        identityName = "myID"
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

        stage('Create Identity') {
            steps {
                sh '''
                az identity create --name $identityName --resource-group $resourceGroup || true

                echo "Retrieving IDs..."
                principalId=$(az identity show --resource-group $resourceGroup --name $identityName --query principalId --output tsv)
                registryId=$(az acr show --resource-group $resourceGroup --name $acrName --query id --output tsv)

                echo $principalId > principalId.txt
                echo $registryId > registryId.txt
                '''
            }
        }

        stage('Assign Role to Identity') {
            steps {
                sh '''
                principalId=$(cat principalId.txt)
                registryId=$(cat registryId.txt)

                az role assignment create --assignee $principalId --scope $registryId --role "AcrPull" || true
                '''
            }
        }

        stage('Assign Identity to App Service') {
            steps {
                sh '''
                az webapp identity assign --name $appName --resource-group $resourceGroup --identities $identityName
                '''
            }
        }

        stage('Configure App Service to pull image from ACR using Identity') {
            steps {
                sh '''
                identityClientId=$(az identity show --resource-group $resourceGroup --name $identityName --query clientId -o tsv)

                az webapp config container set \
                  --name $appName \
                  --resource-group $resourceGroup \
                  --docker-custom-image-name $acrLoginServer/$imagename:$tag \
                  --docker-registry-server-url https://$acrLoginServer \
                  --docker-registry-server-user $identityClientId
                '''
            }
        }

        stage('Setup Webhook for CI/CD') {
            steps {
                sh '''
                echo "Retrieving CI/CD URL..."
                cicdUrl=$(az webapp deployment container config --enable-cd true --name $appName --resource-group $resourceGroup --query CI_CD_URL --output tsv)

                echo "Creating webhook..."
                az acr webhook create --name my-webhook --registry $acrName --uri $cicdUrl --actions push --scope $acrLoginServer/$imagename:$tag || true
                '''
            }
        }
    }
}
