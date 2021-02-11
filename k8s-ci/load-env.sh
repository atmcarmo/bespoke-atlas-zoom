#!/usr/bin/env bash

set -u

RELEASE_STAGE=${1^^}

echo "RELEASE_STAGE=${RELEASE_STAGE}" > .env.docker

env | awk -F "=" '{print $1}' | grep -i "${RELEASE_STAGE}_*" | while read -r CI_ENV_VAR ; do
  CI_ENV_VAR_NAME=${CI_ENV_VAR^^}
  CI_ENV_VAR_NAME=${CI_ENV_VAR_NAME#"${RELEASE_STAGE^^}_"}
  echo "Using var ${CI_ENV_VAR_NAME}"
  echo "${CI_ENV_VAR_NAME}=${!CI_ENV_VAR}" >> .env.docker
done
