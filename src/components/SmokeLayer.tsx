/**
 * Mystic smoke overlay for WIZL — drifts lazily across the top edge
 * of every page. Fixed-position, pointer-events-none, GPU-cheap.
 * Two independent turbulence layers animate at different speeds
 * to create a never-repeating, hand-drawn feel.
 */
export default function SmokeLayer() {
  return (
    <div className="smoke-layer" aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 180" preserveAspectRatio="none">
        <defs>
          {/* Layer A: coarser, slower wisps */}
          <filter id="smoke-a" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.025" numOctaves="3" seed="7" />
            <feColorMatrix
              values="0 0 0 0 0.6
                      0 0 0 0 0.94
                      0 0 0 0 0.53
                      0 0 0 0.6 0"
            />
            <feGaussianBlur stdDeviation="6" />
          </filter>
          {/* Layer B: finer, purple-leaning mist */}
          <filter id="smoke-b" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.025 0.05" numOctaves="2" seed="19" />
            <feColorMatrix
              values="0 0 0 0 0.55
                      0 0 0 0 0.43
                      0 0 0 0 0.72
                      0 0 0 0.5 0"
            />
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>
        <rect className="smoke-a" width="400" height="180" filter="url(#smoke-a)" />
        <rect className="smoke-b" width="400" height="180" filter="url(#smoke-b)" />
      </svg>
    </div>
  );
}
