/**
 * Render a circular ripple visual positioned at the provided coordinates.
 *
 * @param {{ effect: { x: number, y: number } }} props - Component props.
 * @param {number} props.effect.x - X-coordinate (left) for the ripple position, in pixels.
 * @param {number} props.effect.y - Y-coordinate (top) for the ripple position, in pixels.
 * @returns {JSX.Element} The positioned ripple div element.
 */
function ClickRipple({ effect }) {
  return (
    <div
      style={{
        position: 'fixed',
        left: effect.x,
        top: effect.y,
        width: 50,
        height: 50,
        borderRadius: '50%',
        border: '3px solid var(--ripple-color)',
        pointerEvents: 'none',
        zIndex: 20,
        animation: 'ripple 0.6s ease-out forwards',
      }}
    />
  );
}

export default ClickRipple;
