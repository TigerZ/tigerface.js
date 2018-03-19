/* eslint-disable no-undef */
/**
 * Tiger zhangyihu@gmail.com MIT Licensed.
 */
import Logger from './Logger';
import $ from "jquery";

const logger = Logger.getLogger('Utilities');

// Private array of chars to use
const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

export default {

    css: function (dom, name, value, autoPrefix) {
        if (value != undefined) {
            $(dom).css(name, value);
            if (autoPrefix) {
                $(dom).css("-webkit-" + name, value);
                $(dom).css("-moz-" + name, value);
                $(dom).css("-o-" + name, value);
                $(dom).css("-ms-" + name, value);
            }
        } else {
            return $(dom).css(name);
        }
    },

    cssMerge: function (dom, css, autoPrefix) {
        let ext = Object.assign({}, css);
        if (autoPrefix) {
            for (let key in css) {
                ext[key] = css[key];
                ext["-webkit-" + key] = css[key];
                ext["-moz-" + key] = css[key];
                ext["-o-" + key] = css[key];
                ext["-ms-" + key] = css[key];
            }
        }
        this.merge(dom.style, ext);
    },

    removeCss: function (dom, name, autoPrefix) {
        $(dom).css(name, "");
        if (autoPrefix) {
            $(dom).css("-webkit-" + name, "");
            $(dom).css("-moz-" + name, "");
            $(dom).css("-o-" + name, "");
            $(dom).css("-ms-" + name, "");
        }
    },

    addClass: function (dom, name) {
        return $(dom).addClass(name);
    },

    removeClass: function (dom, name) {
        return $(dom).removeClass(name);
    },

    attr: function (dom, name, value) {
        if (arguments.length == 2)
            return $(dom).attr(name);
        else if (arguments.length == 3) {
            $(dom).attr(name, value);
        }
    },

    removeAttr: function (dom, name) {
        $(dom).removeAttr(name);
    },

    /**
     * 获得 Dom 位置，如果修改过 origin 那么 pos 方法返回的位置将与 TigerFace  内部设置不同，所以此方法应该仅在初始化时读取页面元素位置时使用
     * @param dom
     * @returns {{x: jQuery.left, y: jQuery.top}}
     */
    pos: function (dom) {
        let pos = $(dom).position();
        return {x: pos.left, y: pos.top};
    },

    size: function (dom) {
        let $dom = $(dom);
        // console.log("***********", dom.tagName, {width: $dom.width(), height: $dom.height()});
        return {width: $dom.width(), height: $dom.height()};
    },

    scrollTop: function (dom, value) {
        if (arguments.length == 1)
            return $(dom).scrollTop();
        else {
            $(dom).scrollTop(value);
        }
    },

    scrollLeft: function (dom, value) {
        if (arguments.length == 1)
            return $(dom).scrollLeft();
        else {
            $(dom).scrollLeft(value);
        }
    },

    data: function (dom, name, value) {
        if (value != undefined)
            $(dom).data(name, value);
        else
            return $(dom).data(name);
    },

    /**
     * 运行测试用例
     *
     * @param testcase 测试用例函数
     * @param times 执行次数
     * @param answer 期望结果
     * @param args 参数数组
     * @returns {number} 执行毫秒数（结果不符时返回 -1）
     */
    runTest: function (func, times, result, args) {
        let begin, end, ret;
        begin = +new Date();
        for (let i = 0; i < times; i++)
            ret = func.apply(undefined, args);
        end = +new Date();
        if (result === ret)
            return end - begin;
        else {
            logger.debug("Failed", ret, "!=", result);
            return -1;
        }
    },

    /**
     * 当函数被作为Callback调用时，保持函数的this上下文，使得函数内部的this对象依然有效
     *
     * @param thisObj
     * @param func
     * @returns {Function}
     */
    keepThis: function (thisObj, func) {
        return function () {
            func.apply(thisObj, Array.prototype.slice.call(arguments));
        };
    },

    distance: function (p1, p2) {
        let dx = p1.x - p2.x;
        let dy = p1.y - p2.y;

        if (p1.x == p2.x) return Math.abs(dy);
        if (p1.y == p2.y) return Math.abs(dx);

        // 勾股定理
        return Math.sqrt(dx * dx + dy * dy);
    },

    /**
     * 快速舍入，可指定保留小数位数
     *
     * @param num 数字
     * @param digits 小数位数（缺省不保留）
     * @returns {Number} 整数或指定位数的小数
     */
    round: function (num, digits = 0) {

        if (digits === 0) {
            // With a bitwise or.
            // return (0.5 + num) | 0;

            // A double bitwise not.
            // return ~~(0.5 + num);

            // Finally, a left bitwise shift.
            //return (0.5 + num) << 0;
            return Math.round(num);
        } else {
            let factor = Math.pow(10, digits);
            return Math.round(num * factor) / factor;
        }
    },


    /**
     * 产生 1-max 之间的随机整数
     *
     * @param v
     * @returns
     */
    random: function (max) {
        return Math.ceil(Math.random() * max);
    },

    /**
     * 角度转换弧度
     *
     * @param degree
     * @returns {Number}
     */
    degreeToRadian: function (degree) {
        while (degree < 0) {
            degree = degree + 360;
        }
        let d = degree % 360;
        return (d > 0 ? d : (360 + d)) * Math.PI / 180;
    },

    /**
     * 弧度转换角度
     *
     * @param radian
     * @returns {Number}
     */
    radianToDegree: function (radian) {
        let d = radian * 180 / Math.PI;
        while (d < 0) {
            d = d + 360;
        }
        return d % 360;
    },

    /**
     * 克隆对象
     *
     * @param obj
     * @returns {*}
     */
    clone: function (obj) {
        if (this.isArray(obj)) {
            return [].concat(obj);
        } else if (typeof obj === "object")
            return this.extend(obj, {});
        else
            return obj;
    },

    deepEqual: function (a, b) {
        if (typeof a === typeof b) {
            if (typeof a === "object") {
                for (let key in a) {
                    if (!this.deepEqual(a[key], b[key])) return false;
                }
                for (let key in b) {
                    if (!this.deepEqual(a[key], b[key])) return false;
                }
            } else if (this.isArray(a)) {
                if (a.length != b.length) return false;
                for (let i = 0; i < a.length; i++) {
                    if (!this.deepEqual(a[i], b[i])) return false;
                }
            } else if (a != b) return false;
            return true;
        }
        return false;
    },

    assignEqual: function (a, b) {
        if (typeof a === typeof b) {
            if (typeof a === "object") {
                for (let key in b) {
                    if (a[key] !== b[key]) return false;
                }
            } else if (this.isArray(a)) {
                for (let i = 0; i < Math.min(a.length, b.length); i++) {
                    if (a[i]!== b[i]) return false;
                }
            } else if (a !== b) return false;
            return true;
        }
        return false;
    },

    /**
     * 继承（扩展）对象（不影响已存在成员）<br>
     *     将第一个类的全部成员新增至第二个类，跳过已存在的成员，然后返回第二个类
     *
     * @param obj 超类
     * @param extension 子类
     * @returns {*} 返回继承后的子类（改写extension）
     */
    extend: function (obj, extension) {
        for (let key in obj) {
            extension[key] === undefined && (extension[key] = obj[key]);
        }
        return extension;
    },

    /**
     * 合并对象（覆盖已存在成员）<br>
     *     将第二个类的全部成员合并至第一个类，覆盖已存在成员，然后返回第一个类
     *
     * @param obj
     * @param ext
     * @returns {*} 返回合并后的类（改写obj）
     */
    merge: function (obj, ext) {
        if (!obj || !ext) {
            return obj || ext;
        }
        let key;
        for (key in ext) {
            if (obj[key] && ext[key] && typeof obj[key] === 'object' && typeof ext[key] === 'object')
                obj[key] = this.merge(obj[key], ext[key]);
            else
                obj[key] = ext[key];
        }
        return obj;
    },

    inArray: function (obj, arr) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === obj) {
                return i;
            }
        }
        return -1;
    },

    isArray: function (obj) {
        return Object.prototype.toString.apply(obj) === '[object Array]';
    },

    toArray: function (obj) {
        let tmp = [];
        for (let key in obj) {
            tmp.push(obj[key]);
        }
        return tmp;
    },

    reverseArray: function (array) {
        let tmp = [];
        for (let i = 0; i < array.length; i++) {
            tmp.unshift(array[i]);
        }
        return tmp;
    },

    getStrLen: function (str) {
        let len = 0;
        let charCode = -1;
        for (let i = 0; i < str.length; i++) {
            charCode = str.charCodeAt(i);
            if (charCode >= 0 && charCode <= 128) len += 1;
            else len += 2;
        }
        return len;
    },

    /**
     * 检测浏览器类型，目前仅限IOS/Android <br>
     * 方法：检测 navigator.userAgent 是否包含特定字符串（正则表达式），例如：
     *
     *
     * iPhone user agent<br>
     * Mozilla/5.0 (iPhone; U; CPU like Mac OS X; en) AppleWebKit/420+ (KHTML,
     * like Gecko) Version/3.0 Mobile/1A543a Safari/419.3
     *
     * iPod Touch user agent<br>
     * Mozilla/5.0 (iPod; U; CPU like Mac OS X; en) AppleWebKit/420.1 (KHTML,
     * like Gecko) Version/3.0 Mobile/3A101a Safari/419.3
     *
     * iPad user agent<br>
     * Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en-us)
     * AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B334b
     * Safari/531.21.10
     *
     * Android user agent<br>
     * Mozilla/5.0 (Linux; U; Android 1.1; en-gb; dream) AppleWebKit/525.10+
     * (KHTML, like Gecko) Version/3.0.4 Mobile Safari/523.12.2<br>
     * Mozilla/5.0 (Linux; U; Android 2.1; en-us; Nexus One Build/ERD62)
     * AppleWebKit/530.17 (KHTML, like Gecko) Version/4.0 Mobile Safari/530.17
     *
     */
    browser: function () {
        let ua = navigator.userAgent;
        let ios = ua.match(/(iPhone|iPod|iPad)/);
        let android = ua.match(/Android/);
        return {
            isMobile: ios || android,
            isIOS: ios,
            isAndroid: android
        };
    },

    // 下面 UUID 算法原来始修改 Math 方法，我改成修改 Utilities，其它保存原样。
    /*!
     Math.uuid.js (v1.4)
     http://www.broofa.com
     mailto:robert@broofa.com

     Copyright (c) 2010 Robert Kieffer
     Dual licensed under the MIT and GPL licenses.
     */

    /*
     * Generate a random uuid.
     *
     * USAGE: Math.uuid(length, radix)
     *   length - the desired number of characters
     *   radix  - the number of allowable values for each character.
     *
     * EXAMPLES:
     *   // No arguments  - returns RFC4122, version 4 ID
     *   >>> Math.uuid()
     *   "92329D39-6F5C-4520-ABFC-AAB64544E172"
     *
     *   // One argument - returns ID of the specified length
     *   >>> Math.uuid(15)     // 15 character ID (default base=62)
     *   "VcydxgltxrVZSTV"
     *
     *   // Two arguments - returns ID of the specified length, and radix. (Radix must be <= 62)
     *   >>> Math.uuid(8, 2)  // 8 character ID (base=2)
     *   "01001010"
     *   >>> Math.uuid(8, 10) // 8 character ID (base=10)
     *   "47473046"
     *   >>> Math.uuid(8, 16) // 8 character ID (base=16)
     *   "098F4D35"
     */



    uuid: function (len, radix) {
        let chars = CHARS, uuid = [], i;
        radix = radix || chars.length;

        if (len) {
            // Compact form
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
            // rfc4122, version 4 form
            let r;

            // rfc4122 requires these characters
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';

            // Fill in random data.  At i==19 set the high bits of clock sequence as
            // per rfc4122, sec. 4.1.5
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }

        return uuid.join('');
    },

    // A more performant, but slightly bulkier, RFC4122v4 solution.  We boost performance
    // by minimizing calls to random()
    uuidFast: function () {
        let chars = CHARS, uuid = new Array(36), rnd = 0, r;
        for (let i = 0; i < 36; i++) {
            if (i == 8 || i == 13 || i == 18 || i == 23) {
                uuid[i] = '-';
            } else if (i == 14) {
                uuid[i] = '4';
            } else {
                if (rnd <= 0x02) rnd = 0x2000000 + (Math.random() * 0x1000000) | 0;
                r = rnd & 0xf;
                rnd = rnd >> 4;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
        return uuid.join('');
    },

    // A more compact, but less performant, RFC4122v4 solution:
    uuidCompact: function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },

    /**
     * 转换页面坐标为内部坐标
     * 注意：当 DOM 旋转后，得到的是外接矩形的内部坐标！！！
     * @param dom
     * @param pageX
     * @param pageY
     * @returns {{x:number, y:number}}
     * @private
     */
    pagePosToDomPos: function (dom, pageX, pageY) {
        let pos = $(dom).offset();
        if (dom === document)
            return {x: pageX, y: pageY};
        else {
            let offsetLeft = parseFloat(this.css(dom, "margin-left")) + parseFloat(this.css(dom, "padding-left"));
            let offsetTop = parseFloat(this.css(dom, "margin-top")) + parseFloat(this.css(dom, "padding-top"));
            return {x: pageX - pos.left + offsetLeft, y: pageY - pos.top + offsetTop};
        }
    },

    domPosToPagePos: function (dom, domX, domY) {
        let pos = $(dom).offset();
        if (dom === document)
            return {x: domX, y: domY};
        else {
            let offsetLeft = parseFloat(this.css(dom, "margin-left")) + parseFloat(this.css(dom, "padding-left"));
            let offsetTop = parseFloat(this.css(dom, "margin-top")) + parseFloat(this.css(dom, "padding-top"));
            return {x: domX + pos.left - offsetLeft, y: domY + pos.top - offsetTop};
        }
    }
}
