"use client";

import { useState, useEffect } from 'react';

export default function Footer() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // 客户端水合后，读取主题模式
  useEffect(() => {
    setIsClient(true);
    
    const updateTheme = () => {
      // 优先从 localStorage 读取
      const savedMode = localStorage.getItem('darkMode');
      if (savedMode !== null) {
        setIsDarkMode(savedMode === 'true');
      } else {
        // 其次检查 document 类名
        setIsDarkMode(document.documentElement.classList.contains('dark'));
      }
    };

    updateTheme();

    // 监听 localStorage 变化
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'darkMode') {
        updateTheme();
      }
    };

    // 监听 document 类名变化
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    window.addEventListener('storage', handleStorage);
    return () => {
      observer.disconnect();
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 py-12 mt-16">
      <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: '1400px' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* 左侧信息 */}
          <div>
            <a href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity mb-4">
              <div className="w-8 h-8">
                <img 
                  src="/images/logo.svg" 
                  alt="酷设计" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-bold text-xl">酷设计</span>
            </a>
            <p className="text-muted-foreground text-sm mb-4">
              专注收录国内外矢量 LOGO，为设计师和开发者提供高质量的品牌标识资源。
            </p>
            <p className="text-muted-foreground text-xs">
              © 2024-2026 . 由 🎨 乔同学 整理
            </p>
          </div>
          
          {/* 右侧导航 */}
          <div className="md:text-right">
            <div className="md:inline-block md:text-left">
              <h3 className="font-semibold text-lg mb-4">导航</h3>
              <div className="flex flex-wrap gap-4 text-sm">
                <a href="/" className="text-muted-foreground hover:text-[#22c55e] transition-colors">首页</a>
                <a href="/about" className="text-muted-foreground hover:text-[#22c55e] transition-colors">关于</a>
                <a href="/sponsor" className="text-muted-foreground hover:text-[#22c55e] transition-colors">赞助支持</a>
                <a href="https://github.com/xmbsm/kulogo" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#22c55e] transition-colors">提交</a>
              </div>
            </div>
          </div>
        </div>
        
        {/* 底部链接 */}
        <div className="border-t border-border pt-8 text-center">
          <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
            <a href="https://dsxdh.com/" target="_blank" rel="noopener noreferrer" className="hover:text-[#22c55e] transition-colors">大师兄导航</a>
            <a href="https://ps.shijuefuhao.com/" target="_blank" rel="noopener noreferrer" className="hover:text-[#22c55e] transition-colors">配色网</a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-[#22c55e] transition-colors">菜单一</a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-[#22c55e] transition-colors">菜单一</a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-[#22c55e] transition-colors">菜单一</a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-[#22c55e] transition-colors">菜单一</a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-[#22c55e] transition-colors">菜单一</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
