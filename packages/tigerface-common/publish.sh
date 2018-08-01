#!/bin/sh
rm -rf ./lib
babel -q --optional es7.objectRestSpread ./src --out-dir ./lib
mv index.js dev.js
mv npm.js index.js
npm publish
rm -rf ./lib
mv index.js npm.js
mv dev.js index.js