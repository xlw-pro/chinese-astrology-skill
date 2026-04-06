import { getSolarTime } from './date.js';

/** 年柱干支 → 骨重（两） */
const YEAR_WEIGHTS: Record<string, number> = {
  甲子: 1.2, 乙丑: 0.9, 丙寅: 0.6, 丁卯: 0.7, 戊辰: 1.2, 己巳: 0.5,
  庚午: 0.9, 辛未: 0.8, 壬申: 0.7, 癸酉: 0.8, 甲戌: 1.5, 乙亥: 0.9,
  丙子: 1.6, 丁丑: 0.8, 戊寅: 0.8, 己卯: 1.9, 庚辰: 1.2, 辛巳: 0.6,
  壬午: 0.8, 癸未: 0.7, 甲申: 0.5, 乙酉: 1.5, 丙戌: 0.6, 丁亥: 1.6,
  戊子: 1.5, 己丑: 0.7, 庚寅: 0.9, 辛卯: 1.2, 壬辰: 1.0, 癸巳: 0.7,
  甲午: 1.5, 乙未: 0.6, 丙申: 0.5, 丁酉: 1.4, 戊戌: 1.4, 己亥: 0.9,
  庚子: 0.7, 辛丑: 0.7, 壬寅: 0.9, 癸卯: 1.2, 甲辰: 0.8, 乙巳: 0.7,
  丙午: 1.3, 丁未: 0.5, 戊申: 1.4, 己酉: 0.5, 庚戌: 0.9, 辛亥: 1.7,
  壬子: 0.5, 癸丑: 0.7, 甲寅: 1.2, 乙卯: 0.8, 丙辰: 0.8, 丁巳: 0.6,
  戊午: 1.9, 己未: 0.6, 庚申: 0.8, 辛酉: 1.6, 壬戌: 1.0, 癸亥: 0.6,
};

/** 农历月份(1-12) → 骨重（两） */
const MONTH_WEIGHTS = [0.6, 0.7, 1.8, 0.9, 0.5, 1.6, 0.9, 1.5, 1.8, 0.8, 0.9, 0.5];

/** 农历日(1-30) → 骨重（两） */
const DAY_WEIGHTS = [
  0.5, 1.0, 0.8, 1.5, 1.6, 1.5, 0.8, 1.6, 0.8, 1.6, 0.9, 1.7, 0.8, 1.7, 1.0,
  0.8, 0.9, 1.8, 0.5, 1.5, 1.0, 0.9, 0.8, 0.9, 1.5, 1.8, 0.7, 0.8, 1.6, 0.6,
];

/** 时辰地支 → 骨重（两） */
const HOUR_WEIGHTS: Record<string, number> = {
  子: 1.6, 丑: 0.6, 寅: 0.7, 卯: 1.0, 辰: 0.9, 巳: 1.6,
  午: 1.0, 未: 0.8, 申: 0.8, 酉: 0.9, 戌: 0.6, 亥: 0.6,
};

