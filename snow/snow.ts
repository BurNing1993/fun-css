class Snow {
  isRain: boolean; // 是否是雨
  el: HTMLElement; // 元素
  dir: string; // 倾斜方向
  width: number; // 直径
  maxWidth: number; // 最大直径
  minWidth: number; // 最小直径
  opacity: number; // 透明度
  x: number; // 水平位置
  y: number; // 重置位置
  z: number; // z轴位置
  sx: number; // 水平速度
  isSwing: boolean; // 是否左右摇摆
  stepSx: number; // 左右摇摆的步长
  swingRadian: number; // 左右摇摆的正弦函数x变量
  swingStep: number; // 左右摇摆的正弦x步长
  sy: number; // 垂直速度
  maxSpeed: number; // 最大速度
  minSpeed: number; // 最小速度
  quickMaxSpeed: number; // 快速划过的最大速度
  quickMinSpeed: number; // 快速划过的最小速度
  quickWidth: number; // 快速划过的宽度
  quickOpacity: number; // 快速划过的透明度
  windowWidth: number; // 窗口尺寸
  windowHeight: number; // 窗口尺寸
  constructor(opt: Partial<Snow> = {}) {
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
  init(reset?: boolean) {
    let isQuick = Math.random() > 0.8;
    this.isSwing = Math.random() > 0.8;
    this.width = isQuick
      ? this.quickWidth
      : Math.floor(Math.random() * this.maxWidth + this.minWidth);
    this.opacity = isQuick ? this.quickOpacity : Math.random();
    this.x = Math.floor(Math.random() * (this.windowWidth - this.width));
    this.y = Math.floor(Math.random() * (this.windowHeight - this.width));
    if (reset && Math.random() > 0.8) {
      this.x = -this.width;
    } else if (reset) {
      this.y = -this.width;
    }
    this.sy = isQuick
      ? Math.random() * this.quickMaxSpeed + this.quickMinSpeed
      : Math.random() * this.maxSpeed + this.minSpeed;
    this.sx = this.dir === "r" ? this.sy : -this.sy;
    this.z = isQuick ? Math.random() * 300 + 200 : 0;
    this.swingStep = 0.01 * Math.random();
    this.swingRadian = Math.random() * (1.1 - 0.9) + 0.9;
  }

  // 设置样式
  setStyle() {
    this.el.style.cssText = `
            position: fixed;
            left: 0;
            top: 0;
            display: block;
            width: ${this.isRain ? 1 : this.width}px;
            height: ${this.width}px;
            opacity: ${this.opacity};
            background-image: radial-gradient(#fff 0%, rgba(255, 255, 255, 0) 60%);
            border-radius: 50%;
            z-index: 9999999999999;
            pointer-events: none;
            transform: translate(${this.x}px, ${this.y}px) ${this.getRotate(
      this.sy,
      this.sx
    )};
        `;
  }

  // 渲染
  render() {
    this.el = document.createElement("div");
    this.setStyle();
    document.body.appendChild(this.el);
  }

  move() {
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
      } else {
        this.x += this.sx * Math.sin(this.swingRadian * Math.PI);
      }
      this.y -= this.sy * Math.cos(this.swingRadian * Math.PI);
    } else {
      this.x += this.sx;
      this.y += this.sy;
    }
    // 完全离开窗口就调一下初始化方法，另外还需要修改一下init方法，因为重新出现我们是希望它的y坐标为0或者小于0，这样就不会又凭空出现的感觉，而是从天上下来的
    if (
      this.x < -this.width ||
      this.x > this.windowWidth ||
      this.y > this.windowHeight
    ) {
      this.init(true);
      this.setStyle();
    }
    this.el.style.transform = `translate3d(${this.x}px, ${this.y}px, ${this.z
      }px) ${this.getRotate(this.sy, this.sx)}`;
  }

  getRotate(sy, sx) {
    return this.isRain
      ? `rotate(${sx === 0 ? 0 : 90 + Math.atan(sy / sx) * (180 / Math.PI)}deg)`
      : "";
  }
}

class Snows {
  num: number;
  opt: Partial<Snow>;
  snowList: Show[];
  constructor(opt: Partial<Snows | Snow> = {}) {
    this.num = opt.num || 100;
    this.opt = opt;
    this.snowList = [];
    this.createSnows();
    this.moveSnow();
  }
  createSnows() {
    this.snowList = [];
    for (let i = 0; i < this.num; i++) {
      let snow = new Snow(this.opt);
      snow.render();
      this.snowList.push(snow);
    }
  }
  moveSnow() {
    window.requestAnimationFrame(() => {
      this.snowList.forEach((item) => {
        item.move();
      });
      this.moveSnow();
    });
  }
}

new Snows({
  isRain: false,
  num: 50,
  maxSpeed: 15,
  isSwing:true,
});
new Snows({
  isRain: true,
  isSwing:true,
  num: 20,
});
