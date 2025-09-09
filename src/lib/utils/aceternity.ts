export function generateRandomPosition(containerWidth: number, containerHeight: number) {
  return {
  x: Math.random() * containerWidth,
  y: Math.random() * containerHeight
  };
}

export function generateRandomDelay(min: number = 0, max: number = 2) {
  return Math.random() * (max - min) + min;
}

export function generateRandomColor(colors: string[]) {
  return colors[Math.floor(Math.random() * colors.length)];
}

export function generateMeteorStyles(containerWidth: number, containerHeight: number) {
  return {
  top: `${Math.random() * containerHeight - 200}px`,
  left: `${Math.random() * containerWidth - 200}px`,
  animationDelay: `${Math.random() * 2}s`,
  animationDuration: `${Math.random() * 3 + 2}s`
  };
}

export function createRippleEffect(event: React.MouseEvent, containerRef: React.RefObject<HTMLElement>) {
  if (!containerRef.current) return null;

  const rect = containerRef.current.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  return { x, y };
}