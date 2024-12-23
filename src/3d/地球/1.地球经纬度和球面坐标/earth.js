// 引入three.js
import * as THREE from "../../libs/three.js-r123/build/three.module.js";

var R = 100; //地球半径
var earth = createSphereMesh(R); // 创建地球mesh
function createSphereMesh(r) {
  // r：球体半径
  // TextureLoader创建一个纹理加载器对象，可以加载图片作为纹理贴图
  var textureLoader = new THREE.TextureLoader();
  var texture = textureLoader.load("./earth.jpg"); //加载纹理贴图
  var geometry = new THREE.SphereBufferGeometry(r, 40, 40); //创建一个球体几何对象
  //材质对象Material
  var material = new THREE.MeshLambertMaterial({
    // color: 0x00ffff,
    map: texture, //设置地球颜色贴图map
  });
  var mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
  return mesh;
}

export { earth };
