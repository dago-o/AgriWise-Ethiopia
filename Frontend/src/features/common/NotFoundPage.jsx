import { Link } from "react-router-dom";
import { LogoMark } from "../../components/layout/BrandMark.jsx";
import { ButtonLink } from "../../components/ui/Button.jsx";

export function NotFoundPage() {
  return (
    <div className="grid min-h-dvh place-items-center px-6">
      <div className="max-w-md text-center">
        <LogoMark className="mx-auto h-12 w-12" />
        <h1 className="mt-5 text-2xl font-bold text-forest-900">We can’t find that page</h1>
        <p className="mt-2 text-ink-muted">The address may be mistyped, or the page may have moved. <Link to="/login" className="font-semibold text-forest-700 underline">Sign in</Link> to reach your dashboard.</p>
        <ButtonLink to="/" className="mt-6">Back to the homepage</ButtonLink>
      </div>
    </div>
  );
}
