<script lang="ts">
  export let animationDelay = 0;
  export let elementTag: 'p' | 'h3' = 'p';
</script>

<svelte:element
  this={elementTag}
  class="element animated"
  aria-busy="true"
  style={`animation-delay: ${animationDelay}ms; --width: ${elementTag === 'h3' ? '100%' : '90%'}`}>
  <span>&nbsp;</span>
</svelte:element>

<style lang="scss">
  .element {
    display: block;

    width: var(--width);
    height: inherit;

    margin: 0 0 0.25rem;

    background: rgba(var(--color-primary-rgb), 0.25);

    line-height: calc(var(--line-height-standard) / 1.5);

    user-select: none;
    pointer-events: none;

    border-radius: 4px;
  }

  span {
    display: inline-block;
  }

  .animated {
    position: relative;

    animation-duration: 0.75s;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    animation-name: skeleton-text-shimmer;
    animation-timing-function: ease-in-out;
    animation-direction: alternate;
  }

  /* -global- */
  @keyframes -global-skeleton-text-shimmer {
    0% {
      opacity: 0.4;
      transform: translateY(1px) scale(0.99);
    }

    85%,
    100% {
      opacity: 1;
      transform: translateY(0px) scale(1);
    }
  }
</style>
