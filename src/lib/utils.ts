import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getSvgContent(url: string): Promise<string> {
  try {
    console.log('Fetching SVG content from:', url);
    const response = await fetch(url);
    console.log('Response status:', response.status);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const content = await response.text();
    console.log('SVG content length:', content.length);
    console.log('First 100 chars:', content.substring(0, 100));
    return content;
  } catch (error) {
    console.error('Failed to get SVG content:', error);
    throw error;
  }
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    console.log('Copying text to clipboard, length:', text.length);
    console.log('First 100 chars:', text.substring(0, 100));
    
    // 尝试使用 Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      console.log('Using Clipboard API');
      await navigator.clipboard.writeText(text);
      console.log('Clipboard API success');
      return true;
    } else {
      // 降级方案：使用传统的方法
      console.log('Using document.execCommand');
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const success = document.execCommand('copy');
      console.log('document.execCommand result:', success);
      document.body.removeChild(textArea);
      return success;
    }
  } catch (err) {
    console.error("Failed to copy:", err);
    return false;
  }
}

export function downloadFile(content: string, filename: string, type: string = "image/svg+xml"): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 下载 Blob 文件
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 从 SVG 内容中解析原始宽高比
function getSvgAspectRatio(svgContent: string): { width: number; height: number } | null {
  try {
    // 优先解析 viewBox
    const viewBoxMatch = svgContent.match(/viewBox=["'](\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)["']/i);
    if (viewBoxMatch) {
      const [, , , w, h] = viewBoxMatch.map(Number);
      if (w > 0 && h > 0) return { width: w, height: h };
    }
    // 其次解析 width/height 属性
    const widthMatch = svgContent.match(/\bwidth=["'](\d+(?:\.\d+)?)["']/i);
    const heightMatch = svgContent.match(/\bheight=["'](\d+(?:\.\d+)?)["']/i);
    if (widthMatch && heightMatch) {
      const w = parseFloat(widthMatch[1]);
      const h = parseFloat(heightMatch[1]);
      if (w > 0 && h > 0) return { width: w, height: h };
    }
  } catch {
    // 忽略解析错误
  }
  return null;
}

// SVG 内容转 PNG Blob（保持原始宽高比，不变形）
export function svgToPngBlob(svgContent: string, size: number = 1024): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      const svgBlob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        // 优先用图片自然尺寸，其次解析 SVG 内容，最后兜底正方形
        let naturalWidth = img.naturalWidth || 0;
        let naturalHeight = img.naturalHeight || 0;

        if (!naturalWidth || !naturalHeight) {
          const ratio = getSvgAspectRatio(svgContent);
          if (ratio) {
            naturalWidth = ratio.width;
            naturalHeight = ratio.height;
          }
        }

        let canvasWidth = size;
        let canvasHeight = size;

        if (naturalWidth > 0 && naturalHeight > 0) {
          const ratio = naturalWidth / naturalHeight;
          if (ratio >= 1) {
            // 宽图：宽度为 size，高度按比例
            canvasWidth = size;
            canvasHeight = Math.round(size / ratio);
          } else {
            // 高图：高度为 size，宽度按比例
            canvasHeight = size;
            canvasWidth = Math.round(size * ratio);
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          URL.revokeObjectURL(url);
          reject(new Error("Canvas 2D context 不可用"));
          return;
        }
        ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
        URL.revokeObjectURL(url);
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Canvas toBlob 失败"));
          }
        }, "image/png");
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("SVG 图片加载失败"));
      };
      img.src = url;
    } catch (err) {
      reject(err);
    }
  });
}
