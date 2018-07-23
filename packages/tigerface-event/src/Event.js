module.exports = {
    KeyCode: {
        SPACE: 32,
        D: 68,
        K: 75,
        S: 83,
        P: 80,
        LEFT: 37,
        RIGHT: 39,
        UP: 38,
        DOWN: 40,
    },

    KeyEvent: {
        // 键盘事件
        KEY_DOWN: 'keydown',
        KEY_UP: 'keyup',
        KEY_PRESS: 'keypress',
    },

    MouseEvent: {
        // 鼠标事件
        MOUSE_DOWN: 'mousedown',
        MOUSE_UP: 'mouseup',
        MOUSE_MOVE: 'mousemove',
        MOUSE_OUT: 'mouseout',
        MOUSE_OVER: 'mouseover',
        CLICK: 'click',
        DOUBLE_CLICK: 'dblclick',
        CONTEXT_MENU: 'contextmenu',

        DRAG_START: 'dragstart',
        DRAG_END: 'dragend',
        DRAG: 'drag',

        SCROLL_START: 'Event.MouseEvent.SCROLL_START',
        SCROLL_END: 'Event.MouseEvent.SCROLL_END',
        SCROLL: 'Event.MouseEvent.SCROLL',
    },

    TouchEvent: {
        // 触摸事件
        TOUCH_START: 'touchstart',
        TOUCH_MOVE: 'touchmove',
        TOUCH_END: 'touchend',
        TOUCH_CANCEL: 'touchcancel',
        TOUCH_START_PINCH: 'Event.TouchEvent.TOUCH_START_PINCH',
        TOUCH_MOVE_PINCH: 'Event.TouchEvent.TOUCH_MOVE_PINCH',
    },

    ActionEvent: {
        ACTION_START: 'Event.ActionEvent.ACTION_START',
        ACTION_END: 'Event.ActionEvent.ACTION_END',
        ACTION_CHANGE: 'Event.ActionEvent.ACTION_CHANGE',
    },

    NodeEvent: {
        CHILD_ADDED: 'Event.NodeEvent.CHILD_ADDED',
        CHILD_REMOVED: 'Event.NodeEvent.CHILD_REMOVED',
        CHILDREN_CHANGED: 'Event.NodeEvent.CHILDREN_CHANGED',
    },

    // 循环事件
    REDRAW: 'Event.REDRAW',
    BEFORE_REDRAW: 'Event.BEFORE_REDRAW',
    AFTER_REDRAW: 'Event.AFTER_REDRAW',

    ENTER_FRAME: 'Event.ENTER_FRAME',
    CHILD_CHANGED: 'Event.CHILD_CHANGED',

    // 通用事件
    COMPLETE: 'Event.COMPLETE',
    READY: 'Event.READY',
    FOCUS_CHANGED: 'Event.FOCUS_CHANGED',
    FOCUS: 'focus',
    BLUR: 'blur',
    TRANSITION_END: 'transitionend',

    SCROLL: 'scroll',
    SCROLL_LEFT: 'Event.SCROLL_LEFT',
    SCROLL_RIGHT: 'Event.SCROLL_RIGHT',
    SCROLL_TOP: 'Event.SCROLL_TOP',
    SCROLL_BOTTOM: 'Event.SCROLL_BOTTOM',
    SIZE_CHANGED: 'resize',
    MOVE: 'move',

    STATE_CHANGED: 'Event.STATE_CHANGED',
    APPEND_TO_PARENT: 'Event.APPEND_TO_PARENT',
    APPEND_TO_STAGE: 'Event.APPEND_TO_STAGE',
    APPEND_TO_LAYER: 'Event.APPEND_TO_LAYER',

    ORIENTATION_CHANGE: 'orientationchange',
    ACTION: 'Event.ACTION',
};
