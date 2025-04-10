// app/routes/_index.tsx
import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useEffect } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "AI 需求分析师 - 智能需求分析和数据库设计工具" },
    { name: "description", content: "使用 AI 技术快速分析需求,生成用户故事、实体关系和数据库设计" },
  ];
};

export default function Index() {
  //添加滚动动画效果
  useEffect(() => {
    const animateOnScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach(element => {
        const position = element.getBoundingClientRect();
        //当元素进入视图时添加动画类
        if (position.top < window.innerHeight - 100) {
          element.classList.add('fade-in-up');
          element.classList.remove('opacity-0');
        }
      });
    };

    window.addEventListener('scroll', animateOnScroll);
    //初始运行一次以处理已在视图中的元素
    animateOnScroll();

    return () => window.removeEventListener('scroll', animateOnScroll);
  }, []);

  return (
    <div className="relative">
      {/* 自定义全局样式 */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fade-in-up {
          animation: fadeInUp 0.6s ease forwards;
        }
        .animate-on-scroll {
          transition: opacity 0.6s, transform 0.6s;
        }
      `}</style>

      {/* 英雄区域 - 增强版 */}
      <div className="relative overflow-hidden bg-gradient-to-r from-white to-primary-50">
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="mx-auto max-w-7xl">
          <div className="relative z-10 bg-transparent pb-8 sm:pb-16 md:pb-20 lg:w-full lg:max-w-2xl lg:pb-28 xl:pb-32">
            <main className="mx-auto mt-10 max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">使用 AI 技术</span>{" "}
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-600 xl:inline">
                    智能分析需求
                  </span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl lg:mx-0">
                  上传您的需求文档或直接输入需求描述,AI 需求分析师将自动帮您生成用户故事、需求实体和数据库设计,大幅提升开发效率。
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow-lg transform transition duration-300 hover:scale-105">
                    <Link
                      to="/register"
                      className="flex w-full items-center justify-center rounded-md border border-transparent bg-gradient-to-r from-primary-600 to-primary-500 px-8 py-3 text-base font-medium text-white hover:from-primary-700 hover:to-primary-600 md:py-4 md:px-10 md:text-lg shadow-md"
                    >
                      立即注册
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3 transform transition duration-300 hover:scale-105">
                    <Link
                      to="/login"
                      className="flex w-full items-center justify-center rounded-md border border-primary-300 bg-white px-8 py-3 text-base font-medium text-primary-700 hover:bg-primary-50 md:py-4 md: px-10 md:text-lg shadow-md"
                    >
                      登录
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full relative sm:h-72 md:h-96 lg:h-full lg:w-full overflow-hidden">
            <div className="absolute inset-0 bg-primary-100 mix-blend-multiply"></div>
            <img
              className="h-full w-full object-cover transition-transform duration-5000 hover:scale-105"
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80"
              alt="开发团队合作"
            />
          </div>
        </div>
      </div>

      {/* 特性区域 - 优化版 */}
      <div className="py-16 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center animate-on-scroll opacity-0">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">功能特点</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              更智能的需求分析方式
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              利用先进的 AI 技术,我们可以快速理解您的需求,并自动生成开发所需的各种文档。
            </p>
          </div>

          <div className="mt-16">
            <dl className="space-y-12 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-16">
              <div className="relative animate-on-scroll opacity-0">
                <dt>
                  <div className="absolute flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-r from-primary-500 to-primary-400 text-white shadow-lg transform transition-all duration-300 hover:scale-110">
                    <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"  />
                    </svg>
                  </div>
                  <p className="ml-20 text-xl leading-6 font-bold text-gray-900">智能生成用户故事</p>
                </dt>
                <dd className="mt-3 ml-20 text-base text-gray-500 leading-relaxed">
                  基于您的需求文档,自动识别和生成符合敏捷开发标准的用户故事,帮助团队更好地理解和实现功能。
                </dd>
              </div>

              <div className="relative animate-on-scroll opacity-0">
                <dt>
                  <div className="absolute flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-r from-primary-500 to-primary-400 text-white shadow-lg transform transition-all duration-300 hover:scale-110">
                    <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <p className="ml-20 text-xl leading-6 font-bold text-gray-900">需求实体分析</p>
                </dt>
                <dd className="mt-3 ml-20 text-base text-gray-500 leading-relaxed">
                  自动识别需求中的核心业务实体,分析其属性和关系,建立清晰的业务领域模型。
                </dd>
              </div>

              <div className="relative animate-on-scroll opacity-0">
                <dt>
                  <div className="absolute flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-r from-primary-500 to-primary-400 text-white shadow-lg transform transition-all duration-300 hover:scale-110">
                    <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2. 21-3.582 4-8 4s-8-1.79-8-4" />
                    </svg>
                  </div>
                  <p className="ml-20 text-xl leading-6 font-bold text-gray-900">数据库设计</p>
                </dt>
                <dd className="mt-3 ml-20 text-base text-gray-500 leading-relaxed">
                  根据需求和实体分析,自动生成优化的数据库设计,包括表结构、字段定义、关系和索引等。
                </dd>
              </div>

              <div className="relative animate-on-scroll opacity-0">
                <dt>
                  <div className="absolute flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-r from-primary-500 to-primary-400 text-white shadow-lg transform transition-all duration-300 hover:scale-110">
                    <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                  </div>
                  <p className="ml-20 text-xl leading-6 font-bold text-gray-900">集成开发工具</p>
                </dt>
                <dd className="mt-3 ml-20 text-base text-gray-500 leading-relaxed">
                  支持与 PowerDesigner 等专业工具集成,方便导出和进一步编辑设计方案。
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* CTA 区域 - 现代化版本 */}
      <div className="bg-gradient-to-r from-primary-50 to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/dot-pattern.svg')] bg-center opacity-10"></div>
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8 lg:flex lg:items-center lg:justify-between relative z-10">
          <div className="animate-on-scroll opacity-0">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              <span className="block">准备好开始了吗？ </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-600">立即注册免费体验。 </span>
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-3xl">
              加入我们的平台,体验 AI 智能分析为您的项目开发带来的效率提升。 我们提供 14 天免费试用,无需信用卡。
            </p>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row lg:mt-0 lg:flex-shrink-0 animate-on-scroll opacity-0">
            <div className="inline-flex rounded-md shadow-lg transform transition duration-300 hover:scale-105">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 shadow-md"
              >
                立即开始
              </Link>
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-3 inline-flex rounded-md shadow transform transition duration-300 hover:scale-105">
              <a
                href="#features"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 shadow-md"
              >
                了解更多
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 简单的页脚 */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-6">
            <button type="button" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">关于我们</span>
              关于我们
            </button>
            <button type="button" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">联系我们</span>
              联系我们
            </button>
            <button type="button" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">帮助中心</span>
              帮助中心
            </button>
            <button type="button" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">隐私政策</span>
              隐私政策
            </button>
          </div>
          <p className="mt-8 text-center text-base text-gray-400">
            © 2025 All right reserved
          </p>
        </div>
      </footer>
    </div>
  );
}