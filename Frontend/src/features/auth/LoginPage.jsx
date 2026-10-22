import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Alert } from "../../components/feedback/Alert.jsx";
import { ConnectionBanner } from "../../components/feedback/ConnectionBanner.jsx";
import { PublicHeader } from "../../components/layout/PublicHeader.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Card, CardTitle } from "../../components/ui/Card.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { useAuth } from "../../context/useAuth.js";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";
import { getErrorMessage } from "../../lib/errorHandling.js";

export function LoginPage() {
  useDocumentTitle("Sign in");
  const { login, notice, clearNotice } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    clearNotice();
    setLoading(true);
    try {
      const user = await login(form);
      const home = user.role === "admin" ? "/admin" : "/app";
      const from = location.state?.from;
      // Only go back to where the user came from if it belongs to this role's area.
      navigate(from && from.startsWith(home) ? from : home, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "Unable to sign in."));
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh bg-ivory-50">
      <PublicHeader />
      <div className="mx-auto flex max-w-6xl justify-center px-4 py-12 sm:px-6">
        <Card className="w-full max-w-md p-6 sm:p-8">
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <p className="mt-1 text-sm text-ink-muted">Sign in to see your farms, crops and today’s conditions.</p>
          <div className="mt-5">
            <ConnectionBanner />
            {notice ? <Alert variant="info" className="mb-4">{notice}</Alert> : null}
            {error ? <Alert className="mb-4">{error}</Alert> : null}
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input label="Email" name="email" type="email" autoComplete="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input label="Password" name="password" type="password" autoComplete="current-password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <Button type="submit" size="lg" className="w-full" loading={loading}>Sign in</Button>
          </form>
          <p className="mt-5 text-center text-sm text-ink-muted">
            New farmer? <Link to="/register" className="font-medium text-forest-700 hover:underline">Create an account</Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
