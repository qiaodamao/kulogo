import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const filePath = path.join(process.cwd(), 'svg-logo-library.zip');
    
    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
    
    // 读取文件内容
    const fileContent = fs.readFileSync(filePath);
    
    // 设置响应头
    const headers = new Headers();
    headers.set('Content-Type', 'application/zip');
    headers.set('Content-Disposition', 'attachment; filename=svg-logo-library.zip');
    headers.set('Cache-Control', 'no-cache');
    
    // 返回文件内容
    return new NextResponse(fileContent, { headers });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Download failed' }, { status: 500 });
  }
}