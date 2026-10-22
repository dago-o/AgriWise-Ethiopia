import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert } from "../../components/feedback/Alert.jsx";
import { ConnectionBanner } from "../../components/feedback/ConnectionBanner.jsx";
import { PublicHeader } from "../../components/layout/PublicHeader.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Card, CardTitle } from "../../components/ui/Card.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { useAuth } from "../../context/useAuth.js";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";
import { getErrorMessage } from "../../lib/errorHandling.js";

const MIN_PASSWORD = 8; // UX guard only: the backend itself enforces no password rules.

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Enter your full name.";
  if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) errors.email = "Enter a valid email address.";
  if (form.password.length < MIN_PASSWORD) errors.password = `Use at least ${MIN_PASSWORD} characters.`;
  if (form.confirm !== form.password) errors.confirm = "The passwords do not match.";
  return errors;
}

export function RegisterPage() {
  useDocumentTitle("Create account");
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    setError("");
    if (Object.keys(found).length) return;
    setLoading(true);
    try {
      const user = await register({ name: form.name, email: form.email, password: form.password });
      navigate(user.role === "admin" ? "/admin" : "/app", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "Unable to register."));
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh bg-ivory-50">
      <PublicHeader />
      <div className="mx-auto flex max-w-6xl justify-center px-4 py-12 sm:px-6">
        <Card className="w-full max-w-md p-6 sm:p-8">
          <CardTitle className="text-2xl">Create your farmer account</CardTitle>
          <p className="mt-1 text-sm text-ink-muted">Register your farm, fields and crops, then track them season by season.</p>
          <div className="mt-5">
            <ConnectionBanner />
            {error ? <Alert className="mb-4">{error}</Alert> : null}
          </div>
          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <Input label="Full name" name="name" autoComplete="name" required value={form.name} onChange={set("name")} error={errors.name} />
            <Input label="Email" name="email" type="email" autoComplete="email" required value={form.email} onChange={set("email")} error={errors.email} />
            <Input label="Password" name="password" type="password" autoComplete="new-password" required value={form.password} onChange={set("password")} error={errors.password} hint={`At least ${MIN_PASSWORD} characters.`} />
            <Input label="Confirm password" name="confirm" type="password" autoComplete="new-password" required value={form.confirm} onChange={set("confirm")} error={errors.confirm} />
            <Button type="submit" size="lg" className="w-full" loading={loading}>Create account</Button>
          </form>
          <p className="mt-5 text-center text-sm text-ink-muted">
            Already registered? <Link to="/login" className="font-medium text-forest-700 hover:underline">Sign in</Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
