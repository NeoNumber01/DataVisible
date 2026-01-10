/**
 * Chart Colors Configuration - 图表颜色配置模块
 * 为不同类型的图表提供最适合的颜色策略
 */

const ChartColorsConfig = {
    /**
     * Palette cache for optimization - avoids recomputing color palettes
     * Key format: "${chartType}-${count}-${presetName}"
     */
    _paletteCache: new Map(),
    _maxCacheSize: 100, // Maximum cached palettes

    /**
     * 图表颜色模式定义
     */
    colorModes: {
        // 按类别着色(饼图、环形图等)
        CATEGORY: 'category',
        // 按系列着色(柱状图、折线图等)
        SERIES: 'series',
        // 双色对比(K线图、瀑布图等)
        DUAL: 'dual',
        // 渐变映射(热力图、日历图等)
        GRADIENT: 'gradient',
        // 关系型(桑基图、关系图等)
        RELATION: 'relation',
        // 单色强调(仪表盘、水球图等)
        SINGLE: 'single'
    },

    /**
     * 根据图表类型获取颜色模式
     */
    getColorMode(chartType) {
        const modes = {
            // 分类型图表 - 按类别着色
            pie: this.colorModes.CATEGORY,
            doughnut: this.colorModes.CATEGORY,
            rose: this.colorModes.CATEGORY,
            polar: this.colorModes.CATEGORY,
            funnel: this.colorModes.CATEGORY,
            treemap: this.colorModes.CATEGORY,
            sunburst: this.colorModes.CATEGORY,
            progress: this.colorModes.CATEGORY,
            pictorial: this.colorModes.CATEGORY,
            metric: this.colorModes.CATEGORY,
            wordcloud: this.colorModes.CATEGORY,

            // 系列型图表 - 按数据系列着色
            bar: this.colorModes.SERIES,
            line: this.colorModes.SERIES,
            area: this.colorModes.SERIES,
            scatter: this.colorModes.SERIES,
            bubble: this.colorModes.SERIES,
            radar: this.colorModes.SERIES,
            mixed: this.colorModes.SERIES,
            horizontalBar: this.colorModes.SERIES,
            stacked: this.colorModes.SERIES,
            stepLine: this.colorModes.SERIES,
            parallel: this.colorModes.SERIES,
            sparkline: this.colorModes.SERIES,
            timeline: this.colorModes.SERIES,
            line3d: this.colorModes.SERIES,
            scatter3d: this.colorModes.SERIES,

            // 双色型图表 - 涨跌/正负对比
            candlestick: this.colorModes.DUAL,
            waterfall: this.colorModes.DUAL,
            bullet: this.colorModes.DUAL,
            boxplot: this.colorModes.DUAL,

            // 渐变映射型图表
            heatmap: this.colorModes.GRADIENT,
            calendar: this.colorModes.GRADIENT,
            bar3d: this.colorModes.GRADIENT,
            surface3d: this.colorModes.GRADIENT,
            histogram: this.colorModes.GRADIENT,

            // 关系型图表
            sankey: this.colorModes.RELATION,
            graph: this.colorModes.RELATION,
            tree: this.colorModes.RELATION,

            // 单色强调型
            gauge: this.colorModes.SINGLE,
            liquid: this.colorModes.SINGLE,
            effectScatter: this.colorModes.CATEGORY,
            globe: this.colorModes.SINGLE
        };

        return modes[chartType] || this.colorModes.SERIES;
    },

    /**
     * 预设配色方案 - 用于不同场景
     */
    presets: {
        // 默认配色 - 鲜艳现代
        default: {
            name: '默认配色',
            nameEn: 'Default',
            colors: ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6']
        },
        // 商务蓝 - 专业稳重
        business: {
            name: '商务蓝',
            nameEn: 'Business',
            colors: ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#1e3a8a', '#2563eb', '#7dd3fc', '#38bdf8', '#0ea5e9']
        },
        // 自然绿 - 环保健康
        nature: {
            name: '自然绿',
            nameEn: 'Nature',
            colors: ['#166534', '#22c55e', '#4ade80', '#86efac', '#bbf7d0', '#15803d', '#16a34a', '#a7f3d0', '#6ee7b7', '#34d399']
        },
        // 温暖橙 - 活力热情
        warm: {
            name: '温暖橙',
            nameEn: 'Warm',
            colors: ['#ea580c', '#f97316', '#fb923c', '#fdba74', '#fed7aa', '#c2410c', '#f59e0b', '#fcd34d', '#fde047', '#facc15']
        },
        // 优雅紫 - 高贵神秘
        elegant: {
            name: '优雅紫',
            nameEn: 'Elegant',
            colors: ['#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#6d28d9', '#a855f7', '#d8b4fe', '#e9d5ff', '#f3e8ff']
        },
        // 玫瑰粉 - 浪漫柔和
        rose: {
            name: '玫瑰粉',
            nameEn: 'Rose',
            colors: ['#e11d48', '#f43f5e', '#fb7185', '#fda4af', '#fecdd3', '#be123c', '#ec4899', '#f9a8d4', '#fbcfe8', '#fce7f3']
        },
        // 灰度 - 简约专业
        grayscale: {
            name: '灰度',
            nameEn: 'Grayscale',
            colors: ['#18181b', '#3f3f46', '#52525b', '#71717a', '#a1a1aa', '#d4d4d8', '#e4e4e7', '#f4f4f5', '#27272a', '#525252']
        },
        // 渐变蓝绿 - 清新舒适
        ocean: {
            name: '海洋',
            nameEn: 'Ocean',
            colors: ['#0e7490', '#06b6d4', '#22d3ee', '#67e8f9', '#a5f3fc', '#0891b2', '#14b8a6', '#5eead4', '#99f6e4', '#ccfbf1']
        },
        // 数据分析 - 高对比度
        analytics: {
            name: '数据分析',
            nameEn: 'Analytics',
            colors: ['#2563eb', '#16a34a', '#dc2626', '#ca8a04', '#9333ea', '#0891b2', '#c026d3', '#65a30d', '#0284c7', '#7c3aed']
        },
        // 彩虹 - 丰富多彩
        rainbow: {
            name: '彩虹',
            nameEn: 'Rainbow',
            colors: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899']
        }
    },

    /**
     * 双色配色方案 - 用于涨跌/正负对比型图表
     */
    dualColorPresets: {
        redGreen: {
            name: '红涨绿跌',
            nameEn: 'Red/Green',
            positive: '#ef4444',
            negative: '#22c55e'
        },
        greenRed: {
            name: '绿涨红跌',
            nameEn: 'Green/Red',
            positive: '#22c55e',
            negative: '#ef4444'
        },
        blueOrange: {
            name: '蓝橙对比',
            nameEn: 'Blue/Orange',
            positive: '#3b82f6',
            negative: '#f97316'
        },
        purpleTeal: {
            name: '紫青对比',
            nameEn: 'Purple/Teal',
            positive: '#8b5cf6',
            negative: '#14b8a6'
        }
    },

    /**
     * 渐变配色方案 - 用于热力图等
     */
    gradientPresets: {
        coolWarm: {
            name: '冷暖渐变',
            nameEn: 'Cool-Warm',
            colors: ['#3b82f6', '#60a5fa', '#fef3c7', '#fbbf24', '#f97316', '#ef4444']
        },
        blueScale: {
            name: '蓝色渐变',
            nameEn: 'Blue Scale',
            colors: ['#eff6ff', '#bfdbfe', '#60a5fa', '#3b82f6', '#1e40af', '#1e3a8a']
        },
        greenScale: {
            name: '绿色渐变',
            nameEn: 'Green Scale',
            colors: ['#f0fdf4', '#bbf7d0', '#4ade80', '#22c55e', '#15803d', '#14532d']
        },
        purpleScale: {
            name: '紫色渐变',
            nameEn: 'Purple Scale',
            colors: ['#faf5ff', '#e9d5ff', '#c084fc', '#8b5cf6', '#6d28d9', '#4c1d95']
        },
        heatmap: {
            name: '热力图经典',
            nameEn: 'Heatmap Classic',
            colors: ['#f0f9ff', '#bae6fd', '#7dd3fc', '#38bdf8', '#0284c7', '#0369a1']
        },
        viridis: {
            name: 'Viridis',
            nameEn: 'Viridis',
            colors: ['#440154', '#482878', '#3e4a89', '#31688e', '#26838f', '#1f9d8a', '#6cce59', '#b6de2b', '#fee825']
        }
    },

    /**
     * 获取推荐配色（带缓存优化）
     * @param {string} chartType - 图表类型
     * @param {number} count - 需要的颜色数量
     * @param {string} presetName - 预设名称
     */
    getRecommendedColors(chartType, count, presetName = 'default') {
        // Generate cache key
        const cacheKey = `${chartType}-${count}-${presetName}`;

        // Check cache first (optimization)
        if (this._paletteCache.has(cacheKey)) {
            return this._paletteCache.get(cacheKey);
        }

        const mode = this.getColorMode(chartType);
        let result;

        switch (mode) {
            case this.colorModes.DUAL:
                const dual = this.dualColorPresets[presetName] || this.dualColorPresets.redGreen;
                result = [dual.positive, dual.negative];
                break;

            case this.colorModes.GRADIENT:
                const gradient = this.gradientPresets[presetName] || this.gradientPresets.coolWarm;
                result = gradient.colors;
                break;

            default:
                const preset = this.presets[presetName] || this.presets.default;
                result = this._generateColorsInternal(preset.colors, count);
        }

        // Store in cache (with size limit)
        this._cacheResult(cacheKey, result);

        return result;
    },

    /**
     * 根据基础颜色生成足够数量的颜色（公开 API，带缓存）
     */
    generateColors(baseColors, count) {
        // For public API, use simple cache based on base colors signature
        const cacheKey = `gen-${baseColors.join(',')}-${count}`;

        if (this._paletteCache.has(cacheKey)) {
            return this._paletteCache.get(cacheKey);
        }

        const result = this._generateColorsInternal(baseColors, count);
        this._cacheResult(cacheKey, result);

        return result;
    },

    /**
     * 内部颜色生成（无缓存）
     */
    _generateColorsInternal(baseColors, count) {
        if (count <= baseColors.length) {
            return baseColors.slice(0, count);
        }

        const colors = [...baseColors];
        for (let i = baseColors.length; i < count; i++) {
            const hue = (i * 137.508) % 360;
            colors.push(`hsl(${hue}, 70%, 55%)`);
        }
        return colors;
    },

    /**
     * 缓存结果（带大小限制）
     */
    _cacheResult(key, value) {
        // Evict old entries if cache is too large
        if (this._paletteCache.size >= this._maxCacheSize) {
            // Remove oldest entry (first key)
            const firstKey = this._paletteCache.keys().next().value;
            this._paletteCache.delete(firstKey);
        }
        this._paletteCache.set(key, value);
    },

    /**
     * 清除调色板缓存
     */
    clearPaletteCache() {
        this._paletteCache.clear();
    },

    /**
     * 获取图表类型的颜色模式描述
     */
    getColorModeDescription(chartType) {
        const mode = this.getColorMode(chartType);
        const descriptions = {
            [this.colorModes.CATEGORY]: {
                title: '按类别着色',
                titleEn: 'Color by Category',
                description: '每个数据类别（行标签）使用一种颜色',
                descriptionEn: 'One color per data category (row label)',
                tip: '适合突出不同类别间的对比',
                tipEn: 'Good for highlighting contrast between categories'
            },
            [this.colorModes.SERIES]: {
                title: '按系列着色',
                titleEn: 'Color by Series',
                description: '每个数据系列（列）使用一种颜色',
                descriptionEn: 'One color per data series (column)',
                tip: '适合展示多个系列的变化趋势',
                tipEn: 'Good for showing trends across multiple series'
            },
            [this.colorModes.DUAL]: {
                title: '双色对比',
                titleEn: 'Dual Colors',
                description: '使用两种对比色表示正负/涨跌',
                descriptionEn: 'Two contrasting colors for positive/negative',
                tip: '选择容易区分的对比色',
                tipEn: 'Choose easily distinguishable contrasting colors'
            },
            [this.colorModes.GRADIENT]: {
                title: '渐变映射',
                titleEn: 'Gradient Mapping',
                description: '使用连续渐变色表示数值大小',
                descriptionEn: 'Continuous gradient for value magnitude',
                tip: '选择从浅到深的渐变色阶',
                tipEn: 'Choose a light-to-dark gradient scale'
            },
            [this.colorModes.RELATION]: {
                title: '关系型着色',
                titleEn: 'Relation Colors',
                description: '使用不同颜色区分节点类别',
                descriptionEn: 'Different colors for node categories',
                tip: '选择3-5种易于区分的颜色',
                tipEn: 'Select 3-5 distinct colors'
            },
            [this.colorModes.SINGLE]: {
                title: '单色强调',
                titleEn: 'Single Emphasis',
                description: '使用单一主题色突出重点',
                descriptionEn: 'Single theme color for emphasis',
                tip: '选择与整体设计风格一致的颜色',
                tipEn: 'Choose a color consistent with overall design'
            }
        };
        return descriptions[mode] || descriptions[this.colorModes.SERIES];
    },

    /**
     * 获取特定图表类型的颜色配置建议
     */
    getChartColorSuggestion(chartType) {
        const suggestions = {
            // 饼图/环形图 - 需要高对比度
            pie: { preset: 'rainbow', tip: '建议使用高对比度配色，便于区分每个扇区', tipEn: 'High contrast recommended to distinguish sectors' },
            doughnut: { preset: 'rainbow', tip: '同饼图，注意中心空白区域的视觉平衡', tipEn: 'Same as pie, check visual balance of center' },
            rose: { preset: 'elegant', tip: '玫瑰图建议使用渐变色系，突出面积差异', tipEn: 'Gradient recommended to highlight area differences' },

            // 柱状图/折线图 - 系列区分
            bar: { preset: 'analytics', tip: '多系列时建议使用高对比度配色', tipEn: 'High contrast recommended for multiple series' },
            line: { preset: 'default', tip: '折线图注意颜色与背景的对比度', tipEn: 'Check contrast between lines and background' },
            area: { preset: 'ocean', tip: '面积图建议使用半透明颜色避免遮挡', tipEn: 'Semi-transparent colors recommended to avoid occlusion' },

            // 金融图表 - 涨跌色
            candlestick: { preset: 'redGreen', tip: 'K线图遵循当地市场惯例的涨跌色', tipEn: 'Follow local market conventions for up/down colors' },
            waterfall: { preset: 'greenRed', tip: '瀑布图用绿色表示增加，红色表示减少', tipEn: 'Green for increase, red for decrease' },

            // 热力图 - 渐变色
            heatmap: { preset: 'coolWarm', tip: '热力图使用冷-暖渐变直观显示数值', tipEn: 'Cool-warm gradient intuitively shows values' },
            calendar: { preset: 'greenScale', tip: '日历热力图常用单色渐变', tipEn: 'Single color gradient common for calendar heatmaps' },

            // 3D图表
            bar3d: { preset: 'viridis', tip: '3D图表建议使用鲜明的渐变色', tipEn: 'Vibrant gradients recommended for 3D charts' },
            scatter3d: { preset: 'analytics', tip: '3D散点图需要高对比度区分不同系列', tipEn: 'High contrast needed to distinguish series in 3D' },

            // 关系图
            sankey: { preset: 'rainbow', tip: '桑基图使用渐变流动色效果最佳', tipEn: 'Gradient flow colors work best for Sankey' },
            graph: { preset: 'analytics', tip: '网络图使用3-5种类别色即可', tipEn: '3-5 category colors are sufficient for network graphs' },

            // 仪表盘类
            gauge: { preset: 'default', tip: '仪表盘通常使用单一主题色', tipEn: 'Gauge usually uses a single theme color' },
            progress: { preset: 'rainbow', tip: '进度条每项使用不同颜色便于区分', tipEn: 'Different colors for each item to distinguish' }
        };

        return suggestions[chartType] || { preset: 'default', tip: '使用默认配色方案', tipEn: 'Use default color scheme' };
    }
};

// Export
window.ChartColorsConfig = ChartColorsConfig;
