const assert = require('assert');
import {Shape, Circle} from '../src/tigerface-shape';

describe('测试 Shape', () => {
    describe('圆形 Circle', () => {
        it('初始化正常，Shape的抽象方法都实现', () => {
            let c1 = new Circle(100,200,50);
            assert.deepEqual(c1.className, 'Circle');
            c1.rotate(1,{x:10, y:10});
            c1.move(10,10);
            c1.scale(2,2);
            c1.clone();
            let r = c1.getBoundingRect();
            console.log(r);
        });
    });
});