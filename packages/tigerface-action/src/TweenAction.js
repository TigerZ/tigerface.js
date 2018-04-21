/* eslint-disable no-return-assign,no-mixed-operators */
import { Event, EventDispatcher, FrameEventGenerator } from 'tigerface-event';
import { Utilities as T } from 'tigerface-common';
import Tween from './Tween';

/**
 * 补间引擎
 * @type {*|void}
 */
class TweenAction extends EventDispatcher {
    /**
     * 补间引擎构造器。<br>
     *     构造器执行后即开始运行。
     *     本构造器支持两种参数传入方法：1个参数对象，或者，7个单独参数；
     *     其中1个参数对象的写法，还可传入用户提供的callback函数，引擎会在新值产生时调用此函数。
     * @param target 补间目标对象
     * @param options 补间选项 {prop 补间修改的属性，end 结束值，effect 效果，time 时长（毫秒数），digits 保留小数位数（可选，缺省为整数），adapter 采样引擎}
     */
    constructor(target, options = {}) {
        super({
            className: 'TweenAction',
        });

        const {
            prop,
            end,
            effect = Tween.Linear.easeOut,
            time = 1000,
            digits = 0,
            adapter = new FrameEventGenerator(),
        } = options;

        const {
            start = target[prop],
            yoyoEffect = effect,
        } = options;

        this.assign({
            target,
            prop,
            startValue: start,
            endValue: end,
            effect,
            time,
            digits,
            yoyoEffect,
            adapter,
        });
    }

    changeTargetValue(value, elapsed) {
        if (this.lastV === value) return;// 避免重复发送事件

        this.lastV = value;
        this.target[this.prop] = value;

        this.dispatchEvent(Tween.Event.MOTION_CHANGED, {
            value,
            time: elapsed,
        });
    }

    run = () => {
        const now = +new Date();
        const elapsed = now - this.startTime;

        if (now >= this.endTime) {
            this.end();
        } else {
            let newValue = this.effect(elapsed, this.startValue, this.diff, this.time);
            newValue = T.round(newValue, this.digits);
            this.changeTargetValue(newValue, elapsed);
        }
    }

    /**
     * 补间引擎开始运行
     */
    start() {
        this.end();
        this._start_();
    }

    _start_() {
        this.diff = this.endValue - this.startValue;
        if (this.diff === 0) {
            this.dispatchEvent(Tween.Event.MOTION_FINISH);
            return;
        };
        this.startTime = +new Date();
        this.endTime = this.startTime + this.time;
        this.changeTargetValue(this.startValue, 0);
        this.running = true;
        this.adapter.addEventListener(Event.REDRAW, this.run);
        this.dispatchEvent(Tween.Event.MOTION_START);
    }

    /**
     * 补间引擎运行结束
     */
    end() {
        if (!this.running) return;
        this.running = false;
        this.adapter.removeEventListener(Event.REDRAW, this.run);
        this.changeTargetValue(this.endValue);
        this.dispatchEvent(Tween.Event.MOTION_FINISH);
    }

    /**
     * 停止/打断引擎运行
     */
    stop() {
        if (!this.running) return;
        this.running = false;
        this.adapter.removeEventListener(Event.REDRAW, this.run);
        this.changeTargetValue(this.lastV);
        this.dispatchEvent(Tween.Event.MOTION_STOP);
    }

    /**
     * 按照之前的参数，反向运行。此方法通常在 Tween.Event.MOTION_FINISH 事件侦听函数里写。
     * @param effect 可为yoyo方法制定别的动作效果。
     */
    yoyo(effect) {
        this.end();

        if (effect) this.yoyoEffect = effect;

        const _effect = this.effect;
        this.effect = this.yoyoEffect;
        this.yoyoEffect = _effect;

        const _value = this.startValue;
        this.startValue = this.endValue;
        this.endValue = _value;

        this._start_();
    }

    set onStart(func) {
        this.addEventListener(Tween.Event.MOTION_START, func);
    }

    set onFinish(func) {
        this.addEventListener(Tween.Event.MOTION_FINISH, func);
    }

    set onStop(func) {
        this.addEventListener(Tween.Event.MOTION_STOP, func);
    }

    set onChanged(func) {
        this.addEventListener(Tween.Event.MOTION_CHANGED, func);
    }
}

export default TweenAction;
