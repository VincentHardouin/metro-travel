<script setup>
import { computed } from 'vue';

const props = defineProps({
  stops: {
    type: Array,
    required: true,
  },
});

const spacing = 60;

const mergedStations = computed(() => {
  const result = [];
  const map = new Map();

  props.stops.forEach((stop) => {
    if (!map.has(stop.stop_unique_id)) {
      map.set(stop.stop_unique_id, {
        stop_unique_id: stop.stop_unique_id,
        stop_name: stop.stop_name,
        lines: [stop.line],
      });
    }
    else {
      const entry = map.get(stop.stop_unique_id);
      if (!entry.lines.find(l => l.name === stop.line.name)) {
        entry.lines.push(stop.line);
      }
    }
  });

  for (const val of map.values()) {
    result.push(val);
  }

  return result;
});

const segments = computed(() => {
  const segs = [];
  const stops = props.stops;
  const merged = mergedStations.value;

  const stopPositions = new Map();
  merged.forEach((station, index) => {
    stopPositions.set(station.stop_unique_id, index * spacing + spacing / 2);
  });

  for (let i = 0; i < stops.length - 1; i++) {
    const current = stops[i];
    const next = stops[i + 1];
    const startY = stopPositions.get(current.stop_unique_id);
    const endY = stopPositions.get(next.stop_unique_id);

    if (current.stop_unique_id === next.stop_unique_id && current.line.name !== next.line.name) {
      segs.push({
        color: current.line.color,
        startY: startY - spacing / 2,
        endY: startY,
      });
      segs.push({
        color: next.line.color,
        startY,
        endY: startY + spacing / 2,
      });
    }
    else {
      segs.push({
        color: current.line.color,
        startY,
        endY,
      });
    }
  }

  return segs;
});

const svgHeight = computed(() => mergedStations.value.length * spacing);
</script>

<template>
  <svg :height="svgHeight" width="300" class="mx-auto">
    <template v-for="(segment, i) in segments" :key="i">
      <line
        x1="30"
        :y1="segment.startY"
        x2="30"
        :y2="segment.endY"
        :stroke="segment.color"
        stroke-width="6"
      />
    </template>

    <template v-for="(station, i) in mergedStations" :key="station.stop_unique_id">
      <circle
        cx="30"
        :cy="i * spacing + spacing / 2"
        r="8"
        :fill="station.lines[0].color"
        stroke="white"
        stroke-width="3"
      />
      <text
        x="50"
        :y="i * spacing + spacing / 2 + 5"
        font-size="14"
        fill="currentColor"
        style="user-select:none"
      >
        {{ station.stop_name }}
      </text>
    </template>
  </svg>
</template>
