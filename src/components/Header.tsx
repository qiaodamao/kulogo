"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sun, Moon, Github, Download, Upload, House, FileText, Heart, Package, Link } from "lucide-react";
import TallyEmbed from "tally-embed";

export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();

  // 导航项配置
  const navItems = [
    { label: "首页", href: "/", icon: House },
    { label: "关于", href: "/about", icon: FileText },
    { label: "支持", href: "/sponsor", icon: Heart },
    { label: "素材站", href: "https://sucai.kusheji.com/", external: true, icon: Package },
    { label: "网址导航", href: "https://dh.kusheji.com/", external: true, icon: Link },
  ];

  const isActive = (href: string) => !href.startsWith("http") && pathname === href;

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
    <div className="w-full">
      <nav className="fixed top-0 left-0 right-0 z-50 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4 flex justify-center items-center">
          {/* 胶囊导航容器 - 居中，包含全部内容 */}
          <div className="flex items-center gap-1 justify-between md:justify-center w-full md:w-auto bg-white/85 dark:bg-gray-800/85 backdrop-blur-sm rounded-full p-2.5 px-4 md:px-2.5 shadow-[0_2px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_20px_rgba(0,0,0,0.2)] max-w-full">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity pl-2 pr-1 mr-auto md:mr-0">
              <div className="w-9 h-9 rounded-full overflow-hidden">
                <img
                  src="/images/logo.svg"
                  alt="SVG Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-bold text-lg hidden sm:inline">酷设计</span>
            </a>

            {/* 分隔线 */}
            <div className="hidden md:block w-px h-6 bg-gray-200 dark:bg-gray-600 mx-3"></div>

            {/* 导航链接（桌面端） */}
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className={
                    "hidden md:inline-block px-4 py-[0.4rem] rounded-full text-sm font-medium transition-all duration-300 " +
                    (active
                      ? "bg-[#06b30c] text-white shadow-sm"
                      : "text-foreground hover:bg-black/5 dark:hover:bg-white/10")
                  }
                >
                  {item.label}
                </a>
              );
            })}

            {/* 分隔线 */}
            <div className="hidden md:block w-px h-6 bg-gray-200 dark:bg-gray-600 mx-3"></div>

            {/* 提交图标按钮（桌面端） */}
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
              className="hidden md:flex items-center justify-center w-11 h-11 rounded-full text-foreground hover:bg-black/5 dark:hover:bg-white/10 hover:text-[#16a34a] transition-all duration-300"
              aria-label="提交图标"
            >
              <Upload className="w-5 h-5" />
            </button>

            {/* GitHub（桌面端） */}
            <a
              href="https://github.com/qiaodamao/kulogo"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center justify-center w-11 h-11 rounded-full text-foreground hover:bg-black/5 dark:hover:bg-white/10 hover:text-[#16a34a] transition-all duration-300"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>

            {/* 主题切换 */}
            <button
              onClick={toggleDarkMode}
              className="flex items-center justify-center w-11 h-11 rounded-full text-foreground hover:bg-black/5 dark:hover:bg-white/10 hover:text-[#16a34a] transition-all duration-300"
              aria-label="切换主题"
            >
              {isClient ? (isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />) : <Moon className="w-5 h-5" />}
            </button>

            {/* 移动端菜单按钮 */}
            <button
              className="md:hidden flex items-center justify-center w-11 h-11 rounded-full text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="菜单"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* 移动端菜单 - 胶囊导航 */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-4 right-4 bg-white/85 dark:bg-gray-800/85 backdrop-blur-sm rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_20px_rgba(0,0,0,0.2)] z-40">
            <div className="px-4 py-3">
              {/* 列表样式导航项 */}
              {navItems.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className={
                      "flex items-center gap-2 py-3 transition-colors w-full text-left " +
                      (active
                        ? "text-[#06b30c]"
                        : "text-foreground hover:text-[#16a34a]")
                    }
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </a>
                );
              })}
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
                className="flex items-center gap-2 py-3 text-foreground hover:text-[#16a34a] transition-colors w-full text-left"
              >
                <Upload className="w-4 h-4" />
                提交图标
              </button>
              <a href="https://github.com/xmbsm/kulogo" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 py-3 text-foreground hover:text-[#16a34a] transition-colors">
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
