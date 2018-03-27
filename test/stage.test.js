import assert from 'assert';
import { Event } from 'tigerface-event';
import { Stage, CanvasLayer, DomSprite, CanvasSprite } from 'tigerface-display';
import { JSDOM } from "jsdom";
const jquery = require('jquery');

const win = new JSDOM(`<!DOCTYPE html><div></div>`).window;

global.$ = jquery(win);
global.window = win;
global.document = win.document;


describe('测试舞台对象 Stage', () => {
    it('初始化正常', () => {
        let stage = new Stage();
        let l1 = new CanvasLayer();
        let l2 = new DomSprite();
        let d1 = new CanvasSprite();
        stage.addChild(l1);
        stage.addChild(l2);
        l1.addChild(d1);
    });
});