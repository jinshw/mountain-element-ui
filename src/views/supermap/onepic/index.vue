<template>
  <div id="map" class="app-main" />
</template>
<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import '@supermap/iclient-leaflet'
import 'leaflet/dist/leaflet'
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
      var url = 'https://iserver.supermap.io/iserver/services/map-world/rest/maps/World'
      var map = L.map('map', {
        center: [44.117083893, 87.0095617865],
        crs: L.CRS.EPSG4326,
        preferCanvas: true,
        worldCopyJump: true,
        minZoom: 1,
        maxZoom: 18,
        zoom: 3
      })
      L.supermap.tiledMapLayer(url, { noWrap: true }).addTo(map)
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
