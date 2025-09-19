pipeline{
    agent {label 'cloud-agent'}

    environment{
        imagename= "nodeapp_docker_jenkins"
        tag= "latest"
    }

    stages{
        stage('pulling git repo'){
            steps{
                git url: 'https://github.com/raghavvbhayana74447/docker.git', 
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
                        docker login -u $username -p $password
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
        stage('renaming image'){
            steps{
                sh '''
                docker tag  $imagename raghavbhayana/$imagename
            }
        }
        stage('pushing to docker hub'){
            steps{
                sh '''
                docker push $imagename:$tag
                '''
            }
        }
    }
}