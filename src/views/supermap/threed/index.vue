<template>
  <div>
    <div id="cesiumContainer" :style="styleObject" />
  </div>
</template>

<script>
const Cesium = window.Cesium
export default {
  name: 'ThreeD',
  data() {
    return {
      styleObject: {
        width: '100%',
        position: 'absolute',
        top: '0px',
        bottom: '0px',
        left: '0px',
        backgroundColor: '#000000'
      }
    }
  },
  mounted() {
    this.initCesium()
  },
  methods: {
    initCesium() {
      /* eslint-disable */
      var webGlobe = new Cesium.Viewer('cesiumContainer')
      var scene = webGlobe.scene
      scene.open('http://support.supermap.com.cn:8090/iserver/services/3D-CBD/rest/realspace')
      /* eslint-enable */
    }
  }
}
</script>
<style  scoped>
#cesiumContainer {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  margin: 0;
  overflow: hidden;
  padding: 0;
  font-family: sans-serif;
}
</style>
