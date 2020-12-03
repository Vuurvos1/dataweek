<script>
  import {
    geoMercator,
    geoPath,
    select,
    zoomIdentity,
    zoom,
    pointer,
    zoomTransform,
  } from 'd3';

  let projection;
  let geoGenerator;

  let dataSet;
  let dataNight;

  let day = false;
  $: document.body.classList.toggle('night', day);

  let tooltip = false;
  let mousePos = { x: 0, y: 0 };

  let tooltipDot = {};

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

  function stationId(data) {
    return data[0].Station.split(' ')[0];
  }

  function lineGrad(arr) {
    // get total dist of line
    let colArr = [];
    let col = '';
    let offset = 0;
    let totalLenght = 0;
    let tempLength = 0;
    let prevPoint = { lat: 0, lng: 0 };

    for (const [c, i] of arr.entries()) {
      if (c <= 0) {
        prevPoint.lat = Number(i.lat);
        prevPoint.lng = Number(i.lng);
      } else {
        totalLenght += Math.pow(
          Math.pow(prevPoint.lat - Number(i.lat), 2) +
            Math.pow(prevPoint.lng - Number(i.lng), 2),
          0.5
        );

        prevPoint.lat = i.lat;
        prevPoint.lng = i.lng;
      }
    }

    for (const [c, i] of arr.entries()) {
      if (c <= 0) {
        prevPoint.lat = Number(i.lat);
        prevPoint.lng = Number(i.lng);
      } else {
        tempLength += Math.pow(
          Math.pow(prevPoint.lat - Number(i.lat), 2) +
            Math.pow(prevPoint.lng - Number(i.lng), 2),
          0.5
        );

        offset = Math.round((tempLength / totalLenght) * 100);

        prevPoint.lat = i.lat;
        prevPoint.lng = i.lng;
      }

      if (i.alreadyIn < 35) {
        col = '#7268D6';
      } else if (i.alreadyIn < 50 && i.alreadyIn > 35) {
        col = '#FFB67A';
      } else if (i.alreadyIn > 49) {
        col = '#F74559';
      }

      colArr.push({
        col: col,
        offset: offset,
      });
    }

    return colArr;
  }

  function renderTooltip(info) {
    console.log(info)
    tooltipDot = info;
  }
</script>

<style>
  .map path {
    stroke: #e6e7ec;
    stroke-width: 2;
    fill: #f5f5f5;
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
    width: fit-content;
    padding: 0.4em 1em 0.6em 1em;
    border-radius: 100rem;
    font-size: 1.2rem;
    background-color: var(--butCol);
    color: white;
    margin: 0 auto;

    font-weight: 500;

    /* stop highlighting text */
    user-select: none;

    cursor: pointer;
  }

  .map circle {
    cursor: pointer;
  }

  #dayNight {
    display: none;
  }

  .test {
    display: flex;
    justify-content: center;
    flex-direction: column;
  }

  .test p {
    margin-bottom: 2rem;
  }
  .grid-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
    gap: 0px 0px;
    grid-template-areas:
      'description Map'
      'description Map'
      'description Map';

    background-color: var(--bgFrameCol);
    border-radius: 0.4rem;

    max-width: 76rem;
    width: 90vw;
    height: 48rem;

    padding: 0.6rem;
    margin: calc((100vh - 48rem) / 2) auto;
  }

  .tooltip {
    z-index: 10;
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
    padding: .6rem 2rem 1rem 2rem;
    border-radius: 0 0.4rem 0.4rem 0.4rem;
  }

  .description {
    grid-area: description;
  }
  .Map {
    grid-area: Map;
  }

  .Map svg {
    margin: 2rem 0;
  }
  h4 {
    margin: 0;
    font-size: 1.2rem;
  }
  .tooltip-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .time {
    color: #fff;
    margin-left: auto;
    font-weight: bold;
  }
  
</style>

{#if tooltip}
  <div
    class="tooltip"
    style={`transform: translate(${mousePos.x}px, ${mousePos.y}px)`}>
    <div class='tooltip-container'>
    <h4>{`${tooltipDot.Station}`}</h4>
    {#if tooltipDot.aankomst == null}
    <p class="time">{`${tooltipDot.vertrek}`}</p>
    {:else}
    <p class="time">{`${tooltipDot.aankomst}`}</p>
    {/if}
  </div>
    <p>
      {`Op dit station zaten er ${tooltipDot.alreadyIn} mensen in de trein`}
    </p>
    <p>
      {`Aantal mensen zonder mondkapje: ${tooltipDot.noMasks}`}
    </p>
  </div>
{/if}

<div class="grid-container">
  <div class="description">
    <h1>Timetravel</h1>
    <p>
      Timemap is een overzicht waar je onze interessante verschijnselen op de map kunt zien. Als je meer te weten wil komen over onze inzichten kun je 
      op de map drukken of met je muis over het gekleurde bolletje gaan.
    </p>
    <div class="test">
      <h2>Get Started</h2>
      <p>
        Tijdens het vergaderen van data hebben wij een meting gedaan van de ochtend en de avond. U kunt hierdoor het verschil zien tussen dag en nacht door op
          de onderstaande knop te drukken.
      </p>
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
              <path
                d={geoGenerator(path)}
                on:click={() => clicked(event, path)} />
            {/each}

            <g class="lines">
              {#each day ? dataSet : dataNight as data}
                <path
                  d={coordToLine(data)}
                  style={`stroke: url(#${stationId(data)}`} />

                <defs>
                  <linearGradient id={stationId(data)}>
                    {#each lineGrad(data) as col}
                      <stop offset={col.offset} stop-color={col.col} />
                    {/each}
                  </linearGradient>
                </defs>
              {/each}
            </g>

            {#each day ? dataSet : dataNight as points}
              {#each points as dot}
                <circle
                  class="dot"
                  cx={projection([dot.lng, dot.lat])[0]}
                  cy={projection([dot.lng, dot.lat])[1]}
                  r="5px"
                  on:mouseenter={() => {
                    renderTooltip(dot);
                    tooltip = true;
                  }}
                  on:mouseleave={() => {
                    tooltip = false;
                  }}
                  on:mousemove={(e) => {
                    mousePos.x = e.clientX;
                    mousePos.y = e.clientY;
                  }} />
              {/each}
            {/each}
          </g>
        </svg>
      </div>
    {:catch error}
      <p style="color: red">{error.message}</p>
    {/await}
  </div>
</div>
