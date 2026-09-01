import React, { useState } from 'react';
import { X, Send } from 'lucide-react';

interface ContactModalProps {
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, use mailto for simple email functionality as requested
    window.location.href = `mailto:contato@exemplo.com?subject=Contato via Site&body=Nome: ${formData.name}%0AEmail: ${formData.email}%0A%0A${formData.message}`;
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-500"><X /></button>
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Entre em contato</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Nome" required className="w-full p-3 border rounded-xl dark:bg-neutral-800 dark:border-neutral-700 dark:text-white" onChange={e => setFormData({...formData, name: e.target.value})} />
          <input type="email" placeholder="E-mail" required className="w-full p-3 border rounded-xl dark:bg-neutral-800 dark:border-neutral-700 dark:text-white" onChange={e => setFormData({...formData, email: e.target.value})} />
          <textarea placeholder="Mensagem" required className="w-full p-3 border rounded-xl dark:bg-neutral-800 dark:border-neutral-700 dark:text-white" rows={4} onChange={e => setFormData({...formData, message: e.target.value})} />
          <button type="submit" className="w-full bg-[#C5A059] text-white p-3 rounded-xl flex items-center justify-center gap-2 font-bold uppercase tracking-wider">
            Enviar <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
