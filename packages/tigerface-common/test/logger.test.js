//import {describe} from 'tigerface-test';
const assert = require('assert');
import Logger from '../src/Logger';

const logger = Logger.getLogger("Test");

describe('测试日志', () => {
    it('基本功能，颜色展示', () => {
        logger.info("这是消息");
        logger.warn("这是警告");
        logger.debug("这是调试");
        assert.throws(function() { logger.error("这是错误") }, /这是错误/);
    });
});