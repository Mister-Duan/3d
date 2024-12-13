// 引入three.js
import * as THREE from "../../libs/three.js-r123/build/three.module.js";
import { scene, camera } from "./scene.js";
import { chooseMeshArr } from "./HotNews.js";

// 鼠标单击射线拾取meshArr中的某个热点Mesh
var chooseMesh = null;
function choosePointMesh(event) {
  var Sx = event.clientX; //鼠标单击位置横坐标
  var Sy = event.clientY; //鼠标单击位置纵坐标
  //屏幕坐标转WebGL标准设备坐标
  var x = (Sx / window.innerWidth) * 2 - 1; //WebGL标准设备横坐标
  var y = -(Sy / window.innerHeight) * 2 + 1; //WebGL标准设备纵坐标
  //创建一个射线投射器`Raycaster`
  var raycaster = new THREE.Raycaster();
  //通过鼠标单击位置标准设备坐标和相机参数计算射线投射器`Raycaster`的射线属性.ray
  raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
  //返回.intersectObjects()参数中射线选中的网格模型对象
  // 未选中对象返回空数组[],选中一个数组1个元素，选中两个数组两个元素
  var intersects = raycaster.intersectObjects(chooseMeshArr);
  // console.log("射线器返回的对象", intersects);
  // console.log("射线投射器返回的对象 点point", intersects[0].point);
  // console.log("射线投射器的对象 几何体",intersects[0].object.geometry.vertices)
  // intersects.length大于0说明，说明选中了模型
  if (intersects.length > 0) {
    chooseMesh = intersects[0].object;
  } else {
    chooseMesh = null;
  }
}

// 鼠标滑动经过热点事件
addEventListener("mousemove", choosePointMesh); // 监听窗口鼠标单击事件

// 设置鼠标单击事件，如果单击选中某个热点Mesh，跳转到响应的链接
addEventListener("click", function () {
  choosePointMesh(event); //鼠标单击进行拾取计算
  if (chooseMesh) {
    //判断单击是否拾取到热点Mesh
    window.open(chooseMesh.herf); //新的窗口打开
    // window.location.href = chooseMesh.herf  //当前页打开
  }
});

export { choosePointMesh, chooseMesh };
