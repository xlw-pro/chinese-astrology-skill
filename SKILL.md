---
name: chinese-astrology
description: >
  Chinese astrology and fortune telling skill with 4 tools: BaZi (Four Pillars of Destiny) chart calculation,
  bone weight fortune telling (秤骨算命), Chinese almanac (黄历), and reverse BaZi lookup.
  Trigger when: user asks about BaZi, Chinese astrology, Four Pillars, bone weight fortune, 八字, 算命, 命理,
  称骨/秤骨, 黄历, birth chart analysis, destiny analysis, fortune telling, or Chinese metaphysics.
  Also trigger when: user provides a birth date/time and wants personality analysis, career guidance,
  compatibility reading, or life fortune prediction based on Chinese traditions.
---

# Chinese Astrology Skill

Provide accurate Chinese astrology calculations via 4 MCP tools. All calculations are deterministic
(no AI interpretation) — use the returned data to provide insightful readings.

## Setup

Ensure the MCP server is configured. Add to Claude Desktop or Claude Code config:

```json
{
  "mcpServers": {
    "chinese-astrology": {
      "command": "npx",
      "args": ["-y", "chinese-astrology-skill"]
    }
  }
}
```

## Tools

### `getBaziChart` — BaZi Chart (八字排盘)

Calculate a complete Four Pillars chart from birth datetime.

```
Input: { solarDatetime: "2000-01-15T12:00:00+08:00", gender: 1 }
```

Returns: 四柱 (year/month/day/hour pillars), 天干地支, 五行, 十神, 藏干 (hidden stems),
纳音, 空亡, 神煞, 大运 (decade fortune x 10 periods), 刑冲合会 (branch relations).

**Datetime must include timezone.** China is +08:00. Convert user's local time to China time if needed.

**Gender:** 0 = female, 1 = male. Affects 大运 direction only.

### `calculateBoneWeight` — Bone Weight Fortune (秤骨算命)

Yuan Tiangang's Tang Dynasty method. Assigns weight to birth year/month/day/hour, sums to total.

```
Input: { solarDatetime: "1990-06-15T14:00:00+08:00" }
```

Returns: totalWeight (两), percentile, breakdown per pillar, classical poem, modern interpretation.

Weight range: 2.1-7.2 两, 52 destiny types. Heavier generally = more fortunate, but read the poem.

### `getAlmanac` — Chinese Almanac (黄历)

Get almanac for any date: lunar date, auspicious/inauspicious activities, directional gods.

```
Input: { solarDatetime: "2026-04-06T00:00:00+08:00" }  // optional, defaults to today
```

### `findBirthDates` — Reverse BaZi Lookup (八字反查)

Find possible birth dates matching a BaZi string (1700-present).

```
Input: { bazi: "戊寅 己未 己卯 辛未" }
```

## Reading Guidelines

When interpreting BaZi results for users:

1. **日主 (Day Master)** is the person's core identity — always start here
2. **五行 balance** reveals strengths/weaknesses — check which elements are strong/weak/missing
3. **十神 relationships** show personality and life patterns
4. **大运 (Decade Fortune)** shows life phases — note current decade and transitions
5. For bone weight: present the poem first, then explain in modern context
6. Always note: "BaZi provides personality patterns and timing guidance, not fixed predictions"

## Links

- [BaZi Calculator](https://ba-zi.ai/calculator) — AI-powered deep reading
- [Bone Weight Calculator](https://ba-zi.ai/bone-weight) — Free online tool
- [Compatibility Reading](https://ba-zi.ai/compatibility) — Relationship analysis
- [What is BaZi?](https://ba-zi.ai/blog/what-is-bazi) — Introduction guide
