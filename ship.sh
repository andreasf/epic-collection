#!/bin/bash
set -e -o pipefail

script_path=$(dirname $0)
pushd $script_path
    git pull -r
    CI=1 ./gradlew clean npm_test test
    git push
popd
