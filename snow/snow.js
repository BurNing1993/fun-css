var Snow = (function () {
    function Snow(opt) {
        if (opt === void 0) { opt = {}; }
        this.isRain = opt.isRain || false;
        this.el = null;
        this.dir = opt.dir || "r";
        this.width = 0;
        this.maxWidth = opt.maxWidth || 80;
        this.minWidth = opt.minWidth || 2;
        this.opacity = 0;
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.sx = 0;
        this.isSwing = false;
        this.stepSx = 0.02;
        this.swingRadian = 1;
        this.swingStep = 0.01;
        this.sy = 0;
        this.maxSpeed = opt.maxSpeed || 4;
        this.minSpeed = opt.minSpeed || 1;
        this.quickMaxSpeed = opt.quickMaxSpeed || 10;
        this.quickMinSpeed = opt.quickMinSpeed || 8;
        this.quickWidth = opt.quickWidth || 80;
        this.quickOpacity = opt.quickOpacity || 0.2;
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
        this.init();
    }
    // 随机初始化属性
    Snow.prototype.init = function (reset) {
        var isQuick = Math.random() > 0.8;
        this.isSwing = Math.random() > 0.8;
        this.width = isQuick
            ? this.quickWidth
            : Math.floor(Math.random() * this.maxWidth + this.minWidth);
        this.opacity = isQuick ? this.quickOpacity : Math.random();
        this.x = Math.floor(Math.random() * (this.windowWidth - this.width));
        this.y = Math.floor(Math.random() * (this.windowHeight - this.width));
        if (reset && Math.random() > 0.8) {
            this.x = -this.width;
        }
        else if (reset) {
            this.y = -this.width;
        }
        this.sy = isQuick
            ? Math.random() * this.quickMaxSpeed + this.quickMinSpeed
            : Math.random() * this.maxSpeed + this.minSpeed;
        this.sx = this.dir === "r" ? this.sy : -this.sy;
        this.z = isQuick ? Math.random() * 300 + 200 : 0;
        this.swingStep = 0.01 * Math.random();
        this.swingRadian = Math.random() * (1.1 - 0.9) + 0.9;
    };
    // 设置样式
    Snow.prototype.setStyle = function () {
        this.el.style.cssText = "\n            position: fixed;\n            left: 0;\n            top: 0;\n            display: block;\n            width: " + (this.isRain ? 1 : this.width) + "px;\n            height: " + this.width + "px;\n            opacity: " + this.opacity + ";\n            background-image: radial-gradient(#fff 0%, rgba(255, 255, 255, 0) 60%);\n            border-radius: 50%;\n            z-index: 9999999999999;\n            pointer-events: none;\n            transform: translate(" + this.x + "px, " + this.y + "px) " + this.getRotate(this.sy, this.sx) + ";\n        ";
    };
    // 渲染
    Snow.prototype.render = function () {
        this.el = document.createElement("div");
        this.setStyle();
        document.body.appendChild(this.el);
    };
    Snow.prototype.move = function () {
        if (this.isSwing) {
            // if (this.sx >= 1 || this.sx <= -1) {
            //     this.stepSx = -this.stepSx
            // }
            // this.sx += this.stepSx
            if (this.swingRadian > 1.1 || this.swingRadian < 0.9) {
                this.swingStep = -this.swingStep;
            }
            this.swingRadian += this.swingStep;
            if (this.isRain) {
                this.x += this.sx;
            }
            else {
                this.x += this.sx * Math.sin(this.swingRadian * Math.PI);
            }
            this.y -= this.sy * Math.cos(this.swingRadian * Math.PI);
        }
        else {
            this.x += this.sx;
            this.y += this.sy;
        }
        // 完全离开窗口就调一下初始化方法，另外还需要修改一下init方法，因为重新出现我们是希望它的y坐标为0或者小于0，这样就不会又凭空出现的感觉，而是从天上下来的
        if (this.x < -this.width ||
            this.x > this.windowWidth ||
            this.y > this.windowHeight) {
            this.init(true);
            this.setStyle();
        }
        this.el.style.transform = "translate3d(" + this.x + "px, " + this.y + "px, " + this.z + "px) " + this.getRotate(this.sy, this.sx);
    };
    Snow.prototype.getRotate = function (sy, sx) {
        return this.isRain
            ? "rotate(" + (sx === 0 ? 0 : 90 + Math.atan(sy / sx) * (180 / Math.PI)) + "deg)"
            : "";
    };
    return Snow;
})();
var Snows = (function () {
    function Snows(opt) {
        if (opt === void 0) { opt = {}; }
        this.num = opt.num || 100;
        this.opt = opt;
        this.snowList = [];
        this.createSnows();
        this.moveSnow();
    }
    Snows.prototype.createSnows = function () {
        this.snowList = [];
        for (var i = 0; i < this.num; i++) {
            var snow = new Snow(this.opt);
            snow.render();
            this.snowList.push(snow);
        }
    };
    Snows.prototype.moveSnow = function () {
        var _this = this;
        window.requestAnimationFrame(function () {
            _this.snowList.forEach(function (item) {
                item.move();
            });
            _this.moveSnow();
        });
    };
    return Snows;
})();
new Snows({
    isRain: false,
    num: 50,
    maxSpeed: 15,
    isSwing: true
});
new Snows({
    isRain: true,
    isSwing: true,
    num: 20
});
