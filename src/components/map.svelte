<script>
  import { geoMercator, geoPath } from 'd3';
  import {
    handleMouseOver,
    handleMouseOut,
    mouseMove,
  } from '../../scripts/tooltip';

  let projection;
  let geoGenerator;

  let dataSet;
  let dataNight;

  let day = false;
  $: document.body.classList.toggle('night', day);

  const height = 620;
  const width = 500;

  async function getGeo() {
    const url = 'https://cartomap.github.io/nl/wgs84/provincie_2020.geojson';
    const geoData = await (await fetch(url)).json();

    projection = geoMercator().fitSize([width, height], geoData);
    geoGenerator = geoPath().projection(projection);

    const dataSetUrl = './dataDay.json';
    dataSet = await (await fetch(dataSetUrl)).json();

    const dataNightUrl = './dataNight.json';
    dataNight = await (await fetch(dataNightUrl)).json();

    return geoData;
  }

  // needs array
  function coordToLine(arr) {
    let line = '';

    for (let i = 0; i < arr.length; i++) {
      line += `${i <= 0 ? 'M' : 'L'}
            ${projection([Number(arr[i].lng), Number(arr[i].lat)])[0]}, 
            ${projection([Number(arr[i].lng), Number(arr[i].lat)])[1]} `;
    }

    return line;
  }
</script>

<style>
  .map path {
    stroke: #eef6fc;
    stroke-width: 2;
    fill: #fafafd;
  }

  .lines path {
    stroke: hotpink;
    stroke-width: 2;
    fill: transparent;
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

    <g class="lines">
      {#each day ? dataSet : dataNight as data}
        <path d={coordToLine(data)} />
      {/each}
    </g>

    <g class="dots">
      {#each day ? dataSet : dataNight as points}
        {#each points as dot}
          <circle
            class="dot"
            cx={projection([Number(dot.lng), Number(dot.lat)])[0]}
            cy={projection([Number(dot.lng), Number(dot.lat)])[1]}
            r="5px"
            on:mouseover={handleMouseOver(`
          Station: ${dot.Station} 
          Personen in het voertuig: ${dot.alreadyIn}`)}
            on:mouseout={handleMouseOut}
            on:mousemove={mouseMove} />
        {/each}
      {/each}
    </g>
  </svg>

  <input type="checkbox" name="dayNight" id="dayNight" bind:checked={day} />
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}
