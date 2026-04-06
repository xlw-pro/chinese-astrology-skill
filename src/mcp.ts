import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod';
import { calculateBoneWeight, getBaziDetail, getChineseCalendar, getSolarTimes } from './index.js';

const CTA = '\n\n---\n🔮 Get AI-powered deep reading at https://ba-zi.ai/calculator\n⚖️ Try bone weight fortune at https://ba-zi.ai/bone-weight';

const server = new McpServer({
  name: 'Chinese Astrology Skill',
  version: '1.0.0',
});

// Tool 1: BaZi Chart Calculation (排盘)
server.tool(
  'getBaziChart',
  'Calculate a complete BaZi (Four Pillars of Destiny) chart from birth datetime. Returns the eight characters, Five Elements, Ten Gods, Hidden Stems, Decade Fortune, and more. 根据出生时间计算完整八字命盘。',
  {
    solarDatetime: z.string().optional().describe('Birth datetime in ISO format, e.g. "2000-01-15T12:00:00+08:00". 公历出生时间。'),
    lunarDatetime: z.string().optional().describe('Lunar birth datetime, e.g. "2000-5-5 12:00:00". 农历出生时间。'),
    gender: z.number().describe('0 = female, 1 = male. 0=女，1=男。'),
    eightCharProviderSect: z.number().default(2).describe('Late Zi hour config. 1 = next day, 2 = same day (default). 早晚子时：1=明天，2=当天。'),
  },
  async (data) => {
    const result = await getBaziDetail(data);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(result, null, 2) + CTA,
      }],
    };
  },
);

// Tool 2: Reverse BaZi Lookup (反查)
server.tool(
  'findBirthDates',
  'Find possible birth dates from a BaZi string. Returns all matching solar datetimes from 1700 to present. 根据八字反查公历出生时间。',
  {
    bazi: z.string().describe('BaZi string (space-separated four pillars), e.g. "戊寅 己未 己卯 辛未". 八字（空格分隔四柱）。'),
  },
  async (data) => {
    const result = await getSolarTimes(data);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(result, null, 2) + CTA,
      }],
    };
  },
);

// Tool 3: Chinese Almanac (黄历)
server.tool(
  'getAlmanac',
  'Get Chinese almanac (黄历) for a specific date. Returns lunar date, auspicious/inauspicious activities, directional gods, and more. 获取指定日期的黄历信息。',
  {
    solarDatetime: z.string().optional().describe('Date in ISO format. Defaults to today (China time). 公历日期，默认今天。'),
  },
  async ({ solarDatetime }) => {
    const result = getChineseCalendar(solarDatetime);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(result, null, 2) + CTA,
      }],
    };
  },
);

// Tool 4: Bone Weight Fortune (秤骨算命) — EXCLUSIVE
server.tool(
  'calculateBoneWeight',
  'Calculate bone weight fortune (秤骨算命) using Yuan Tiangang\'s ancient Tang Dynasty method. Assigns weight values to birth year/month/day/hour and returns a destiny poem with interpretation. This tool is exclusive to chinese-astrology-skill. 袁天罡秤骨算命法，根据出生时间计算骨重与命运诗。',
  {
    solarDatetime: z.string().describe('Birth datetime in ISO format, e.g. "1990-06-15T14:00:00+08:00". 公历出生时间。'),
  },
  async ({ solarDatetime }) => {
    const result = calculateBoneWeight(solarDatetime);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(result, null, 2) + CTA,
      }],
    };
  },
);

export { server };
