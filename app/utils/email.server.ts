// app/utils/email.server.ts
import nodemailer from 'nodemailer';

// 配置邮件发送器
// 注意：在生产环境中，应该使用真实的SMTP服务，比如SendGrid、Mailgun等
let transporter: nodemailer.Transporter;

if (process.env.NODE_ENV === 'production') {
  // 生产环境配置
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
} else {
  // 开发环境 - 使用ethereal.email提供的测试账户
  // 你可以在 https://ethereal.email 创建测试账户
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: 'your-ethereal-email@ethereal.email', // 替换为你的ethereal账户
      pass: 'your-ethereal-password',             // 替换为你的ethereal密码
    },
  });
}

/**
 * 发送密码重置邮件
 */
export async function sendPasswordResetEmail(to: string, resetToken: string, appUrl: string) {
  const resetUrl = `${appUrl}/reset-password/${resetToken}`;
  
  try {
    const info = await transporter.sendMail({
      from: '"AI需求分析师" <noreply@example.com>',
      to,
      subject: '重置您的密码',
      text: `
        您好，
        
        我们收到了重置您密码的请求。如果这不是您发起的，请忽略此邮件。
        
        请点击以下链接重置您的密码：
        ${resetUrl}
        
        此链接将在24小时后失效。
        
        AI需求分析师团队
      `,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">重置您的密码</h2>
          <p>您好，</p>
          <p>我们收到了重置您密码的请求。如果这不是您发起的，请忽略此邮件。</p>
          <p>请点击以下按钮重置您的密码：</p>
          <p style="text-align: center; margin: 20px 0;">
            <a href="${resetUrl}" style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              重置密码
            </a>
          </p>
          <p>或者，您可以复制以下链接到浏览器地址栏：</p>
          <p style="word-break: break-all; background-color: #f3f4f6; padding: 10px; border-radius: 5px;">
            ${resetUrl}
          </p>
          <p>此链接将在24小时后失效。</p>
          <p>AI需求分析师团队</p>
        </div>
      `,
    });
    
    console.log('密码重置邮件发送成功:', info.messageId);
    
    // 在开发环境中，返回Ethereal邮件的预览URL
    if (process.env.NODE_ENV !== 'production') {
      console.log('邮件预览URL:', nodemailer.getTestMessageUrl(info));
      return {
        success: true,
        previewUrl: nodemailer.getTestMessageUrl(info),
      };
    }
    
    return { success: true };
  } catch (error) {
    console.error('发送密码重置邮件失败:', error);
    return { success: false, error };
  }
}