<script>
  import Map from './components/map.svelte';
</script>

<style>
  :global(body) {
    --bgCol: #e6e9f4;
    --purple: #854ce3;
    --purpleOpac: rgba(133, 76, 227, 0.3);

    background-color: var(--bgCol);

    overflow-x: hidden;
  }

  :global(body.night) {
    --bgCol: #34335a;
  }

  .backgroundCrap {
    z-index: -100;
  }

  .backgroundCrap .circleTopLeft {
    width: 20rem;
    height: 20rem;

    z-index: -10;

    position: absolute;
    top: -10rem;
    left: -10rem;

    border-radius: 100rem;
    background-color: var(--purple);

    box-shadow: 0px 0px 0px 36px var(--purpleOpac);
  }

  .backgroundCrap .circleBotRight {
    width: 20rem;
    height: 20rem;

    z-index: -10;
    bottom: -10rem;
    right: -10rem;

    position: absolute;

    border-radius: 100rem;
    background-color: var(--purple);

    box-shadow: 0px 0px 0px 36px var(--purpleOpac);
  }
</style>

<main>
  <h1>Time travel</h1>
  <Map />
</main>

<div class="backgroundCrap">
  <div class="circleTopLeft" />
  <div class="circleBotRight" />
</div>
