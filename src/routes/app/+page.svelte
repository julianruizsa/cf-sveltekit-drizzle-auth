<script lang="ts">
  import { enhance } from "$app/forms";
  import type { SubmitFunction } from "@sveltejs/kit";
  import type { PageProps } from "./$types";
  import { authClient } from "$lib/auth-client";
  import { invalidateAll } from "$app/navigation";
  import MessageCard from "$lib/components/MessageCard.svelte";
  import type { ImageApiResponse } from "$lib/types/images";

  let { data, form }: PageProps = $props();

  const createMessageWithImage: SubmitFunction = async ({
    formData,
    formElement,
    cancel,
  }) => {
    //Get the file from input
    const file = formData.get("imageFile") as File | null;

    //If the user sets an image to be uploaded
    if (file) {
      // Get the direct upload URL from our API
      const response = await fetch("/api/images", { method: "POST" });

      if (!response.ok) {
        console.error("Failed to get upload URL");
        cancel();
        return;
      }

      const { uploadURL } = (await response.json()) as { uploadURL: string };

      //Upload image directly to Cloudflare
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const uploadResponse = await fetch(uploadURL, {
        method: "POST",
        body: uploadFormData,
      });

      if (!uploadResponse.ok) {
        console.error("Failed to upload image");
        cancel();
        return;
      }

      const uploadData = (await uploadResponse.json()) as ImageApiResponse;

      const publicImageUrl = uploadData.result.variants[0];

      // Update formData with the image URL
      formData.set("image", publicImageUrl);
    }

    return async ({ result, update }) => {
      if (result.type === "success") {
        console.log("success after form submitted");
        formElement.reset();
      }
      await update();
    };
  };
</script>

<h1>Welcome from inside the App</h1>
<p>Name: {data.user?.name}</p>
<p>Email: {data.user?.email}</p>
<p>UserId: {data.user?.id}</p>

<button
  onclick={async () => {
    await authClient.signOut();
    invalidateAll();
  }}>Logout</button
>

<hr />
<h2>Form 1: Use enhance with named action</h2>
<p>
  Handle the process of submitting the form inside a custom function, full
  control
</p>
<form method="post" action="?/createMessageWithAction" use:enhance>
  <div>
    <label for="msg">Message</label>
    <textarea name="message" id="msg" maxlength="1000"></textarea>
    {#if form?.errors?.message}
      <p class="error">{form.errors.message}</p>
    {/if}
  </div>
  <button type="submit">Post Message using form 1</button>
</form>

<hr />
<h2>Form 2: Use enhance with named action and client side function</h2>
<p>
  Handle the process of submitting the form inside a custom function, full
  control
</p>
<form
  method="post"
  action="?/createMessageWithFunction"
  use:enhance={({ formElement }) => {
    //Here will come logic before form submission

    return async ({ result, update }) => {
      if (result.type === "success") {
        //Here will come logic after form succeed
        console.log("success after form submitted");
        formElement.reset();
      }
      //-If invalidate all is set to false, the form will not run the load function again for this page after submission.
      // Useful when updating the state for the page is sufficient to the user therefore saving network and db trips
      // await update({invalidateAll:false});
      await update();
    };
  }}
>
  <div>
    <label for="msg">Message</label>
    <textarea name="message" id="msg" maxlength="1000"></textarea>
    {#if form?.errors?.message}
      <p class="error">{form.errors.message}</p>
    {/if}
  </div>
  <button type="submit">Post Message using form 2</button>
</form>

<hr />
<h2>Form 3: Form with image with direct upload URL</h2>
<p>
  Handle the process of submitting the form inside a custom function, full
  control with upload image.
</p>
<form
  method="post"
  action="?/createMessageWithImage"
  use:enhance={createMessageWithImage}
  enctype="multipart/form-data"
>
  <div class="container">
    <div>
      <label for="msg">Message</label>
      <textarea name="message" id="msg" maxlength="1000"></textarea>
      {#if form?.errors?.message}
        <p class="error">{form.errors.message}</p>
      {/if}
    </div>
  </div>
  <div>
    <label for="image">Image</label>
    <input
      type="file"
      name="imageFile"
      alt="Image Upload"
      accept="image/*"
      class="sr-only"
    />
  </div>
  <button type="submit">Post Message using form 3</button>
</form>
<hr />
<div>
  <h2>Messages from DB:</h2>
  {#each data.messages as message}
    <MessageCard
      id={message.id}
      message={message.message}
      country={message.country}
      image={message.image}
      createdAt={message.createdAt}
    />
  {:else}
    <p>No messages yet</p>
  {/each}
</div>

<style>
  .container {
    display: flex;
  }
  .error {
    color: red;
    font-weight: bold;
  }
</style>
