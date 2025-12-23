import { useRouter } from 'next/router';

export default function Reset() {
  const router = useRouter();
  const { token } = router.query;
  async function handle(e) {
    e.preventDefault();
    const password = e.target.password.value;
    const res = await fetch('/api/auth/reset', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, password }) });
    const data = await res.json();
    if (data.error) return alert(data.error);
    alert('Password reset. You can login now.');
    router.push('/login');
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Reset Password</h1>
      <form onSubmit={handle}>
        <input name="password" type="password" placeholder="New password" />
        <button type="submit">Reset</button>
      </form>
    </div>
  );
}
