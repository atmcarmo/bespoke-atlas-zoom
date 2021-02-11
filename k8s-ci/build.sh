#!/usr/bin/env bash

set -u

RELEASE_STAGE=$1

jq -n --arg RELEASE_TAG $RELEASE_TAG '{"RELEASE_TAG":$RELEASE_TAG}' > deploy-info.json

CREATE_RANDOM='cat /dev/urandom | LC_CTYPE=C tr -dc "[:alpha:]" | head -c 8'
PROJECT_NAME=${TALKDESK_CI_BUILD_NAME:-$(eval ${CREATE_RANDOM})}
BUILD_TAG=${TALKDESK_CI_BUILD_TASK:-$(eval ${CREATE_RANDOM})}

echo "Building Docker image"
docker-compose --project-name ${PROJECT_NAME} build build
docker-compose --project-name ${PROJECT_NAME} run --name ${BUILD_TAG} build

mkdir -p ${OUTPUT_PATH_ARTIFACTS}/${RELEASE_STAGE}
echo "Moving assets into ${OUTPUT_PATH_ARTIFACTS}/${RELEASE_STAGE}"
CONTAINER_ID=$(docker ps -aqf "name=^/${BUILD_TAG}$")
[ ! -z "${CONTAINER_ID}" ] && docker cp ${CONTAINER_ID}:/usr/src/app/build/. ${OUTPUT_PATH_ARTIFACTS}/${RELEASE_STAGE} 

mv deploy-info.json ${OUTPUT_PATH_ARTIFACTS}/${RELEASE_STAGE}/assets

docker-compose --project-name "${PROJECT_NAME}" down --volumes
