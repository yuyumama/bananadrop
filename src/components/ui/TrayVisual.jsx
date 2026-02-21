import { forwardRef } from 'react';

const TrayVisual = forwardRef(function TrayVisual(
  { barWidth, rimRise, tableHeight },
  ref,
) {
  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        height: `${rimRise + tableHeight}px`,
        pointerEvents: 'none',
        zIndex: 1,
        filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.3))',
      }}
    >
      <svg
        width="100%"
        height={rimRise + tableHeight}
        viewBox={`0 0 ${barWidth} ${rimRise + tableHeight}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ display: 'block', overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="trayGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: '#e3c6a1', stopOpacity: 1 }}
            />
            <stop
              offset="50%"
              style={{ stopColor: '#d2b48c', stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: '#bc9d76', stopOpacity: 1 }}
            />
          </linearGradient>
          <pattern
            id="woodGrain"
            patternUnits="userSpaceOnUse"
            width="100"
            height="20"
          >
            <path
              d="M0 10 Q 25 5, 50 10 T 100 10"
              fill="none"
              stroke="rgba(0,0,0,0.05)"
              strokeWidth="1"
            />
            <path
              d="M0 15 Q 25 10, 50 15 T 100 15"
              fill="none"
              stroke="rgba(0,0,0,0.03)"
              strokeWidth="1"
            />
          </pattern>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
            <feOffset dx="0" dy="2" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Main Tray Body */}
        <path
          d={`M 10,${rimRise / 2} 
               Q ${barWidth / 2},${rimRise + tableHeight / 2} ${barWidth - 10},${rimRise / 2}
               L ${barWidth},${rimRise / 2 + 5}
               Q ${barWidth / 2},${rimRise + tableHeight} 0,${rimRise / 2 + 5}
               Z`}
          fill="url(#trayGradient)"
          filter="url(#shadow)"
        />

        {/* Wood Grain Overlay */}
        <path
          d={`M 10,${rimRise / 2} 
               Q ${barWidth / 2},${rimRise + tableHeight / 2} ${barWidth - 10},${rimRise / 2}
               L ${barWidth},${rimRise / 2 + 5}
               Q ${barWidth / 2},${rimRise + tableHeight} 0,${rimRise / 2 + 5}
               Z`}
          fill="url(#woodGrain)"
          opacity="0.4"
        />

        {/* Tray Rim/Edge Enhancement */}
        <path
          d={`M 10,${rimRise / 2} 
               Q ${barWidth / 2},${rimRise + tableHeight / 2} ${barWidth - 10},${rimRise / 2}`}
          fill="none"
          stroke="#c4a484"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>
    </div>
  );
});

export default TrayVisual;
