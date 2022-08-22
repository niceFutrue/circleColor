//index.js
//获取应用实例
// const app = getApp()
const util = require('../../utils/util.js')
let twoPI = 2*Math.PI;
//圆心的 x 坐标  , 圆心的 Y 坐标 , 圆的半径
let ballRadNum = 0;
let ballColor = "transparent"; // 小球选色
let ballCtx = {};
let timerNum = 0;
let curRad = twoPI;
Page({
  data: {
    rgbStr: "rgb(0,0,0)",
    ringDiameter: 0, // 圆直径，宽/高
  },

  onLoad: function() {
    let that = this;
     //初始化canvas
    const query = wx.createSelectorQuery()
    query.select('#colorPicker').fields({ node: true, size: true }).exec((res) => {
      that.initRing(res);
    })

    const queryBall = wx.createSelectorQuery()
    queryBall.select('#colorPickerSlider').fields({ node: true, size: true }).exec((res) => {
      that.initBall(res);
    })
  },
  // 画圆环
  initRing(res) {
    const canvas = res[0].node;
    const ctx = canvas.getContext('2d')
    const dpr = wx.getSystemInfoSync().pixelRatio // 设备像素比
    canvas.width = res[0].width * dpr
    canvas.height = res[0].height * dpr
    ctx.scale(dpr, dpr);
    let ringD = res[0].width;
    this.setData({
      ringDiameter: ringD
    })
    // ctx.translate(0, 0);  // 定义圆点在画布的中心
    // ctx.fillStyle = '#ffffff'; // 背景
    // ctx.fillRect(0, 0, canvas.width, canvas.height); // 绘制背景矩形
    // util.drawRing(ctx, ringD);  // 绘制圆环
   
    var radius = ringD / 2;
    var toRad = Math.PI / 180; // 将圆分为 360 份
    // 2、角度颜色（推荐）
    for (let i = 1; i <= 360; i++) {
      let a = i;
      let b = (i - 1);
      let x1 = Math.cos(toRad*a) * radius + radius;
      let y1 = Math.sin(toRad*a) * radius + radius;
      let x2 = Math.cos(toRad*b) * radius + radius;
      let y2 = Math.sin(toRad*b) * radius + radius;
      let g = ctx.createLinearGradient(x1, y1, x2, y2);    // 梯度颜色
      let rgb = util.hslToRgb(a / 360, 1, 0.5);
      let rgbStr = 'rgb('+rgb.r + ', '+rgb.g+', '+rgb.b+')';
      g.addColorStop(0, rgbStr);
      g.addColorStop(1, rgbStr);
      let gap = 0.005; //去掉间隙
      ctx.beginPath();
      ctx.fillStyle = g;
      ctx.arc(radius, radius, radius, toRad*b-gap, toRad*a+gap, false);
      ctx.arc(radius, radius, radius - 30, toRad*a+gap, toRad*b-gap, true);
      ctx.fill();
      ctx.closePath();
    }
  },

  initBall(res){
    const canvas = res[0].node;
    ballCtx = canvas.getContext('2d');
    const dpr = wx.getSystemInfoSync().pixelRatio // 设备像素比
    canvas.width = res[0].width * dpr
    canvas.height = res[0].height * dpr
    ballCtx.scale(dpr, dpr)
    let ringD = res[0].width; // 直径
    var radius = ringD / 2;   // 半径
    var rgb = util.hslToRgb(ballRadNum, 1, 0.5);
    ballColor = "rgb("+rgb.r+","+rgb.g+","+rgb.b+")";
    ballCtx.translate(radius, radius);  // 定义圆点在画布的中心
    const renderLoop = () => {
      ballCtx.clearRect(-radius, -radius, ringD, ringD);
      ballCtx.fillStyle = ballColor;
      ballCtx.beginPath();
      ballCtx.arc(0, 0, radius * 0.3, 0, Math.PI * 2, true); // 中心选色圆
      ballCtx.fill();
      ballCtx.beginPath()
      ballCtx.strokeStyle = '#ffffff';
      ballCtx.lineWidth = 5;
      ballCtx.arc(125*Math.cos(curRad), 125*Math.sin(curRad), 10, 0, 2 * Math.PI)
      ballCtx.stroke();
      ballCtx.closePath();
      canvas.requestAnimationFrame(renderLoop)
    }
    renderLoop();
  },
  touchMove(e){
    let that = this;
    let ringD = that.data.ringDiameter;
    let tx = e.changedTouches[0].x;
    let ty = e.changedTouches[0].y;
    let num = parseInt(e.timeStamp - timerNum);
    var x = ((tx * (100 / ringD)).toFixed(0) - 50);
    var y = -((ty * (100 / ringD)).toFixed(0) - 50);
    var h = ((Math.PI * 5 / 2 - Math.atan2(y, x)) % (Math.PI * 2) * 180 / Math.PI).toFixed(0);
    curRad = twoPI*(h-90)/360;
    var rgb = util.hslToRgb((h-90) / 360, 1, 0.5);
    let rgbStr = "rgb("+rgb.r+","+rgb.g+","+rgb.b+")";
    ballColor = rgbStr;
    this.setData({
      rgbStr: rgbStr
    })
    if(num > 100){
      timerNum = parseInt(e.timeStamp);
      // 发送指令
    }
  },
  touchStart(e){
    let that = this;
    let ringD = that.data.ringDiameter;
    let tx = e.changedTouches[0].x;
    let ty = e.changedTouches[0].y;
    var x = ((tx * (100 / ringD)).toFixed(0) - 50);
    var y = -((ty * (100 / ringD)).toFixed(0) - 50);
    var h = ((Math.PI * 5 / 2 - Math.atan2(y, x)) % (Math.PI * 2) * 180 / Math.PI).toFixed(0);
    curRad = twoPI*(h-90)/360;
    var rgb = util.hslToRgb((h-90) / 360, 1, 0.5);
    let rgbStr = "rgb("+rgb.r+","+rgb.g+","+rgb.b+")";
    ballColor = rgbStr;
    this.setData({
      rgbStr: rgbStr
    })
    // console.log(tx,ty)
    // let px = tx > 140 ? tx-140: tx;
    // let py = ty > 140 ? ty-140: ty;
    // console.log(Math.pow(px.toFixed(0),2),Math.pow(py.toFixed(0),2),Math.pow(140,2))
  },
  // 按钮: 红、绿、蓝
  tab(e){
    let num = e.currentTarget.dataset.num;
    let r = 0; let g = 0; let b = 0;
    if(num == 1){r = 255;}
    if(num == 2){g = 255;}
    if(num == 3){b = 255;}
    let hsl = util.rgb2Hsl(r,g,b);
    var rgb = util.hslToRgb(hsl[0], 1, 0.5);
    curRad = twoPI*hsl[0];
    let rgbStr = "rgb("+rgb.r+","+rgb.g+","+rgb.b+")";
    ballColor = rgbStr;
    this.setData({
      rgbStr: rgbStr
    })
  },
})