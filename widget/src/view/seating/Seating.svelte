<script>
  import Seat from "./Seat.svelte";
  import { summ } from "../../store";

  const seatings = [...Array(100).keys()].map(item => ({
    id: item,
    price: 120,
    disabled: false,
  }));

  const seatingsOrder = [];

  function addToOrder(event) {
    const { seat } = event.detail;

    seatingsOrder.push(seat);
    summ.update(n => n + seat.price);
  }
</script>

<div class="mb-3">Цена: {$summ}</div>

<section class="section section_seating">
  <div class="d-flex flex-wrap">
    {#each seatings as seat, i}
      <div class="seating__col p-1 d-flex">
        <Seat on:clickSeat={addToOrder} {seat} />
      </div>
    {/each}
  </div>
</section>