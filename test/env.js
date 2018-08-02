import { JSDOM } from "jsdom";
import jquery from 'jquery';

const win = new JSDOM(`<!DOCTYPE html><div></div>`).window;

global.$ = jquery(win);
global.window = win;
global.document = win.document;

const { $ } = global;

export default $;