<script>
  export let mousePos;
  export let tooltipDot;
</script>

<style>
  h4 {
    margin: 0;
    font-size: 1.2rem;
  }

  .tooltip {
    z-index: 10;
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
    padding: 0.6rem 2rem 1rem 2rem;
    border-radius: 0 0.4rem 0.4rem 0.4rem;

    width: 20rem;
  }

  .tooltip-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    margin-bottom: 0.4rem;
  }

  .tooltip p {
    width: initial;
    text-align: left;

    color: #fff;
  }

  .time {
    color: #fff;
    margin-left: auto;
    font-weight: bold;
  }
</style>

<div
  class="tooltip"
  style={`transform: translate(${mousePos.x}px, ${mousePos.y}px)`}>
  <div class="tooltip-container">
    <h4>{`${tooltipDot.Station}`}</h4>
    {#if tooltipDot.aankomst == null}
      <p class="time">{`${tooltipDot.vertrek}`}</p>
    {:else}
      <p class="time">{`${tooltipDot.aankomst}`}</p>
    {/if}
  </div>
  <p>{`Op dit station zaten er ${tooltipDot.alreadyIn} mensen in de trein`}</p>
  <p>{`Aantal mensen zonder mondkapje: ${tooltipDot.noMasks}`}</p>
</div>
