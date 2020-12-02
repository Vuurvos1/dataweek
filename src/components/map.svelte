<script>
  import { geoMercator, geoPath } from 'd3';
  import { feature } from 'topojson';

  //   import {  }

  export let data;

  const height = 620;
  const width = 500;

  const projection = geoMercator().fitSize([width, height], data);
  //   const path = geoPath().projection(projection);

  //   const json = data;

  //   const json = map.json();
  console.log(data);

  let geoData = feature(data, data.features[0]);
  console.log(geoData);

  //   var projection = geoEquirectangular();

  let geoGenerator = geoPath().projection(projection);

  console.log(data.features[0]);
  console.log(geoGenerator(data.features[0]));

  //   const path = geoGenerator(data);

  //   const topoData = feature(data, data.features[0]);
  //   console.log(topoData);
  //   console.log(geoData);
  //   const land = {
  //     ...topoData,
  //     features: topoData.features,
  //   };
  //   console.log(land);
  //   let mapData = land.features;
  //   console.log(mapData);
</script>

<svg {width} {height}>
  {#each data.features as path}
    <path d={geoGenerator(path)} />
  {/each}
</svg>
