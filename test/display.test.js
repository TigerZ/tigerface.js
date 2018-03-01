const assert = require('assert');
const {Event} = require('tigerface-event');
const {DisplayObject} = require('tigerface-display');

describe('测试显示对象 DisplayObject', () => {
    describe('初始化显示对象，输入与缺省值不同的初始属性', () => {
        it('初始属性都生效，对象为"状态已改变"，每次修改发送"状态已改变"事件', () => {
            let num = 0;
            let opt = {
                pos: {x: 1, y: 2},
                size: {width: 9, height: 10},
                scale: {x: 3, y: 4},
                origin: {x: 5, y: 6},
                alpha: 7,
                rotation: 8,
                visible: false,
            };
            let d = new DisplayObject(opt);

            assert.deepEqual(d.x, 1);
            assert.deepEqual(d.y, 2);
            assert.deepEqual(d.scaleX, 3);
            assert.deepEqual(d.scaleY, 4);
            assert.deepEqual(d.originX, 5);
            assert.deepEqual(d.originY, 6);
            assert.deepEqual(d.alpha, 7);
            assert.deepEqual(d.rotation, 8);
            assert.deepEqual(d.width, 9);
            assert.deepEqual(d.height, 10);
            assert.deepEqual(d.visible, false);
            assert.deepEqual(d.isChanged(), true);

            d.addEventListener(Event.STATUS_CHANGED, (e) => {
                console.log(++num, e.log);
            });
            d.setState(opt);
            assert.deepEqual(num, 7);
        });
    });
});