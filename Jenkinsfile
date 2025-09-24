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
        // stage('docker login'){
        //     steps{
        //         sh 'echo "Fecthing username and password"'
        //         withCredentials([usernamePassword(
        //             credentialsId: 'dockercreds', 
        //             usernameVariable: 'username',
        //             passwordVariable: 'password')]){
        //                 sh '''
        //                 whoami
        //                 sudo docker login -u $username -p $password
        //                 '''
        //             }
        //     }
        // }
        stage('building docker image'){
            steps{
                sh '''
                sudo docker build -t $imagename:$tag .
                '''
            }
        }

        stage('acr login '){
            steps{
                sh '''
                sudo docker login demoregistry74447.azurecr.io 
                '''
            }
        }
        stage('renaming image'){
            steps{
                sh '''
                sudo docker tag  $imagename demoregistry74447.azurecr.io/$imagename:$tag
                '''
            }
        }
        stage('pushing to azure container regitry'){
            steps{
                echo "pushing to acr"
                sh ''' 
                sudo docker push demoregistry74447.$imagename:$tag
                '''
            }
        }



        // stage('pushing to docker hub'){
        //     steps{
                
        //          withCredentials([usernamePassword(
        //             credentialsId: 'dockercreds', 
        //             usernameVariable: 'username',
        //             passwordVariable: 'password')])
        //             {
        //            sh '''
        //             sudo docker push raghavbhayana/$imagename:$tag
        //             '''
        //         }
                
        //     }
        // }
    }
}