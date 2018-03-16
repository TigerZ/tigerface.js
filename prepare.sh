#!/bin/sh
#rm -rf ./lib/*
#babel -q --no-babelrc --presets=env,stage-1,react --optional es7.objectRestSpread ./packages --out-dir ./lib
rm -rf ./node_modules/tigerface-*
babel --no-babelrc --presets=env,stage-1,react --optional es7.objectRestSpread ./packages --out-dir ./node_modules
rm -f ./node_modules/log-config.json
cp ./test/log-config.json ./node_modules/
# babel --optional es7.objectRestSpread ./example/src --out-dir ./example/assets
# npm run hello