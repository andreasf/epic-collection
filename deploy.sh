#!/usr/bin/env bash
set -e -o pipefail

script_path=$(dirname $0)
pushd $script_path/frontend
    npm run build
    cp ../Staticfile build
    rm build/static/js/*.map
    rm build/static/css/*.map
popd

pushd $script_path
    cf push
popd
