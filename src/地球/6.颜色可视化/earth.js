// 引入three.js
import * as THREE from "../../libs/three.js-r123/build/three.module.js";
import { countryLine } from "./line.js"; //绘制地球国家边界线
// import { countryMesh } from './countryMesh.js';//每个国家对应球面Mesh
import { countryMesh } from "./countryMesh/index.js"; //每个国家对应球面Mesh
import { getCountryGdpColor } from "./countryGdpColor.js"; //处理gdp.json数据

var R = 100; //地球半径
var earth = createEarth(R); // 创建地球

// R：地球半径
function createSphereMesh(R) {
  var geometry = new THREE.SphereBufferGeometry(R, 40, 40); //创建一个球体几何对象
  //材质对象Material
  var material = new THREE.MeshLambertMaterial({
    // color: 0xf0f0f0,
    color: 0x888888,
  });
  var mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
  return mesh;
}

// 创建一个地球总对象earthGroup
function createEarth(R) {
  var earthGroup = new THREE.Group(); //地球组对象
  earthGroup.add(createSphereMesh(R)); //球体Mesh插入earthGroup中

  earthGroup.meshArr = []; //自顶一个属性包含所有国家mesh，用于鼠标射线拾取

  var loader = new THREE.FileLoader(); //three.js文件加载类FileLoader：封装了XMLHttpRequest
  loader.setResponseType("json");
  // 加载GDP数据
  loader.load("./gdp.json", function (gdpData) {
    var countryGdpColor = getCountryGdpColor(gdpData);
    // 异步加载包含世界各个国家边界坐标的GeoJSON文件：worldZh.json
    // worldZh.json和world.json相比只是多了每个国家的中文名称
    loader.load("./worldZh.json", function (data) {
      // 访问所有国家边界坐标数据：data.features
      data.features.forEach(function (country) {
        // "Polygon"：国家country有一个封闭轮廓
        //"MultiPolygon"：国家country有多个封闭轮廓
        if (country.geometry.type === "Polygon") {
          // 把"Polygon"和"MultiPolygon"的geometry.coordinates数据结构处理为一致
          country.geometry.coordinates = [country.geometry.coordinates];
        }
        // 解析所有封闭轮廓边界坐标country.geometry.coordinates
        // R * 1.001比地球R稍大，以免深度冲突
        var line = countryLine(R * 1.002, country.geometry.coordinates); //国家边界
        var mesh = countryMesh(R * 1.001, country.geometry.coordinates); //国家轮廓mesh
        earthGroup.add(line); //国家边界集合插入earthGroup中
        earthGroup.add(mesh); //国家Mesh集合插入earthGroup中
        earthGroup.meshArr.push(mesh);
        // mesh.name = country.properties.name;//设置每个国家mesh对应的国家英文名
        mesh.name = country.properties.nameZh; //设置每个国家mesh对应的中文名
        if (countryGdpColor[mesh.name]) {
          //worldZh.json部分国家或地区在gdp.json文件中不存在，判断下，以免报错
          mesh.material.color.copy(countryGdpColor[mesh.name].color);
          mesh.color = countryGdpColor[mesh.name].color; //自定义颜色属性 用于射线拾取交互
          mesh.gdp = countryGdpColor[mesh.name].gdp; //自定义颜色属性 用于射线拾取HTML标签显示
        } else {
          mesh.material.color.set(0xffffff);
          mesh.color = mesh.material.color.clone(); //自定义颜色属性 用于射线拾取交互
        }
      });
    });
  });

  return earthGroup;
}

export { earth };
