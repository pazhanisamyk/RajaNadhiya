import Image from "next/image";

interface OrnamentDividerProps {
  withLogo?: boolean;
}

export function OrnamentDivider({ withLogo = false }: OrnamentDividerProps) {
  return (
    <div className="ornament-divider" aria-hidden="true">
      <span className="ornament-line ornament-line-left" />
      {withLogo ? (
        <span className="ornament-seal">
          <Image
            src="/rn-logo.png"
            alt=""
            width={548}
            height={520}
            className="ornament-seal-img"
          />
        </span>
      ) : (
        <svg
          className="ornament-svg"
          width="48"
          height="20"
          viewBox="0 0 48 20"
          fill="none"
        >
          <path
            d="M4 10H16M32 10H44M24 2L28.5 10L24 18L19.5 10L24 2Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="24" cy="10" r="1.8" fill="currentColor" />
        </svg>
      )}
      <span className="ornament-line ornament-line-right" />
    </div>
  );
}

