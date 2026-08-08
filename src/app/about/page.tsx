import React from 'react';
import type { Metadata } from "next";
import { config } from "../../config";
import Header from '../../components/Header';
import Analytics from '../../components/Analytics';
import Footer from '../../components/Footer';

export const metadata: Metadata = {
  title: config.tdk.about.title,
  description: config.tdk.about.description,
  keywords: config.tdk.about.keywords,
};

const AboutPage = () => {
  return (
    <div>
      <Header />
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-16" style={{ maxWidth: '1400px' }}>
        <h1 className="text-3xl font-bold mb-8">关于我们</h1>
        <div className="space-y-6">
          <p className="text-lg">
            酷设计 SVG Logo 素材库是一个专注收录国内外矢量 LOGO 的开源项目，为设计师和开发者提供高质量的品牌标识资源。
          </p>
          
          <h2 className="text-2xl font-semibold mt-10 mb-4">项目愿景</h2>
          <p>
            我们的目标是创建一个全面、高质量的国内外矢量 LOGO 素材库，让设计师和开发者能够轻松找到并使用各种品牌标识资源。
          </p>
          
          <h2 className="text-2xl font-semibold mt-10 mb-4">项目特点</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>收录大量国内外品牌的矢量 LOGO</li>
            <li>支持 SVG 和 PNG 格式下载</li>
            <li>提供分类和搜索功能</li>
            <li>完全免费，开源项目</li>
            <li>定期更新新的 LOGO 资源</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-10 mb-4">如何使用</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>在首页浏览或搜索您需要的 LOGO</li>
            <li>点击 LOGO 查看详情</li>
            <li>选择复制 SVG 或下载 PNG 格式</li>
          </ol>
          
          <h2 className="text-2xl font-semibold mt-10 mb-4">贡献者</h2>
          <p>
            这个项目由热爱开源的开发者共同维护，欢迎更多人加入我们的行列。
          </p>
        </div>
      </div>
      <Analytics />
      <Footer />
    </div>
  );
};

export default AboutPage;