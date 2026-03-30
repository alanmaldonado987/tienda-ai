import { useState, useEffect } from 'react'
import { countdownAPI } from '../services/api'
import { motion } from 'framer-motion'

export default function CountdownTimer() {
  const [offer, setOffer] = useState(null)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOffer()
  }, [])

  useEffect(() => {
    if (!offer?.endDate) return
    
    const calculateTimeLeft = () => {
      const difference = new Date(offer.endDate) - new Date()
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [offer])

  const fetchOffer = async () => {
    try {
      const response = await countdownAPI.getFeatured()
      if (response.data.data?.length > 0) {
        setOffer(response.data.data[0])
      }
    } catch (err) {
      console.error('Error fetching countdown:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !offer) return null

  return (
    <div className="bg-naf-black text-white py-3">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">{offer.title}</span>
          <span className="bg-red-600 px-2 py-0.5 text-xs font-bold rounded">
            {offer.discountPercent}% OFF
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm mr-2">Termina en:</span>
          <div className="flex gap-1">
            <TimeUnit value={timeLeft.days} label="D" />
            <span className="text-naf-gray">:</span>
            <TimeUnit value={timeLeft.hours} label="H" />
            <span className="text-naf-gray">:</span>
            <TimeUnit value={timeLeft.minutes} label="M" />
            <span className="text-naf-gray">:</span>
            <TimeUnit value={timeLeft.seconds} label="S" />
          </div>
        </div>
      </div>
    </div>
  )
}

function TimeUnit({ value, label }) {
  return (
    <motion.div 
      key={value}
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      className="bg-white/10 px-2 py-1 rounded min-w-[36px] text-center"
    >
      <span className="text-sm font-bold font-mono">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-xs ml-1 text-white/60">{label}</span>
    </motion.div>
  )
}
