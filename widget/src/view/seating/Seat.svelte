<script>
  import { createEventDispatcher } from "svelte";

  export let seat;

  const { price, id, disabled } = seat;

  const dispatch = createEventDispatcher();

  function dispatchPrice(price) {
    dispatch("clickSeat", {
      seat
    });
  }
</script>

<div
  on:click={dispatchPrice}
  class:disabled={disabled}
  class="seating__item p-2 w-100 text-center border border-succes rounded
  cursor-pointer">
  {id}
</div>
