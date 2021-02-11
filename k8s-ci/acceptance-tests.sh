#!/usr/bin/env bash

set -u
RELEASE_STAGE=$1

CREATE_RANDOM="LC_ALL=C tr -dc '[:alpha:]' < /dev/urandom | head -c 24"
PROJECT_NAME=${TALKDESK_JENKINS_BUILD_NAME:-$(eval ${CREATE_RANDOM})}
BUILD_TAG=${TALKDESK_CI_BUILD_TASK:-$(eval ${CREATE_RANDOM})}
REPORTS_ACCEPTANCE=/usr/src/app/tests/reports/acceptance

echo "Running acceptance tests"
docker-compose --project-name "${PROJECT_NAME}" run --name "${BUILD_TAG}" acceptance-deploy-${RELEASE_STAGE}

EXIT=$?

CONTAINER_ID=$(docker ps -aqf "name=^/${BUILD_TAG}$")
[ ! -z "${CONTAINER_ID}" ] && docker cp ${CONTAINER_ID}:${REPORTS_ACCEPTANCE} ./


echo "Cleaning up..."
docker-compose --project-name "${PROJECT_NAME}" down --volumes

echo "Done!"
exit $EXIT
