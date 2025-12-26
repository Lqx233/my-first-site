// StoryTellerService - 用于生成随机历练故事
export class StoryTellerService {
  // DeepSeek AI API配置（实际使用时需要替换为真实API密钥）
  private readonly API_KEY = 'your-deepseek-api-key';
  private readonly API_URL = 'https://api.deepseek.com/v1/chat/completions';

  // 生成随机宗门故事
  async generateStory(): Promise<string> {
    try {
      // 这里是模拟实现，实际项目中需要调用真实的DeepSeek AI API
      // const response = await fetch(this.API_URL, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${this.API_KEY}`
      //   },
      //   body: JSON.stringify({
      //     model: 'deepseek-chat',
      //     messages: [
      //       {
      //         role: 'system',
      //         content: '你是一位修仙小说作家，擅长创作简短有趣的宗门故事。'
      //       },
      //       {
      //         role: 'user',
      //         content: '请生成一个简短的修仙宗门日常故事，不超过200字。'
      //       }
      //     ],
      //     max_tokens: 200
      //   })
      // });
      // const data = await response.json();
      // return data.choices[0].message.content;

      // 模拟故事生成
      const stories = [
        '近日，宗门附近出现了一只修炼成精的白兔，经常偷吃弟子们的灵草。众弟子合力围捕，却被它用幻术逃脱。掌教真人得知后，只是微微一笑，说这是对弟子们的历练。',
        '昨夜，宗门后山的灵泉突然变得异常活跃，涌出大量灵气。弟子们纷纷前往修炼，修为都有所提升。据长老推测，这可能是附近有高阶灵物出世的征兆。',
        '今天，一位云游修士来到宗门拜访，带来了一些稀有灵草作为礼物。他与掌教真人相谈甚欢，临走前留下一句预言："三月之内，必有大机缘降临。"',
        '宗门的传功堂近日新增了几本古籍，记载了一些失传的法术。弟子们争相借阅，掀起了一股修炼热潮。掌教真人看到这一幕，心中甚是欣慰。',
        '昨夜，天空中出现了罕见的双星交汇现象，灵气浓度骤增。掌教真人趁机闭关修炼，据说有望突破当前境界。弟子们都在期待掌教真人出关后的教诲。'
      ];

      return stories[Math.floor(Math.random() * stories.length)];
    } catch (error) {
      console.error('生成故事失败:', error);
      return '近日宗门一切正常，弟子们都在勤勉修炼。';
    }
  }

  // 生成弟子历练故事
  async generateExploreStory(discipleName: string): Promise<string> {
    try {
      // 这里是模拟实现，实际项目中需要调用真实的DeepSeek AI API
      // const response = await fetch(this.API_URL, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${this.API_KEY}`
      //   },
      //   body: JSON.stringify({
      //     model: 'deepseek-chat',
      //     messages: [
      //       {
      //         role: 'system',
      //         content: '你是一位修仙小说作家，擅长创作简短有趣的弟子历练故事。'
      //       },
      //       {
      //         role: 'user',
      //         content: `请生成一个关于${discipleName}的修仙历练故事，不超过200字。`
      //       }
      //     ],
      //     max_tokens: 200
      //   })
      // });
      // const data = await response.json();
      // return data.choices[0].message.content;

      // 模拟历练故事生成
      const stories = [
        `${discipleName}在历练途中遇到了一位受伤的老者，出手相救。没想到老者竟是一位隐世高手，传授了他一套上乘的剑法。${discipleName}感激不尽，承诺日后定会回报。`,
        `${discipleName}深入深山历练，意外发现了一个古老的洞府。在洞府中，他找到了一些珍贵的灵草和一本修炼心得。虽然遇到了一些危险，但最终满载而归。`,
        `${discipleName}在历练时遇到了一只强大的妖兽，经过一番激战，最终将其击败。在妖兽的巢穴中，他发现了一颗妖丹，这对他的修炼大有裨益。`,
        `${discipleName}在历练途中迷路了，误闯入一片迷雾森林。在森林中，他遇到了一位神秘女子，女子指引他走出了森林，并送给他一枚神秘的玉佩。`,
        `${discipleName}在历练时遇到了其他宗门的弟子，双方因为争夺一株灵草发生了冲突。最终，${discipleName}凭借自己的实力和智慧，成功获得了灵草。`
      ];

      return stories[Math.floor(Math.random() * stories.length)];
    } catch (error) {
      console.error('生成历练故事失败:', error);
      return `${discipleName}外出历练，平安归来，略有收获。`;
    }
  }
}
