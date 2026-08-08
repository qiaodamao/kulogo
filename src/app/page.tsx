"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Search, Sun, Moon, Copy, Download, ArrowUpRight, Github, ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import JSZip from "jszip";
import { svgs, lastUpdated } from "../data/svgs";
import { categories } from "../data/categories";
import type { iSVG } from "../types/svg";
import { cn, getSvgContent, copyToClipboard, downloadFile } from "../lib/utils";
import Header from "../components/Header";
import Analytics from "../components/Analytics";
import GoogleAds from "../components/GoogleAds";
import Footer from "../components/Footer";
import { config } from "../config";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const [selectedLogos, setSelectedLogos] = useState<Set<number>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState<iSVG | null>(null);
  const [copyMenuOpen, setCopyMenuOpen] = useState(false);
  const [copyMenuPosition, setCopyMenuPosition] = useState({ x: 0, y: 0 });
  const [currentSvg, setCurrentSvg] = useState<iSVG | null>(null);
  const [copyingSvg, setCopyingSvg] = useState<iSVG | null>(null);
  const [displayedCount, setDisplayedCount] = useState(35); // 默认显示35个logo
  const [sortOption, setSortOption] = useState<string>("recent"); // 排序选项：default, recent, alphabetical
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false); // 移动端分类菜单状态
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // 移动端导航菜单状态
  const [showBackToTop, setShowBackToTop] = useState(false); // 返回顶部按钮显示状态
  
  // 引用logo展示区域
  const logoDisplayRef = React.useRef<HTMLDivElement>(null);
  
  // 当分类变化时，滚动到logo展示区域
  useEffect(() => {
    // 只有当selectedCategory不是初始值时才滚动
    if (logoDisplayRef.current && selectedCategory !== "") {
      logoDisplayRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedCategory]);

  const filteredSvgs = useMemo(() => {
    let result = svgs.filter((svg) => {
      const matchesSearch =
        svg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        svg.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory
        ? svg.category === selectedCategory
        : true;
      return matchesSearch && matchesCategory;
    });

    // 排序
  switch (sortOption) {
    case "recent":
      // 按id降序排序（假设id越大越新）
      result.sort((a, b) => b.id - a.id);
      break;
    case "alphabetical":
      // 按标题A-Z排序
      result.sort((a, b) => a.title.localeCompare(b.title));
      break;
    default:
      // 默认按最近更新排序
      result.sort((a, b) => b.id - a.id);
      break;
  }

    return result;
  }, [searchQuery, selectedCategory, sortOption]);



  // 当搜索或分类变化时，重置显示数量和排序选项
  useEffect(() => {
    setDisplayedCount(35);
    setSortOption("recent");
  }, [searchQuery, selectedCategory]);

  // 监听滚动事件，控制返回顶部按钮的显示
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLogoSelection = (id: number) => {
    const newSelected = new Set(selectedLogos);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedLogos(newSelected);
  };

  const getRoutePath = (route: string | { dark: string; light: string }) => {
    if (typeof route === "string") {
      console.log('Route is string:', route);
      return route;
    }
    // 使用全局主题状态
    const isDark = document.documentElement.classList.contains('dark');
    const path = isDark ? route.dark : route.light;
    console.log('Route is object, selected path:', path);
    return path;
  };

  const handleCopy = (svg: iSVG, e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setCopyMenuPosition({ x: rect.left, y: rect.bottom + 10 });
    setCurrentSvg(svg);
    setCopyingSvg(svg);
    setCopyMenuOpen(true);
  };

  const copySvg = () => {
    if (!copyingSvg) {
      console.error('copyingSvg is null');
      toast.error("复制失败");
      setCopyMenuOpen(false);
      return;
    }
    
    console.log('Copying SVG:', copyingSvg.title);
    
    // 获取实际的SVG内容
    const svgUrl = getRoutePath(copyingSvg.route);
    fetch(svgUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(content => {
        console.log('SVG content length:', content.length);
        
        // 使用最简单的方法复制
        const textArea = document.createElement('textarea');
        textArea.value = content;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        let success = false;
        try {
          success = document.execCommand('copy');
        } catch (err) {
          console.error('复制失败:', err);
          success = false;
        }
        
        document.body.removeChild(textArea);
        
        console.log('SVG copy success:', success);
        
        if (success) {
          toast.success(`已复制到剪贴板\n分类: ${copyingSvg.category}\nLogo: ${copyingSvg.title}`);
        } else {
          toast.error("复制失败");
        }
      })
      .catch(error => {
        console.error('获取SVG内容失败:', error);
        toast.error("复制失败");
      })
      .finally(() => {
        setCopyMenuOpen(false);
        setCopyingSvg(null);
      });
  };

  const copyPng = () => {
    if (!copyingSvg) {
      console.error('copyingSvg is null');
      toast.error("复制失败");
      setCopyMenuOpen(false);
      return;
    }
    
    console.log('Copying PNG:', copyingSvg.title);
    
    // 简化PNG复制：先复制SVG，然后提示用户可以转换
    const svgUrl = getRoutePath(copyingSvg.route);
    fetch(svgUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(content => {
        console.log('SVG content length:', content.length);
        
        // 使用最简单的方法复制
        const textArea = document.createElement('textarea');
        textArea.value = content;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        let success = false;
        try {
          success = document.execCommand('copy');
        } catch (err) {
          console.error('复制失败:', err);
          success = false;
        }
        
        document.body.removeChild(textArea);
        
        console.log('PNG copy success:', success);
        
        if (success) {
          toast.success(`已复制SVG内容（PNG复制需要通过设计软件转换）\n分类: ${copyingSvg.category}\nLogo: ${copyingSvg.title}`);
        } else {
          toast.error("复制失败");
        }
      })
      .catch(error => {
        console.error('获取SVG内容失败:', error);
        toast.error("复制失败");
      })
      .finally(() => {
        setCopyMenuOpen(false);
        setCopyingSvg(null);
      });
  };

  const handleDownload = async (svg: iSVG) => {
    try {
      const content = await getSvgContent(getRoutePath(svg.route));
      downloadFile(content, `${svg.title}.svg`);
      toast.success("下载成功！");
    } catch (error) {
      toast.error("下载失败");
    }
  };

  const handleBatchDownload = async () => {
    if (selectedLogos.size === 0) {
      toast.warning("请先选择要下载的 Logo");
      return;
    }

    const zip = new JSZip();
    const selectedSvgs = svgs.filter((svg) => selectedLogos.has(svg.id));
    let successCount = 0;

    for (const svg of selectedSvgs) {
      try {
        console.log('Processing SVG for batch download:', svg.title);
        const routePath = getRoutePath(svg.route);
        console.log('Route path:', routePath);
        
        // 直接使用fetch获取SVG内容
        const response = await fetch(routePath);
        console.log('Response status for', svg.title, ':', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const content = await response.text();
        console.log('SVG content length for', svg.title, ':', content.length);
        
        if (content.length > 0) {
          zip.file(`${svg.title}.svg`, content);
          successCount++;
        } else {
          console.error(`Empty SVG content for ${svg.title}`);
        }
      } catch (error) {
        console.error(`Failed to add ${svg.title} to zip`, error);
      }
    }

    if (successCount === 0) {
      toast.error("无法获取任何Logo内容，下载失败");
      return;
    }

    try {
      const content = await zip.generateAsync({ type: "blob" });
      console.log('Zip generated, size:', content.size);
      
      if (content.size === 0) {
        toast.error("压缩包为空，下载失败");
        return;
      }
      
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = "svg-logos.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`已下载 ${successCount} 个 Logo！`);
      setSelectedLogos(new Set());
    } catch (error) {
      console.error('Failed to generate zip file:', error);
      toast.error("压缩包生成失败");
    }
  };

  const openModal = (svg: iSVG) => {
    setSelectedLogo(svg);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLogo(null);
  };

  // 返回顶部函数
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen transition-colors duration-300">
      <div className="min-h-screen bg-background text-foreground">
        <Header />

        {/* Hero区域 - 全屏显示 */}
        <div className="relative min-h-[80vh] flex items-center justify-center mb-4 lg:mb-6 w-full mt-0">
          {/* 背景装饰 */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-60"></div>
            <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-green-100 dark:bg-green-900/20 rounded-full blur-3xl opacity-60"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-full blur-3xl"></div>
          </div>
          
          {/* 内容区域 */}
          <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 pt-20 pb-12">
            <div className="flex flex-col items-center gap-12 lg:gap-16">
              {/* 上方内容 */}
              <div className="w-full max-w-3xl text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-full mb-6 mx-auto">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-600 dark:text-green-400 font-medium text-sm">{svgs.length}+ 矢量标志</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text">
                  国内外矢量标志收录
                </h1>
                
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  专注收录国内外矢量 LOGO，免费在线下载矢量 LOGO 素材，为设计师和开发者提供高质量的品牌标识资源。
                </p>
                
                <div className="flex items-center justify-center">
                    <div className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-[rgba(0,0,0,0.01)] border border-gray-100 dark:border-gray-700">
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="text-xs text-muted-foreground">上次更新时间</p>
                        <p className="text-sm text-gray-900 dark:text-white">{lastUpdated}</p>
                      </div>
                    </div>
                  </div>
              </div>
              
              {/* 下方Logo展示 - 滚动效果 */}
              <div className="w-full -mx-4 md:mx-0">
                <div className="relative overflow-hidden w-full">
                  {/* 装饰性元素 */}
                  <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-3xl rotate-12"></div>
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-3xl -rotate-12"></div>
                  
                  {/* 滚动Logo展示 */}
                  <div className="relative p-0 md:p-8 w-full overflow-x-hidden">
                    {/* 第一行：向左滚动 */}
                    <div className="relative overflow-hidden h-[6rem] sm:h-[7.5rem] mb-0.125 w-full">
                      <div className="animate-scroll-left">
                        <div className="flex gap-2 sm:gap-4 w-max">
                          {[...svgs
                            .sort((a, b) => b.id - a.id)
                            .slice(0, 15), ...svgs
                            .sort((a, b) => b.id - a.id)
                            .slice(0, 15), ...svgs
                            .sort((a, b) => b.id - a.id)
                            .slice(0, 15)].map((svg, index) => (
                              <div key={`${svg.id}-${index}`} className="w-20 sm:w-24 h-20 sm:h-24 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-xl flex items-center justify-center p-3 sm:p-4 flex-shrink-0 border border-gray-100 dark:border-gray-600 hover:shadow-lg hover:scale-105 transition-all duration-300">
                                <img
                                  src={getRoutePath(svg.route)}
                                  alt={svg.title}
                                  className="max-w-full max-h-full object-contain"
                                />
                              </div>
                            ))}
                        </div>
                      </div>
                      {/* 左右渐变遮罩 */}
                      <div className="absolute left-0 top-0 bottom-0 w-4 sm:w-16 bg-gradient-to-r from-background to-transparent pointer-events-none z-10"></div>
                      <div className="absolute right-0 top-0 bottom-0 w-4 sm:w-16 bg-gradient-to-l from-background to-transparent pointer-events-none z-10"></div>
                    </div>
                    
                    {/* 第二行：向右滚动 */}
                    <div className="relative overflow-hidden h-[6rem] sm:h-[7.5rem] mb-0.125 w-full">
                      <div className="animate-scroll-right">
                        <div className="flex gap-2 sm:gap-4 w-max">
                          {[...svgs
                            .sort((a, b) => b.id - a.id)
                            .slice(15, 30), ...svgs
                            .sort((a, b) => b.id - a.id)
                            .slice(15, 30), ...svgs
                            .sort((a, b) => b.id - a.id)
                            .slice(15, 30)].map((svg, index) => (
                              <div key={`${svg.id}-${index}`} className="w-20 sm:w-24 h-20 sm:h-24 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-xl flex items-center justify-center p-3 sm:p-4 flex-shrink-0 border border-gray-100 dark:border-gray-600 hover:shadow-lg hover:scale-105 transition-all duration-300">
                                <img
                                  src={getRoutePath(svg.route)}
                                  alt={svg.title}
                                  className="max-w-full max-h-full object-contain"
                                />
                              </div>
                            ))}
                        </div>
                      </div>
                      {/* 左右渐变遮罩 */}
                      <div className="absolute left-0 top-0 bottom-0 w-4 sm:w-16 bg-gradient-to-r from-background to-transparent pointer-events-none z-10"></div>
                      <div className="absolute right-0 top-0 bottom-0 w-4 sm:w-16 bg-gradient-to-l from-background to-transparent pointer-events-none z-10"></div>
                    </div>
                    
                    {/* 第三行：向左滚动 */}
                    <div className="relative overflow-hidden h-[6rem] sm:h-[7.5rem] w-full">
                      <div className="animate-scroll-left">
                        <div className="flex gap-2 sm:gap-4 w-max">
                          {[...svgs
                            .sort((a, b) => b.id - a.id)
                            .slice(30, 45), ...svgs
                            .sort((a, b) => b.id - a.id)
                            .slice(30, 45), ...svgs
                            .sort((a, b) => b.id - a.id)
                            .slice(30, 45)].map((svg, index) => (
                              <div key={`${svg.id}-${index}`} className="w-20 sm:w-24 h-20 sm:h-24 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-xl flex items-center justify-center p-3 sm:p-4 flex-shrink-0 border border-gray-100 dark:border-gray-600 hover:shadow-lg hover:scale-105 transition-all duration-300">
                                <img
                                  src={getRoutePath(svg.route)}
                                  alt={svg.title}
                                  className="max-w-full max-h-full object-contain"
                                />
                              </div>
                            ))}
                        </div>
                      </div>
                      {/* 左右渐变遮罩 */}
                      <div className="absolute left-0 top-0 bottom-0 w-4 sm:w-16 bg-gradient-to-r from-background to-transparent pointer-events-none z-10"></div>
                      <div className="absolute right-0 top-0 bottom-0 w-4 sm:w-16 bg-gradient-to-l from-background to-transparent pointer-events-none z-10"></div>
                    </div>
                    

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="mx-auto px-4 sm:px-6 lg:px-8 py-0" style={{ maxWidth: '1400px' }}>
          <div className="relative mb-10" ref={logoDisplayRef}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              placeholder="搜索 Logo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex flex-wrap justify-between items-center gap-2 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">排序：</span>
              <button
                onClick={() => setSortOption("recent")}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all",
                  sortOption === "recent"
                    ? "bg-primary text-primary-foreground"
                    : "bg-accent hover:bg-accent/80"
                )}
              >
                最近更新
              </button>
              <button
                onClick={() => setSortOption("alphabetical")}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all",
                  sortOption === "alphabetical"
                    ? "bg-primary text-primary-foreground"
                    : "bg-accent hover:bg-accent/80"
                )}
              >
                A-Z排序
              </button>
            </div>
            {selectedLogos.size > 0 && (
              <button
                onClick={handleBatchDownload}
                className="flex items-center gap-2 px-4 py-2 bg-[rgb(22_163_74)] text-white rounded-full text-sm font-medium hover:bg-[rgb(22_163_74)]/90 hover:shadow-[0_4px_12px_rgba(22,163,74,0.3)] transition-all duration-300"
              >
                <Download className="w-4 h-4" />
                批量下载 ({selectedLogos.size})
              </button>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
            {/* 左侧边栏分类筛选 */}
            <div className="lg:w-64 shrink-0">
              {/* 移动端下拉菜单 */}
              <div className="lg:hidden relative mb-2">
                <div 
                  className="bg-card border border-border rounded-xl px-4 py-3 cursor-pointer"
                  onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm">分类筛选</h3>
                    <span className={`transition-transform ${isCategoryMenuOpen ? 'rotate-180' : ''}`}>▼</span>
                  </div>
                </div>
                
                {/* 下拉菜单 */}
                {isCategoryMenuOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
                    <div className="p-4 space-y-2">
                      <button
                        onClick={() => {
                          setSelectedCategory("");
                          setIsCategoryMenuOpen(false);
                        }}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all",
                          selectedCategory === ""
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-accent"
                        )}
                      >
                        全部 ({svgs.length})
                      </button>
                      {categories.map((category) => (
                        <button
                          key={category.slug}
                          onClick={() => {
                            setSelectedCategory(category.slug);
                            setIsCategoryMenuOpen(false);
                          }}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all",
                            selectedCategory === category.slug
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-accent"
                          )}
                        >
                          {category.name} ({category.count})
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* 桌面端固定边栏 */}
              <div className="hidden lg:block sticky top-24 bg-card border border-border rounded-xl p-4">
                <h3 className="font-medium text-lg mb-4">分类筛选</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                        setSelectedCategory("");
                      }}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all",
                      selectedCategory === ""
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                    )}
                  >
                    全部 ({svgs.length})
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.slug}
                      onClick={() => {
                        setSelectedCategory(category.slug);
                      }}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all",
                        selectedCategory === category.slug
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent"
                      )}
                    >
                      {category.name} ({category.count})
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 主内容区域 */}
            <div className="flex-1">
              {filteredSvgs.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-muted-foreground text-lg">
                    没有找到匹配的 Logo
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    <AnimatePresence>
                      {filteredSvgs.slice(0, displayedCount).flatMap((svg, index) => {
                        // 每10个logo插入一个广告
                        const items = [
                          <motion.div
                            key={svg.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="group"
                          >
                            <div
                              className="relative bg-card border border-border rounded-xl p-4 hover:shadow-lg transition-all cursor-pointer"
                              onClick={() => openModal(svg)}
                            >
                              <div className={cn(
                                "absolute top-2 right-2 transition-opacity z-10",
                                selectedLogos.has(svg.id) ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                              )}>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleLogoSelection(svg.id);
                                  }}
                                  className={cn(
                                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                                    selectedLogos.has(svg.id)
                                      ? "bg-primary border-primary text-primary-foreground"
                                      : "border-border hover:border-primary"
                                  )}
                                >
                                  {selectedLogos.has(svg.id) && (
                                    <div className="w-2 h-2 bg-current rounded-full" />
                                  )}
                                </button>
                              </div>

                              <div className="aspect-square flex items-center justify-center mb-3">
                                <img
                                  src={getRoutePath(svg.route)}
                                  alt={svg.title}
                                  className="max-w-full max-h-full object-contain"
                                />
                              </div>
                              <div className="text-center">
                                <h3 className="font-medium text-sm truncate">{svg.title}</h3>
                                <p className="text-xs text-muted-foreground">{svg.category}</p>
                              </div>

                              <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-xl">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopy(svg, e);
                                  }}
                                  className="p-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                                >
                                  <Copy className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownload(svg);
                                  }}
                                  className="p-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                                >
                                  <Download className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ];

                        // 每10个logo插入一个广告（仅当广告配置开启时）
                        if ((index + 1) % 10 === 0 && config.ads.google.enabled && config.ads.google.clientId && config.ads.google.slotId) {
                          items.push(
                            <div key={`ad-${index}`} className="col-span-1">
                              <GoogleAds className="h-full" />
                            </div>
                          );
                        }

                        return items;
                      })}
                    </AnimatePresence>
                  </div>
                  
                  {displayedCount < filteredSvgs.length && (
                    <div className="text-center mt-12">
                      <button
                        onClick={() => setDisplayedCount(prev => Math.min(prev + 35, filteredSvgs.length))}
                        className="px-6 py-3 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 transition-colors dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 text-sm"
                      >
                        加载更多 ({filteredSvgs.length - displayedCount} 个)
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </main>

        <Footer />

        <AnimatePresence>
          {isModalOpen && selectedLogo && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeModal}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-card border border-border rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl"
              >
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 p-2 hover:bg-accent rounded-lg transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                <div className="text-center">
                  <div className="aspect-square max-w-xs mx-auto mb-6 flex items-center justify-center bg-accent/30 rounded-xl">
                    <img
                      src={getRoutePath(selectedLogo.route)}
                      alt={selectedLogo.title}
                      className="max-w-full max-h-full object-contain p-8"
                    />
                  </div>

                  <h2 className="text-2xl font-bold mb-2">{selectedLogo.title}</h2>
                  <p className="text-muted-foreground mb-4">{selectedLogo.category}</p>
                  
                  {selectedLogo.url && selectedLogo.url !== "TODO" && (
                    <a
                      href={selectedLogo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:underline mb-6"
                    >
                      访问官网
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  )}

                  <div className="flex gap-4 justify-center mt-8">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(selectedLogo, e);
                      }}
                      className="flex items-center gap-2 px-6 py-3 bg-accent rounded-xl hover:bg-accent/80 transition-colors"
                    >
                      <Copy className="w-5 h-5" />
                      复制
                    </button>
                    <button
                      onClick={() => handleDownload(selectedLogo)}
                      className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
                    >
                      <Download className="w-5 h-5" />
                      下载 SVG
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {copyMenuOpen && currentSvg && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setCopyMenuOpen(false)}
                className="fixed inset-0 z-40"
              />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                style={{
                  position: 'fixed',
                  left: copyMenuPosition.x,
                  top: copyMenuPosition.y,
                  zIndex: 50
                }}
                className="bg-card border border-border rounded-lg shadow-lg p-1 min-w-[150px]"
              >
                <button
                  onClick={copySvg}
                  className="w-full px-4 py-2 text-left rounded-md hover:bg-accent transition-colors flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  复制 SVG
                </button>
                <button
                  onClick={copyPng}
                  className="w-full px-4 py-2 text-left rounded-md hover:bg-accent transition-colors flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  复制 PNG
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* 返回顶部按钮 */}
        <AnimatePresence>
          {showBackToTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={scrollToTop}
              className="fixed bottom-8 right-8 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-all z-50"
              aria-label="返回顶部"
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* 统计分析组件 */}
        <Analytics />
      </div>
    </div>
  );
}
