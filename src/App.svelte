<script>
  import Map from './components/map.svelte';
</script>

<style>
  :global(body) {
    --bgCol: #eaedf4;

    background-color: var(--bgCol);
  }

  :global(body.night) {
    --bgCol: hotpink;
  }
</style>

<main>
  <h1>Time travel</h1>
  <Map />
</main>
