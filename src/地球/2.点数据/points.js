// 引入three.js
import * as THREE from "../../libs/three.js-r123/build/three.module.js";
// 引入lon2xyz,经纬度转球面坐标
import { lon2xyz } from "./math.js";

import config from "./config.js";
var R = config.R; //地球半径

var loader = new THREE.FileLoader(); //three.js文件加载类FileLoader：封装了XMLHttpRequest
loader.setResponseType("json");
var group = new THREE.Group();
loader.load("数据.json", function (data) {
  var coordArr = data.points; //所有经纬度坐标数据
  var numArr = data.num; //所有点对应周边点数
  var numMax = numArr.slice().sort(compareNum)[numArr.length - 1]; //数组复制并排序，然后获得最大值
  // console.log(numMax);//2395
  var verticesArr = []; //所有顶点数据，三个元素为一组
  var colorArr = []; //所有顶点颜色数据，三个元素为一组
  var color1 = new THREE.Color(0x00aaaa);
  var color2 = new THREE.Color(0x99ffff); //周边点最多点对应顶点颜色
  for (var i = 0; i < coordArr.length; i += 2) {
    // 经纬度转球面坐标
    var coord = lon2xyz(R, coordArr[i], coordArr[i + 1]);
    verticesArr.push(coord.x, coord.y, coord.z);
    // 颜色插值计算
    var percent = (numArr[i / 2] / numMax) * 100;
    if (percent > 1.0) percent = 1.0;
    var color = color1.clone().lerp(color2.clone(), percent);
    colorArr.push(color.r, color.g, color.b);
  }
  var geometry = new THREE.BufferGeometry(); //创建一个Buffer类型几何体对象
  //3个为一组，表示一个顶点的xyz坐标
  var attribute = new THREE.BufferAttribute(new Float32Array(verticesArr), 3);
  // console.log('顶点数据',attribute.count);//25万个点
  // 设置几何体attributes属性的位置属性
  geometry.attributes.position = attribute;

  geometry.attributes.color = new THREE.BufferAttribute(
    new Float32Array(colorArr),
    3
  );
  // 点渲染模式
  var material = new THREE.PointsMaterial({
    // color: 0x22ffee,
    vertexColors: THREE.VertexColors, //使用顶点颜色插值计算
    size: 0.5, //点尺寸
  }); //材质对象
  var points = new THREE.Points(geometry, material); //点模型对象
  group.add(points);
});

// 数组排序规则
function compareNum(num1, num2) {
  if (num1 < num2) {
    return -1;
  } else if (num1 > num2) {
    return 1;
  } else {
    return 0;
  }
}

export default group;
