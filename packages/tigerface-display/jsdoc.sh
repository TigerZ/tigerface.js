#!/bin/sh
rm -rf ./doc/
jsdoc ./src/ -t ../../node_modules/docdash -a all -d doc