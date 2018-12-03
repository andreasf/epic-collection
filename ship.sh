#!/bin/bash
set -e -o pipefail

script_path=$(dirname $0)
pushd $script_path/frontend
    git pull -r
    CI=1 npm test
    git push
popd
