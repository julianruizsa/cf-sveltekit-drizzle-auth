<script lang="ts">
  import { authClient } from "$lib/auth-client";

  async function loginWithGoogle() {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
      errorCallbackURL: "/",
      newUserCallbackURL: "/",
    });
  }

  async function loginWithEmailAndPassword() {
    await authClient.signIn.email(
      {
        email: "john.doe@email.com", // required
        password: "12345678", // required
        rememberMe: true,
        callbackURL: "/",
      },
      {
        onError: (ctx) => {
          console.error("Registration error:", ctx.error.message);
        },
      },
    );
  }
</script>

<h1>Login</h1>

<button onclick={loginWithGoogle}>Login With Google</button>
<hr />
<div>
  <input type="email" name="email" id="" placeholder="Email" />
  <input type="password" name="password" id="" placeholder="Password" />
  <button onclick={loginWithEmailAndPassword}>Login with Email</button>
</div>

<hr />

<p>Not an user? Register now</p>
<a href="/register">Register</a>
