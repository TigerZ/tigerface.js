/**
 * User: zyh
 * Date: 2018/2/27.
 * Time: 13:01.
 */
import Shape from './Shape';
import {convertVertexArray} from './Vertex'
import Line from './Line';

/**
 * 多边形类<br>
 *     多边形类是其它图形的基类
 */

export default class Polygon extends Shape {
    /**
     * 多边形构造器
     * @param points 多边形顶点数组（注意：必须按连线顺序）
     */
    constructor(points) {
        super();
        if (points)
            this.initPolygon(points);

        this.className = Polygon.name;
    }

    initPolygon(points) {
        this.points = convertVertexArray(points);

        for (var i = 0; i < this.points.length; i++) {
            this.points[i].owner = this;
        }


        //console.log("this.points", this.points);

        // 提取边
        this.sides = this._getSides();
        // 提取外接矩形
        this.boundingRect = this._getBoundingRect_();
    }

    /**
     * 提取外接矩形
     *
     * @returns {{left: Number, top: Number, width: Number, height: Number}}
     * @private
     */
    _getBoundingRect_() {
        var left = this.points[0].x, right = left;
        var top = this.points[0].y, bottom = top;
        for (var i = 1; i < this.points.length; i++) {
            left = Math.min(left, this.points[i].x);
            right = Math.max(right, this.points[i].x);
            top = Math.min(top, this.points[i].y);
            bottom = Math.max(bottom, this.points[i].y);
        }
        return {
            left: left,
            top: top,
            right: right,
            bottom: bottom,
            width: right - left,
            height: bottom - top
        };
    }



    /**
     * 返回外接矩形的宽度
     *
     * @returns {Number}
     */
    getWidth() {
        return this.getBoundingRect().width;
    }

    /**
     * 返回外接矩形的高度
     *
     * @returns {Number}
     */
    getHeight() {
        return this.getBoundingRect().height;
    }

    /**
     * 创建相同的多边形实例
     *
     * @returns {Polygon}
     */
    clone() {
        return new Polygon(this.points);
    }

    /**
     * 返回顶点数组
     *
     * @returns {Array}
     * @private
     */
    _getVertexes() {
        return this.points;
    }

    /**
     * 返回外接矩形顶点数组
     *
     * @returns {Array}
     */
    getVertexes() {
        if (!this.vertexes)
            this.vertexes = this._getVertexes();
        return this.vertexes;
    }

    /**
     * 顶点数
     *
     * @returns
     */
    countVertexes() {
        return this.getVertexes().length;
    }

    /**
     * 返回边数组
     *
     * @returns {Array}
     * @private
     */
    _getSides() {
        var lines = [];
        var points = this.getVertexes();
        var p1, p2;
        p1 = points[0];
        for (var i = 1; i <= points.length; i++) {
            p2 = points[i % points.length];
            var side = new Line(p1, p2);
            lines.push(side);
            p1 = p2;
        }
        return lines;
    }

    /**
     * 返回边数组（缓存）
     *
     * @returns {Array}
     */
    getSides() {
        if (!this.sides)
            this.sides = this._getSides();
        return this.sides;
    }

    /**
     * 边数
     *
     * @returns
     */
    countSides() {
        return this.getSides().length;
    }

    /**
     * 测试外接矩形是否包含另一个多边形的外接矩形
     *
     * @param polygon 另一多边形
     * @returns {boolean}
     * @private
     */
    _containsByBoundingRect(polygon) {
        var rect1 = this.getBoundingRect();
        var s1 = new Point(rect1.left, rect1.top);
        var e1 = new Point(rect1.left + rect1.width, rect1.top + rect1.height);

        var rect2 = polygon.getBoundingRect();
        var s2 = new Point(rect2.left, rect2.top);
        var e2 = new Point(rect2.left + rect2.width, rect2.top + rect2.height);

        // 判断外接矩形是否重合
        return Math.max(s1.x, e1.x) >= Math.min(s2.x, e2.x)
            && Math.max(s2.x, e2.x) >= Math.min(s1.x, e1.x)
            && Math.max(s1.y, e1.y) >= Math.min(s2.y, e2.y)
            && Math.max(s2.y, e2.y) >= Math.min(s1.y, e1.y);
    }

