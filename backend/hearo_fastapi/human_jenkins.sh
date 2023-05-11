echo "1. stop container"
docker stop hearo-fastapi

echo "2. remove container"
docker rm hearo-fastapi

echo "3. remove image"
docker rmi fastapi

echo "4. re-build image"
docker build -t fastapi /home/ubuntu/S08P31A603/backend/hearo_fastapi/.

echo "5. re-run container"
docker run -d -p 80:80 --shm-size 2000000000 --name hearo-fastapi fastapi

echo "6. check!"
docker ps -a

echo "7. log!"
docker logs -f hearo-fastapi