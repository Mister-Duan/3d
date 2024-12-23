// 引入three.js
import * as THREE from "../../libs/three.js-r123/build/three.module.js";
// 引入lon2xyz,经纬度转球面坐标
import { lon2xyz } from "./math.js";
// 几何体辅助合并工具
import { BufferGeometryUtils } from "../../libs/three.js-r123/examples/jsm/utils/BufferGeometryUtils.js";
import config from "./config.js";
var R = config.R; //地球半径

//three.js文件加载类FileLoader
var loader = new THREE.FileLoader();
loader.setResponseType("json");
var group = new THREE.Group(); //声明一个组对象包含人口密度柱子mesh，方便引入到场景
loader.load("人口密度.json", function (data) {
  var coord = data.population; //所有经纬度坐标和对应需要可视化的数值
  var geoArr = []; //所有几何体集合
  var Max = maxFun(coord) * 0.05; //设置一个基准值,以要可视化的数据最大值为准即可 如果极大值过大 也可以根据需要降低 以视觉效果呈现为准
  console.log(Max);
  var color1 = new THREE.Color(0x00aa88);
  var color2 = new THREE.Color(0x00ff88); //最大数值对应柱子颜色
  for (var i = 0; i < coord.length; i++) {
    var PopulationDensity = coord[i][2]; //经纬度coord[i][0], coord[i][1]对应数值  人口密度
    // 创建一个柱子几何体
    // var height = PopulationDensity / 10;//柱子高度
    var height = PopulationDensity / 50; //柱子高度
    var geometry = new THREE.BoxBufferGeometry(0.5, 0.5, height); //柱子长宽0.5 0.5 尺寸最好不要过大或过小
    var color = color1.clone().lerp(color2.clone(), PopulationDensity / Max);
    var colorArr = []; //几何体所有顶点颜色数据
    var pos = geometry.attributes.position;
    for (var j = 0; j < pos.count; j++) {
      // pos.count表示几何体geometry顶点数量
      // 不同高度柱子颜色明暗不同，同一个柱子从下到上颜色不同
      if (pos.getZ(j) < 0) {
        //柱子几何体底部顶点对应颜色
        colorArr.push(color.r * 0.0, color.g * 0.1, color.b * 0.1);
      } else {
        //柱子几何体顶部顶点对应颜色
        colorArr.push(color.r * 0.0, color.g * 1.0, color.b * 1.0);
      }
    }
    //设置几何体 顶点颜色数据
    geometry.attributes.color = new THREE.BufferAttribute(
      new Float32Array(colorArr),
      3
    );

    // 经纬度转球面坐标
    var SphereCoord = lon2xyz(R, coord[i][0], coord[i][1]); //SphereCoord球面坐标
    // 沿着z轴也就是柱子高度方向平移R+height / 2
    geometry.translate(0, 0, R + height / 2);
    // 通过lookAt调整几何体姿态角度
    geometry.lookAt(
      new THREE.Vector3(SphereCoord.x, SphereCoord.y, SphereCoord.z)
    );
    geoArr.push(geometry);
  }

  // 所有几何体合并为一个几何体
  var BfferGeometry = BufferGeometryUtils.mergeBufferGeometries(geoArr);
  // console.log('柱子顶点数量接近百万',BfferGeometry.attributes.position.count)
  // console.log('柱子三角形索引量约140万',BfferGeometry.index.count)
  var material = new THREE.MeshLambertMaterial({
    // color: 0x00ffff,
    vertexColors: THREE.VertexColors, //使用顶点颜色渲染
  });
  var mesh = new THREE.Mesh(BfferGeometry, material);
  group.add(mesh);
});

// 所有人口密度值提取到一个数组中，然后对数组进行排序，获得最大密度值
function maxFun(coord) {
  var array = [];
  for (var i = 0; i < coord.length; i++) {
    array.push(coord[i][2]);
  }
  array.sort(compareNum);
  return array[array.length - 1];
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
}

export default group;
