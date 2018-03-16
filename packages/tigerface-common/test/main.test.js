const assert = require('assert');

import BaseObject from '../src/BaseObject';

describe('测试 BaseObject', () => {

    let bo;

    it('创建实例', () => {
        bo = new BaseObject();
        assert(bo);
    });

    it('赋值属性', () => {
        bo = new BaseObject({name: 'Tom', age: 30, male: true});
        assert.deepEqual(bo.name, 'Tom');
        assert.deepEqual(bo.age, 30);
        assert.deepEqual(bo.male, true);
    });

    it('更新属性', () => {
        bo.update({name: 'Rose', age: 25, male: false});
        assert.deepEqual(bo.name, 'Rose');
        assert.deepEqual(bo.age, 25);
        assert.deepEqual(bo.male, false);
    });

    it('无效属性', () => {
        bo.update({name: undefined, age:28});
        assert.deepEqual(bo.name, 'Rose');
        assert.deepEqual(bo.age, 28);
    });
});