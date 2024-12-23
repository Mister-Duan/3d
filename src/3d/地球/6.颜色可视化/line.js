// 引入three.js
import * as THREE from "../../libs/three.js-r123/build/three.module.js";
// 引入lon2xyz,经纬度转球面坐标
import { lon2xyz } from "./math.js";
// 渲染一个国家的边界线(一个国家多边形轮廓数量 >= 1)
// R:球面半径
// polygonArr：一个数组，包含多个元素，每个元素是一个多边形轮廓
// polygonArr：是一个国家的数据geometry.coordinates(geometry.type === "MultiPolygon")
function countryLine(R, polygonArr) {
  var group = new THREE.Group(); //一个国家多个轮廓线条line的父对象
  polygonArr.forEach((polygon) => {
    var pointArr = []; //边界线顶点坐标
    polygon[0].forEach((elem) => {
      // 经纬度转球面坐标
      var coord = lon2xyz(R, elem[0], elem[1]);
      pointArr.push(coord.x, coord.y, coord.z);
    });
    group.add(line(pointArr));
  });
  return group;
}

// pointArr：行政区一个多边形轮廓边界坐标(2个元素为一组，分别表示一个顶点x、y值)
function line(pointArr) {
  /**
   * 通过BufferGeometry构建一个几何体，传入顶点数据
   * 通过Line模型渲染几何体，连点成线
   * LineLoop和Line功能一样，区别在于首尾顶点相连，轮廓闭合
   */
  var geometry = new THREE.BufferGeometry(); //创建一个Buffer类型几何体对象
  //类型数组创建顶点数据
  var vertices = new Float32Array(pointArr);
  // 创建属性缓冲区对象
  var attribue = new THREE.BufferAttribute(vertices, 3); //3个为一组，表示一个顶点的xyz坐标
  // 设置几何体attributes属性的位置属性
  geometry.attributes.position = attribue;
  // 线条渲染几何体顶点数据
  var material = new THREE.LineBasicMaterial({
    color: 0x333333, //线条颜色
  }); //材质对象
  // var line = new THREE.Line(geometry, material);//线条模型对象
  var line = new THREE.LineLoop(geometry, material); //首尾顶点连线，轮廓闭合
  return line;
}

export { countryLine };
