#!/bin/sh

set -xu

CREATE_RANDOM='cat /dev/urandom | LC_CTYPE=C tr -dc "[:alpha:]" | head -c 8'
PROJECT_NAME=${TALKDESK_CI_BUILD_NAME:-$(eval ${CREATE_RANDOM})}
BUILD_TAG=${TALKDESK_CI_BUILD_TASK:-$(eval ${CREATE_RANDOM})}

echo "Building Docker image"
docker-compose --project-name ${PROJECT_NAME} build lint
docker-compose --project-name ${PROJECT_NAME} run --name ${BUILD_TAG} lint

EXIT=$?

docker-compose --project-name "${PROJECT_NAME}" down --volumes

exit $EXIT
