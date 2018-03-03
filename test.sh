#!/bin/sh
cross-env NODE_ENV=test mocha --require babel-core/register test/shape.test.js