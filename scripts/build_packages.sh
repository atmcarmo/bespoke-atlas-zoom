#!/usr/bin/env bash

REPO_NAME="bespoke-atlas-zoom"
APP_VERSION="latest"

rm -rf ./build

for PACKAGE_DIR in packages/* ; do
    PACKAGE_NAME=$(echo $PACKAGE_DIR | grep -o '[^/]*$')

    ( cd $PACKAGE_DIR ; PUBLIC_URL="/$REPO_NAME/$APP_VERSION/$PACKAGE_NAME" yarn build )
    mkdir -p ./build/$PACKAGE_NAME
    mv ./$PACKAGE_DIR/build/* ./build/$PACKAGE_NAME
    rmdir ./$PACKAGE_DIR/build/
done
