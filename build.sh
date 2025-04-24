ECR_REGISTRY="992382570944.dkr.ecr.us-east-1.amazonaws.com"
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 992382570944.dkr.ecr.us-east-1.amazonaws.com
docker build -t dose_certa/frontend .
docker tag dose_certa/backend:latest $ECR_REGISTRY/dose_certa/frontend:latest
docker push $ECR_REGISTRY/dose_certa/frontend:latest
