#!/bin/bash

set -exu

CREATE_RANDOM='cat /dev/urandom | LC_CTYPE=C tr -dc "[:alpha:]" | head -c 8'
PROJECT_NAME=${TALKDESK_CI_BUILD_NAME:-$(eval ${CREATE_RANDOM})}
BUILD_TAG=${TALKDESK_CI_BUILD_TASK:-$(eval ${CREATE_RANDOM})}

echo "Building Docker image"
docker-compose --project-name ${PROJECT_NAME} build build-${RELEASE_STAGE}
docker-compose --project-name ${PROJECT_NAME} run --name ${BUILD_TAG} build-${RELEASE_STAGE}

echo "Moving assets into ${OUTPUT_PATH}"
CONTAINER_ID=$(docker ps -aqf "name=^/${BUILD_TAG}$")
[ ! -z "${CONTAINER_ID}" ] && docker cp ${CONTAINER_ID}:/usr/src/app/build/. ${OUTPUT_PATH}

docker-compose --project-name "${PROJECT_NAME}" down --volumes
