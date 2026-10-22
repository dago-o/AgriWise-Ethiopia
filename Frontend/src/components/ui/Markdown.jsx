import ReactMarkdown from "react-markdown";

// react-markdown does not render raw HTML by default, so model output cannot inject markup.
const components = {
  p: (p) => <p className="mt-3 first:mt-0" {...p} />,
  ul: (p) => <ul className="mt-3 list-disc space-y-1 pl-5" {...p} />,
  ol: (p) => <ol className="mt-3 list-decimal space-y-1 pl-5" {...p} />,
  h1: (p) => <h3 className="mt-4 text-lg font-semibold first:mt-0" {...p} />,
  h2: (p) => <h3 className="mt-4 text-lg font-semibold first:mt-0" {...p} />,
  h3: (p) => <h4 className="mt-4 font-semibold first:mt-0" {...p} />,
  strong: (p) => <strong className="font-semibold text-forest-900" {...p} />,
  a: (p) => <a className="text-forest-700 underline" target="_blank" rel="noopener noreferrer" {...p} />,
  code: (p) => <code className="rounded bg-ivory-100 px-1 py-0.5 text-[0.9em]" {...p} />,
};

export function Markdown({ children }) {
  return <ReactMarkdown components={components}>{children}</ReactMarkdown>;
}
