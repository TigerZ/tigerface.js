#!/bin/sh
rm -rf ./apidoc/
#jsdoc ./packages/ -r -d apidoc -t ./node_modules/docdash -c ./jsdoc.json -a all
jsdoc ./packages/ -r -d apidoc -t ./node_modules/docdash -c ./jsdoc.json