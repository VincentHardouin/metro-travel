<script setup>
import { onMounted, ref } from 'vue';

defineProps({
  stations: {
    type: Array,
    required: true,
  },
  lines: {
    type: Array,
    required: true,
  },
  start: {
    type: Object,
    required: true,
  },
  end: {
    type: Object,
    required: true,
  },
});

const lightTiles = 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png';
const darkTiles = 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png';

const activeTiles = ref(null);

onMounted(() => {
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  activeTiles.value = isDark ? darkTiles : lightTiles;

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    activeTiles.value = e.matches ? darkTiles : lightTiles;
  });
});
</script>

<template>
  <div id="map">
    <LMap
      :zoom="12"
      :center="[48.8566, 2.3522]"
      :use-global-leaflet="false"
      style="position: relative;"
    >
      <LTileLayer
        :url="activeTiles"
        attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
        layer-type="base"
        name="OpenStreetMap"
        z-index="0"
      />
      <LPolyline
        v-for="(line, index) in lines"
        :key="index"
        :color="`#${line.color}`"
        :lat-lngs="line.path"
        :weight="7"
      />
      <LCircleMarker
        color="#008a22"
        :lat-lng="[start.stop_lat, start.stop_lon]"
        :radius="8"
      >
        <LPopup>{{ start.stop_name }}</LPopup>
      </LCircleMarker>
      <LCircleMarker
        color="#e52228"
        :lat-lng="[end.stop_lat, end.stop_lon]"
        :radius="8"
      >
        <LPopup>{{ end.stop_name }}</LPopup>
      </LCircleMarker>
      <LCircleMarker
        v-for="(station, index) in stations.filter(s => s.isActive)"
        :key="index"
        :lat-lng="[station.stop_lat, station.stop_lon]"
        :radius="8"
      >
        <LPopup>{{ station.stop_name }}</LPopup>
      </LCircleMarker>
    </LMap>
  </div>
</template>

<style>
#map {
  height: 100vh;
  width: 100%;
  z-index: 0;
  position: relative;
}
</style>
