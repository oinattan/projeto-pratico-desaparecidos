"use client";

import React from 'react';
import { downloadImage, generateFilename, shareUtils } from '../../lib/utils/download';
import type { PessoaDTO } from '../../types';

interface ShareModalProps {
  pessoa: PessoaDTO;
  imageUrl: string;
  isCartazOficial: boolean;
  onClose?: () => void;
}

export function ShareModal({ pessoa, imageUrl, isCartazOficial, onClose }: ShareModalProps) {
  const handleDownload = async () => {
  try {
  const filename = generateFilename(pessoa, isCartazOficial ? 'cartaz' : 'foto');
  await downloadImage(imageUrl, filename);
  alert('📥 Download iniciado! Verifique sua pasta de downloads.');
  } catch (error) {
  alert('❌ Erro ao baixar a imagem. Tente novamente.');
  }
  };

  const handleCopyHashtags = () => {
  const hashtags = shareUtils.createHashtags(pessoa);
  navigator.clipboard.writeText(hashtags).then(() => {
  alert('📋 Hashtags copiadas para a área de transferência!');
  }).catch(() => {
  prompt('Copie as hashtags:', hashtags);
  });
  };

  const handleCopyCaption = () => {
  const caption = shareUtils.createInstagramCaption(pessoa);
  navigator.clipboard.writeText(caption).then(() => {
  alert('📋 Texto copiado para a área de transferência!');
  }).catch(() => {
  prompt('Copie o texto:', caption);
  });
  };

  const modalHtml = `
  <html>
  <head>
    <title>Compartilhar no Instagram - ${pessoa.nome}</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #fff;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        min-height: 100vh;
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .container {
        max-width: 800px;
        width: 100%;
        background: rgba(0, 0, 0, 0.8);
        border-radius: 20px;
        padding: 30px;
        backdrop-filter: blur(10px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      }

      .header {
        text-align: center;
        margin-bottom: 30px;
      }

      .header h1 {
        font-size: 2em;
        margin-bottom: 10px;
        background: linear-gradient(45deg, #f093fb, #f5576c);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .badge {
        display: inline-block;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: 600;
        margin: 10px 0;
      }

      .badge.official {
        background: linear-gradient(45deg, #28a745, #20c997);
        color: white;
      }

      .badge.warning {
        background: linear-gradient(45deg, #ffc107, #fd7e14);
        color: #000;
      }

      .image-container {
        text-align: center;
        margin: 30px 0;
        position: relative;
      }

      .image-container img {
        max-width: 100%;
        max-height: 500px;
        object-fit: contain;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        transition: transform 0.3s ease;
      }

      .image-container img:hover {
        transform: scale(1.02);
      }

      .download-btn {
        position: absolute;
        top: 15px;
        right: 15px;
        background: rgba(0, 0, 0, 0.8);
        border: none;
        color: white;
        padding: 12px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 18px;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
      }

      .download-btn:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: scale(1.1);
      }

      .section {
        background: rgba(255, 255, 255, 0.1);
        padding: 25px;
        border-radius: 15px;
        margin: 20px 0;
        backdrop-filter: blur(5px);
      }

      .section h3 {
        margin-bottom: 15px;
        color: #f8f9fa;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 1.3em;
      }

      .instructions ol {
        padding-left: 20px;
        line-height: 1.8;
      }

      .instructions li {
        margin-bottom: 8px;
      }

      .tip {
        background: rgba(40, 167, 69, 0.2);
        padding: 15px;
        border-radius: 10px;
        margin: 15px 0;
        border-left: 4px solid #28a745;
      }

      .content-box {
        background: rgba(0, 0, 0, 0.3);
        padding: 20px;
        border-radius: 10px;
        margin: 15px 0;
        font-family: monospace;
        font-size: 14px;
        line-height: 1.6;
        border: 1px solid rgba(255, 255, 255, 0.2);
      }

      .btn {
        background: linear-gradient(45deg, #833ab4, #fd1d1d, #fcb045);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 25px;
        cursor: pointer;
        font-weight: 600;
        margin: 8px;
        transition: all 0.3s ease;
        font-size: 14px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      }

      .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
      }

      .btn.download {
        background: linear-gradient(45deg, #007bff, #0056b3);
      }

      .btn.close {
        background: linear-gradient(45deg, #6c757d, #495057);
        margin-top: 30px;
        padding: 15px 30px;
        font-size: 16px;
      }

      .button-group {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 10px;
        margin-top: 20px;
      }

      .close-button {
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        border: none;
        color: white;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 20px;
        z-index: 1000;
      }

      .close-button:hover {
        background: rgba(255, 0, 0, 0.8);
      }

      @media (max-width: 768px) {
        .container {
          padding: 20px;
          margin: 10px;
        }

        .header h1 {
          font-size: 1.5em;
        }

        .section {
          padding: 20px;
        }

        .btn {
          padding: 10px 20px;
          font-size: 13px;
        }
      }
    </style>
  </head>
  <body>
    <button class="close-button" onclick="window.close()" title="Fechar">×</button>

    <div class="container">
      <div class="header">
        <h1>📷 Compartilhar no Instagram</h1>
        ${isCartazOficial ?
  '<div class="badge official">📋 Cartaz Oficial Disponível</div>' :
  '<div class="badge warning">⚠️ Usando foto pessoal (cartaz oficial não disponível)</div>'}
      </div>

      <div class="image-container">
        <img src="${
  imageUrl}" alt="${pessoa.nome}" id="mainImage" />
        <button class="download-btn" onclick="downloadImage()" title="Baixar Imagem">
          📥
        </button>
      </div>

      <div class="section">
        <h3>📋 Como compartilhar</h3>
        <div class="instructions">
          <ol>
            <li><strong>Clique no botão de download</strong> (📥) ou clique com o botão direito na imagem</li>
            <li>Salve a imagem no seu dispositivo</li>
            <li>Abra o <strong>Instagram</strong> no seu celular</li>
            <li>Crie um <strong>novo post</strong> ou <strong>story</strong></li>
            <li>Adicione a imagem salva</li>
            <li>Copie e cole o <strong>texto</strong> e <strong>hashtags</strong> abaixo</li>
          </ol>
        </div>
        ${isCartazOficial ?
  '<div class="tip"><strong>💡 Dica:</strong> Este é o cartaz oficial do caso. Use-o para maior impacto e alcance!</div>' :
  ''}
      </div>

      <div class="section">
        <h3>🏷️ Hashtags para copiar</h3>
        <div class="content-box" id="hashtags">${
  shareUtils.createHashtags(pessoa)}</div>
        <div class="button-group">
          <button class="btn" onclick="copyHashtags()">📋 Copiar Hashtags</button>
        </div>
      </div>

      <div class="section">
        <h3>📝 Texto sugerido para legenda</h3>
        <div class="content-box" id="caption">${shareUtils.createInstagramCaption(pessoa)}</div>
        <div class="button-group">
          <button class="btn" onclick="copyCaption()">📋 Copiar Texto</button>
        </div>
      </div>

      <div class="button-group">
        <button class="btn download" onclick="downloadImage()">📥 Baixar Imagem</button>
        <button class="btn close" onclick="window.close()">Fechar</button>
      </div>
    </div>

    <script>
      async function downloadImage() {
        try {
          const imageUrl = "${imageUrl}";
          const filename = "${generateFilename(pessoa, isCartazOficial ? 'cartaz' : 'foto')}";

          // Fazer fetch da imagem
          const response = await fetch(imageUrl);
          if (!response.ok) throw new Error('Erro ao baixar');

          // Converter para blob
          const blob = await response.blob();

          // Criar URL temporária
          const blobUrl = window.URL.createObjectURL(blob);

          // Criar link de download
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = filename;

          // Fazer download
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Limpar
          window.URL.revokeObjectURL(blobUrl);

          alert('📥 Download iniciado! Verifique sua pasta de downloads.');
        } catch (error) {
          alert('❌ Erro ao baixar. Tente clicar com o botão direito na imagem e selecionar "Salvar como".');
        }
      }

      function copyHashtags() {
        const hashtags = document.getElementById('hashtags').textContent;
        navigator.clipboard.writeText(hashtags).then(() => {
          alert('📋 Hashtags copiadas para a área de transferência!');
        }).catch(() => {
          prompt('Copie as hashtags:', hashtags);
        });
      }

      function copyCaption() {
        const caption = document.getElementById('caption').textContent;
        navigator.clipboard.writeText(caption).then(() => {
          alert('📋 Texto copiado para a área de transferência!');
        }).catch(() => {
          prompt('Copie o texto:', caption);
        });
      }

      // Fechar com ESC
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          window.close();
        }
      });
    </script>
  </body>
  </html>
  `;

  return modalHtml;
}

export default ShareModal;