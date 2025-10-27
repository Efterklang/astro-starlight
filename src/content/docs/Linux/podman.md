---
title: Docker, Podman
---
## Commands

```shell
# Export a container's filesystem as a tar archive
docker export -o ./image.tar <container_name>

# Display Docker system-wide information
docker info

# Display Docker version information
docker version

# Show Docker disk usage
$ docker system df
TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          38        6         23.26GB   20.75GB (89%)
Containers      8         0         6.613GB   6.613GB (100%)
Local Volumes   14        1         3.928GB   2.205GB (56%)
Build Cache     128       0         7.887GB   7.887GB

# Clean up unused data (containers, networks, images, volumes)
docker system prune

# Clean up unused data including volumes
docker system prune -a --volumes

# Login to Docker registry
docker login [registry]

# Logout from Docker registry
docker logout [registry]
```

## Image

```shell
# Download an image from a registry
docker pull nginx:1.21.0

# List all images
docker images

# List all images (including intermediates)
docker images -a

# Save one or more images to a tar archive (streamed to STDOUT by default)
docker save -o ./image.tar <image_name>

# Load an image from a tar archive
docker load -i ./image.tar

# Build an image from a Dockerfile
docker build -t <image_name>:<tag> <path_to_dockerfile_directory>

# Build an image with no cache
docker build --no-cache -t <image_name>:<tag> <path_to_dockerfile_directory>

# Tag an image
docker tag <source_image>:<tag> <target_image>:<tag>

# Remove an image
docker rmi <image_name>:<tag>

# Remove all unused images
docker image prune

# Remove all unused images, not just dangling ones
docker image prune -a

# Show the history of an image
docker history <image_name>:<tag>

# Push an image to a registry
docker push <image_name>:<tag>

# Search for an image on Docker Hub
docker search <term>
```

## Container

```shell
# Create and start a new container
docker run -d --name <container_name> <image_name>

# Create and start a container with port mapping
docker run -d -p <host_port>:<container_port> --name <container_name> <image_name>

# Create and start a container with volume mounting
docker run -d -v <host_path>:<container_path> --name <container_name> <image_name>

# Create and start a container with environment variables
docker run -d -e KEY=VALUE --name <container_name> <image_name>

# List running containers
docker ps

# List all containers (including stopped ones)
docker ps -a

# Start a stopped container
docker start <container_name>

# Stop a running container
docker stop <container_name>

# Restart a container
docker restart <container_name>

# Remove a container
docker rm <container_name>

# Force remove a running container
docker rm -f <container_name>

# View container logs
docker logs <container_name>

# Follow container logs
docker logs -f <container_name>

# Execute a command in a running container
docker exec -it <container_name> <command>

# Get a shell inside a running container
docker exec -it <container_name> bash

# View container details
docker inspect <container_name>

# Show container resource usage statistics
docker stats <container_name>
```

## Network

```shell
# List all networks
docker network ls

# Create a network
docker network create <network_name>

# Create a network with specific subnet and gateway
docker network create --subnet=172.18.0.0/16 --gateway=172.18.0.1 <network_name>

# Connect a container to a network
docker network connect <network_name> <container_name>

# Disconnect a container from a network
docker network disconnect <network_name> <container_name>

# Remove a network
docker network rm <network_name>

# Display detailed information on one or more networks
docker network inspect <network_name>

# Remove all unused networks
docker network prune
```

## Volume

```shell
# List all volumes
docker volume ls

# Create a volume
docker volume create <volume_name>

# Remove a volume
docker volume rm <volume_name>

# Remove all unused volumes
docker volume prune

# Display detailed information on one or more volumes
docker volume inspect <volume_name>

# Mount a volume when running a container
docker run -d -v <volume_name>:<container_path> <image_name>

# Mount a host directory as a volume
docker run -d -v <host_path>:<container_path> <image_name>

# Create a read-only volume
docker run -d -v <volume_name>:<container_path>:ro <image_name>
```

## Docker Compose

```shell
# Start services defined in docker-compose.yml
docker-compose up -d

# Stop services defined in docker-compose.yml
docker-compose down

# View logs for services
docker-compose logs

# Follow logs for services
docker-compose logs -f

# List containers for services
docker-compose ps

# Execute a command in a service container
docker-compose exec <service_name> <command>

# Build or rebuild services
docker-compose build

# Pull service images
docker-compose pull

# Scale a service to multiple instances
docker-compose up -d --scale <service_name>=<number_of_instances>
```


## 进入container

```shell
podman start <container_name>
podman attach <container_name>
```
