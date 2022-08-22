// 空间颜色转换

let rgbToHsl = (r, g, b) => {
  r /= 255, g /= 255, b /= 255;
  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let l = (max + min) / 2; // 亮度计算
  var h = 0, s = 0;
  if (max == min) {
     s = 0; 
  } else {
    // 饱和度换算
    var d = max - min;
    // l <= 0.5, s=(max-min)/(max+min) ；l > 0.5, s=(max-min)/(2-max-min)
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);  // max=r, h=60*(g-b)/(max+min)
        break;
      case g:
        h = (b - r) / d + 2;  // max=g, h=120+60*(b-r)/(max+min)
        break;
      case b:
        h = (r - g) / d + 4;  // max=b, h=240+60*(r-g)/(max+min)
        break;
    }
    h /= 6;
  }
  return [h, s, l];
}
let rgb2Hsl = (r, g, b) => {
  r /= 255, g /= 255, b /= 255; // 让 min,max 处于0~1之间
  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let l = (max + min) / 2; // 亮度计算
  var h = 0, s = 0;
  if (max == min) {
     s = 0; 
  } else {
    // 饱和度换算
    var d = max - min;
    var sum = max + min;
    // l <= 0.5, s=(max-min)/(max+min) ；l > 0.5, s=(max-min)/(2-max-min)
    s = l > 0.5 ? d / (2 - max - min) : d / sum;
    switch (max) {
      case r:
        h = 60*(g - b) / sum + (g < b ? 360 : 0);  // max=r, h=60*(g-b)/(max+min)
        break;
      case g:
        h = 120 + 60*(b - r) / sum ;  // max=g, h=120+60*(b-r)/(max+min)
        break;
      case b:
        h = 240 + 60*(r - g) / sum;  // max=b, h=240+60*(r-g)/(max+min)
        break;
    }
    h /= 360;
  }
  return [h, s, l];
}
let hueToRgb = (p, q, t) => {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}
let hslToRgb = (h, s, l) => {
  var r, g, b;
  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hueToRgb(p, q, h + 1 / 3);
    g = hueToRgb(p, q, h);
    b = hueToRgb(p, q, h - 1 / 3);
  }
  return {r: Math.round(r * 255), g: Math.round(g * 255),b: Math.round(b * 255)};
}

// 画圆环
let drawRing = (ctx, ringD) => {
  var radius = ringD / 2;
  var toRad = Math.PI / 180; // 将圆分为 360 份
  // 1、线条颜色
  // let step = 0.1;
  // for (var i = 0; i < 360; i += step) {
  //   var rad = i * toRad;
  //   var rgb = hslToRgb(i / 360, 1, 0.5);
  //   ctx.strokeStyle = `rgb(${rgb.r},${rgb.g},${rgb.b})`;
  //   ctx.beginPath();
  //   ctx.moveTo(radius, radius);
  //   ctx.lineTo(radius + radius * Math.cos(rad), radius + radius * Math.sin(rad));
  //   ctx.stroke();
  // }
  // ctx.beginPath();
  // ctx.arc(radius, radius, radius - 120, 0, Math.PI * 2, false);
  // ctx.closePath();
  // ctx.fill();
  // 2、角度颜色（推荐）
  for (let i = 1; i <= 360; i++) {
    let a = i;
    let b = (i - 1);
    let x1 = Math.cos(toRad*a) * radius + radius;
    let y1 = Math.sin(toRad*a) * radius + radius;
    let x2 = Math.cos(toRad*b) * radius + radius;
    let y2 = Math.sin(toRad*b) * radius + radius;
    let g = ctx.createLinearGradient(x1, y1, x2, y2); // 梯度颜色
    let rgb = hslToRgb(a / 360, 1, 0.5);
    let rgbStr = 'rgb('+rgb.r + ', '+rgb.g+', '+rgb.b+')';
    g.addColorStop(0, rgbStr);
    g.addColorStop(1, rgbStr);
    let gap = 0.005; //去掉间隙
    ctx.beginPath();
    ctx.fillStyle = g;
    ctx.arc(radius, radius, radius, toRad*b-gap, toRad*a+gap, false);
    ctx.arc(radius, radius, radius- 30, toRad*a+gap, toRad*b-gap, true);
    ctx.fill();
  }
};


module.exports = {
  rgbToHsl: rgbToHsl,
  rgb2Hsl: rgb2Hsl,
  hslToRgb: hslToRgb,
  drawRing: drawRing,
}