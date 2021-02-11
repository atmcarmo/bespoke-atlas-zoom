#!/usr/bin/env bash

set -u

RELEASE_STAGE=${1^^}
echo "RELEASE_STAGE:: ".$RELEASE_STAGE
case $RELEASE_STAGE in
  STG)
    CDN_URL=https://stg-cdn-talkdesk.talkdeskdev.com
    ;;

  QA)
    CDN_URL=https://qa-cdn-talkdesk.talkdeskdev.com
    ;;

  PRD)
    CDN_URL=https://prd-cdn-talkdesk.talkdesk.com
    ;;

  *)
    echo -n "Invalid release stage variable: $RELEASE_STAGE"
    exit 1
    ;;
esac

echo "Waiting for deploy..."

while true; do
  DEPLOYED_TAG=$(curl -s $CDN_URL/bespoke-atlas-zoom/latest/assets/deploy-info.json | jq --raw-output '.RELEASE_TAG')
  if [ $? -eq 0 ] && [ "$DEPLOYED_TAG" = "$RELEASE_TAG" ]; then
    break
  fi

  sleep 5
done

echo "Deployed"
