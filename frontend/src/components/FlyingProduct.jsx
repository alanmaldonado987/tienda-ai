import { useEffect, useState, useRef } from 'react';
import { useCart } from '../context/CartContext';

export default function FlyingProduct() {
  const { flyingProduct, cartButtonPosition } = useCart();
  const positionRef = useRef({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0, opacity: 1 });
  const [isAnimating, setIsAnimating] = useState(false);

  // Guardar la posición del carrito en un ref para evitar re-renders
  useEffect(() => {
    if (cartButtonPosition?.x && cartButtonPosition?.y) {
      positionRef.current = { x: cartButtonPosition.x, y: cartButtonPosition.y };
    }
  }, [cartButtonPosition]);

  useEffect(() => {
    if (flyingProduct) {
      // Posición inicial viene del click
      setPosition({ x: flyingProduct.startX, y: flyingProduct.startY, opacity: 1 });
      setIsAnimating(true);

      // Posición objetivo: usar la posición guardada en el ref
      const targetX = positionRef.current.x || window.innerWidth - 60;
      const targetY = positionRef.current.y || 80;

      // Animación de vuelo
      const duration = 500;
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
        const currentOpacity = 1 - progress * 0.5;
        const scale = 1 - progress * 0.3;

        setPosition({ x: currentX, y: currentY, opacity: currentOpacity });

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Terminar animación
          setTimeout(() => {
            setIsAnimating(false);
          }, 100);
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
        transform: 'translate(-50%, -50%)'
      }}
    >
      <div className="w-12 h-16 bg-white rounded-md shadow-xl overflow-hidden border border-naf-black">
        <img
          src={flyingProduct.image}
          alt={flyingProduct.name}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}