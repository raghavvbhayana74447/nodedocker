pipeline {
    agent { label 'cloud-agent' }

    tools {
        nodejs "node"
    }

    environment {
        RESOURCE_GROUP = "RnD-RaghavRG"
        APP_NAME       = "mywebapp74447"
        PLAN_NAME      = "ASP-RnDRaghavRG-b5a6"   
        LOCATION       = "eastus"         
    }

    stages {
        stage('Pulling Git Repo') {
            steps {
                git url: 'https://github.com/raghavvbhayana74447/node.git', branch: 'main'
            }
        }

        stage('Installing Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
        }

        stage('Setup Azure Web App') {
            steps {
                withCredentials([azureServicePrincipal(credentialsId: 'AzureServicePrincipal')]) {
                 sh ''' az login --service-principal -u $AZURE_CLIENT_ID -p $AZURE_CLIENT_SECRET -t $AZURE_TENANT_ID
                        az account set --subscription $AZURE_SUBSCRIPTION_ID    
                        echo "Checking Web App..."
                        az webapp show --resource-group $RESOURCE_GROUP --name $APP_NAME || \
                        az webapp create \
                          --resource-group $RESOURCE_GROUP \
                          --plan $PLAN_NAME \
                          --name $APP_NAME \
                          --runtime "NODE|20-lts"
                    '''
                }
            }
        }

        stage('Deploy to Azure with CLI') {
            steps {
                withCredentials([azureServicePrincipal(credentialsId: 'AzureServicePrincipal')]) {
                sh ''' az login --service-principal -u $AZURE_CLIENT_ID -p $AZURE_CLIENT_SECRET -t $AZURE_TENANT_ID'
                        az account set --subscription $subscriptionId

                        echo "Zipping app..."
                        zip -r app.zip .

                        echo "Deploying to Azure Web App..."
                        az webapp deployment source config-zip \
                          --resource-group $RESOURCE_GROUP \
                          --name $APP_NAME \
                          --src app.zip
                       
                    '''
                }
            }
        }
    }
}
