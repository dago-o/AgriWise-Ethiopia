import { Link } from "react-router-dom";
import { BrandMark } from "./BrandMark.jsx";

export function PublicFooter() {
  return (
    <footer className="bg-forest-950 text-forest-200">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <BrandMark tone="light" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-forest-300">A farm management and decision-support platform for Ethiopian farmers, built as an INSA graduation project.</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white">Explore</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a className="hover:text-white" href="/#features">What it does</a></li>
            <li><a className="hover:text-white" href="/#how-it-works">How it works</a></li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white">Account</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="hover:text-white" to="/login">Sign in</Link></li>
            <li><Link className="hover:text-white" to="/register">Create an account</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-forest-400 sm:px-6">© {new Date().getFullYear()} AgriWise-Ethiopia. All rights reserved.</p>
      </div>
    </footer>
  );
}
