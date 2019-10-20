<script>
  import Seating from "./view/seating/Index.svelte";

  export let CBID;

  console.log(CBID)
</script>

<main class="p-2">
  <h1>Выберите место</h1>
  <Seating></Seating>
</main>
