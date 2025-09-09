"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from 'next/image';
import { motion } from "framer-motion";
import { fetchInformacoesDesaparecido, OcorrenciaInformacaoDTO } from "../../../lib/api/ocorrencia";
import ImageModal from "../../shared/ImageModal";
import { downloadImage } from '@/lib/utils/download';

const formatDateTimeDebug = (date: string | Date): string => {
  if (!date) return 'Data inválida';

  try {
  let d: Date;

  if (typeof date === 'string') {

  if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {

    d = new Date(date + 'T12:00:00-04:00');
  } else {
    d = new Date(date);
  }
  } else {
  d = new Date(date);
  }

  if (isNaN(d.getTime())) return `Data inválida: ${date}`;

  if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'America/Cuiaba'
  });
  } else {

  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Cuiaba'
  });
  }
  } catch {
  return `Erro na data: ${date}`;
  }
};

interface MediaItem {
  url: string;
  type: "video" | "image" | "document";
  name: string;
}

interface LazyAnexosProps {
  anexos: string[];
  onOpenMedia: (items: MediaItem[], index: number) => void;
}

const LazyAnexos: React.FC<LazyAnexosProps> = ({ anexos, onOpenMedia }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [loadedAnexos, setLoadedAnexos] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
  const observer = new IntersectionObserver(
  ([entry]) => {
    if (entry.isIntersecting) {
      setIsVisible(true);

      anexos.forEach((anexo, index) => {
        setTimeout(() => {
          setLoadedAnexos((prev) => [...prev, anexo]);
        }, index * 50);
      });
      observer.disconnect();
    }
  },
  { threshold: 0.1 }
  );

  if (containerRef.current) {
  observer.observe(containerRef.current);
  }

  return () => observer.disconnect();
  }, [anexos]);

  const getFileName = (url: string, anexoIndex: number) => {
  try {
  const urlObj = new URL(url);
  const pathname = urlObj.pathname;
  const fileName = pathname.split('/').pop() || 'arquivo';

  const cleanName = fileName.replace(/^[a-f0-9-]{36}\./, '');
  return cleanName || `anexo-${anexoIndex + 1}`;
  } catch {
  return `anexo-${anexoIndex + 1}`;
  }
  };

  const getFileType = (url: string) => {
  const fileName = getFileName(url, 0);
  const extension = fileName.split('.').pop()?.toLowerCase();

  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
  return 'image';
  } else if (['pdf'].includes(extension || '')) {
  return 'pdf';
  } else if (['doc', 'docx'].includes(extension || '')) {
  return 'document';
  }
  return 'file';
  };

  return (
  <div ref={containerRef} className="mt-3">
  <span className="text-sm text-gray-600 dark:text-gray-400 block mb-2">
    Anexos ({anexos.length}):
  </span>
  
  {!isVisible ?

  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {anexos.map((_, anexoIndex) =>
    <div
      key={anexoIndex}
      className="aspect-square bg-gray-100 dark:bg-gray-600 rounded-lg animate-pulse" />

    )}
    </div> :

  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {anexos.slice(0, 9).map((anexo, anexoIndex) => {
      const isLoaded = loadedAnexos.includes(anexo);
      const fileType = getFileType(anexo);
      const fileName = getFileName(anexo, anexoIndex);

      if (!isLoaded) {
        return (
          <div
            key={anexoIndex}
            className="aspect-square bg-gray-100 dark:bg-gray-600 rounded-lg animate-pulse" />);

      }

      return (
        <motion.div
          key={anexoIndex}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: anexoIndex * 0.05 }}
          className="relative aspect-square bg-gray-100 dark:bg-gray-600 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform group"
          onClick={() => {
            const mediaItems = anexos.map((url, idx) => {
              const fileName = getFileName(url, idx);
              const fileType = getFileType(url);

              let mediaType: 'image' | 'video' | 'document' = 'document';
              if (fileType === 'image') {
                mediaType = 'image';
              } else if (url.toLowerCase().match(/\.(mp4|webm|ogg|avi|mov)$/)) {
                mediaType = 'video';
              }

              return {
                url,
                type: mediaType,
                name: fileName
              };
            });

            onOpenMedia(mediaItems, anexoIndex);
          }}>
          
            {fileType === 'image' ?
          <div className="w-full h-full relative">
                <Image
              src={anexo}
              alt={fileName}
              fill
              sizes="(max-width: 640px) 50vw, 20vw"
              className="object-cover" />
            
              </div> :

          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 dark:bg-gray-700">
                <div className="text-3xl mb-2">
                  {fileType === 'pdf' ? '📄' : '📁'}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 px-2 text-center truncate max-w-full">
                  {fileName.split('.').pop()?.toUpperCase()}
                </div>
              </div>
          }
            
            {}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="flex items-center space-x-2">
                {fileType === 'image' &&
              <div className="p-2 bg-white/20 rounded-full">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
              }
                <button
                type="button"
                onClick={(e) => {e.stopPropagation();downloadImage(anexo, getFileName(anexo, anexoIndex));}}
                className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                title="Baixar arquivo">
                
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </button>
              </div>
            </div>
            
            {}
            {anexos.length > 9 && anexoIndex === 8 &&
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <span className="text-white font-medium text-lg">
                  +{anexos.length - 9}
                </span>
              </div>
          }
          </motion.div>);

    })}
    </div>
  }
  </div>);

};

interface OcorrenciaInformacoesProps {
  ocorrenciaId?: number;
  pessoaNome: string;
  className?: string;
}

