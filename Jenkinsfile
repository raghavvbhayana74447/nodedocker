pipeline{
    agent {label 'cloud-agent'}

    environment{
        imagename= "nodeappdocker"
        tag= "latest"
    }

    stages{
        stage('pulling git repo'){
            steps{
                git url: 'https://github.com/raghavvbhayana74447/nodedocker.git', 
                branch: 'main'
            }
        }
        stage('docker login'){
            steps{
                sh 'echo "Fecthing username and password"'
                withCredentials([usernamePassword(
                    credentialsId: 'dockercreds', 
                    usernameVariable: 'username',
                    passwordVariable: 'password')]){
                        sh '''
                        whoami
                        sudo docker login -u $username -p $password
                        '''
                    }
            }
        }
        stage('building docker image'){
            steps{
                sh '''
                sudo docker build -t $imagename:$tag .
                '''
            }
        }

        stage('acr login '){
            steps{
                withCredentials([azureServicePrincipal(credentialsId: 'AzureServicePrincipal')]) {
                sh '''
                az logout
                az login --service-principal -u $AZURE_CLIENT_ID -p $AZURE_CLIENT_SECRET -t $AZURE_TENANT_ID
                az account set --subscription $AZURE_SUBSCRIPTION_ID 
                az acr login --name demoregistry74447 
                sudo docker tag  $imagename demoregistry74447.azurecr.io/$imagename:$tag
                echo "pushing to acr"
                docker login demoregistry74447.azurecr.io
                sudo docker push demoregistry74447.azurecr.io/$imagename:$tag                

                '''
                }
            }
        }

        // stage('renaming image'){
        //     steps{
        //         sh '''
        //         sudo docker tag  $imagename demoregistry74447.azurecr.io/$imagename:$tag
        //         '''
        //     }
        // }
        // stage('pushing to azure container regitry'){
        //     steps{
        //         withCredentials([azureServicePrincipal(credentialsId: 'AzureServicePrincipal')]) {
        //         sh '''
        //         az logout
        //         az login --service-principal -u $AZURE_CLIENT_ID -p $AZURE_CLIENT_SECRET -t $AZURE_TENANT_ID
        //         az account set --subscription $AZURE_SUBSCRIPTION_ID 
                
        //         docker login demoregistry74447.azurecr.io

        //         echo "pushing to acr"
        //         az acr login --name demoregistry74447 
        //         sudo docker push demoregistry74447.azurecr.io/$imagename:$tag
        //         '''
        //         }
        //     }
        // }



        stage('pushing to docker hub'){
            steps{
                
                  withCredentials([usernamePassword(
                    credentialsId: 'dockercreds', 
                    usernameVariable: 'username',
                    passwordVariable: 'password')])
                   {
                 sh '''
                    sudo docker push raghavbhayana/$imagename:$tag
                         docker login demoregistry74447.azurecr.io
                sudo docker push demoregistry74447.azurecr.io/$imagename:$tag 
                    '''
                 }
                
             }
         }
    }
}