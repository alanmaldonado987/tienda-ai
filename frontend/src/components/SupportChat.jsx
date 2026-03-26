import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, ChevronRight } from 'lucide-react';
import { supportAPI } from '../services/api';

export default function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: '¡Hola! 👋 Soy el asistente de MODACOLOMBIA. ¿En qué puedo ayudarte?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll al final
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Abrir con animación
  const handleOpen = () => {
    setIsAnimating(true);
    setIsOpen(true);
    setTimeout(() => setIsAnimating(false), 300);
  };

  // Cerrar con animación
  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsAnimating(false);
    }, 250);
  };

  // Enviar mensaje al backend
  const handleSend = async () => {
    if (!inputText.trim()) return;

    // Agregar mensaje del usuario
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputText
    };
    setMessages(prev => [...prev, userMessage]);
    const messageToSend = inputText;
    setInputText('');
    setIsTyping(true);

    try {
      // Llamar al backend
      const response = await supportAPI.chat(messageToSend, sessionId);
      
      const { response: botText, suggestions, sessionId: newSessionId } = response.data.data;
      
      // Actualizar sessionId si es nuevo
      if (newSessionId && !sessionId) {
        setSessionId(newSessionId);
      }

      // Agregar respuesta del bot
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: botText,
        suggestions: suggestions || []
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      // Si falla el backend, usar respuesta local
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: 'Lo siento, tengo problemas técnicos en este momento. Por favor intenta más tarde o contáctanos por otro medio.',
        suggestions: ['Contacto', 'Ayuda']
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Manejar click en sugerencia
  const handleSuggestionClick = (suggestion) => {
    setInputText(suggestion);
    setTimeout(() => handleSend(), 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={handleOpen}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-naf-black rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 z-40 ${
          isOpen ? 'opacity-0 scale-0 pointer-events-none' : 'opacity-100 scale-100'
        }`}
      >
        <MessageCircle className="w-7 h-7 text-white" />
      </button>

      {/* Chat window */}
      <div
        className={`fixed bottom-6 right-6 w-80 md:w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-gray-200 transition-all duration-300 ${
          isOpen 
            ? isAnimating 
              ? 'opacity-0 scale-90 translate-y-4' 
              : 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-90 translate-y-4 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-naf-black text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold">Asistente Virtual</h3>
              <p className="text-xs text-white/70">En línea</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  msg.type === 'user'
                    ? 'bg-naf-black text-white rounded-br-md'
                    : 'bg-naf-light-gray text-naf-black rounded-bl-md'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>
                
                {/* Sugerencias */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-gray-200/50">
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="flex items-center gap-1 px-2 py-1 text-xs bg-white border border-gray-200 rounded-full hover:bg-naf-black hover:text-white hover:border-naf-black transition-colors"
                        >
                          {suggestion}
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-naf-light-gray p-3 rounded-2xl rounded-bl-md">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t bg-white">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje..."
              className="flex-1 px-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-naf-black"
            />
            <button
              onClick={handleSend}
              disabled={!inputText.trim() || isTyping}
              className="w-10 h-10 bg-naf-black text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-naf-gray transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}