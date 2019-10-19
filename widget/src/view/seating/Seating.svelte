<script>
  import { sum } from "../../store/sum";
  import { seating } from "../../store/seating";

  function addToOrder(seat) {
    const { id, disabled, price } = seat;

    seating.toggleSeat(id);
    sum.update(n => n + price);
  }
</script>

<div class="mb-2">Цена: {$sum}</div>
<div class="mb-3">Выбранные места: </div>

<section class="section section_seating">
  <div class="d-flex flex-wrap">
    {#each $seating as seat (seat.id)}
      <div class="seating__col p-1 d-flex">
        <div
          on:click={(e) => addToOrder(seat)}
          class:disabled={seat.disabled}
          class="seating__item p-2 w-100 text-center border border-succes rounded
          cursor-pointer">
            {seat.id}
        </div>
      </div>
    {/each}
  </div>
</section>