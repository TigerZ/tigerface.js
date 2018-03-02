const assert = require('assert');
const {Event} = require('tigerface-event');
const {DisplayObject, DisplayObjectContainer} = require('tigerface-display');

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
    let dc = new DisplayObjectContainer();
    let c1 = new DisplayObjectContainer();
    c1.name = 'c1';
    let c2 = new DisplayObjectContainer();
    c2.name = 'c2';
    let c3 = new DisplayObjectContainer();
    c3.name = 'c3';
    describe("显示对象容器", () => {
        it("添加子节点，容器 length + 1", () => {
            let num = dc.children.length;
            dc.addChild(c1);
            dc.addChild(c2);
            dc.addChild(c3);
            assert.deepEqual(dc.children.length, num + 3);
        });
        let r = (a, b) => {
            return {name: (a.name + b.name)}
        };
        it("swapChildrenAt 交换子节点顺序结果正确", () => {
            dc.swapChildrenAt(1, 2);
            assert.deepEqual(dc.children.reduce(r).name, 'c1c3c2');
        });
        it("swapChildren 交换子节点顺序结果正确", () => {
            dc.swapChildren(c1, c2);
            assert.deepEqual(dc.children.reduce(r).name, 'c2c3c1');
        });
        it("setChildIndex 设置子节点位置结果正确", () => {
            dc.setChildIndex(c2, 1);
            assert.deepEqual(dc.children.reduce(r).name, 'c3c2c1');
            dc.setChildIndex(c1, 1);
            assert.deepEqual(dc.children.reduce(r).name, 'c3c1c2');
        });
        it("setTop 设置子节点位置结果正确", () => {
            dc.setTop(c3);
            assert.deepEqual(dc.children.reduce(r).name, 'c1c2c3');
            dc.setTop(c1, c2);
            assert.deepEqual(dc.children.reduce(r).name, 'c2c1c3');
            dc.setTop(c3, c2);
            assert.deepEqual(dc.children.reduce(r).name, 'c2c3c1');
        });
        it("setBottom 设置子节点位置结果正确", () => {
            dc.setBottom(c3);
            assert.deepEqual(dc.children.reduce(r).name, 'c3c2c1');
            dc.setBottom(c1, c2);
            assert.deepEqual(dc.children.reduce(r).name, 'c3c1c2');
            dc.setBottom(c3, c2);
            assert.deepEqual(dc.children.reduce(r).name, 'c1c3c2');
        });
        it("移除子节点，容器 length - 1", () => {
            let num = dc.children.length;
            dc.removeChild(c1);
            dc.removeChild(c2);
            dc.removeChild(c3);
            assert.deepEqual(dc.children.length, num - 3);
        });
    });
});