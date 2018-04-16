#!/bin/sh
rm -rf ./lib
babel -q --no-babelrc --presets=env,stage-1 --optional es7.objectRestSpread ./src --out-dir ./lib
mv index.js dev.js
mv npm.js index.js
npm publish
rm -rf ./lib
mv index.js npm.js
mv dev.js index.js
