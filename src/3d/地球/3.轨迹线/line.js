// 引入three.js
import * as THREE from "../../libs/three.js-r123/build/three.module.js";
// 引入lon2xyz,经纬度转球面坐标
import { lon2xyz } from "./math.js";
// R:球面半径
function countryLine(R) {
  var loader = new THREE.FileLoader(); //three.js文件加载类FileLoader：封装了XMLHttpRequest
  loader.setResponseType("json");
  var group = new THREE.Group(); // 组对象mapGroup是所有国家边界父对象
  // 所有边界线顶点坐标合并在一起，适合使用LineSegments渲染
  var allPointArr = [];
  // 异步加载包含世界各个国家边界坐标的GeoJSON文件：world.json
  loader.load("./world.json", function (data) {
    // 访问所有国家边界坐标数据：data.features
    data.features.forEach(function (country) {
      // "Polygon"：国家country有一个封闭轮廓
      //"MultiPolygon"：国家country有多个封闭轮廓
      if (country.geometry.type === "Polygon") {
        // 把"Polygon"和"MultiPolygon"的geometry.coordinates数据结构处理为一致
        country.geometry.coordinates = [country.geometry.coordinates];
      }
      // 解析所有封闭轮廓边界坐标country.geometry.coordinates
      // 批量渲染一个国家的多个轮廓线(>=1个)
      country.geometry.coordinates.forEach((polygon) => {
        var pointArr = []; //边界线顶点坐标
        polygon[0].forEach((elem) => {
          // 经纬度转球面坐标   导出半径为1的球面数据  当然你也是10、100或1000等
          // var coord = lon2xyz(R, elem[0], elem[1])
          var coord = lon2xyz(1, elem[0], elem[1]);
          pointArr.push(coord.x, coord.y, coord.z);

          // 小数后保留位数越多，精度越高，但是导出数据占用文件越大
          //小数点后设置合适的有效数字，过小精度不够，过大，文件比较大
          // var n = 3;//小数点保留3位数
          // pointArr.push(parseFloat(coord.x.toFixed(n)), parseFloat(coord.y.toFixed(n)), parseFloat(coord.z.toFixed(n)));
        });
        allPointArr.push(pointArr[0], pointArr[1], pointArr[2]);
        for (var i = 3; i < pointArr.length; i += 3) {
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
        allPointArr.push(pointArr[0], pointArr[1], pointArr[2]);
      });
    });
    var LineSegments = line(allPointArr);
    LineSegments.scale.set(R, R, R); //球面坐标对应半径是1，需要缩放R倍
    group.add(LineSegments); //一个LineSegments渲染所有国家边界坐标

    // 保存国家边界球面坐标  导出数据的时候，注意地球半径设置，可以设置为1，便于以后加载
    // console.log(JSON.stringify(allPointArr));//顶点数据数组转化为JSON
  });
  return group;
}

// pointArr：行政区一个多边形轮廓边界坐标(2个元素为一组，分别表示一个顶点x、y值)
function line(pointArr) {
  /**
   * 通过BufferGeometry构建一个几何体，传入顶点数据
   * 通过Line模型渲染几何体，连点成线
   * LineLoop和Line功能一样，区别在于首尾顶点相连，轮廓闭合
   * 如果使用LineSegments连线，需要把顶点多复制一份
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
    color: 0x00aaaa, //线条颜色
  }); //材质对象
  // var line = new THREE.Line(geometry, material);//线条模型对象
  // var line = new THREE.LineLoop(geometry, material);//首尾顶点连线，轮廓闭合
  var line = new THREE.LineSegments(geometry, material); //间隔绘制直线
  return line;
}

export { countryLine };
