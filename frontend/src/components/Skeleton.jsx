import { motion } from 'framer-motion';

/**
 * Skeleton - Componente de carga reutilizable
 * Uso: <Skeleton variant="card" count={3} />
 */

export default function Skeleton({ 
  variant = 'text', 
  width, 
  height, 
  count = 1,
  className = '',
  rounded = 'rounded'
}) {
  const baseClasses = `bg-gray-200 animate-pulse ${rounded}`;
  
  const variants = {
    text: 'h-4 w-full',
    title: 'h-6 w-3/4',
    avatar: 'w-12 h-12 rounded-full',
    card: 'h-64 w-full',
    cardHorizontal: 'h-48 w-80',
    image: 'h-64 w-full',
    button: 'h-10 w-24',
    input: 'h-10 w-full',
    tableRow: 'h-12 w-full',
    badge: 'h-6 w-16',
    price: 'h-6 w-20',
    thumbnail: 'w-16 h-16'
  };

  const skeletonClass = variants[variant] || variants.text;

  if (count === 1) {
    return (
      <div 
        className={`${baseClasses} ${skeletonClass} ${className}`}
        style={{ width, height }}
      />
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: i * 0.1
          }}
          className={`${baseClasses} ${skeletonClass}`}
          style={{ width, height }}
        />
      ))}
    </div>
  );
}

// Skeleton para ProductCard
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-100">
      <Skeleton variant="image" className="aspect-[3/4]" />
      <div className="p-4 space-y-3">
        <Skeleton variant="text" />
        <Skeleton variant="text" width="60%" />
        <div className="flex gap-2">
          <Skeleton variant="thumbnail" />
          <Skeleton variant="thumbnail" />
          <Skeleton variant="thumbnail" />
        </div>
      </div>
    </div>
  );
}

// Skeleton para ProductGrid
export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Skeleton para formulario
export function FormSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton variant="input" />
      <Skeleton variant="input" />
      <Skeleton variant="input" />
      <Skeleton variant="button" className="mt-4" />
    </div>
  );
}

// Skeleton para tabla
export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex gap-4 p-4 bg-gray-50 rounded">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} variant="text" className="flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 p-4 border-b">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton key={colIndex} variant="text" className="flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

// Skeleton para perfil de usuario
export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <Skeleton variant="avatar" className="w-24 h-24" />
        <div className="space-y-2 flex-1">
          <Skeleton variant="title" />
          <Skeleton variant="text" width="50%" />
        </div>
      </div>
      <FormSkeleton />
    </div>
  );
}

// Skeleton para detalle de producto
export function ProductDetailSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Skeleton variant="image" className="aspect-[3/4] rounded-xl" />
      <div className="space-y-4">
        <Skeleton variant="title" />
        <Skeleton variant="text" width="30%" />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="button" className="w-full mt-8" />
      </div>
    </div>
  );
}

// Skeleton para tarjeta de orden
export function OrderCardSkeleton() {
  return (
    <div className="bg-white border rounded-lg p-4 space-y-3">
      <div className="flex justify-between">
        <Skeleton variant="text" width="30%" />
        <Skeleton variant="badge" />
      </div>
      <Skeleton variant="text" />
      <Skeleton variant="text" width="50%" />
    </div>
  );
}

// Skeleton para stats del dashboard
export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white p-6 rounded-xl border">
          <Skeleton variant="text" width="50%" className="mb-2" />
          <Skeleton variant="title" />
        </div>
      ))}
    </div>
  );
}
