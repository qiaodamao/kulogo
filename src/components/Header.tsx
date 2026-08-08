"use client";

import { useState, useEffect } from "react";
import { Sun, Moon, Github, Download, Upload, House, FileText, Heart, Package, Link } from "lucide-react";
import TallyEmbed from "tally-embed";

export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // 当 isDarkMode 变化时，更新所有相关状态
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('darkMode', isDarkMode.toString());
      document.cookie = `darkMode=${isDarkMode}; path=/; max-age=31536000; SameSite=Lax`;
      
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isDarkMode, isClient]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <div className="bg-white dark:bg-gray-900 text-foreground border-b border-gray-200 dark:border-gray-800 w-full">
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-[3.5rem] sm:h-[3.5rem] md:h-[4.5rem] lg:h-[4.5rem] xl:h-[4.5rem] 2xl:h-[4.5rem]">
            <div className="flex items-center gap-8">
              <a href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                <div className="w-8 h-8">
                  <img 
                    src="/images/logo.svg" 
                    alt="SVG Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="font-bold text-xl">酷设计</span>
              </a>
              
              {/* 桌面端菜单 */}
              <div className="hidden md:flex items-center gap-6">
                <a href="/" className="text-foreground hover:text-[#16a34a] transition-colors">首页</a>
                <a href="/about" className="text-foreground hover:text-[#16a34a] transition-colors">关于我们</a>
                <a href="/sponsor" className="text-foreground hover:text-[#16a34a] transition-colors">赞助支持</a>
                <a href="https://sucai.kusheji.com/" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-[#16a34a] transition-colors">素材站</a>
                <a href="https://dh.kusheji.com/" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-[#16a34a] transition-colors">网址导航</a>
              </div>
            </div>
            
            <div className="ml-auto flex items-center gap-4">
              <button
                onClick={async () => {
                  try {
                    await TallyEmbed.openPopup("wza6xZ", {
                      layout: "default",
                      width: 375,
                      alignLeft: false,
                      onSubmit: (payload) => {
                        console.log("Form submitted:", payload);
                      },
                    });
                  } catch (error) {
                    console.error("Error opening Tally form:", error);
                  }
                }}
                className="md:flex hidden items-center gap-2 px-4 py-2 bg-[rgb(22_163_74)] text-white rounded-full text-sm font-medium hover:bg-[rgb(22_163_74)]/90 hover:shadow-[0_4px_12px_rgba(22,163,74,0.3)] transition-all duration-300" style={{ lineHeight: '1.1rem' }}
              >
                <Upload className="w-4 h-4" />
                提交图标
              </button>
              <a 
                href="https://github.com/xmbsm/kulogo" 
                target="_blank" 
                rel="noopener noreferrer"
                className="md:block hidden p-2 rounded-lg hover:bg-accent transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-accent transition-colors"
              >
                {isClient ? (isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />) : <Moon className="w-5 h-5" />}
              </button>
              {/* 移动端菜单按钮 */}
              <button 
                className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* 移动端菜单 */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 border-t border-border bg-white dark:bg-gray-900 shadow-lg z-40 w-full">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-4 space-y-3">
              <a href="/" className="flex items-center gap-2 py-2 text-foreground hover:text-[#16a34a] transition-colors">
                <House className="w-4 h-4" />
                首页
              </a>
              <a href="/about" className="flex items-center gap-2 py-2 text-foreground hover:text-[#16a34a] transition-colors">
                <FileText className="w-4 h-4" />
                关于我们
              </a>
              <a href="/sponsor" className="flex items-center gap-2 py-2 text-foreground hover:text-[#16a34a] transition-colors">
                <Heart className="w-4 h-4" />
                赞助支持
              </a>
              <a href="https://sucai.kusheji.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 py-2 text-foreground hover:text-[#16a34a] transition-colors">
                <Package className="w-4 h-4" />
                素材站
              </a>
              <a href="https://dh.kusheji.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 py-2 text-foreground hover:text-[#16a34a] transition-colors">
                <Link className="w-4 h-4" />
                网址导航
              </a>
              <button
                onClick={async () => {
                  try {
                    await TallyEmbed.openPopup("wza6xZ", {
                      layout: "default",
                      width: 375,
                      alignLeft: false,
                      onSubmit: (payload) => {
                        console.log("Form submitted:", payload);
                      },
                    });
                  } catch (error) {
                    console.error("Error opening Tally form:", error);
                  }
                }}
                className="flex items-center gap-2 py-2 text-foreground hover:text-[#16a34a] transition-colors w-full text-left"
              >
                <Upload className="w-4 h-4" />
                提交图标
              </button>
              <a href="https://github.com/xmbsm/kulogo" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 py-2 text-foreground hover:text-[#16a34a] transition-colors">
                <Github className="w-4 h-4" />
                GitHub
              </a>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
