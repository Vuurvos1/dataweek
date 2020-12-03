<script>
  import Map from './components/map.svelte';
</script>

<style>
  :global(body) {
    --bgCol: #8885ee;
    --bgFrameCol: #fff;

    --purple: #854ce3;
    --purple2: #854ce3;
    --purpleOpac: rgba(133, 76, 227, 0.3);

    --textCol: #000;

    --butCol: var(--purple);

    background-color: var(--bgCol);

    overflow-x: hidden;
    overflow-y: hidden;
  }

  :global(body.night) {
    --bgCol: #34335a;
    --purple: #854ce3;
    /* --purple2: #854ce3; */

    --bgFrameCol: #8885ee;

    --butCol: var(--purple);

    --textCol: #fff;
  }

  :global(h1, h2) {
    margin-top: 5rem;
  }
  :global(h1, h2, p) {
    color: var(--textCol);
    text-align: center;
  }

  :global(p) {
    max-width: 30em;
    margin: 0 auto;
  }

  .circleTopLeft,
  .circleBotRight {
    border-radius: 100rem;
    background-color: var(--purple2);

    box-shadow: 0px 0px 0px 36px var(--purpleOpac);

    position: absolute;
  }

  .backgroundCrap .circleTopLeft {
    width: 50rem;
    height: 50rem;

    z-index: -10;

    top: -25rem;
    left: -25rem;
  }

  .backgroundCrap .circleBotRight {
    width: 30rem;
    height: 30rem;

    z-index: 1;

    bottom: -10rem;
    right: -10rem;
  }
</style>

<main>
  <Map />
</main>

<div class="backgroundCrap">
  <div class="circleTopLeft" />
  <div class="circleBotRight" />
</div>
