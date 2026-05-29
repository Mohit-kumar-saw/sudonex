export function HeroFallback({ variant }: { variant: string }) {
  const orbit = variant === 'orbit';
  const network = variant === 'network';
  const helix = variant === 'helix';
  const arcs = variant === 'arcs';
  const wave = variant === 'wave';
  const contact = variant === 'contact';
  const about = variant === 'about';
  const services = variant === 'services';
  const solutions = variant === 'solutions';
  const industries = variant === 'industries';
  const work = variant === 'work';
  const noSpin = orbit || helix || contact || about || services || solutions || industries || work;

  return (
    <div className="relative w-full max-w-[420px] aspect-square mx-auto flex items-center justify-center">
      <svg
        viewBox="0 0 200 200"
        className={`w-[85%] h-[85%] ${noSpin ? '' : 'animate-[spin_48s_linear_infinite]'}`}
        aria-hidden
      >
        {orbit && (
          <>
            <circle cx="100" cy="100" r="52" fill="rgba(255,102,0,0.15)" />
            <ellipse cx="100" cy="100" rx="72" ry="28" fill="none" stroke="rgba(255,102,0,0.4)" strokeWidth="0.8" />
            <ellipse cx="100" cy="100" rx="68" ry="48" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
            <ellipse cx="100" cy="100" rx="28" ry="68" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
          </>
        )}
        {network && (
          <>
            <polygon points="100,30 160,70 140,150 60,150 40,70" fill="none" stroke="rgba(255,102,0,0.35)" strokeWidth="0.8" />
            <line x1="100" y1="30" x2="140" y2="150" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
            <line x1="160" y1="70" x2="60" y2="150" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
            <line x1="40" y1="70" x2="140" y2="150" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
          </>
        )}
        {helix && (
          <>
            <path d="M70,20 Q110,60 70,100 Q30,140 70,180" fill="none" stroke="rgba(255,102,0,0.4)" strokeWidth="0.8" />
            <path d="M130,20 Q90,60 130,100 Q170,140 130,180" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.6" />
          </>
        )}
        {arcs && (
          <>
            <path d="M30,160 Q100,40 170,160" fill="none" stroke="rgba(255,102,0,0.35)" strokeWidth="0.8" />
            <path d="M50,160 Q100,60 150,160" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
            <path d="M70,160 Q100,80 130,160" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
          </>
        )}
        {wave && (
          <>
            <path d="M20,120 Q60,80 100,120 T180,120" fill="none" stroke="rgba(255,102,0,0.4)" strokeWidth="0.8" />
            <path d="M20,140 Q60,100 100,140 T180,140" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
          </>
        )}
        {contact && (
          <>
            <rect x="72" y="58" width="56" height="88" rx="28" fill="rgba(51,20,0,0.6)" stroke="rgba(255,102,0,0.65)" strokeWidth="1.2" />
            <path d="M72,86 Q100,72 128,86" fill="none" stroke="rgba(255,133,51,0.5)" strokeWidth="0.8" />
            <rect x="82" y="92" width="36" height="6" rx="1" fill="rgba(255,102,0,0.75)" />
            <rect x="128" y="100" width="22" height="14" fill="rgba(255,102,0,0.55)" stroke="rgba(255,133,51,0.7)" strokeWidth="0.6" />
            <line x1="128" y1="114" x2="128" y2="132" stroke="rgba(153,61,0,0.8)" strokeWidth="1.2" />
            <rect x="52" y="38" width="30" height="20" rx="2" fill="rgba(51,20,0,0.7)" stroke="rgba(255,102,0,0.6)" strokeWidth="0.8" />
            <path d="M52,38 L67,50 L82,38" fill="none" stroke="rgba(255,133,51,0.65)" strokeWidth="0.7" />
            <circle cx="100" cy="34" r="11" fill="none" stroke="rgba(255,102,0,0.55)" strokeWidth="1" />
            <path d="M111,34 L111,22" stroke="rgba(255,133,51,0.6)" strokeWidth="0.8" />
          </>
        )}
        {about && (
          <>
            <line x1="36" y1="155" x2="36" y2="48" stroke="rgba(255,102,0,0.5)" strokeWidth="0.8" />
            <line x1="36" y1="155" x2="168" y2="155" stroke="rgba(153,61,0,0.4)" strokeWidth="0.6" />
            {[48, 68, 88, 108, 128, 148].map((x, i) => {
              const h = 28 + i * 14 + (i % 2) * 8;
              return (
                <rect
                  key={x}
                  x={x - 8}
                  y={155 - h}
                  width="16"
                  height={h}
                  fill="rgba(51,20,0,0.75)"
                  stroke="rgba(255,102,0,0.55)"
                  strokeWidth="0.7"
                />
              );
            })}
            <path
              d="M40,130 L56,118 L72,108 L88,92 L104,78 L120,62 L136,48 L152,38"
              fill="none"
              stroke="rgba(255,133,51,0.85)"
              strokeWidth="1.2"
            />
            <path
              d="M40,130 L56,118 L72,108 L88,92 L104,78 L120,62 L136,48 L152,38 L152,155 L40,155 Z"
              fill="rgba(255,102,0,0.08)"
            />
            <circle cx="152" cy="38" r="5" fill="rgba(255,133,51,0.8)" />
          </>
        )}
        {services && (
          <>
            <line x1="48" y1="42" x2="48" y2="158" stroke="rgba(255,102,0,0.45)" strokeWidth="0.8" />
            {[52, 68, 84, 100, 116, 132, 148].map((y, i) => (
              <rect
                key={y}
                x={58 + (i % 2) * 4}
                y={y}
                width={84 - i * 4}
                height="10"
                fill="rgba(51,20,0,0.75)"
                stroke="rgba(255,102,0,0.55)"
                strokeWidth="0.7"
              />
            ))}
            <circle cx="42" cy="100" r="10" fill="none" stroke="rgba(255,133,51,0.5)" strokeWidth="0.7" />
          </>
        )}
        {solutions && (
          <>
            <rect x="82" y="82" width="36" height="36" fill="rgba(51,20,0,0.75)" stroke="rgba(255,133,51,0.75)" strokeWidth="1" />
            {[0, 60, 120, 180, 240, 300].map((deg, i) => {
              const rad = (deg * Math.PI) / 180;
              const x = 100 + Math.cos(rad) * 52;
              const y = 100 + Math.sin(rad) * 30;
              return (
                <g key={i}>
                  <line x1="100" y1="100" x2={x} y2={y} stroke="rgba(255,102,0,0.3)" strokeWidth="0.6" />
                  <polygon
                    points={`${x},${y - 10} ${x + 9},${y + 5} ${x - 9},${y + 5}`}
                    fill="rgba(51,20,0,0.7)"
                    stroke="rgba(255,102,0,0.55)"
                    strokeWidth="0.7"
                  />
                </g>
              );
            })}
            <ellipse cx="100" cy="100" rx="62" ry="36" fill="none" stroke="rgba(153,61,0,0.35)" strokeWidth="0.6" />
          </>
        )}
        {industries && (
          <>
            <circle cx="100" cy="100" r="14" fill="rgba(255,102,0,0.2)" stroke="rgba(255,133,51,0.6)" strokeWidth="0.9" />
            <circle cx="100" cy="100" r="58" fill="none" stroke="rgba(153,61,0,0.35)" strokeWidth="0.6" />
            {[0, 60, 120, 180, 240, 300].map((deg, i) => {
              const rad = (deg * Math.PI) / 180;
              const len = 22 + (i % 3) * 10;
              const x2 = 100 + Math.cos(rad) * len;
              const y2 = 100 + Math.sin(rad) * len;
              return (
                <g key={i}>
                  <line x1="100" y1="100" x2={x2} y2={y2} stroke="rgba(255,102,0,0.35)" strokeWidth="0.7" />
                  <circle cx={x2} cy={y2} r="4" fill="rgba(255,133,51,0.7)" />
                </g>
              );
            })}
            <path
              d="M100,100 L155,85 A58,58 0 0,1 100,100 Z"
              fill="rgba(255,102,0,0.1)"
            />
          </>
        )}
        {work && (
          <>
            <rect x="68" y="72" width="64" height="44" rx="3" fill="rgba(51,20,0,0.8)" stroke="rgba(255,133,51,0.8)" strokeWidth="1" />
            <rect x="74" y="78" width="52" height="8" fill="rgba(255,102,0,0.45)" />
            <line x1="78" y1="94" x2="122" y2="94" stroke="rgba(153,61,0,0.5)" strokeWidth="0.6" />
            <line x1="78" y1="102" x2="110" y2="102" stroke="rgba(153,61,0,0.4)" strokeWidth="0.5" />
            <line x1="78" y1="110" x2="118" y2="110" stroke="rgba(153,61,0,0.4)" strokeWidth="0.5" />
            <circle cx="124" cy="76" r="4" fill="rgba(255,133,51,0.8)" />
            <rect x="48" y="88" width="40" height="30" rx="2" fill="rgba(51,20,0,0.55)" stroke="rgba(255,102,0,0.35)" strokeWidth="0.6" transform="rotate(-12 68 103)" />
            <rect x="112" y="88" width="40" height="30" rx="2" fill="rgba(51,20,0,0.55)" stroke="rgba(255,102,0,0.35)" strokeWidth="0.6" transform="rotate(12 132 103)" />
          </>
        )}
        {!orbit && !network && !helix && !arcs && !wave && !contact && !about && !services && !solutions && !industries && !work && (
          <>
            <circle cx="100" cy="100" r="78" fill="none" stroke="rgba(255,102,0,0.35)" strokeWidth="0.8" />
            <ellipse cx="100" cy="100" rx="78" ry="24" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
            <ellipse cx="100" cy="100" rx="78" ry="48" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
          </>
        )}
      </svg>
      <div className="absolute w-3 h-3 rounded-full bg-brand-500/80 blur-sm animate-pulse" />
    </div>
  );
}
