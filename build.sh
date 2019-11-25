#!/bin/bash
set -e

cd $(dirname $0)
CI=1 MOZ_HEADLESS=1 ./gradlew --info clean npm_install npm_test test