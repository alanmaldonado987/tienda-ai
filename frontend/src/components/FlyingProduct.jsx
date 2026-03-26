import { useEffect, useState, useRef } from 'react';

export default function FlyingProduct() {
  const [flyingProduct, setFlyingProduct] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0, opacity: 1 });
  const [isAnimating, setIsAnimating] = useState(false);

  // Escuchar eventos de flying product
  useEffect(() => {
    const handleFlyingProduct = (event) => {
      const { productInfo, targetPosition } = event.detail;
      setFlyingProduct({ ...productInfo, targetX: targetPosition.x, targetY: targetPosition.y });
    };
    
    window.addEventListener('triggerFlyingProduct', handleFlyingProduct);
    return () => window.removeEventListener('triggerFlyingProduct', handleFlyingProduct);
  }, []);

  useEffect(() => {
    if (!flyingProduct || !flyingProduct.targetX) return;

    setPosition({ x: flyingProduct.startX, y: flyingProduct.startY, opacity: 1 });
    setIsAnimating(true);

    const targetX = flyingProduct.targetX;
    const targetY = flyingProduct.targetY;
    const duration = 500;
    const startTime = Date.now();
    const startX = flyingProduct.startX;
    const startY = flyingProduct.startY;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);

      const currentX = startX + (targetX - startX) * ease;
      const currentY = startY + (targetY - startY) * ease;
      const currentOpacity = 1 - progress * 0.5;

      setPosition({ x: currentX, y: currentY, opacity: currentOpacity });

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setTimeout(() => setIsAnimating(false), 100);
      }
    };

    requestAnimationFrame(animate);
  }, [flyingProduct]);

  if (!flyingProduct || !isAnimating) return null;

  return (
    <div
      className="fixed pointer-events-none z-[9999]"
      style={{
        left: position.x,
        top: position.y,
        opacity: position.opacity,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <div className="w-12 h-16 bg-white rounded-md shadow-xl overflow-hidden border border-naf-black">
        <img src={flyingProduct.image} alt={flyingProduct.name} className="w-full h-full object-cover" />
      </div>
    </div>
  );
}