/** 52 bone weight poems (2.1 - 7.2 liang) */
const POEMS: Record<number, { poem: string; interpretation: string }> = {
  2.1: { poem: '短命非业谓大空，平生灾难事重重，凶祸频临陷逆境，终世困苦事不成。', interpretation: 'Life presents many challenges. Focus on building genuine relationships and finding inner peace through adversity.' },
  2.2: { poem: '身寒骨冷苦伶仃，此命推来行乞人，劳劳碌碌无度日，终年打拱过平生。', interpretation: 'A path of perseverance. Material comforts may be modest, but resilience builds character.' },
  2.3: { poem: '此命推来骨格轻，求谋作事事难成，妻儿兄弟应难许，别处他乡作散人。', interpretation: 'Independence defines this destiny. Success comes through self-reliance and adaptability.' },
  2.4: { poem: '此命推来福禄无，门庭困苦总难荣，六亲骨肉皆无靠，流浪他乡作老翁。', interpretation: 'A journey of self-discovery. True fulfillment comes from within, not external validation.' },
  2.5: { poem: '此命推来祖业微，门庭营度似稀奇，六亲骨肉如冰炭，一世勤劳自把持。', interpretation: 'Hard work is your greatest asset. Though family support may be limited, your determination leads to self-made success.' },
  2.6: { poem: '平生衣禄苦中求，独自营谋事不休，离祖出门宜早计，晚来衣禄自无忧。', interpretation: 'Early independence brings rewards. The second half of life enjoys the fruits of earlier efforts.' },
  2.7: { poem: '一生作事少商量，难靠祖宗作主张，独马单枪空做去，早年晚岁总无长。', interpretation: 'A self-directed life. Learning to collaborate and seek counsel improves outcomes significantly.' },
  2.8: { poem: '一生行事似飘蓬，祖宗产业在梦中，若不过房改名姓，也当移徒二三通。', interpretation: 'Change and mobility define this path. Embracing new environments brings unexpected opportunities.' },
  2.9: { poem: '初年运限未曾亨，纵有功名在后成，须过四旬方可立，移居改姓始为良。', interpretation: 'A late bloomer. Major achievements come after 40, with patience and persistence as key virtues.' },
  3.0: { poem: '劳劳碌碌苦中求，东奔西走何日休，若使终身勤与俭，老来稍可免忧愁。', interpretation: 'Diligence and frugality are rewarded over time. Consistent effort leads to comfortable later years.' },
  3.1: { poem: '忙忙碌碌苦中求，何日云开见日头，难得祖基家可立，中年衣食渐无忧。', interpretation: 'Middle age brings stability. Early struggles give way to moderate prosperity through sustained effort.' },
  3.2: { poem: '初年运蹇事难谋，渐有财源如水流，到得中年衣食旺，那时名利一齐收。', interpretation: 'Fortune improves steadily. Financial flow increases through middle age, bringing both reputation and material comfort.' },
  3.3: { poem: '早年做事事难成，百计徒劳枉费心，半世自如流水去，后来运到得黄金。', interpretation: 'The second half of life is golden. Early setbacks are lessons that prepare you for later success.' },
  3.4: { poem: '此命福气果如何，僧道门中衣禄多，离祖出家方为妙，朝晚拜佛念弥陀。', interpretation: 'Spiritual pursuits bring fulfillment. A life enriched by philosophy, meditation, or service to others.' },
  3.5: { poem: '生平福量不周全，祖业根基觉少传，营事生涯宜守旧，时来衣食胜从前。', interpretation: 'Steady and conservative approaches work best. Timing is important — wait for the right moment to act.' },
  3.6: { poem: '不须劳碌过平生，独自成家福不轻，早有福星常照命，任君行去百般成。', interpretation: 'Natural good fortune accompanies this weight. Self-reliance leads to meaningful achievements.' },
  3.7: { poem: '此命般般事不成，弟兄少力自孤成，虽然祖业须微有，来得明时去不明。', interpretation: 'Mixed fortunes require wisdom in decision-making. Clarity of purpose helps navigate uncertain times.' },
  3.8: { poem: '一身骨肉最清高，早入簧门姓氏标，待到年将三十六，蓝衣脱去换红袍。', interpretation: 'Distinguished destiny with a turning point around age 36. Career advancement and recognition follow.' },
  3.9: { poem: '此命终身运不通，劳劳做事尽皆空，苦心竭力成家计，到得那时在梦中。', interpretation: 'Effort may not always yield visible results, but inner growth and wisdom are the true rewards.' },
  4.0: { poem: '平生衣禄是绵长，件件心中自主张，前面风霜多受过，后来必定享安康。', interpretation: 'Abundant and lasting fortune. After weathering early storms, lasting peace and prosperity follow.' },
  4.1: { poem: '此命推来自不同，为人能干异凡庸，中年还有逍遥福，不比前时运未通。', interpretation: 'Exceptional ability sets you apart. Middle age brings the freedom and success that early years lacked.' },
  4.2: { poem: '得宽怀处且宽怀，何用双眉总不开，若使中年命运济，那时名利一齐来。', interpretation: 'Optimism is rewarded. When fortune turns in middle age, both fame and wealth arrive together.' },
  4.3: { poem: '为人心性最聪明，做事轩昂近贵人，衣禄一生天数定，不须劳碌过平生。', interpretation: 'Intelligence and charm attract powerful connections. Fortune flows naturally without excessive effort.' },
  4.4: { poem: '万事由天莫苦求，须知福碌赖人修，当年财帛难如意，晚景欣然便不忧。', interpretation: 'Trust the natural flow of life. Late-life contentment exceeds early expectations.' },
  4.5: { poem: '名利推来竟若何，前番辛苦后奔波，命中难养男和女，骨肉扶持也不多。', interpretation: 'Career success requires mobility and flexibility. Family matters need extra attention and care.' },
  4.6: { poem: '东西南北尽皆通，出姓移居更觉隆，衣禄无亏天数定，中年晚景一般同。', interpretation: 'Versatility brings success in any direction. Consistent fortune throughout middle and later years.' },
  4.7: { poem: '此命推来旺末年，妻荣子贵自怡然，平生原有滔滔福，可卜财源若水泉。', interpretation: 'Growing prosperity that peaks in later years. Family thrives and wealth flows like a spring.' },
  4.8: { poem: '初年运道未曾亨，若是蹉跎再不兴，兄弟六亲皆无靠，一身事业晚来整。', interpretation: 'Late success through independence. Patient self-development in early years pays off magnificently later.' },
  4.9: { poem: '此命推来福不轻，自成自立显门庭，从来富贵人亲近，使婢差奴过一生。', interpretation: 'Substantial natural fortune. Self-made prosperity that elevates the entire family.' },
  5.0: { poem: '为利为名终日劳，中年福禄也多遭，老来是有财星照，不比前番目下高。', interpretation: 'Tireless pursuit brings rewards. Later years enjoy financial security surpassing earlier prosperity.' },
  5.1: { poem: '一世荣华事事通，不须劳碌自亨通，弟兄叔侄皆如意，家业成时福禄宏。', interpretation: 'A blessed life of smooth accomplishments. Family harmony and career success come naturally.' },
  5.2: { poem: '一世亨通事事能，不须劳思自然宁，宗族欣然心皆好，家业丰亨自称心。', interpretation: 'Effortless achievement across all areas. Family pride and material abundance define this destiny.' },
  5.3: { poem: '此格推来气象真，兴家发达在其中，一生福禄安排定，却是人间一富翁。', interpretation: 'True wealth destiny. Building and growing a family legacy comes naturally.' },
  5.4: { poem: '此命推来厚且清，诗书满腹看功成，丰衣足食自然稳，正是人间有福人。', interpretation: 'Scholarly elegance meets material comfort. Knowledge and culture bring both respect and prosperity.' },
  5.5: { poem: '走马扬鞭争利名，少年做事废功成，一朝福禄源源至，富贵荣华显六亲。', interpretation: 'Early ambition eventually pays off. When fortune arrives, it transforms the entire family.' },
  5.6: { poem: '此格推来礼义通，一生福禄用无穷，甜酸苦辣皆尝过，财源滚滚稳且丰。', interpretation: 'Wisdom through diverse experiences. Unlimited prosperity flows from strong moral foundation.' },
  5.7: { poem: '福禄盈盈万事全，一生荣耀显双亲，名扬威震人钦敬，处世逢凶化为吉。', interpretation: 'Complete fortune in all dimensions. Respected leader who turns challenges into opportunities.' },
  5.8: { poem: '平生福禄自然来，名利兼全福寿偕，雁塔题名为贵客，紫袍金带走金阶。', interpretation: 'Natural-born leader destined for high achievement. Both fame and fortune arrive effortlessly.' },
  5.9: { poem: '细推此格妙且清，必定才高礼义通，甲第之中应有分，扬鞭走马显威荣。', interpretation: 'Exceptional talent with strong ethics. Destined for elite circles and distinguished achievement.' },
  6.0: { poem: '一朝金榜快题名，显祖荣宗立大功，衣食定然原裕足，田园财帛更丰盈。', interpretation: 'Pinnacle achievement that honors the family lineage. Abundant wealth and lasting legacy.' },
  6.1: { poem: '不做朝中金榜客，定为世上大财翁，聪明天赋经书熟，名显高科自是荣。', interpretation: 'Either a distinguished scholar or a great entrepreneur. Natural intelligence ensures elite status.' },
  6.2: { poem: '此命生来福不穷，读书必定显亲宗，紫衣金带为卿相，富贵荣华皆可同。', interpretation: 'Limitless fortune through education and wisdom. Destined for the highest ranks of society.' },
  6.3: { poem: '命主为官福禄长，得来富贵定非常，名题金塔传金榜，定中高科天下扬。', interpretation: 'Extraordinary destiny for leadership and lasting fame. Name remembered across generations.' },
  6.4: { poem: '此格权威不可当，紫袍金带坐高堂，荣华富贵谁能及，积玉堆金满储仓。', interpretation: 'Supreme authority and unmatched prosperity. A destiny of power, wealth, and lasting influence.' },
  6.5: { poem: '细推此命福非轻，富贵荣华孰与争，定国安邦人极品，威声显赫震寰瀛。', interpretation: 'A nation-shaping destiny. Among the rarest and most influential fates, commanding global respect.' },
  6.6: { poem: '此格人间一福人，堆金积玉满堂春，从来富贵由天定，正笏垂绅谒圣君。', interpretation: 'The pinnacle of earthly blessing. Wealth beyond measure with honor and dignity.' },
  6.7: { poem: '此命生来福自宏，田园家业最高隆，平生衣禄盈丰足，一世荣华万事通。', interpretation: 'Grand and expansive fortune. Everything flourishes — land, business, family, and reputation.' },
  6.8: { poem: '富贵由天莫苦求，万金家计不须谋，十年不比前番事，一但遂心百事谋。', interpretation: 'Effortless wealth and success. When the moment arrives, every endeavor succeeds.' },
  6.9: { poem: '君是人间衣禄星，一生富贵众人钦，纵然福禄由天定，安享荣华过一生。', interpretation: 'A star of fortune among people. Lifelong prosperity admired by all.' },
  7.0: { poem: '此命推来福禄宏，不须劳碌自亨通，田园产业家昌盛，大富大贵不受穷。', interpretation: 'The greatest fortune. Effortless prosperity, thriving family, and complete abundance.' },
  7.1: { poem: '此命生成大不同，公侯卿相在其中，一生自有逍遥福，富贵荣华极品隆。', interpretation: 'Extraordinarily rare destiny of the highest nobility. Complete freedom and supreme prosperity.' },
  7.2: { poem: '此格世界罕有生，十代积善产此人，天上紫微来照命，统治万民乐太平。', interpretation: 'The rarest destiny — once in ten generations. Born to lead and bring peace to the world.' },
};

