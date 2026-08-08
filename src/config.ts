// 项目配置文件
export const config = {
  // 统计功能配置
  analytics: {
    // 百度统计
    baidu: {
      enabled: true, // 是否开启百度统计
      siteId: '8808da6231820f5b8f686703365b6927' // 百度统计站点ID
    },
    // 谷歌分析（预留）
    google: {
      enabled: false,
      trackingId: ''
    }
  },
  // 广告功能配置
  ads: {
    google: {
      enabled: false,
      clientId: '', // 谷歌广告客户端ID
      slotId: '', // 广告单元ID
      format: 'auto', // 广告格式
      responsive: true // 是否响应式
    }
  },
  // TDK 配置
  tdk: {
    // 首页 TDK
    home: {
      title: '酷设计 - 国内外矢量logo下载',
      description: '专注收录国内外矢量 LOGO，免费在线下载矢量 LOGO 素材，为设计师和开发者提供高质量的品牌标识资源。',
      keywords: 'SVG, logo, 矢量标志, 品牌标识, 设计素材, 免费下载, 国内外logo'
    },
    // 关于我们页面 TDK
    about: {
      title: '关于我们 - 酷设计',
      description: '酷设计 SVG Logo 素材库是一个专注收录国内外矢量 LOGO 的开源项目，为设计师和开发者提供高质量的品牌标识资源。',
      keywords: '酷设计, 关于我们, SVG Logo, 开源项目, 品牌标识'
    },
    // 赞助支持页面 TDK
    sponsor: {
      title: '赞助支持 - 酷设计',
      description: '酷设计 SVG Logo 素材库是一个开源项目，需要您的支持来持续发展和改进。',
      keywords: '酷设计, 赞助支持, SVG Logo, 开源项目, 贡献'
    }
  },
  // 其他配置
  app: {
    name: '酷设计',
    version: '1.0.0'
  }
};
