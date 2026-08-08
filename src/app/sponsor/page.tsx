import React from 'react';
import type { Metadata } from "next";
import { config } from "../../config";
import Header from '../../components/Header';
import Analytics from '../../components/Analytics';
import Footer from '../../components/Footer';

export const metadata: Metadata = {
  title: config.tdk.sponsor.title,
  description: config.tdk.sponsor.description,
  keywords: config.tdk.sponsor.keywords,
};

const SponsorPage = () => {
  return (
    <div>
      <Header />
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-16" style={{ maxWidth: '1400px' }}>
        <h1 className="text-3xl font-bold mb-8">赞助支持</h1>
        <div className="space-y-6">
          <p className="text-lg">
            酷设计 SVG Logo 素材库是一个开源项目，需要您的支持来持续发展和改进。
          </p>
          
          <h2 className="text-2xl font-semibold mt-10 mb-4">为什么需要赞助</h2>
          <p>
            维护一个高质量的 LOGO 素材库需要大量的时间和精力：
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>收集和整理 LOGO 资源</li>
            <li>确保 LOGO 的质量和准确性</li>
            <li>开发和维护网站功能</li>
            <li>服务器和域名费用</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-10 mb-4">如何赞助</h2>
          <p>
            您可以通过以下方式支持我们的项目：
          </p>
          
          <div className="bg-card border border-border rounded-xl p-6 my-8">
            <h3 className="text-xl font-semibold mb-4">赞助方式</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>GitHub Stars 和 Forks</li>
              <li>贡献代码或 LOGO 资源</li>
              <li>通过支付宝或微信支付方式捐赠</li>
              <li>在社交媒体上分享我们的项目</li>
            </ul>
          </div>
          
          <h2 className="text-2xl font-semibold mt-10 mb-4">赞助者权益</h2>
          <p>
            对于赞助我们的个人和企业，我们将：
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>在赞助页面展示您的名字或 logo</li>
            <li>优先处理您的功能请求和反馈</li>
            <li>提供技术支持和合作机会</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-10 mb-4">联系我们</h2>
          <p>
            如果您有任何关于赞助的问题，欢迎联系我们：
          </p>
          <p className="mt-4">
            <strong>Email:</strong> 1@kusheji.com
          </p>
        </div>
      </div>
      <Analytics />
      <Footer />
    </div>
  );
};

export default SponsorPage;