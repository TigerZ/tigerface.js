const assert = require('assert');
const {DisplayObject} = require('tigerface-display');

describe('测试显示对象 DisplayObject', () => {
    describe('初始化显示对象', () => {
        it('初始化 不报错', () => {
            let _do = new DisplayObject();
            console.log(_do);
        });
    });
});