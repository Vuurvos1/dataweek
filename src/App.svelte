<script>
  import Map from './components/map.svelte';

  import { geoPath, geoMercator } from 'd3';
  export let name;

  async function fetchMap() {
    const url = 'https://cartomap.github.io/nl/wgs84/provincie_2020.geojson';
    const geoData = await (await fetch(url)).json();

    const dataSetUrl = './data.json';
    const dataset = await (await fetch(dataSetUrl)).json();

    // return [geoData, dataset];
    return geoData;
    // check if there is saved data
    //     if (localStorage.getItem('geoData') && localStorage.getItem('points')) {
    //       geoData = JSON.parse(localStorage.getItem('geoData'));
    //       points = JSON.parse(localStorage.getItem('points'));
    //     } else {
    //       // fetch and save data if not found
    //       const geoDataUrl =
    //         'https://cartomap.github.io/nl/wgs84/arbeidsmarktregio_2020.geojson';
    //       const pointsUrl = `https://gist.githubusercontent.com/Vuurvos1/0f2e26a2e24732991f0d5b0120d8bb99/raw/24aa0e4fb59a3334b70aa8f037a601106201e773/geoSpecCombined.json`;
    //       [geoData, points] = await Promise.all([
    //         await (await fetch(geoDataUrl)).json(),
    //         await (await fetch(pointsUrl)).json(),
    //       ]);
    //       // save data to local storage
    //       localStorage.setItem('geoData', JSON.stringify(geoData));
    //       localStorage.setItem('points', JSON.stringify(points));
    //     }
    //     return [geoData, points];
  }
</script>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>

<main>
  <h1>Hello {name}!</h1>

  {#await fetchMap()}
    <h2>Loading Map</h2>
  {:then data}
    <Map {data} />
  {:catch error}
    <p style="color: red">{error.message}</p>
  {/await}
</main>
