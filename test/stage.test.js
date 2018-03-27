import assert from 'assert';
import { Stage, CanvasLayer, DomLayer } from 'tigerface-display';
import { JSDOM } from "jsdom";
const jquery = require('jquery');

const win = new JSDOM(`<!DOCTYPE html><div></div>`).window;

global.$ = jquery(win);
global.window = win;
global.document = win.document;


describe('测试舞台对象 Stage', () => {
    it('初始化正常', () => {
        const stage = new Stage();
        const layer1 = new DomLayer();
        layer1.name = 'first';
        const layer2 = new CanvasLayer();
        stage.addLayer(layer1);
        stage.addLayer(layer2, 'second');
    });
});