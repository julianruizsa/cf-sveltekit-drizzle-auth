<script lang="ts">
  let { id, message, country, createdAt } = $props();
</script>

<div class="message">
  <h3>{id} ({country})</h3>
  <p>{message}</p>
  <span class="date">Posted on {createdAt}</span>
</div>
