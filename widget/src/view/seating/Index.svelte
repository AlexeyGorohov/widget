<script>
  import { tick } from "svelte";

  import { seating } from "../../store/seating";

  function addToOrder(seat) {
    const { id } = seat;

    seating.toggleSeat(id);
  }

  $: selectedSeat = $seating.filter(item => item.disabled === true);
  $: sum = selectedSeat.reduce((sum, item) => sum + item.price, 0);
</script>

<div class="mb-2">Цена: {sum}</div>
<div class="mb-3">
  Выбранные места:
  {#each selectedSeat as item}{item.id},{/each}
</div>
<section class="section section_seating">
  <div class="d-flex flex-wrap">
    {#each $seating as seat (seat.id)}
      <div class="seating__col p-1 d-flex">
        <div
          on:click={e => addToOrder(seat)}
          class:disabled={seat.disabled}
          class="seating__item p-2 w-100 text-center border border-succes
          rounded cursor-pointer">
          {seat.id}
        </div>
      </div>
    {/each}
  </div>
</section>
