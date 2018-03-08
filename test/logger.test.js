//import {describe} from 'tigerface-test';
const assert = require('assert');
const {Logger} = require('tigerface-common');

const logger = Logger.getLogger("Test");

describe('测试日志', () => {
    it('基本功能，颜色展示', () => {
        logger.info("这是消息");
        logger.warn("这是警告");
        logger.debug("这是调试");
        assert.throws(function() { logger.error("这是错误") }, /这是错误/);
    });
    it('...', () => {
        console.time('100-elements');
        for (var i = 0; i < 100; i++) {
            ;
        }
        console.timeEnd('100-elements');

        // console.trace('abcd');
        var bunyan = require('bunyan');
        var log = bunyan.createLogger({name: "myapp"});
        log.info("hi");
        log.warn({lang: 'fr'}, 'au revoir');
    });
});