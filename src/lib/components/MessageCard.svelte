<script lang="ts">
  let { id, message, country, image, createdAt } = $props();
</script>

<div class="message">
  {#if image}
    <img class="image" src={image} alt={message} />
  {:else}
    <div class="image-placeholder"></div>
  {/if}
  <h3>{id} ({country})</h3>
  <p>{message}</p>
  <span class="date">Posted on {createdAt}</span>
</div>

<style>
  .message {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid black;
    padding: 5px;
    margin: 5px;
  }
  .image {
    width: 8rem;
    border-radius: 5%;
  }
  .image-placeholder {
    width: 8rem;
    height: 8rem;
    background-color: #ccc;
    border-radius: 5%;
  }
</style>
