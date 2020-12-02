<script>
  import { geoMercator, geoPath, select, zoomIdentity, zoom, pointer} from 'd3';
  import {
    handleMouseOver,
    handleMouseOut,
    mouseMove,
  } from '../../scripts/tooltip'

  let projection;
  let geoGenerator;

  let dataSet;

  const height = 620;
  const width = 500;
  
  const path = geoPath();

  async function getGeo() {
    const url = 'https://cartomap.github.io/nl/wgs84/provincie_2020.geojson';
    const geoData = await (await fetch(url)).json();

    projection = geoMercator().fitSize([width, height], geoData);
    geoGenerator = path.projection(projection);

    const dataSetUrl = './data.json';
    dataSet = await (await fetch(dataSetUrl)).json();
    
    return geoData;
  }


    // Zoom functions

    const d3zoom = zoom()
      .scaleExtent([1, 8])
      .on("zoom", zoomed);

  const svg = select("svg")


      svg.call(d3zoom);
      select('svg').call(d3zoom)


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
      }

      function clicked(event,d) {
        console.log(event, d)
      const [[x0, y0], [x1, y1]] = path.bounds(d);
      event.stopPropagation();
      select('svg').transition().duration(750).call(
        d3zoom.transform,
        zoomIdentity
        .translate(width / 2, height / 2)
        .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
        .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
        pointer(event, svg.node())
    );
    console.log('end of code reached')
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
  <svg {width} {height} viewBox={[0, 0, width, height]} on:click={reset}>
    <g class="map">
      {#each data.features as path}
        <path d={geoGenerator(path)}
              on:click={() => clicked(event, path)}/>
      {/each}

      {#each dataSet as points}
        {#each points as dot}
          <circle
            class="dot"
            cx={projection([dot.lng, dot.lat])[0]}
            cy={projection([dot.lng, dot.lat])[1]}
            r='5px'
            on:mouseover={handleMouseOver(`
            Station: ${dot.Station} 
            Personen in het voertuig: ${dot.alreadyIn}`)}
            on:mouseout={handleMouseOut}
            on:mousemove={mouseMove}
            />
        {/each}
      {/each}
    </g>
  </svg>
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}
