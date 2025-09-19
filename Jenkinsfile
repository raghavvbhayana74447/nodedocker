pipeline{
    agent {label 'cloud-agent'}

    environment{
        imagename: "raghavbhayana/nodeapp_docker_jenkins"
        tag: "latest"
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
                    username: 'username',
                    password: 'password')]){
                        sh '''
                        docker login -u $username -p $password
                        '''
                    }
            }
        }
        stage('building docker image'){
            steps{
                sh '''
                docker build -t $imagename:$tag .
                '''
            }
        }
        stage('pushing to docker hub'){
            steps{
                docker push $imagename:$tag
            }
        }
    }
}