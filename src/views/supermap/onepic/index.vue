<template>
  <div id="map" class="app-main" />
</template>
<script>
import L from 'leaflet'
// import 'leaflet/dist/leaflet.css'
// import '@supermap/iclient-leaflet'
// import 'leaflet/dist/leaflet'
export default {
  name: 'OnePic',
  data() {
    return {
    }
  },
  mounted() {
    this.addMap()
  },
  methods: {
    addMap() {
      const base_url = "http://iserver.supermap.io/iserver/services/map-world/rest/maps/World";
      // 初始化地图信息
      const map = L.map('map', {
        preferCanvas: true,
        crs: L.CRS.EPSG4326,
        center: [116.2,40.0],
        maxZoom: 18,
        zoom: 2
      });
      // 添加图层
      L.supermap.tiledMapLayer(base_url).addTo(map);
      query();
      function query(){
          // 指定SQL查询服务参数
          var sqlParam = new SuperMap.GetFeaturesBySQLParameters({
              queryParameter: {
                  name: "Main_Road_L_1@Main_Road_L",
                  attributeFilter: "SMID = 1"
              },
              datasetNames: ["Main_Road_L:Main_Road_L_1"]
          });
          // 创建SQL查询实例
          var url = "http://localhost:8090/iserver/services/data-China100/rest/data";
          L.supermap
              .featureService(url)
              .getFeaturesBySQL(sqlParam, function (serviceResult) {
                  console.log(serviceResult.result.features);
                  resultLayer = L.geoJSON(serviceResult.result.features).addTo(map).bindPopup('SMID = 1');
              });
      }

    }
  }
}
</script>
<style  scoped>
  /* #map {
    width: 800px;
    height: 750px;
  } */
</style>
