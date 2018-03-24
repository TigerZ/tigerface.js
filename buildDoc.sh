#!/bin/sh
rm -rf ./apidoc/
#jsdoc ./packages/ -r -d apidoc -t ./node_modules/docdash -c ./jsdoc.json -a all
jsdoc ./packages/ -r -d apidoc -c ./jsdoc.json -t ./node_modules/ink-docstrap/template