// 引入three.js
import * as THREE from "../../libs/three.js-r123/build/three.module.js";
// 引入lon2xyz,经纬度转球面坐标
import { lon2xyz } from "./math.js";
import config from "./config.js";
var R = config.R * 1.001; //地球半径

var loader = new THREE.FileLoader(); //three.js文件加载类FileLoader：封装了XMLHttpRequest
loader.setResponseType("json");
var group = new THREE.Group(); //所有轨迹线的父对象
// 所有边界线顶点坐标合并在一起，适合使用LineSegments渲染
var allPointArr = [];
// 解析GeoJSON格式的线条数据
loader.load("./铁路线.json", function (data) {
  // data.features:包含多条轨迹线坐标数据
  data.features.forEach((obj) => {
    // "LineString"：obj对象包含一条轨迹曲线
    //"MultiLineString"：obj对象包含多条轨迹曲线
    if (obj.geometry.type === "LineString") {
      // 把"LineString"和"MultiLineString"的geometry.coordinates数据结构处理为一致
      obj.geometry.coordinates = [obj.geometry.coordinates];
    }
    obj.geometry.coordinates.forEach((arr) => {
      var pointArr = []; //一条曲线顶点坐标
      arr.forEach((elem) => {
        // 经纬度转球面坐标
        var coord = lon2xyz(R, elem[0], elem[1]);
        pointArr.push(coord.x, coord.y, coord.z);
      });
      // 处理顶点数据适合LineSegments连续渲染所有独立不相连轨迹线
      allPointArr.push(pointArr[0], pointArr[1], pointArr[2]);
      for (let i = 3; i < pointArr.length - 3; i += 3) {
        // 如果使用LineSegments连线，需要把顶点多复制一份
        allPointArr.push(
          pointArr[i],
          pointArr[i + 1],
          pointArr[i + 2],
          pointArr[i],
          pointArr[i + 1],
          pointArr[i + 2]
        );
      }
      var index = pointArr.length - 3;
      // 获取后三个数据
      allPointArr.push(
        pointArr[index],
        pointArr[index + 1],
        pointArr[index + 2]
      );
    });
  });
  group.add(line(allPointArr));
});

// pointArr：已知直线顶点坐标，创建直线THREE.Line
function line(pointArr) {
  /**
   * 通过BufferGeometry构建一个几何体，传入顶点数据
   * 通过Line模型渲染几何体，连点成线
   */
  var geometry = new THREE.BufferGeometry(); //创建一个Buffer类型几何体对象
  //类型数组创建顶点数据
  var vertices = new Float32Array(pointArr);
  // 创建属性缓冲区对象
  var attribue = new THREE.BufferAttribute(vertices, 3); //3个为一组，表示一个顶点的xyz坐标
  // 设置几何体attributes属性的位置属性
  geometry.attributes.position = attribue;
  var material = new THREE.LineBasicMaterial({
    // color: 0x33ff99, //线条颜色
    color: 0xffff00,
  }); //材质对象
  // 线条渲染几何体顶点数据
  // var line = new THREE.Line(geometry, material);//线条模型对象
  // var line = new THREE.LineLoop(geometry, material);//首尾顶点连线，轮廓闭合
  var line = new THREE.LineSegments(geometry, material); //间隔绘制直线
  return line;
}

export default group;
