<script>
  import Map from './components/map.svelte';
</script>

<style>
  :global(body) {
    --white: #fff
    --black: #0f0f0f

    --bgCol: #8885ee;
    --bgFrameCol: #fff;

    --purple: #854ce3;
    --purple2: #854ce3;
    --purple3: #854ce3;
    
    --purpleOpac: rgba(133, 76, 227, 0.3);

    --textCol:var(--black);

    --butCol: var(--purple);

    background-color: var(--bgCol);

    overflow-x: hidden;
    overflow-y: hidden;
  }

  :global(body.night) {
    --bgCol: #34335a;
    --purple: #854ce3;
    --purple3: #6438aa;

    --bgFrameCol: #8885ee;

    --butCol: var(--purple);

    --textCol: #fff;
  }

  :global(h1, h2) {
    margin-top: 5rem;
  }
  :global(h1, h2, p) {
    color: var(--textCol);
    max-width: 30rem;
    text-align: left;
    
    margin-bottom: 1em;
  }

  :global(h2) {
    font-size: 1.6rem;
    width: 30rem;
    margin: 0 auto 1.4rem auto;
  }

  :global(h1) {
    font-size: 3rem;
    text-align: left;
    color: var(--purple3);
    max-width: 30rem;
    margin: 2rem auto 4.6rem auto;
  }

  :global(p) {
    max-width: 30rem;
    margin: 0 auto;

    font-size: 1.2rem;

    margin-bottom: 1.2em;

    font-weight: 400;
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
