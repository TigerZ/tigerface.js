//import {describe} from 'tigerface-test';
const assert = require('assert');
const {EventDispatcher} = require('tigerface-event');

let dispatcher = new EventDispatcher();
let subscriber = new EventDispatcher();

let listener = (e) => {
    e.done();
};

describe('测试事件分发器 EventDispatcher', () => {
    describe('注册事件侦听器 addEventListener()', () => {

        it('注册后事件侦听器列表数量增加 1', () => {
            let num = dispatcher.getEventListeners('aaa').length;
            dispatcher.addEventListener('aaa', listener);
            assert.deepEqual(dispatcher.getEventListeners('aaa').length, num+1)
        });
        it('注册后同一事件侦听器，列表数量不增加', () => {
            let num = dispatcher.getEventListeners('aaa').length;
            dispatcher.addEventListener('aaa', listener);
            assert.deepEqual(dispatcher.getEventListeners('aaa').length, num)
        });
    });

    describe('发送同步事件 dispatchEvent()', () => {
        it('接收成功', (done) => {
            dispatcher.dispatchEvent('aaa', {done:done});
        });
    });

    describe('发送异步事件 dispatchAsyncEvent()', () => {
        it('接收成功', (done) => {
            dispatcher.dispatchAsyncEvent('aaa', {done:done});
        });
    });

    describe('移除事件侦听器 removeEventListener()', () => {
        it('移除后，列表侦听器数量 -1', () => {
            let num = dispatcher.getEventListeners('aaa').length;
            dispatcher.removeEventListener('aaa', listener);
            assert.deepEqual(dispatcher.getEventListeners('aaa').length, num - 1);
        });
    });

    describe('注册事件订阅者 addEventSubscriber()', () => {
        it('分发者添加订阅者，订阅者列表数量 + 1', () => {
            let num = dispatcher.getEventSubscribers().length;
            dispatcher.addEventSubscriber(subscriber);
            assert.deepEqual(dispatcher.getEventSubscribers().length, num + 1);
        });
        it('分发者发送事件，订阅者接收成功', (done) => {
            subscriber.addEventListener('aaa', listener);
            dispatcher.dispatchEvent('aaa', {done:done});
        });
    });
});