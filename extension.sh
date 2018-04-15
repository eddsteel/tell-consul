#!/bin/bash

set -x
set -e

rm -rf dist
node_modules/.bin/webpack --mode production

rm -rf target
mkdir target
cp -R dist icons manifest.json target
cd target

../node_modules/.bin/web-ext lint
../node_modules/.bin/web-ext build

. ../.secrets
web-ext sign --api-key=$AMO_JWT_ISSUER --api-secret=$AMO_JWT_SECRET
