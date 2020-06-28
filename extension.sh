#!/bin/bash

set -ex

rm -rf dist
node_modules/.bin/webpack --mode production

rm -rf target
mkdir target
cp -R dist icons manifest.json .web-extension-id target
cd target

../node_modules/.bin/web-ext lint
../node_modules/.bin/web-ext build
web-ext sign --api-key=$AMO_JWT_ISSUER --api-secret=$AMO_JWT_SECRET
