import { CanvasSprite, Sprite, DisplayObject } from 'tigerface-display';

const assert = require('assert');

describe('基本测试', () => {
    it('多级继承判断 instanceof 都正确', () => {
        const foo = new CanvasSprite();
        assert(foo instanceof Sprite && foo instanceof DisplayObject);
    });
});