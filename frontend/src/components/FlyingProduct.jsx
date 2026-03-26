import { useEffect, useState, useRef } from 'react';
import { useCart } from '../context/CartContext';

export default function FlyingProduct() {
  const { flyingProduct, cartButtonPosition } = useCart();
  const positionRef = useRef({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0, opacity: 1 });
  const [isAnimating, setIsAnimating] = useState(false);

  // Guardar la posición del carrito cuando cambie
  useEffect(() => {
    console.log('cartButtonPosition updated:', cartButtonPosition);
    if (cartButtonPosition?.x && cartButtonPosition?.y) {
      positionRef.current = { 
        x: cartButtonPosition.x, 
        y: cartButtonPosition.y 
      };
      console.log('positionRef updated:', positionRef.current);
    }
  }, [cartButtonPosition]);

  useEffect(() => {
    if (!flyingProduct) return;

    // Usar la posición actual del ref
    const targetX = positionRef.current.x;
    const targetY = positionRef.current.y;

    // Si no tenemos posición válida, no animamos
    if (!targetX || !targetY) {
      console.log('No cart position available');
      return;
    }

    setPosition({ x: flyingProduct.startX, y: flyingProduct.startY, opacity: 1 });
    setIsAnimating(true);

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