import * as THREE from "../../libs/three.js-r123/build/three.module.js";

// 创建一个小球用于测试
function createSphereMesh(R, x, y, z) {
  var geometry = new THREE.SphereGeometry(R, 25, 25); //创建一个球体几何对象
  var material = new THREE.MeshLambertMaterial({
    color: 0xff0000,
  }); //材质对象Material
  var mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
  mesh.position.set(x, y, z);
  return mesh;
}

export { createSphereMesh };
