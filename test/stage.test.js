import assert from 'assert';
import {Event} from 'tigerface-event';
import Stage from '../src/tigerface-display/Stage';
import { JSDOM } from "jsdom";
const {document} = new JSDOM(`<!DOCTYPE html><div></div>`).window;
const dom = document.querySelector('div');

describe('测试舞台对象 Stage', () => {
    describe('初始化', () => {
        it('正常', () => {
            let stage = new Stage({}, dom);
        });
    });
});