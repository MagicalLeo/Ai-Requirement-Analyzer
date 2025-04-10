// app/utils/openai.server.ts 的修改版本
import OpenAI from "openai";

// 提供后备的 API 密钥（仅用于开发环境）
const apiKey = process.env.OPENAI_API_KEY || "demo-key-for-development";

if (!process.env.OPENAI_API_KEY) {
  console.warn(
    "⚠️ 警告: OPENAI_API_KEY 环境变量未设置。" +
    "API 调用将会失败。请确保在 .env 文件中设置有效的 OPENAI_API_KEY。"
  );
}

const openai = new OpenAI({
  apiKey: apiKey,
});

export async function generateUserStories(requirementText: string) {
  if (!process.env.OPENAI_API_KEY) {
    return "⚠️ API 密钥未配置。请在 .env 文件中设置有效的 OPENAI_API_KEY。";
  }
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: `你是一位专业的需求分析师和敏捷开发专家。你的任务是分析用户的需求文档，并生成高质量的用户故事。
          用户故事应该遵循以下格式：作为一个[角色]，我想要[功能]，以便[好处]。
          请确保生成的用户故事全面覆盖所提供需求文档中的所有功能点，并适当分类组织。`,
        },
        {
          role: "user",
          content: `基于以下需求文档，生成一组全面的用户故事：\n\n${requirementText}`,
        },
      ],
    });

    return response.choices[0]?.message?.content || "无法生成用户故事";
  } catch (error) {
    console.error("调用 OpenAI API 时出错:", error);
    const errorMessage = error instanceof Error ? error.message : "未知错误";
    return `调用 AI 服务时出错: ${errorMessage}`;
  }
}

export async function generateEntities(requirementText: string) {
  if (!process.env.OPENAI_API_KEY) {
    return "⚠️ API 密钥未配置。请在 .env 文件中设置有效的 OPENAI_API_KEY。";
  }
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: `你是一位专业的需求分析师和数据建模专家。你的任务是分析用户的需求文档，并识别出关键的业务实体。
          对于每个实体，请详细列出其属性、数据类型、约束条件、与其他实体的关系等。
          请以结构化的JSON格式返回，以便前端可以轻松解析和显示。`,
        },
        {
          role: "user",
          content: `基于以下需求文档，识别并详细描述所有关键业务实体：\n\n${requirementText}`,
        },
      ],
    });

    return response.choices[0]?.message?.content || "无法识别业务实体";
  } catch (error) {
    console.error("调用 OpenAI API 时出错:", error);
    const errorMessage = error instanceof Error ? error.message : "未知错误";
    return `调用 AI 服务时出错: ${errorMessage}`;
  }
}

export async function generateDatabaseDesign(requirementText: string) {
  if (!process.env.OPENAI_API_KEY) {
    return "⚠️ API 密钥未配置。请在 .env 文件中设置有效的 OPENAI_API_KEY。";
  }
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: `你是一位专业的数据库设计师和架构师。你的任务是分析用户的需求文档，并生成详细的数据库设计。
          请包括表结构、字段定义、主键/外键关系、索引建议等内容。
          生成的设计应当既符合规范化原则，又考虑到性能优化。
          请以结构化的格式返回，并提供可以导入到PowerDesigner或类似工具的SQL脚本。`,
        },
        {
          role: "user",
          content: `基于以下需求文档，设计一个优化的数据库结构：\n\n${requirementText}`,
        },
      ],
    });

    return response.choices[0]?.message?.content || "无法生成数据库设计";
  } catch (error) {
    console.error("调用 OpenAI API 时出错:", error);
    const errorMessage = error instanceof Error ? error.message : "未知错误";
    return `调用 AI 服务时出错: ${errorMessage}`;
  }
}   