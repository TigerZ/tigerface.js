#!/bin/sh
rm -rf ./doc/
#jsdoc ./packages/ -t ./node_modules/docdash -a all -d doc
jsdoc ./packages/ -r -d doc -t ./node_modules/docdash