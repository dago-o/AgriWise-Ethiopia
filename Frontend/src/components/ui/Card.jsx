export function Card({ className = "", children, as: Tag = "div", ...props }) {
  return (
    <Tag className={`rounded-[var(--radius-card)] border border-ivory-200 bg-white p-5 shadow-[var(--shadow-card)] ${className}`} {...props}>
      {children}
    </Tag>
  );
}

export function CardTitle({ children, className = "" }) {
  return <h3 className={`text-lg font-semibold text-forest-900 ${className}`}>{children}</h3>;
}
