<script>
  import Seating from "./view/seating/Index.svelte";

  export let CBID;
  export let btns;
</script>

<div class="widget-cb">
  <div class="modal">
    <h1>Выберите место</h1>
    <Seating />
  </div>
</div>
