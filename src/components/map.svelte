<script>
  import { geoMercator, geoPath } from 'd3';

  let projection;
  let geoGenerator;

  let dataSet;

  const height = 620;
  const width = 500;

  async function getGeo() {
    const url = 'https://cartomap.github.io/nl/wgs84/provincie_2020.geojson';
    const geoData = await (await fetch(url)).json();

    projection = geoMercator().fitSize([width, height], geoData);
    geoGenerator = geoPath().projection(projection);

    const dataSetUrl = './data.json';
    dataSet = await (await fetch(dataSetUrl)).json();

    return geoData;
  }
</script>

<style>
  .map path {
    stroke: #eef6fc;
    stroke-width: 2;
    fill: #fafafd;
  }
  .dot {
    fill: #9d5feb;
    stroke: white;
    stroke-width: 1;
  }
</style>

{#await getGeo()}
  <h2>Loading Map</h2>
{:then data}
  <svg {width} {height}>
    <g class="map">
      {#each data.features as path}
        <path d={geoGenerator(path)} />
      {/each}
    </g>

    <g class="dots">
      {#each dataSet as points}
        {#each points as dot}
          <circle
            class="dot"
            cx={projection([Number(dot.lng), Number(dot.lat)])[0]}
            cy={projection([Number(dot.lng), Number(dot.lat)])[1]}
            r={5} />
        {/each}
      {/each}
    </g>
  </svg>
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}