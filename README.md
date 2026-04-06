# Chinese Astrology Skill 🔮

The most comprehensive Chinese astrology AI skill — **4 tools** covering BaZi (Four Pillars of Destiny), bone weight fortune telling, and Chinese almanac.

Built by [**Ba-Zi.ai**](https://ba-zi.ai) — Free AI-powered BaZi calculator and Chinese astrology platform.

## Features

| Tool | Description | Unique? |
|------|-------------|---------|
| `getBaziChart` | Full BaZi (四柱八字) chart calculation with Ten Gods, Hidden Stems, Decade Fortune | — |
| `findBirthDates` | Reverse-lookup: find birth dates from a BaZi string | — |
| `getAlmanac` | Chinese almanac (黄历) with auspicious activities and directional gods | — |
| `calculateBoneWeight` | **Yuan Tiangang bone weight fortune (秤骨算命)** with 52 destiny poems | ✅ Exclusive |

### What makes this different?

- **Bone Weight Fortune (秤骨算命)** — The only MCP/Skill that includes Yuan Tiangang's 1,300-year-old bone weight calculation with all 52 classical poems and modern interpretations
- **Bilingual descriptions** — All tool descriptions in both English and Chinese
- **Accurate calculations** — Powered by [tyme4ts](https://github.com/6tail/tyme4ts), the most precise Chinese calendar library

## Quick Start

### Claude Desktop / Claude Code

Add to your MCP config:

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

### Stdio Transport

```bash
npx chinese-astrology-skill
```

### HTTP Transport

```bash
git clone https://github.com/ba-zi-ai/chinese-astrology-skill.git
cd chinese-astrology-skill
npm install
npm start
# Server runs at http://localhost:3000/mcp
```

## Tools

### 1. `getBaziChart` — BaZi Chart Calculation (八字排盘)

Calculate a complete Four Pillars of Destiny chart from birth datetime.

**Input:**
```json
{
  "solarDatetime": "2000-01-15T12:00:00+08:00",
  "gender": 1
}
```

**Returns:** Complete BaZi chart including:
- Four Pillars (年柱/月柱/日柱/时柱) with Heavenly Stems & Earthly Branches
- Five Elements (五行) for each position
- Ten Gods (十神) relationships
- Hidden Stems (藏干) — main, middle, and residual qi
- Nayin (纳音), Void (空亡), Terrain (星运)
- Decade Fortune (大运) — 10 periods with start ages
- Gods & Spirits (神煞) for all four pillars
- Branch Relations (刑冲合会) — clashes, combinations, penalties

### 2. `findBirthDates` — Reverse BaZi Lookup (八字反查)

Find all possible birth dates (from 1700 to present) that match a given BaZi string.

**Input:**
```json
{
  "bazi": "戊寅 己未 己卯 辛未"
}
```

**Returns:** Array of matching solar datetimes.

### 3. `getAlmanac` — Chinese Almanac (黄历)

Get Chinese almanac information for any date.

**Input:**
```json
{
  "solarDatetime": "2026-04-06T00:00:00+08:00"
}
```

**Returns:** Lunar date, zodiac, Nayin, solar terms, 28 mansions, Peng Zu taboos, directional gods (Joy/Yang Noble/Yin Noble/Mascot/Wealth), auspicious & inauspicious activities, clash info.

### 4. `calculateBoneWeight` — Bone Weight Fortune (秤骨算命) ⭐

Calculate bone weight fortune using Yuan Tiangang's ancient Tang Dynasty method (c. 600 CE).

**Input:**
```json
{
  "solarDatetime": "1990-06-15T14:00:00+08:00"
}
```

**Returns:**
```json
{
  "totalWeight": 4.8,
  "unit": "两 (liǎng)",
  "percentile": 54,
  "breakdown": {
    "year": { "ganzhi": "庚午", "weight": 0.9 },
    "month": { "lunarMonth": 5, "weight": 0.5 },
    "day": { "lunarDay": 23, "weight": 0.8 },
    "hour": { "earthBranch": "未", "weight": 0.8 }
  },
  "poem": "初年运道未曾亨...",
  "interpretation": "Late success through independence..."
}
```

Weight ranges from 2.1 to 7.2 liǎng across 52 destiny types. [Learn more about bone weight fortune →](https://ba-zi.ai/bone-weight)

## Use Cases

- **AI Chatbots** — Give your AI assistant accurate BaZi reading capabilities
- **Fortune Telling Apps** — Build Chinese astrology features into your product
- **Calendar Apps** — Add Chinese almanac and auspicious date lookup
- **Research** — Explore traditional Chinese metaphysics computationally

## Tech Stack

- [tyme4ts](https://github.com/6tail/tyme4ts) — Chinese calendar calculation engine
- [cantian-tymext](https://www.npmjs.com/package/cantian-tymext) — Extended BaZi analysis
- [MCP SDK](https://modelcontextprotocol.io) — Model Context Protocol for AI integration

## Related

- [**Ba-Zi.ai**](https://ba-zi.ai) — Free AI BaZi calculator with deep analysis reports
- [**BaZi Calculator**](https://ba-zi.ai/calculator) — Generate your Four Pillars chart in 30 seconds
- [**Bone Weight Calculator**](https://ba-zi.ai/bone-weight) — Free online Yuan Tiangang bone weight fortune
- [**BaZi Compatibility**](https://ba-zi.ai/compatibility) — Check relationship compatibility with BaZi
- [**What is BaZi?**](https://ba-zi.ai/blog/what-is-bazi) — Complete guide to Four Pillars of Destiny

## Roadmap

- [x] v1.0 — BaZi chart, reverse lookup, almanac, bone weight
- [ ] v2.0 — Qi Men Dun Jia (奇门遁甲)
- [ ] v3.0 — Zi Wei Dou Shu (紫微斗数)

## License

MIT — see [LICENSE](LICENSE)

---

**Built with ❤️ by [Ba-Zi.ai](https://ba-zi.ai)** — AI-powered Chinese astrology for everyone.
