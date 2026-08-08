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
