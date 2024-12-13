
import { pointInPolygon } from './pointInPolygon.js'//判断点是否在多边形中
import  config  from './config.js'

// worldData:所有国家边界轮廓的经纬度数据
function gridPoint(worldData) {

  var 间距 = config.sp; //网格数据间隔经纬度度数
  var 行 = Math.ceil(360 / 间距);//网格点阵多少行
  var 列 = Math.ceil(180 / 间距);//网格点阵多少列
  var rectPointsArr = [];//polygon对应的矩形轮廓内生成均匀间隔的矩形网格数据rectPointsArr
  for (var i = 0; i < 行 - 1; i++) {
    for (var j = 0; j < 列 - 1; j++) {
      rectPointsArr.push([-180 + i * 间距, -90 + j * 间距]);
    }
  }

  var landPointsArr = [];//处理所有网格数据，仅保留位于国家轮廓内部的数据，也就是保留和陆地重合的网格点阵数据
  // 访问所有国家边界坐标数据：worldData.features
  worldData.features.forEach(function (country) {
    // "Polygon"：国家country有一个封闭轮廓
    //"MultiPolygon"：国家country有多个封闭轮廓
    if (country.geometry.type === "Polygon") {
      // 把"Polygon"和"MultiPolygon"的geometry.coordinates数据结构处理为一致
      country.geometry.coordinates = [country.geometry.coordinates];
    }
    // 一个国家包含多个多边形轮廓polygon(>=1)
    country.geometry.coordinates.forEach(function (polygon) {
      polygon = polygon[0];
      rectPointsArr.forEach(function (point) {
        //  pointInPolygon(point,polygon)：判断点point是否位于多边形polygon内
        if (pointInPolygon(point, polygon)) {
          landPointsArr.push(point);//保存陆地网格数据
        }
      })
    });
  });
  return landPointsArr;
}
export { gridPoint };