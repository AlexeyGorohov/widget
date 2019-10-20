<script>
  import Seating from "./view/seating/Index.svelte";

  export let CBID;

  console.log(CBID);
</script>

<div
  class="modal fade"
  id="exampleModalLong"
  tabindex="-1"
  role="dialog"
  aria-labelledby="exampleModalLongTitle"
  aria-hidden="true">
  <div class="modal-dialog" role="document">
    <h1>Выберите место</h1>
    <Seating />
  </div>
</div>
