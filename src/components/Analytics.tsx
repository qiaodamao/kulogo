"use client";

import { useEffect } from 'react';
import { config } from '../config';

export default function Analytics() {
  useEffect(() => {
    // 检查是否在浏览器环境中
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    // 加载百度统计
    if (config.analytics.baidu.enabled && config.analytics.baidu.siteId) {
      // 动态创建百度统计脚本
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.innerHTML = `
        var _hmt = _hmt || [];
        (function() {
          var hm = document.createElement("script");
          hm.src = "https://hm.baidu.com/hm.js?${config.analytics.baidu.siteId}";
          var s = document.getElementsByTagName("script")[0]; 
          s.parentNode.insertBefore(hm, s);
        })();
      `;
      document.head.appendChild(script);

      // 清理函数
      return () => {
        document.head.removeChild(script);
      };
    }

    // 加载谷歌分析（预留）
    if (config.analytics.google.enabled && config.analytics.google.trackingId) {
      // 动态创建谷歌分析脚本
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://www.googletagmanager.com/gtag/js?id=${config.analytics.google.trackingId}`;
      script.async = true;
      document.head.appendChild(script);

      // 初始化谷歌分析
      const initScript = document.createElement('script');
      initScript.type = 'text/javascript';
      initScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${config.analytics.google.trackingId}');
      `;
      document.head.appendChild(initScript);

      // 清理函数
      return () => {
        document.head.removeChild(script);
        document.head.removeChild(initScript);
      };
    }
  }, []);

  return null;
}