/**
 * Calculate bone weight (秤骨算命) from a solar datetime.
 * The Yuan Tiangang method assigns weight values to birth year, month, day, and hour.
 */
export function calculateBoneWeight(solarDatetime: string) {
  const solarTime = getSolarTime(solarDatetime);
  const lunarHour = solarTime.getLunarHour();
  const lunarDay = lunarHour.getLunarDay();
  const lunarMonth = lunarDay.getLunarMonth();
  const lunarYear = lunarMonth.getLunarYear();

  const yearGanzhi = lunarYear.getSixtyCycle().getName();
  const yearWeight = YEAR_WEIGHTS[yearGanzhi];
  if (yearWeight === undefined) throw new Error(`Unknown year ganzhi: ${yearGanzhi}`);

  const lunarMonthNumber = Math.abs(lunarMonth.getMonthWithLeap());
  const monthWeight = MONTH_WEIGHTS[lunarMonthNumber - 1];
  if (monthWeight === undefined) throw new Error(`Unknown lunar month: ${lunarMonthNumber}`);

  const lunarDayNumber = lunarDay.getDay();
  const dayWeight = DAY_WEIGHTS[lunarDayNumber - 1];
  if (dayWeight === undefined) throw new Error(`Unknown lunar day: ${lunarDayNumber}`);

  const eightChar = lunarHour.getEightChar();
  const hourEarthBranch = eightChar.getHour().getEarthBranch().getName();
  const hourWeight = HOUR_WEIGHTS[hourEarthBranch];
  if (hourWeight === undefined) throw new Error(`Unknown hour earth branch: ${hourEarthBranch}`);

  const totalWeight = Math.round((yearWeight + monthWeight + dayWeight + hourWeight) * 10) / 10;

  // Find matching or closest poem
  let entry = POEMS[totalWeight];
  if (!entry) {
    const keys = Object.keys(POEMS).map(Number).sort((a, b) => a - b);
    const closest = keys.reduce((prev, curr) =>
      Math.abs(curr - totalWeight) < Math.abs(prev - totalWeight) ? curr : prev
    );
    entry = POEMS[closest];
  }

  const percentile = Math.max(0, Math.min(100, Math.round(((totalWeight - 2.0) / (7.2 - 2.0)) * 100)));

  return {
    totalWeight,
    unit: '两 (liǎng)',
    percentile,
    breakdown: {
      year: { ganzhi: yearGanzhi, weight: yearWeight },
      month: { lunarMonth: lunarMonthNumber, weight: monthWeight },
      day: { lunarDay: lunarDayNumber, weight: dayWeight },
      hour: { earthBranch: hourEarthBranch, weight: hourWeight },
    },
    poem: entry.poem,
    interpretation: entry.interpretation,
  };
}
