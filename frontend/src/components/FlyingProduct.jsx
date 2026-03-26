import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';

export default function FlyingProduct() {
  const { flyingProduct } = useCart();
  const [position, setPosition] = useState({ x: 0, y: 0, opacity: 1 });
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (flyingProduct) {
      // Posición inicial viene del click
      setPosition({ x: flyingProduct.startX, y: flyingProduct.startY, opacity: 1 });
      setIsAnimating(true);

      // Calcular posición final (carrito en header - aproximada)
      const targetX = window.innerWidth - 80;
      const targetY = 80;

      // Animación de vuelo
      const duration = 600;
      const startTime = Date.now();
      const startX = flyingProduct.startX;
      const startY = flyingProduct.startY;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const ease = 1 - Math.pow(1 - progress, 3);

        const currentX = startX + (targetX - startX) * ease;
        const currentY = startY + (targetY - startY) * ease;
        const currentOpacity = 1 - progress * 0.3;
        const scale = 1 - progress * 0.5;

        setPosition({ x: currentX, y: currentY, opacity: currentOpacity });

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Al final, hacer un pequeño "pop" en el carrito
          setTimeout(() => {
            setIsAnimating(false);
          }, 200);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [flyingProduct]);

  if (!flyingProduct || !isAnimating) return null;

  return (
    <div
      className="fixed pointer-events-none z-[9999]"
      style={{
        left: position.x,
        top: position.y,
        opacity: position.opacity,
        transform: `translate(-50%, -50%) scale(${1 - (flyingProduct ? 0.5 : 0)})`,
        transition: 'none'
      }}
    >
      <div className="w-16 h-20 bg-white rounded-lg shadow-2xl overflow-hidden border-2 border-naf-black">
        <img
          src={flyingProduct.image}
          alt={flyingProduct.name}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}