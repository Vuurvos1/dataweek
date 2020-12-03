<script>
  import {
    geoMercator,
    geoPath,
    select,
    zoomIdentity,
    zoom,
    pointer,
    zoomTransform,
    selectAll,
  } from 'd3';
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

  const height = 700;
  const width = 700;

  const path = geoPath();

  async function getGeo() {
    const url = 'https://cartomap.github.io/nl/wgs84/provincie_2020.geojson';
    const geoData = await (await fetch(url)).json();

    projection = geoMercator().fitSize([width, height], geoData);
    geoGenerator = path.projection(projection);

    const dataSetUrl = './dataDay.json';
    dataSet = await (await fetch(dataSetUrl)).json();

    const dataNightUrl = './dataNight.json';
    dataNight = await (await fetch(dataNightUrl)).json();

    return geoData;
  }

  // Zoom functions

  const d3zoom = zoom().scaleExtent([1, 8]).on('zoom', zoomed);

  const svg = select('svg');

  svg.call(d3zoom);
  select('.mapContainer svg').call(d3zoom);

  function zoomed(event) {
    const { transform } = event;
    select('g').attr('transform', transform);
    select('g').attr('stroke-width', 1 / transform.k);
  }

  function reset() {
    select('svg')
      .transition()
      .duration(750)
      .call(
        d3zoom.transform,
        zoomIdentity,
        zoomTransform(select('svg').node()).invert([width / 2, height / 2])
      );
    console.log('reset');
  }

  function clicked(event, d) {
    // selectAll('.dot')
    //       .attr('r', '2px')

    console.log(event, d);
    const [[x0, y0], [x1, y1]] = path.bounds(d);
    event.stopPropagation();
    select('svg')
      .transition()
      .duration(750)
      .call(
        d3zoom.transform,
        zoomIdentity
          .translate(width / 2, height / 2)
          .scale(
            Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height))
          )
          .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
        pointer(event, svg.node())
      );
    console.log('end of code reached');
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
    stroke: #edeff6;
    stroke-width: 2;
    fill: #fbfbfb;
  }
  .dot {
    fill: #9d5feb;
    stroke: white;
    stroke-width: 1;
  }
  .mapContainer {
    display: flex;
    justify-content: center;

    margin-bottom: 2rem;
  }
  .lines path {
    stroke: hotpink;
    stroke-width: 2;
    fill: transparent;
  }

  .dayNightButton {
    width: 30%;
    padding: 0.4em 1em;
    border-radius: 100rem;
    font-size: 1.2rem;
    background-color: orangered;
    color: whitesmoke;
    margin: 0 auto;

    /* stop highlighting text */
    user-select: none;
  }

  #dayNight {
    display: none;
  }

  .center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 50rem;
    width: 90rem;
    background-color: white;
    border-radius: 2px;
  }
  h1 {
    margin-top: 5rem;
    
  }
  h1, p, h2 {
    text-align: center;
  }

  h2 {
    margin-top: 5rem;
  }

  .test {
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
  .grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  gap: 0px 0px;
  grid-template-areas:
    "description description Map Map"
    "description description Map Map"
    "description description Map Map";
}

.description { grid-area: description; }
.Map { grid-area: Map; }
</style>

<div class="center">

    <div class="grid-container">
      <div class="description">
        <h1>Timetravel</h1>
        <p>Meerdere weergavens van onze ervaring tijds het reizen. U kunt andere inzichten opdoen door op de onderstaande button te klikken.</p>
        <div class="test">
          <h2>Get Started</h2>
          <label class="dayNightButton" for="dayNight">Schakel tussen dag & nacht</label>
          <input type="checkbox" name="dayNight" id="dayNight" bind:checked={day} />
        </div>
      </div>
      <div class="Map">
        {#await getGeo()}
          <h2>Loading Map</h2>
        {:then data}
          <div class="mapContainer">
          <svg {width} {height} viewBox={[0, 0, width, height]} on:click={reset}>
          <g class="map">
      {#each data.features as path}
          <path d={geoGenerator(path)} on:click={() => clicked(event, path)} />
        {/each}

        <g class="lines">
          {#each day ? dataSet : dataNight as data}
            <path d={coordToLine(data)} />
          {/each}
        </g>

        {#each day ? dataSet : dataNight as points}
          {#each points as dot}
            <circle
              class="dot"
              cx={projection([dot.lng, dot.lat])[0]}
              cy={projection([dot.lng, dot.lat])[1]}
              r="5px"
              on:mouseover={handleMouseOver(`
          Station: ${dot.Station} 
          Personen in het voertuig: ${dot.alreadyIn}`)}
              on:mouseout={handleMouseOut}
              on:mousemove={mouseMove} />
          {/each}
        {/each}
      </g></svg>
  </div>

{:catch error}
  <p style="color: red">{error.message}</p>
{/await}
      </div>
    </div>
  </div>
