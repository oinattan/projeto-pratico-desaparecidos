"use client";
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { downloadImage } from '@/lib/utils/download';
import { useRouter } from 'next/navigation';

interface ImageItem {
  url: string;
  name?: string;
}

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ImageItem[];
  initialIndex?: number;
}

export const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, items, initialIndex = 0 }) => {
  const router = useRouter();
  const [index, setIndex] = useState(initialIndex);
  const [loading, setLoading] = useState(true);
  const [scale, setScale] = useState<number>(1);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
  if (isOpen) {
  setIndex(initialIndex);
  setLoading(true);
  setScale(1);
  }
  }, [isOpen, initialIndex]);

  useEffect(() => {
  const handler = (e: KeyboardEvent) => {
  if (!isOpen) return;
  if (e.key === 'Escape') onClose();
  if (e.key === 'ArrowRight') setIndex((i) => Math.min(i + 1, items.length - 1));
  if (e.key === 'ArrowLeft') setIndex((i) => Math.max(i - 1, 0));
  };
  window.addEventListener('keydown', handler);
  return () => window.removeEventListener('keydown', handler);
  }, [isOpen, items.length, onClose]);

  const goNext = useCallback(() => setIndex((i) => Math.min(i + 1, items.length - 1)), [items.length]);
  const goPrev = useCallback(() => setIndex((i) => Math.max(i - 1, 0)), [items.length]);

  const closeAndGoToOcorrencias = () => {
  onClose();
  try {
  router.push('/ocorrencias');
  } catch {
  if (typeof window !== 'undefined') window.location.href = '/ocorrencias';
  }
  };

  if (!isOpen || items.length === 0) return null;

  const current = items[index];

  return createPortal(
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6">
  <div className="relative max-w-[90vw] max-h-[90vh] bg-transparent p-4 rounded">
    <button
      onClick={closeAndGoToOcorrencias}
      className="absolute left-4 top-4 z-40 bg-white/10 text-white px-3 py-2 rounded-md">
      
      Voltar
    </button>

    <button
      onClick={onClose}
      className="absolute right-4 top-4 z-40 bg-white text-black p-2 rounded-full"
      aria-label="Fechar">
      
      <X size={18} />
    </button>

    <div className="flex flex-col sm:flex-row items-center justify-center w-full gap-4">
      <button
        onClick={goPrev}
        disabled={index === 0}
        className="text-white bg-black/40 p-3 rounded-full disabled:opacity-50 z-30 self-center sm:self-auto"
        aria-label="Anterior">
        
        <ChevronLeft size={20} />
      </button>

      <div ref={wrapperRef} className="max-w-[78vw] max-h-[76vh] flex items-center justify-center overflow-hidden p-2 bg-transparent rounded">
        {loading &&
        <div className="flex items-center justify-center w-full h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
          </div>
        }
        <img
          src={current.url}
          alt={current.name || `imagem-${index + 1}`}
          className="max-w-full max-h-full object-contain"
          style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
          onLoad={(e) => {
            try {
              const img = e.currentTarget as HTMLImageElement;
              const natW = img.naturalWidth || 0;
              const natH = img.naturalHeight || 0;
              console.debug('[ImageModal] loaded image', { natW, natH, wrapperRect: wrapperRef.current?.getBoundingClientRect() });
              const rect = wrapperRef.current?.getBoundingClientRect();
              if (rect && natW > 0 && natH > 0) {
                const scaleFit = Math.min(rect.width / natW, rect.height / natH);

                const computed = Math.min(2, Math.max(1, scaleFit));
                console.debug('[ImageModal] scaleFit/computed', { scaleFit, computed });
                setScale(computed);
              } else {
                setScale(1);
              }
            } catch {
              setScale(1);
            }
            setLoading(false);
          }}
          onError={() => setLoading(false)} />
        
      </div>

      <button
        onClick={goNext}
        disabled={index === items.length - 1}
        className="text-white bg-black/40 p-3 rounded-full disabled:opacity-50 z-30 self-center sm:self-auto"
        aria-label="Próximo">
        
        <ChevronRight size={20} />
      </button>
    </div>

    <div className="mt-3 text-center text-white flex flex-col sm:flex-row items-center justify-center gap-3">
      <span className="text-sm">{index + 1} de {items.length}</span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setScale((s) => Math.max(0.5, +(s - 0.25).toFixed(2)))}
          className="text-white bg-white/10 px-3 py-1 rounded"
          title="Diminuir escala">
          -</button>
        <button
          onClick={() => setScale((s) => Math.min(2, +(s + 0.25).toFixed(2)))}
          className="text-white bg-white/10 px-3 py-1 rounded"
          title="Aumentar escala">
          +</button>
        <button
          onClick={() => downloadImage(current.url, current.name || `imagem-${index + 1}`)}
          className="text-white bg-white/10 px-3 py-1 rounded">
          
          <Download size={16} />
        </button>
      </div>
    </div>
  </div>
  </div>,
  document.body
  );
};

export default ImageModal;