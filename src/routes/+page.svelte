<script lang="ts">
  import type { PageProps } from "./$types";
  import { enhance } from "$app/forms";
  import { authClient } from "$lib/auth-client";
  import { invalidateAll } from "$app/navigation";

  let { data }: PageProps = $props();

  let message = $state("");
  let characterCount = $derived(message.length);
</script>

<h1>Guest book Test</h1>
{#if data.session?.user}
  <img src={data.session.user.image} alt={data.session.user.name} />
  <p>Hello {data.session.user.email}</p>

  <button
    onclick={async () => {
      await authClient.signOut();
      invalidateAll();
    }}>Logout</button
  >
{:else}
  <a href="/login">Login</a>
{/if}

{#if data.session?.user}
  <div>
    {#each data.messages as message}
      <div class="message">
        <h3>{message.user.name} ({message.guestbook_messages.country})</h3>
        <p>{message.guestbook_messages.message}</p>
        <span class="date"
          >Posted on {message.guestbook_messages.createdAt}</span
        >
      </div>
    {:else}
      <p>No messages yet</p>
    {/each}
  </div>

  <hr />
  <form method="post" use:enhance>
    <div>
      <label for="msg">Message</label>
      <textarea name="message" id="msg" bind:value={message} maxlength="1000"
      ></textarea>
      <span class="count">{characterCount} characters</span>
    </div>
    <button type="submit" disabled={characterCount < 5}>Post</button>
  </form>
{/if}