    /**
     * 测试本多边形是否包含另一个多边形
     *
     * @param polygon
     *            测试被保护的多边形
     */
    contains(polygon) {

        // 判断外接矩形是否包含
        var success = this._containsByBoundingRect(polygon);

        if (success) {
            /*
             首先检测被包含的一侧是否全部顶点都在本多边形内部。
             */
            var points = polygon.getVertexes();
            for (var i = 0; i < points.length; i++) {
                // 如果polygon的任一顶点碰撞失败，就返回不包含
                if (!this.hitTestPoint(points[i])) {
                    return false;
                }
            }
            /*
             外部多边形如果是凹多边形，有可能发生凹角进入内部多边形一边的情况。
             此时虽然内部多边形的全部点都在外部多边形内，外部多边形的顶点却可能进入内部多边形
             所以反过来检测点碰撞，避免这种情况。
             */
            points = this.getVertexes();
            for (var i = 0; i < points.length; i++) {
                // 如果polygon的任一顶点碰撞失败，就返回不包含
                if (!polygon.hitTestPoint(points[i])) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    /**
     * 判断点是否与外接矩形碰撞，用于做粗略碰撞测试，在精细碰撞测试前应该先做粗略碰撞测试
     *
     * @param point
     * @returns {boolean}
     * @private
     */
    _hitTestPointByBoundingRect(point) {
        return point.x >= this.boundingRect.left
            && point.x <= this.boundingRect.left + this.boundingRect.width
            && point.y >= this.boundingRect.top
            && point.y <= this.boundingRect.top + this.boundingRect.height;
    }

    /**
     * 判断矩形是否与外接矩形碰撞，用于外接矩形间的粗略碰撞测试，在精细测试前应该先做此测试
     * @param rect2
     * @returns {boolean}
     * @private
     */
    _hitTestRectByBoundingRect(rect2) {
        var rect1 = this.getBoundingRect();
        if ((rect1.right >= rect2.left)
            && (rect1.left <= rect2.right)
            && (rect1.bottom >= rect2.top)
            && (rect1.top <= rect2.bottom))
            return true;
        return false;
    }

    /**
     * 判断点是否与此多边形碰撞
     *
     * @param point 指定点
     * @returns {boolean}
     */
    hitTestPoint(point) {

        // 先检测基本范围，如果点位于包裹矩形之外，那么就没必要继续检测
        if (!this._hitTestPointByBoundingRect(point)) {
            return false;
        }

        // 如果点就是顶点，那么直接返回 true
        for (var i = 0; i < this.getVertexes().length; i++) {
            if (this.getVertexes()[i].equals(point)) {
                return true;
            }
        }

        // 射线法检测：如果此点在多边形内，那么从此点发出的射线，与此多边形的边相交的次数，比为奇数
        var p1, p2;
        var xCount = 0;

        p1 = this.getVertexes()[0];
        // 注意：下面for循环的边界故意越界，因为第一点既是起始顶点又是结束顶点。但获取顶点时，一定要用[i %
        // this.points.length]来获取
        for (var i = 1; i <= this.getVertexes().length; i++) {
            p2 = this.getVertexes()[i % this.getVertexes().length];
            // 只判断右侧的边
            //
            // 只检查射线位于两顶点之间的线段（即：检测点的y位于两顶点的y之间）
            if (point.y > Math.min(p1.y, p2.y) && point.y < Math.max(p1.y, p2.y)) {
                // 如果边是垂线，那么肯定相交，交点数+1
                if (p1.x == p2.x) {
                    // 如果点在线上，直接返回true
                    if (p1.x == point.x) {
                        return true;
                    }
                    // 如果垂线位于右侧，交点数+1
                    if (p1.x > point.x) {
                        xCount++;
                    }
                } else {
                    // 根据等角定理算出，交点的x坐标，再与p的y坐标组成交点
                    var x0 = (point.y - p1.y) * (p2.x - p1.x) / (p2.y - p1.y) + p1.x;

                    // 如果点在线上，直接返回true
                    if (x0 == point.x) {
                        return true;
                    }

                    // 如果交点位于右侧，交点数+1
                    if (x0 > point.x) {
                        xCount++;
                    }

                }
            } else if (point.y == p2.y && point.x <= p2.x) { // 如果射线穿过第二顶点
                // 下一顶点
                var p3 = this.getVertexes()[(i + 1) % this.getVertexes().length];

                // 如果不可能与下一条边相交，交点+1
                if (point.y >= Math.min(p1.y, p3.y) && point.y <= Math.max(p1.y, p3.y)) {
                    xCount++;
                }
                // 否则交点+2，因为只判断第二顶点
                else {
                    xCount += 2;
                }
            }

            p1 = p2;
        }
        if (xCount % 2 != 0) {
            return true;
        }

        return false;
    }

    /**
     * 线段碰撞检测
     * @param line
     * @returns {boolean}
     */
    hitTestLine(line) {
        var sides = this.getSides();
        for (var i = 0; i < sides.length; i++) {
            if (sides[i].hasIntersection(line)) {
                return true;
            }
        }
    }

    /**
     * 多边形碰撞测试
     *
     * @param polygon
     * @returns {boolean}
     */
    hitTestPolygon(polygon) {

        // 如果包含则返回True
        if (this.contains(polygon) || polygon.contains(this)) return true;

        // 先做外接矩形间的粗略碰撞测试
        if (!this._hitTestRectByBoundingRect(polygon.getBoundingRect())) {
            return false;
        }

        // 与圆形的碰撞检测
        if (polygon.className == "Circle") {
            //console.log("hit", "Circle");
            return polygon.hitTestPolygon(this);
        }

        // 与矩形的碰撞检测
        //console.log("hit", this.className, polygon.className);
        if (this.className == "Rectangle" && polygon.className == "Rectangle") {
            //console.log("hit", "Rectangle");
            return this.hitTestRectangle(polygon);
        }

        // 检测边碰撞
        var sides2 = polygon.getSides();
        for (var i = 0; i < sides2.length; i++) {
            var side = sides2[i];
            if (this.hitTestLine(side)) {
                //console.log("hit", "边碰");
                return true;
            }
        }

        // 检测点边碰撞
        var points1 = this.getVertexes();
        for (var i = 0; i < points1.length; i++) {
            var p = points1[i];
            for (var j = 0; j < sides2.length; j++) {
                var s = sides2[j];
                if (s.hitTestPoint(p)) {
                    //console.log("hit", "点边碰");
                    return true;
                }
            }
        }

        // 反向检测点边碰撞
        var points2 = polygon.getVertexes();
        var sides1 = this.getSides();
        for (var i = 0; i < points2.length; i++) {
            var p = points2[i];
            for (var j = 0; j < sides1.length; j++) {
                var s = sides1[j];
                if (s.hitTestPoint(p)) {
                    //console.log("hit", "反向点边碰");
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * 转换圆角
     *
     * @param radius
     * @param precision
     * @returns {Polygon}
     */
    convertRounded(radius, precision) {
        (precision != undefined) || (precision = 10);
        var points = this.getVertexes(precision);
        var newPoints = [];
        var p1, p2;
        p1 = points[0];
        var rp0, rp1, rp2;
        // 注意：下面for循环的边界故意越界，因为第一点既是起始端点又是结束端点。但获取端点时，一定要用[i %
        // this.points.length]来获取
        for (var i = 1; i <= points.length; i++) {
            p2 = points[i % points.length];
            var slope = Math.atan2(p2.y - p1.y, p2.x - p1.x);
            var x = Math.cos(slope) * radius;
            var y = Math.sin(slope) * radius;
            rp1 = new Point(p1.x + x, p1.y + y);
            if (rp2) {
                var curvePoints = new QuadraticBezier(rp2, p1, rp1, precision).getPoints();
                newPoints = newPoints.concat(curvePoints);
            } else {
                rp0 = rp1;
            }

            rp2 = new Point(p2.x - x, p2.y - y);
            p1 = p2;
        }
        if (rp2) {
            var curvePoints = new QuadraticBezier(rp2, p1, rp0, precision).getPoints();
            newPoints = newPoints.concat(curvePoints);
        }
        return new Polygon(newPoints);
    }

    /**
     * 获取与直线段交点
     *
     * @param line
     * @returns {Array | undefined}
     */
    getIntersectionOfLine(line) {
        // 原理：遍历全部边，直到找到交点，或失败。
        var sides = this.getSides();
        var ips = [];
        for (var i in sides) {
            var p = sides[i].getIntersection(line);
            if (p) {
                ips.push({side: sides[i], point: p});
            }
        }
        // 按与 line 起点的距离排序交点
        ips.sort(function (a, b) {
            return a.point.getDistance(line.p0) - b.point.getDistance(line.p0);
        });
        return ips.length > 0 ? ips : undefined;
    }

    /**
     * 旋转
     * @param radian 弧度
     * @param origin 原点 可选，缺省为（0，0）
     * @returns {Polygon}
     */
    rotate(radian, origin) {
        var points = this.getVertexes();
        var newPoints = [];
        for (var i in points) {
            newPoints.push(points[i].rotate(radian, origin));
        }
        return new Polygon(newPoints);
    }

    /**
     * 移动
     *
     * @param offsetX X轴平移量
     * @param offsetY Y轴平移量
     * @returns {Polygon}
     */
    move(offsetX, offsetY) {
        var points = this.getVertexes();
        var newPoints = [];
        for (var i in points) {
            newPoints.push(points[i].move(offsetX, offsetY));
        }
        return new Polygon(newPoints);
    }

    /**
     * 缩放
     *
     * @param scaleX
     * @param scaleY
     * @returns {Polygon}
     */
    scale(scaleX, scaleY) {
        var points = this.getVertexes();
        var newPoints = [];
        for (var i in points) {
            newPoints.push(points[i].scale(scaleX, scaleY));
        }
        return new Polygon(newPoints);
    }

    merge(polygon, g) {
        var debug = true;

        var s1 = this;
        var s2 = polygon;

        // 如果一个多边形包含另一个，那么直接返回
        if (s1.contains(s2)) return s1;
        if (s2.contains(s1)) return s2;

        // 准备新多边形顶点数组
        var nps = [];
        var passed = [];

        // 记录点的方法，负责添加点，并且和前点链起来
        var record = function (p) {
            var v = new Shape.Vertex(p.x, p.y);
            if (nps.length > 0) {
                nps[nps.length - 1].next = v;
                var l = new Line(nps[nps.length - 1], v);
                if (!isPassed(l)) passed.push(l);
                else return false;
            }
            nps.push(v);
            v.next = nps[0];
            //console.log(v.toString());
            if (g) g.drawPoint(v);
            return true;
        }

        var isPassed = function (l) {
            for (var i = 0; i < passed.length; i++) {
                if (passed[i].p0.equals(l.p0) && passed[i].p1.equals(l.p1)) return true;
            }
            return false;
        }

        // 本该先检测两多边形碰撞，但后面要先获得最远没碰撞点，所以就省了
        // 先得到中点
        var rect2 = s2.getBoundingRect();
        var pc2 = new Shape.Point(rect2.left + rect2.width / 2, rect2.top + rect2.height / 2);
        // 寻找最远未碰撞点
        var p;
        for (var i = 0; i < s1.getVertexes().length; i++) {
            if (!s2.hitTestPoint(s1.getVertexes()[i])) {
                if (p == undefined || p.getDistance(pc2) < s1.getVertexes()[i].getDistance(pc2)) {
                    p = s1.getVertexes()[i];
                }
            }
        }
        // 如果没找到，反过来找
        if (!p) {
            var rect1 = s1.getBoundingRect();
            var pc1 = new Shape.Point(rect1.left + rect1.width / 2, rect1.top + rect1.height / 2);
            for (var i = 0; i < s2.getVertexes().length; i++) {
                if (!s1.hitTestPoint(s2.getVertexes()[i])) {
                    if (p == undefined || p.getDistance(pc1) < s2.getVertexes()[i].getDistance(pc1)) {
                        p = s2.getVertexes()[i];
                    }
                }
            }
        }

        // 找到未碰撞点才能开始
        if (p) {
            var p0 = p;

            // 其实无错的情况下，寻找边界的过程不会无限循环，所以可以用个死循环来包裹，但为安全起见，使用两多边形的顶点积作为极限
            var tot = s1.getVertexes().length * s2.getVertexes().length;
            //tot = 26;
            var t = 0;
            do {
                // 每次进入循环的点，一定是外部点，先记录
                //if(debug) console.log("* 记录点", t, (p.owner === s1 ? "s1" : "s2"), p.toString(), p.friend ? ("friend=" + (p.owner === s1 ? "s2 " : "s1 ") + p.friend.toString()) : "");
                var ignore = false;
                if (!record(p)) {
                    //console.log("记录失败，说明走了老路");
                    //g.drawPoint(p);
                    ignore = true;
                    nps.pop();
                    p = p.prev.prev.prev;
                }

                // 判断交点
                var ips = (p.owner === s1 ? s2 : s1).getIntersectionOfLine(p.getSide());

                // 先过滤无效的交点
                if (ips) {
                    for (var i = ips.length - 1; i >= 0; i--) {
                        // 当前点就是交点
                        if (p.equals(ips[i].point)) {
                            //if(debug) console.log("当前点就是交点，放弃此交点");
                            ips.splice(i, 1);
                            continue;
                        }
                        // 发现碰撞在顶点上，移除交点前一边。因为前一边无意义，后一边才是要考虑是否保留的
                        if (ips[i].point.equals(ips[i].side.p1)) {
                            //if(debug) console.log("发现碰撞在顶点上，移除交点前一边");
                            ips.splice(i, 1);
                            continue;
                        }
                        // 交点在之前的边上，还是因为前一边无意义
                        if (p.prev && p.prev.next && p.prev.next.equals(ips[i].side.p1)) {
                            //if(debug) console.log("交点就是之前的边", p.prev.next.toString(), ips[i].point.toString());
                            ips.splice(i, 1);
                            continue;
                        }

                    }
                }

                // 保存当前的边（结束点）留给下一交点过滤时使用
                var prev = p;

                // 如果获得了交点，开始四种情况的检查
                if (!ignore && ips && ips.length > 0) { // 有交点
                    //**************** debug begin **********************
                    //if(debug) {
                    //    var str = "";
                    //    for (var i = 0; i < ips.length; i++) {
                    //        if (i > 0) str += ","
                    //        str += "{" + ips[i].point.toString() + " side=" + ips[i].side.p1 + "}";
                    //    }
                    //    console.log("发现交点", (p.owner === s1 ? "s2" : "s1"), str);
                    //    if (ips[0].point.x == 291.04176257809934 && ips[0].point.y == 153.85728378822756)
                    //        g.drawPoint(ips[0].point);
                    //}
                    //**************** debug end ********************

                    // 交点是本边结束点
                    if (p.next.equals(ips[0].point)) {
                        //if(debug) console.log("点碰");
                        // 点点碰或点边碰处理相同
                        // 点点碰特点：当前边结束，下一边和交点边都从交点开始，角度小的为外围边
                        // ns 下一边，is 交点边
                        var ps = T.radianToDegree(new Line(ips[0].point, p).getSlope());
                        var ns = T.radianToDegree(new Line(ips[0].point, p.next.next).getSlope());
                        var is = T.radianToDegree(ips[0].side.getSlope());
                        if (ps > ns) {
                            ns = ns + 360;
                        }
                        if (ps > is) {
                            is = is + 360;
                        }
                        //if(debug) console.log("前一边", ps, "后一边", ns, "交点边", is);
                        if (ns > is) {
                            var ip = ips[0].point, side = ips[0].side;
                            p = new Shape.Vertex(ip.x, ip.y);
                            p.next = side.p1;
                            p.prev = prev;
                            p.owner = p.next.owner;
                            if (p === p0) break;
                            //p.friend = friend;
                            //g.drawLine(p.getSide());
                            continue;
                        } else {
                            p.firend = ips[0].side.p1;
                        }
                    } else {
                        if (ips[0].point.equals(ips[0].side.p0)) { // 边点碰
                            //if(debug) console.log("边点碰");
                            // 边点碰特点：当前边和交点边都从交点开始，角度小的为外围边
                            // ps 当前边，is 交点边
                            var ps = T.radianToDegree(new Line(ips[0].point, p).getSlope());
                            var ns = T.radianToDegree(new Line(ips[0].point, p.next).getSlope());
                            var is = T.radianToDegree(ips[0].side.getSlope());
                            if (ps > ns) {
                                ns = ns + 360;
                            }
                            if (ps > is) {
                                is = is + 360;
                            }
                            //g.drawLine(ips[0].side)
                            //if(debug) console.log("前一边", ps, "后一边", ns, "交点边", is);
                            if (ns > is) {
                                var ip = ips[0].point, side = ips[0].side;
                                p = new Shape.Vertex(ip.x, ip.y);
                                p.next = side.p1;
                                p.prev = prev;
                                p.owner = p.next.owner;
                                if (p === p0) break;
                                //if(debug) console.log("边点碰，转为交点边");
                                continue;
                            }
                        } else { // 边边碰
                            //if(debug) console.log("边边碰");
                            // 边边碰特点：边边碰情况简单，交点边一定是外围边
                            var ip = ips[0].point, side = ips[0].side;

                            p = new Shape.Vertex(ip.x, ip.y);
                            p.next = side.p1;
                            //g.drawLine(p.getSide());
                            p.prev = prev;
                            p.owner = p.next.owner;
                            if (p === p0) break;
                            //if(debug) console.log("边边碰，转为交点边");
                            continue;
                        }
                        p.prev = prev;
                    }

                }
                // 无交点
                if (ignore) {
                    //if(debug) console.log("忽略路径", p);
                    //g.drawPoint(p);
                    //g.drawPoint(p.next);
                }
                p = p.next;
                p.prev = prev;
                if (p === p0) break;
                //if(debug) console.log("继续当前多边形边");
            } while (++t < tot)

            // debug
            //if (nps.length > 2)
            //    g.drawCurve(new Curve(nps));

            // debug
            if (t > 20) {
                return undefined;
            }

            if (p === p0) {
                //if(debug) console.log("*** 正常结束 ***");
                if (nps.length > 2)
                    return new Shape.Polygon(nps);
            }

            //if(debug) console.log("*** 非正常结束，检查是否存在合并错误 ***");

        }

        return undefined;
    }

    //,
    /*
     merge2: function (polygon, g) {
     var s1 = this;
     var s2 = polygon;

     if (s1.contains(s2)) return s1;
     if (s2.contains(s1)) return s2;

     var nps = [];
     var record = function (p) {
     var v = new Shape.Vertex(p.x, p.y);
     if (nps.length > 0) {
     nps[nps.length - 1].next = v;
     }
     nps.push(v);
     v.next = nps[0];
     //console.log(v.toString());
     if (g) g.drawPoint(v);
     }

     if (s1.hitTestPolygon(s2)) {
     //var rect = s2.getBoundingRect();
     //var pc2 = new Shape.Point(rect.left + rect.width / 2, rect.top + rect.height / 2);

     // 找到最远的没碰撞点
     var p;
     for (var i = 0; i < s1.getVertexes().length; i++) {
     if (!s2.hitTestPoint(s1.getVertexes()[i])) {
     if (p == undefined || p.getDistance(pc2) < s1.getVertexes()[i].getDistance(pc2)) {
     p = s1.getVertexes()[i];
     }
     }
     }

     var p0 = p;
     var tot = s1.getVertexes().length * s2.getVertexes().length;
     //tot = 4;
     var t = 0;
     if (p) { // 开始运行
     do {
     //console.log("记录点", t, (p.owner === s1 ? "s1" : "s2"), p.toString(), p.friend ? ("friend=" + (p.owner === s1 ? "s2 " : "s1 ") + p.friend.toString()) : "");
     record(p);
     // 判断与另一多边形是否有交点
     var ips = (p.owner === s1 ? s2 : s1).getIntersectionOfLine(p.getSide());

     if (ips) {
     var end = false;
     // 识别是否碰撞在顶点上
     for (var i = ips.length - 1; i >= 0; i--) {
     // 当前点就是交点
     if (p.equals(ips[i].point)) {
     //console.log("当前点就是交点");
     ips.splice(i, 1);
     continue;
     }
     // 交点就是之前的边
     if (p.friend && p.friend.equals(ips[i].side.p1)) {
     console.log("交点就是之前的边", p.friend.toString(), ips[i].point.toString());
     ips.splice(i, 1);
     continue;
     }
     // 发现碰撞在顶点上，移除交点前一边
     if (ips[i].point.equals(ips[i].side.p1)) {
     //console.log("发现碰撞在顶点上，移除交点前一边");
     ips.splice(i, 1);
     continue;
     }
     // 发现两顶点为交点，放弃此交点
     if (ips[i].point.equals(ips[i].side.p0) && p.next.equals(ips[i].point)) {
     //console.log("发现两顶点为交点，放弃此交点");
     ips.splice(i, 1);
     continue;
     }
     }

     if (end) break;
     }

     p.isBegin = false;

     if (ips && ips.length > 0) {
     //**************** debug begin **********************
     //var str = "";
     //for (var i = 0; i < ips.length; i++) {
     //    if (i > 0) str += ","
     //    str += "{" + ips[i].point.toString() + " side=" + ips[i].side.p1 + "}";
     //}
     //console.log("发现交点", (p.owner === s1 ? "s2" : "s1"), str);
     //**************** debug end ********************
     var friend = p.next;
     //console.log("记录本边的结束点，避免二次交点误选这个边", friend.toString());

     // 交点是当前多边形顶点
     if (p.next.equals(ips[0].point)) {
     //console.log("当前边结束，需要判断下一边是否在交点边的顺时针小");
     var p1 = p.next.next, pc = ips[0].point, p2 = ips[0].side.p1;
     // ps 前一边，ns 后一边，is 交点边
     var ps = T.radianToDegree(new Line(ips[0].point, p).getSlope());
     var ns = T.radianToDegree(new Line(ips[0].point, p.next.next).getSlope());
     var is = T.radianToDegree(ips[0].side.getSlope());
     if (ps > ns) {
     ns = ns + 360;
     }
     if (ps > is) {
     is = is + 360;
     }
     //console.log("前一边", ps, "后一边", ns, "交点边", is);
     //console.log("前后边角", ns - ps, "前夹边角", is - ps);
     if (ns < is) {
     p = p.next;
     if (p === p0) break;
     continue;
     }
     }

     // 交点是对方多边形顶点
     if (ips[0].point.equals(ips[0].side.p0)) {
     //console.log("发现交点是顶点");
     // ps 当前边，is 交点边
     var ps = T.radianToDegree(new Line(ips[0].point, p.next).getSlope());
     var is = T.radianToDegree(ips[0].side.getSlope());
     if (ps > is) {
     p = ips[0].side.p0;
     p.isBegin = true;
     if (p === p0) break;
     continue;
     }
     }
     //if (ips[0].point.equals(ips[0].side.p0)) {
     //    //console.log("发现交点是顶点，直接转入另一边");
     //    p = ips[0].side.p0;
     //    p.isBegin = true;
     //    if (p === p0) break;
     //    continue;
     //}

     var ip = ips[0].point, side = ips[0].side;

     // p设置为交点
     p = new Shape.Vertex(ip.x, ip.y);
     if (p.equals(side.p1)) {
     p = side.p1;
     //console.log("碰撞在顶点", p.toString());
     //p.next = ips[0].side.p1.next;
     //console.log("***", t, p.isIps, p.toString(), p.next.toString());
     p.isIps = false;
     }
     else {
     p.next = side.p1;
     p.isIps = true;
     }
     //g.drawLine(p.getSide());

     //p.next = ips[0].side.p1;
     p.owner = p.next.owner;
     //p.isIps = true;
     p.friend = friend;
     continue;

     }
     p = p.next;

     //console.log("无交点，转到下一点", p.toString());
     // 回到起始点，完成
     if (p === p0) break;
     } while (++t < tot)

     if (t >= tot) {
     console.log("t>=tot,检查是否存在合并错误");
     return undefined;
     }

     }
     }
     if (nps.length > 2)
     return new Shape.Polygon(nps);
     }
     */
}