export const OcorrenciaInformacoes: React.FC<OcorrenciaInformacoesProps> = ({
  ocorrenciaId,
  pessoaNome,
  className = ""
}) => {
  const [informacoes, setInformacoes] = useState<OcorrenciaInformacaoDTO[]>([]);
  const [openInformante, setOpenInformante] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isMediaViewerOpen, setIsMediaViewerOpen] = useState(false);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [initialMediaIndex, setInitialMediaIndex] = useState(0);

  const openMediaViewer = (items: MediaItem[], index: number = 0) => {
  setMediaItems(items);
  setInitialMediaIndex(index);
  setIsMediaViewerOpen(true);
  };

  useEffect(() => {
  if (ocorrenciaId) {
  carregarInformacoes();
  }
  }, [ocorrenciaId]);

  const carregarInformacoes = async () => {
  if (!ocorrenciaId) return;

  try {
  setLoading(true);
  setError(null);

  const data = await fetchInformacoesDesaparecido(ocorrenciaId);

  const sortedData = data.sort((a, b) => {
    try {
      const createDate = (dateStr: string) => {
        if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
          return new Date(dateStr + 'T12:00:00-04:00');
        } else {
          return new Date(dateStr);
        }
      };

      const dateA = createDate(a.data);
      const dateB = createDate(b.data);

      return dateB.getTime() - dateA.getTime();
    } catch {
      return 0;
    }
  });

  setInformacoes(sortedData);
  } catch (err: unknown) {
  const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
  setError(`Erro ao carregar informações: ${errorMessage}`);
  } finally {
  setLoading(false);
  }
  };

  const stripEmojis = (text?: string) => {
  if (!text) return '';

  return text.replace(/([\uD800-\uDBFF][\uDC00-\uDFFF])/g, '').replace(/[\u2600-\u26FF\u2700-\u27BF]/g, '').trim();
  };

  const splitInformacao = (text?: string) => {
  const raw = text || '';

  const markerRegex = /\n?\s*(?:DADOS DO INFORMANTE[:\-]?|DADOS DO INFORMANTE \(opcional\)[:\-]?|DADOS DO INFORMANTE \(Opcional\)[:\-]?)/i;
  const parts = raw.split(markerRegex);
  if (parts.length <= 1) {
  return { main: raw, informante: '' };
  }

  const main = parts[0];
  const informante = parts.slice(1).join('').trim();
  return { main, informante };
  };

  const normalizeMultiline = (text?: string) => {
  if (!text) return '';
  const lines = text.replace(/\r/g, '').split('\n');

  while (lines.length && lines[0].trim() === '') lines.shift();
  while (lines.length && lines[lines.length - 1].trim() === '') lines.pop();

  const indents = lines.
  filter((l) => l.trim() !== '').
  map((l) => l.match(/^\s*/)?.[0].length || 0);
  const minIndent = indents.length ? Math.min(...indents) : 0;

  const cleaned = lines.map((l) => l.slice(minIndent).replace(/\s+$/u, ''));
  return cleaned.join('\n');
  };

  if (!ocorrenciaId) {
  return null;
  }

  return (
  <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, delay: 0.1 }}
  className={`bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 ${className}`}>
  
  <div className="flex items-center justify-between mb-4">
    <div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
        Informações da Ocorrência
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Ocorrência: {ocorrenciaId}
      </p>
    </div>
    
    {loading &&
    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
    }
  </div>

  {error &&
  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
      <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
    </div>
  }


  {informacoes.length > 0 &&
  <div className="space-y-4">
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Informações registradas sobre {pessoaNome}:
      </p>
      
      <div className="max-h-96 overflow-y-auto overflow-x-hidden pr-2 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
        {informacoes.map((info, index) =>
      <motion.div
        key={info.id || index}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: 0.3,
          delay: info.anexos && info.anexos.length > 0 ? index * 0.05 : 0
        }}
        className="border-l-4 border-blue-500 pl-4 py-2">
        
          <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-2">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDateTimeDebug(info.data)}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Data original: {info.data}
                </span>
              </div>
              
              <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                Ocorrência #{info.ocoId}
              </span>
            </div>
            
            {}
  <div className="text-gray-900 dark:text-white leading-relaxed break-words whitespace-pre-wrap text-left">
              {(() => {
              const { main, informante } = splitInformacao(info.informacao);
              return (
                <>
  <div>{normalizeMultiline(stripEmojis(main))}</div>

                    {informante &&
                  <div className="mt-3">
                        <button
                      type="button"
                      onClick={() => setOpenInformante((prev) => ({ ...prev, [String(info.id || index)]: !prev[String(info.id || index)] }))}
                      className="text-sm text-blue-600 dark:text-blue-400">
                      
                          {openInformante[String(info.id || index)] ? 'Fechar Dados do Informante' : 'Abrir Dados do Informante'}
                        </button>

                          {openInformante[String(info.id || index)] &&
                    <div className="mt-2 p-2 sm:p-3 bg-gray-50 dark:bg-slate-700 rounded overflow-x-auto">
                              <div className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed">{normalizeMultiline(stripEmojis(informante))}</div>
                            </div>
                    }
                      </div>
                  }
                  </>);

            })()}
            </div>
            
            {info.anexos && info.anexos.length > 0 &&
          <LazyAnexos
            anexos={info.anexos}
            onOpenMedia={openMediaViewer} />

          }
          </div>
        </motion.div>
      )}
      </div>
    </div>
  }

  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
      <span>{informacoes.length} informações encontradas</span>
    </div>
  </div>

  {}
  <ImageModal
    isOpen={isMediaViewerOpen}
    onClose={() => setIsMediaViewerOpen(false)}
    items={mediaItems.filter((i) => i.type === 'image').map((i) => ({ url: i.url, name: i.name }))}
    initialIndex={initialMediaIndex} />
  
  </motion.div>);

};

export default OcorrenciaInformacoes;