type ZeroMarkProps = {
  className?: string;
  title?: string;
};

export function ZeroMark({ className, title }: ZeroMarkProps) {
  return (
    <svg
      aria-hidden={title ? undefined : true}
      aria-label={title}
      className={className}
      fill="none"
      role={title ? "img" : undefined}
      viewBox="0 0 32 32"
    >
      {title ? <title>{title}</title> : null}
      <circle
        cx="16"
        cy="16"
        r="11.5"
        stroke="currentColor"
        strokeDasharray="3.1 3.1"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <path
        d="M22.8 7.2c2 1.7 3.4 4 4.1 6.6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.25"
      />
    </svg>
  );
}
