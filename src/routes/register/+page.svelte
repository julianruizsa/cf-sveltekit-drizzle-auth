<script lang="ts">
  import { goto } from "$app/navigation";
  import { authClient } from "$lib/auth-client";

  async function registerWithEmailAndPassword() {
    await authClient.signUp.email(
      {
        name: "John Doe", // required
        email: "john6.doe@email.com", // required
        password: "12345678", // required
        // image: "",
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          goto("/app");
        },
        onError: (ctx) => {
          console.error("Registration error:", ctx.error.message);
        },
      },
    );
  }
</script>

<h1>Register</h1>

<hr />
<div>
  <input type="text" name="name" id="" placeholder="Name" />
  <input type="email" name="email" id="" placeholder="Email" />
  <input type="password" name="password" id="" placeholder="Password" />
  <button onclick={registerWithEmailAndPassword}>Register</button>
</div>
<p>Already registered? <a href="/login">Login</a></p>
