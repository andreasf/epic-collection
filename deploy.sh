#!/usr/bin/env bash
set -e -o pipefail

APP=epic-collection

main() {
    require_client_id

    script_path=$(dirname $0)
    pushd $script_path/frontend
        rm -rf deploy

        npm run build

        rm build/static/js/*.map
        rm build/static/css/*.map

        mkdir -p deploy/public
        mkdir -p deploy/nginx/conf/includes
        cp -R build/* deploy/public
        cp ../Staticfile deploy
        cp ../nginx-overrides.conf deploy/nginx/conf/includes
    popd

    pushd $script_path
        rename_app_if_running
        cf push
        delete_old_instance_if_running
    popd
}

require_client_id() {
    if [[ -z "${REACT_APP_CLIENT_ID}" ]]
    then
        echo "error: REACT_APP_CLIENT_ID must be set" >&2
        exit 1
    fi
}

rename_app_if_running() {
    set +e
    cf app "$APP" &>/dev/null
    running="$?"
    set -e

    if [[ "$running" == "0" ]]
    then
        cf rename "$APP" "$APP-old"
    fi
}

delete_old_instance_if_running() {
    if [[ "$running" == "0" ]]
    then
        cf delete -f "$APP-old"
    fi
}

main $*
