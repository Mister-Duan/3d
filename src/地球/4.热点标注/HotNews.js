// 引入three.js
import * as THREE from "../../libs/three.js-r123/build/three.module.js";
import { createPointMesh } from "./pointMesh.js";
import { createLightPillar } from "./LightPillar.js";
import { createWaveMesh } from "./WaveMesh.js";
import HotNewsData from "./HotNewsData.js";

import config from "./config.js";
var R = config.R; //地球半径

var HotNews = new THREE.Group(); //声明一个组对象包含所有光柱、光柱底座、波动光圈
var WaveMeshArr = []; //所有波动光圈Mesh集合
var chooseMeshArr = []; //所有光柱底座Mesh，用于射线拾取计算
HotNewsData.forEach(function (obj, i) {
  var lon = obj.E; //经度
  var lat = obj.N; //纬度
  var mesh = createPointMesh(R, lon, lat); //光柱底座矩形平面
  HotNews.add(mesh);

  mesh.name = obj.name; //mesh对应新闻name属性 表示新闻发生地点
  mesh.title = obj.title; //新闻标题
  mesh.herf = obj.herf; //新闻超链接地址
  chooseMeshArr.push(mesh);

  // 光柱高度5~5 + R*0.3之间
  var height =
    5 + (R * 0.3 * (HotNewsData.length - 1 - i)) / (HotNewsData.length - 1); // 热度越高，光柱高度越高
  var LightPillar = createLightPillar(R, lon, lat, height); //光柱
  HotNews.add(LightPillar);
  var WaveMesh = createWaveMesh(R, lon, lat); //波动光圈
  HotNews.add(WaveMesh);
  WaveMeshArr.push(WaveMesh);

  if (i == 0) {
    //热度最高
    changeColor(0xff6666); //设置热点Mesh颜色
  } else if (i > 0 && i < 6) {
    //热度前6
    // 设置光柱和光柱底座颜色
    changeColor(0xffff66); //设置热点Mesh颜色
  }

  function changeColor(color) {
    // 光柱颜色设置
    LightPillar.children[0].material.color.set(color);
    // 光柱底座颜色设置
    mesh.material.color.set(color);
    // 波动光圈颜色设置
    WaveMesh.material.color.set(color);
  }
});

export { HotNews, WaveMeshArr, chooseMeshArr };
