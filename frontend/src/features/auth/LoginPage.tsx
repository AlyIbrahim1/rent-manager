export function LoginPage() {
  return (
    <main>
      <h1>Sign in to Rent Manager</h1>
      <form>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" />
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" />
        <button type="submit">Sign in</button>
      </form>
    </main>
  );
}
