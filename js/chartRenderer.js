/**
 * ChartRenderer - 图表渲染引擎
 * Manages chart creation, updates, and destruction
 */

class ChartRenderer {
    constructor() {
        this.charts = new Map(); // slot -> chart instance
        this.chartTypes = new Map(); // slot -> current chart type
        this.customColors = new Map(); // slot -> custom color array for scheme
        this.seriesColors = new Map(); // slot -> { seriesIndex: color } map for per-series colors
        this.chartOptions = new Map(); // slot -> custom options
        this.showValues = new Map(); // slot -> boolean for showing data labels
        this.selectedColorScheme = new Map(); // slot -> selected color scheme key
        this.currentLayout = 1;
        this.data = null;
    }


    /**
     * Initialize renderer with data
     */
    init(data) {
        this.data = data;
        this.renderChart(1, 'bar');
    }

    /**
     * Set data and update all charts
     */
    setData(data) {
        this.data = data;
        this.updateAllCharts();
    }

    /**
     * Set custom colors for a specific slot
     * @param {number} slot - Chart slot number
     * @param {Array} colors - Color array to set
     * @param {string} schemeKey - Optional key of the color scheme
     */
    setColors(slot, colors, schemeKey = null) {
        this.customColors.set(slot, colors);
        // Store the selected scheme key
        if (schemeKey) {
            this.selectedColorScheme.set(slot, schemeKey);
        } else {
            // If no key, clear the scheme selection (custom colors applied)
            this.selectedColorScheme.delete(slot);
        }
        // Clear per-series colors when applying a scheme
        this.seriesColors.delete(slot);
        const chartType = this.chartTypes.get(slot) || 'bar';
        this.renderChart(slot, chartType);
    }

    /**
     * Get the currently selected color scheme key for a slot
     */
    getSelectedColorScheme(slot) {
        return this.selectedColorScheme.get(slot) || null;
    }

    /**
     * Set color for a specific series in a slot
     */
    setSeriesColor(slot, seriesIndex, color) {
        if (!this.seriesColors.has(slot)) {
            this.seriesColors.set(slot, {});
        }
        this.seriesColors.get(slot)[seriesIndex] = color;
        // Clear the scheme selection when applying individual colors
        this.selectedColorScheme.delete(slot);
        const chartType = this.chartTypes.get(slot) || 'bar';
        this.renderChart(slot, chartType);
    }

    /**
     * Get series colors for a slot
     */
    getSeriesColors(slot) {
        return this.seriesColors.get(slot) || {};
    }

    /**
     * Set color for a specific category (row) in a slot
     */
    setCategoryColor(slot, categoryIndex, color) {
        if (!this.categoryColors) {
            this.categoryColors = new Map();
        }
        if (!this.categoryColors.has(slot)) {
            this.categoryColors.set(slot, {});
        }
        this.categoryColors.get(slot)[categoryIndex] = color;
        // Clear the scheme selection when applying individual colors
        this.selectedColorScheme.delete(slot);
        const chartType = this.chartTypes.get(slot) || 'bar';
        this.renderChart(slot, chartType);
    }

    /**
     * Get category colors for a slot
     */
    getCategoryColors(slot) {
        if (!this.categoryColors) {
            this.categoryColors = new Map();
        }
        return this.categoryColors.get(slot) || {};
    }

    /**
     * Clear all custom colors for a slot
     */
    clearCustomColors(slot) {
        this.customColors.delete(slot);
        this.seriesColors.delete(slot);
        this.selectedColorScheme.delete(slot);
        if (this.categoryColors) {
            this.categoryColors.delete(slot);
        }
        const chartType = this.chartTypes.get(slot) || 'bar';
        this.renderChart(slot, chartType);
    }


    /**
     * Toggle show values for a specific slot
     */
    toggleShowValues(slot) {
        const current = this.showValues.get(slot) || false;
        this.showValues.set(slot, !current);
        const chartType = this.chartTypes.get(slot) || 'bar';
        this.renderChart(slot, chartType);
        return !current;
    }

    /**
     * Get show values state for a slot
     */
    getShowValues(slot) {
        return this.showValues.get(slot) || false;
    }

    /**
     * Set custom options for a specific slot
     */
    setOptions(slot, options) {
        this.chartOptions.set(slot, options);
        const chartType = this.chartTypes.get(slot) || 'bar';
        this.renderChart(slot, chartType);
    }

    /**
     * Get current options for a specific slot
     */
    getOptions(slot) {
        return this.chartOptions.get(slot) || {};
    }


    /**
     * Render a chart in a specific slot
     */
    renderChart(slot, chartType) {
        const container = document.getElementById(`chart-${slot}`);
        if (!container) return;

        const canvas = document.getElementById(`canvas-${slot}`);
        const echartContainer = document.getElementById(`echart-${slot}`);

        // Destroy existing chart
        this.destroyChart(slot);

        if (!this.data) {
            console.warn('No data available for chart rendering');
            return;
        }

        // Determine which library to use
        const useEcharts = [
            'boxplot', 'heatmap', 'funnel', 'treemap', 'sunburst', 'sankey', 'gauge', 'wordcloud', 'table',
            'waterfall', 'timeline', 'graph', 'map', 'parallel', 'calendar', 'themeriver', 'pictorial', 'liquid',
            // 3D charts
            'bar3d', 'scatter3d', 'surface3d', 'globe', 'line3d',
            // Financial & Statistical charts
            'candlestick', 'effectScatter', 'bullet', 'stepLine', 'histogram', 'tree', 'progress'
        ].includes(chartType);

        // Special HTML-based charts (not canvas/echarts)
        const useHtmlRender = ['metric', 'sparkline'].includes(chartType);

        if (useHtmlRender) {
            canvas.style.display = 'none';
            echartContainer.style.display = 'block';
            echartContainer.classList.add('active');
            this.renderHtmlChart(echartContainer, chartType, slot);
        } else if (useEcharts) {
            canvas.style.display = 'none';
            echartContainer.style.display = 'block';
            echartContainer.classList.add('active');
            this.renderEchartsChart(echartContainer, chartType, slot);
        } else {
            canvas.style.display = 'block';
            echartContainer.style.display = 'none';
            echartContainer.classList.remove('active');
            this.renderChartJSChart(canvas, chartType, slot);
        }

        this.chartTypes.set(slot, chartType);

        // Update the select dropdown
        const select = container.querySelector('.chart-type-select');
        if (select) {
            select.value = chartType;
        }
    }

    /**
     * Render Chart.js chart
     */
    renderChartJSChart(canvas, chartType, slot) {
        const ctx = canvas.getContext('2d');
        let chart;

        // Get custom colors if set
        const customColors = this.customColors.get(slot);
        const seriesColors = this.seriesColors.get(slot) || {};
        const categoryColors = this.getCategoryColors(slot);
        const showValues = this.showValues.get(slot) || false;
        const chartOptions = this.chartOptions.get(slot) || {};

        // Build render options - merge chart options with other settings
        const renderOptions = {
            showValues: showValues,
            seriesColors: seriesColors,
            categoryColors: categoryColors,
            ...chartOptions  // Spread custom chart options
        };

        // Temporarily override color palette if custom colors are set
        let originalGetPalette = null;
        if (customColors && customColors.length > 0) {
            originalGetPalette = BasicCharts.getColorPalette;
            BasicCharts.getColorPalette = (count) => {
                const palette = [...customColors];
                while (palette.length < count) {
                    palette.push(customColors[palette.length % customColors.length]);
                }
                return palette.slice(0, count);
            };
        }

        switch (chartType) {
            case 'bar':
                chart = BasicCharts.createBarChart(ctx, this.data, renderOptions);
                break;
            case 'line':
                chart = BasicCharts.createLineChart(ctx, this.data, renderOptions);
                break;
            case 'pie':
                chart = BasicCharts.createPieChart(ctx, this.data, renderOptions);
                break;
            case 'doughnut':
                chart = BasicCharts.createDoughnutChart(ctx, this.data, renderOptions);
                break;
            case 'scatter':
                chart = AdvancedCharts.createScatterChart(ctx, this.data, renderOptions);
                break;
            case 'bubble':
                chart = AdvancedCharts.createBubbleChart(ctx, this.data, renderOptions);
                break;
            case 'radar':
                chart = AdvancedCharts.createRadarChart(ctx, this.data, renderOptions);
                break;
            case 'area':
                chart = AdvancedCharts.createAreaChart(ctx, this.data, renderOptions);
                break;
            case 'stacked':
                chart = AdvancedCharts.createStackedChart(ctx, this.data, renderOptions);
                break;
            case 'polar':
                chart = AdvancedCharts.createPolarChart(ctx, this.data, renderOptions);
                break;
            case 'rose':
                chart = BasicCharts.createRoseChart(ctx, this.data, renderOptions);
                break;
            case 'mixed':
                chart = BasicCharts.createMixedChart(ctx, this.data, renderOptions);
                break;
            case 'horizontalBar':
                chart = BasicCharts.createHorizontalBarChart(ctx, this.data, renderOptions);
                break;
            default:
                chart = BasicCharts.createBarChart(ctx, this.data, renderOptions);
        }

        // Apply per-series colors (column colors) if set
        if (Object.keys(seriesColors).length > 0 && chart && chart.data && chart.data.datasets) {
            chart.data.datasets.forEach((dataset, index) => {
                if (seriesColors[index]) {
                    dataset.backgroundColor = seriesColors[index];
                    dataset.borderColor = seriesColors[index];
                }
            });
            chart.update();
        }

        // Apply per-category colors (row colors) if set - this creates per-point colors
        if (Object.keys(categoryColors).length > 0 && chart && chart.data && chart.data.datasets) {
            const labelsCount = chart.data.labels ? chart.data.labels.length : 0;
            const isPieType = ['pie', 'doughnut', 'polarArea'].includes(chart.config.type);

            chart.data.datasets.forEach((dataset) => {
                // For pie/doughnut charts, backgroundColor is already an array - update specific indices
                if (isPieType && Array.isArray(dataset.backgroundColor)) {
                    // Directly update the color at each category index
                    for (let i = 0; i < labelsCount; i++) {
                        if (categoryColors[i]) {
                            dataset.backgroundColor[i] = categoryColors[i];
                        }
                    }
                    dataset.borderColor = '#fff';
                } else if (!Array.isArray(dataset.backgroundColor) || dataset.backgroundColor.length !== labelsCount) {
                    // For bar/line charts, convert single color to array
                    const currentColor = dataset.backgroundColor;
                    const newColors = [];
                    for (let i = 0; i < labelsCount; i++) {
                        newColors.push(categoryColors[i] || currentColor);
                    }
                    dataset.backgroundColor = newColors;
                }
            });
            chart.update();
        }

        // Restore original function
        if (originalGetPalette) {
            BasicCharts.getColorPalette = originalGetPalette;
        }

        this.charts.set(slot, { type: 'chartjs', instance: chart });
    }


    /**
     * Render ECharts chart
     */
    renderEchartsChart(container, chartType, slot) {
        let chart;
        const customColors = this.customColors.get(slot);
        const seriesColors = this.seriesColors.get(slot) || {};
        const categoryColors = this.getCategoryColors(slot);
        const chartOptions = this.chartOptions.get(slot) || {};

        // Build render options for ECharts - merge custom colors with series/category colors
        let effectiveColors = customColors;

        // If category colors are set, build a custom color array from them
        if (Object.keys(categoryColors).length > 0) {
            const defaultColors = BasicCharts.getColorPalette(this.data?.labels?.length || 10);
            effectiveColors = defaultColors.map((c, i) => categoryColors[i] || c);
        }

        // If series colors are set and we have datasets, apply them  
        if (Object.keys(seriesColors).length > 0 && this.data?.datasets) {
            const defaultColors = BasicCharts.getColorPalette(this.data.datasets.length);
            effectiveColors = defaultColors.map((c, i) => seriesColors[i] || c);
        }

        // Use effective colors (prioritize explicit customColors if set)
        const colorsToUse = customColors || effectiveColors;

        // Build render options object with colors and chart options
        const renderOptions = {
            customColors: colorsToUse,
            seriesColors,
            categoryColors,
            ...chartOptions
        };

        switch (chartType) {
            case 'boxplot':
                chart = ComparisonCharts.createBoxplotChart(container, this.data, renderOptions);
                break;
            case 'heatmap':
                chart = ComparisonCharts.createHeatmapChart(container, this.data, renderOptions);
                break;
            case 'funnel':
                chart = ComparisonCharts.createFunnelChart(container, this.data, renderOptions);
                break;
            case 'treemap':
                chart = ComparisonCharts.createTreemapChart(container, this.data, renderOptions);
                break;
            case 'sunburst':
                chart = ComparisonCharts.createSunburstChart(container, this.data, renderOptions);
                break;
            case 'sankey':
                chart = ComparisonCharts.createSankeyChart(container, this.data, renderOptions);
                break;
            case 'gauge':
                chart = ComparisonCharts.createGaugeChart(container, this.data, renderOptions);
                break;
            case 'wordcloud':
                chart = ComparisonCharts.createWordCloudChart(container, this.data, renderOptions);
                break;
            case 'table':
                chart = ComparisonCharts.createDataTable(container, this.data);
                break;
            case 'waterfall':
                chart = SpecialCharts.createWaterfallChart(container, this.data, renderOptions);
                break;
            case 'timeline':
                chart = SpecialCharts.createTimelineChart(container, this.data, renderOptions);
                break;
            case 'graph':
                chart = SpecialCharts.createGraphChart(container, this.data, renderOptions);
                break;
            case 'map':
                chart = SpecialCharts.createMapChart(container, this.data, renderOptions);
                break;
            case 'parallel':
                chart = SpecialCharts.createParallelChart(container, this.data, renderOptions);
                break;
            case 'calendar':
                chart = SpecialCharts.createCalendarChart(container, this.data, renderOptions);
                break;
            case 'themeriver':
                chart = SpecialCharts.createThemeRiverChart(container, this.data, renderOptions);
                break;
            case 'pictorial':
                chart = SpecialCharts.createPictorialBarChart(container, this.data, renderOptions);
                break;
            case 'liquid':
                chart = SpecialCharts.createLiquidChart(container, this.data, renderOptions);
                break;
            // 3D Charts
            case 'bar3d':
                chart = Charts3D.createBar3DChart(container, this.data, renderOptions);
                break;
            case 'scatter3d':
                chart = Charts3D.createScatter3DChart(container, this.data, renderOptions);
                break;
            case 'surface3d':
                chart = Charts3D.createSurface3DChart(container, this.data, renderOptions);
                break;
            case 'globe':
                chart = Charts3D.createGlobeChart(container, this.data, renderOptions);
                break;
            case 'line3d':
                chart = Charts3D.createLine3DChart(container, this.data, renderOptions);
                break;
            // Financial & Statistical Charts
            case 'candlestick':
                chart = FinancialCharts.createCandlestickChart(container, this.data, renderOptions);
                break;
            case 'effectScatter':
                chart = FinancialCharts.createEffectScatterChart(container, this.data, renderOptions);
                break;
            case 'bullet':
                chart = FinancialCharts.createBulletChart(container, this.data, renderOptions);
                break;
            case 'stepLine':
                chart = FinancialCharts.createStepLineChart(container, this.data, renderOptions);
                break;
            case 'histogram':
                chart = FinancialCharts.createHistogramChart(container, this.data, renderOptions);
                break;
            case 'tree':
                chart = FinancialCharts.createTreeChart(container, this.data, renderOptions);
                break;
            case 'progress':
                chart = FinancialCharts.createProgressChart(container, this.data, renderOptions);
                break;
            default:
                chart = ComparisonCharts.createHeatmapChart(container, this.data, renderOptions);
        }

        this.charts.set(slot, { type: 'echarts', instance: chart });
    }

    /**
     * Render HTML-based charts (metric cards, sparklines)
     */
    renderHtmlChart(container, chartType, slot) {
        let chart;

        switch (chartType) {
            case 'metric':
                chart = FinancialCharts.createMetricCards(container, this.data);
                break;
            case 'sparkline':
                chart = FinancialCharts.createSparklines(container, this.data);
                break;
            default:
                chart = FinancialCharts.createMetricCards(container, this.data);
        }

        this.charts.set(slot, { type: 'html', instance: chart });
    }

    /**
     * Destroy a chart in a specific slot
     */
    destroyChart(slot) {
        const chartInfo = this.charts.get(slot);
        if (!chartInfo) return;

        if (chartInfo.type === 'chartjs') {
            chartInfo.instance.destroy();
        } else if (chartInfo.type === 'echarts') {
            if (chartInfo.instance.dispose) {
                chartInfo.instance.dispose();
            } else if (chartInfo.instance.destroy) {
                chartInfo.instance.destroy();
            }
        }

        this.charts.delete(slot);
    }

    /**
     * Update all charts with current data
     */
    updateAllCharts() {
        for (const [slot, type] of this.chartTypes) {
            this.renderChart(slot, type);
        }
    }

    /**
     * Set layout (1, 2, or 4 charts)
     */
    setLayout(count) {
        const grid = document.getElementById('chartGrid');
        if (!grid) return;

        this.currentLayout = count;

        // Update grid class
        grid.className = `chart-grid layout-${count}`;

        // Clear existing charts
        grid.innerHTML = '';

        // Create chart containers
        for (let i = 1; i <= count; i++) {
            const container = this.createChartContainer(i);
            grid.appendChild(container);
        }

        // Render charts
        const chartType = this.chartTypes.get(1) || 'bar';
        for (let i = 1; i <= count; i++) {
            this.renderChart(i, chartType);
        }
    }

    /**
     * Create a chart container element
     */
    createChartContainer(slot) {
        const container = document.createElement('div');
        container.className = 'chart-container';
        container.id = `chart-${slot}`;

        const currentType = this.chartTypes.get(slot) || 'bar';

        // Get translations
        const t = window.app ? window.app.getTranslations() : this.getDefaultTranslations();

        container.innerHTML = `
            <div class="chart-header">
                <select class="chart-type-select" data-slot="${slot}">
                    <optgroup label="${t.basicCharts}">
                        <option value="bar">${t.bar}</option>
                        <option value="line">${t.line}</option>
                        <option value="pie">${t.pie}</option>
                        <option value="doughnut">${t.doughnut}</option>
                        <option value="horizontalBar">${t.horizontalBar || '水平柱状图'}</option>
                    </optgroup>
                    <optgroup label="${t.advancedCharts}">
                        <option value="scatter">${t.scatter}</option>
                        <option value="bubble">${t.bubble}</option>
                        <option value="radar">${t.radar}</option>
                        <option value="area">${t.area}</option>
                        <option value="stacked">${t.stacked}</option>
                        <option value="polar">${t.polar}</option>
                        <option value="rose">${t.rose || '玫瑰图'}</option>
                        <option value="mixed">${t.mixed || '组合图'}</option>
                    </optgroup>
                    <optgroup label="${t.distributionCharts}">
                        <option value="boxplot">${t.boxplot}</option>
                        <option value="heatmap">${t.heatmap}</option>
                        <option value="calendar">${t.calendar || '日历热力图'}</option>
                    </optgroup>
                    <optgroup label="${t.hierarchyCharts}">
                        <option value="treemap">${t.treemap}</option>
                        <option value="sunburst">${t.sunburst}</option>
                        <option value="sankey">${t.sankey}</option>
                        <option value="funnel">${t.funnel}</option>
                    </optgroup>
                    <optgroup label="${t.specialCharts}">
                        <option value="gauge">${t.gauge}</option>
                        <option value="wordcloud">${t.wordcloud}</option>
                        <option value="table">${t.table}</option>
                        <option value="waterfall">${t.waterfall || '瀑布图'}</option>
                        <option value="timeline">${t.timeline || '时间轴图'}</option>
                        <option value="graph">${t.graph || '关系图'}</option>
                        <option value="parallel">${t.parallel || '平行坐标'}</option>
                        <option value="themeriver">${t.themeriver || '河流图'}</option>
                        <option value="pictorial">${t.pictorial || '象形柱图'}</option>
                        <option value="liquid">${t.liquid || '水球图'}</option>
                    </optgroup>
                </select>
                <button class="chart-action-btn color-picker-btn" data-action="colorpicker" title="${t.colorPicker || '颜色'}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 2a10 10 0 0 0 0 20 2 2 0 0 0 2-2v-1a2 2 0 0 1 2-2h1a2 2 0 0 0 2-2 10 10 0 0 0-7-13z"/>
                        <circle cx="8" cy="9" r="1.5" fill="currentColor"/>
                        <circle cx="12" cy="7" r="1.5" fill="currentColor"/>
                        <circle cx="16" cy="9" r="1.5" fill="currentColor"/>
                        <circle cx="9" cy="13" r="1.5" fill="currentColor"/>
                    </svg>
                </button>
                <button class="chart-action-btn settings-btn" data-action="settings" title="${t.chartSettings || '图表设置'}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="3"/>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1.08 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.08a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.08a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                    </svg>
                </button>
                <button class="chart-action-btn toggle-values-btn" data-action="togglevalues" title="${t.toggleValues || '显示/隐藏数值'}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M7 20h10"/>
                        <path d="M10 20c5.5-2.5 6.5-9 3.5-13"/>
                        <path d="M6.5 9c0 1.5 1 3 2.5 3"/>
                        <path d="M14 6.5c0-.8.5-2 1.5-2"/>
                        <text x="12" y="15" font-size="6" text-anchor="middle" fill="currentColor">123</text>
                    </svg>
                </button>
                <div class="chart-actions">
                    <button class="chart-action-btn" data-action="fullscreen" title="${t.fullscreen || '全屏'}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                        </svg>
                    </button>
                    <button class="chart-action-btn" data-action="download" title="${t.download || '下载'}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7,10 12,15 17,10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="chart-wrapper">
                <canvas id="canvas-${slot}"></canvas>
                <div id="echart-${slot}" class="echart-container"></div>
            </div>
        `;

        // Set current chart type
        const select = container.querySelector('.chart-type-select');
        select.value = currentType;

        return container;
    }


    /**
     * Get default translations (fallback)
     */
    getDefaultTranslations() {
        return {
            basicCharts: '基础图表',
            advancedCharts: '高级图表',
            distributionCharts: '分布图表',
            hierarchyCharts: '层级图表',
            specialCharts: '特殊图表',
            bar: '柱状图', line: '折线图', pie: '饼图', doughnut: '环形图',
            scatter: '散点图', bubble: '气泡图', radar: '雷达图',
            area: '面积图', stacked: '堆叠图', polar: '极坐标图',
            boxplot: '箱线图', heatmap: '热力图',
            treemap: '树状图', sunburst: '旭日图', sankey: '桑基图', funnel: '漏斗图',
            gauge: '仪表盘', wordcloud: '词云图', table: '数据表格',
            colorPicker: '颜色', fullscreen: '全屏', download: '下载',
            toggleValues: '显示/隐藏数值',
            seriesColors: '按系列设置颜色',
            series: '系列'
        };
    }


    /**
     * Download chart as image - shows format selection menu
     */
    downloadChart(slot) {
        const chartInfo = this.charts.get(slot);
        if (!chartInfo) return;

        // Show format selection popup
        this.showExportFormatMenu(slot, chartInfo);
    }

    /**
     * Show export format selection menu
     */
    showExportFormatMenu(slot, chartInfo) {
        // Remove existing menu
        document.querySelector('.export-format-menu')?.remove();

        const container = document.getElementById(`chart-${slot}`);
        const downloadBtn = container?.querySelector('[data-action="download"]');
        if (!downloadBtn) return;

        const rect = downloadBtn.getBoundingClientRect();

        // Get translations
        const t = window.app ? window.app.getTranslations() : this.getDefaultTranslations();

        const menu = document.createElement('div');
        menu.className = 'export-format-menu';
        menu.innerHTML = `
            <div class="export-menu-header">
                <span>${t.selectExportFormat || '选择导出格式'}</span>
                <button class="close-export-menu">×</button>
            </div>
            <div class="export-formats">
                <button class="export-format-btn" data-format="png" data-mime="image/png">
                    <span class="format-icon">🖼️</span>
                    <span class="format-name">PNG</span>
                    <span class="format-desc">${t.pngDesc || '无损压缩，支持透明'}</span>
                </button>
                <button class="export-format-btn" data-format="jpg" data-mime="image/jpeg">
                    <span class="format-icon">📷</span>
                    <span class="format-name">JPG / JPEG</span>
                    <span class="format-desc">${t.jpgDesc || '有损压缩，文件更小'}</span>
                </button>
                <button class="export-format-btn" data-format="webp" data-mime="image/webp">
                    <span class="format-icon">🌐</span>
                    <span class="format-name">WebP</span>
                    <span class="format-desc">${t.webpDesc || '现代格式，高压缩比'}</span>
                </button>
                ${chartInfo.type === 'echarts' ? `
                <button class="export-format-btn" data-format="svg" data-mime="image/svg+xml">
                    <span class="format-icon">📐</span>
                    <span class="format-name">SVG</span>
                    <span class="format-desc">${t.svgDesc || '矢量图，可无限缩放'}</span>
                </button>
                ` : ''}
            </div>
            <div class="export-quality-section">
                <label class="quality-label">
                    <span>${t.exportQuality || '导出质量'}</span>
                    <span class="quality-value">90%</span>
                </label>
                <input type="range" class="quality-slider" min="10" max="100" value="90" step="5">
            </div>
            <div class="export-scale-section">
                <label class="scale-label">
                    <span>${t.exportScale || '导出倍率'}</span>
                    <span class="scale-value">2x</span>
                </label>
                <input type="range" class="scale-slider" min="1" max="4" value="2" step="0.5">
            </div>
        `;

        // Position menu
        menu.style.position = 'fixed';
        menu.style.top = `${rect.bottom + 8}px`;
        menu.style.left = `${Math.max(10, rect.left - 150)}px`;
        menu.style.zIndex = '2000';

        document.body.appendChild(menu);

        // Event handlers
        menu.querySelector('.close-export-menu').onclick = () => menu.remove();

        // Quality slider
        const qualitySlider = menu.querySelector('.quality-slider');
        const qualityValue = menu.querySelector('.quality-value');
        qualitySlider.addEventListener('input', () => {
            qualityValue.textContent = `${qualitySlider.value}%`;
        });

        // Scale slider
        const scaleSlider = menu.querySelector('.scale-slider');
        const scaleValue = menu.querySelector('.scale-value');
        scaleSlider.addEventListener('input', () => {
            scaleValue.textContent = `${scaleSlider.value}x`;
        });

        // Format buttons
        menu.querySelectorAll('.export-format-btn').forEach(btn => {
            btn.onclick = () => {
                const format = btn.dataset.format;
                const mimeType = btn.dataset.mime;
                const quality = parseInt(qualitySlider.value) / 100;
                const scale = parseFloat(scaleSlider.value);

                this.exportChartWithFormat(slot, chartInfo, format, mimeType, quality, scale);
                menu.remove();
            };
        });

        // Close on outside click
        setTimeout(() => {
            document.addEventListener('click', function closeMenu(e) {
                if (!menu.contains(e.target) && e.target !== downloadBtn && !downloadBtn.contains(e.target)) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            });
        }, 100);
    }

    /**
     * Export chart with specified format
     */
    exportChartWithFormat(slot, chartInfo, format, mimeType, quality, scale) {
        let dataUrl;

        try {
            if (chartInfo.type === 'chartjs') {
                const canvas = document.getElementById(`canvas-${slot}`);

                if (format === 'svg') {
                    console.warn('SVG export not supported for Chart.js');
                    return;
                }

                // For high-res export, we need to redraw on a scaled canvas
                if (scale > 1) {
                    const scaledCanvas = document.createElement('canvas');
                    const ctx = scaledCanvas.getContext('2d');
                    scaledCanvas.width = canvas.width * scale;
                    scaledCanvas.height = canvas.height * scale;

                    // Fill background for JPG (no transparency)
                    if (format === 'jpg' || format === 'jpeg') {
                        ctx.fillStyle = '#ffffff';
                        ctx.fillRect(0, 0, scaledCanvas.width, scaledCanvas.height);
                    }

                    ctx.scale(scale, scale);
                    ctx.drawImage(canvas, 0, 0);
                    dataUrl = scaledCanvas.toDataURL(mimeType, quality);
                } else {
                    // For JPG, need white background
                    if (format === 'jpg' || format === 'jpeg') {
                        const tempCanvas = document.createElement('canvas');
                        const ctx = tempCanvas.getContext('2d');
                        tempCanvas.width = canvas.width;
                        tempCanvas.height = canvas.height;
                        ctx.fillStyle = '#ffffff';
                        ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
                        ctx.drawImage(canvas, 0, 0);
                        dataUrl = tempCanvas.toDataURL(mimeType, quality);
                    } else {
                        dataUrl = canvas.toDataURL(mimeType, quality);
                    }
                }
            } else if (chartInfo.type === 'echarts' && chartInfo.instance.getDataURL) {
                if (format === 'svg') {
                    // SVG export for ECharts
                    dataUrl = chartInfo.instance.getDataURL({
                        type: 'svg',
                        pixelRatio: scale,
                        backgroundColor: '#fff'
                    });
                } else {
                    dataUrl = chartInfo.instance.getDataURL({
                        type: format === 'jpg' || format === 'jpeg' ? 'jpeg' : format,
                        pixelRatio: scale,
                        backgroundColor: '#fff',
                        quality: quality
                    });
                }
            } else {
                console.warn('Cannot export this chart type');
                return;
            }

            const link = document.createElement('a');
            link.download = `chart-${slot}-${Date.now()}.${format}`;
            link.href = dataUrl;
            link.click();

            // Show success message
            if (window.app) {
                const t = window.app.getTranslations();
                window.app.showToast(t.exportSuccess || '导出成功', 'success');
            }
        } catch (error) {
            console.error('Export failed:', error);
            if (window.app) {
                const t = window.app.getTranslations();
                window.app.showToast(t.exportError || '导出失败', 'error');
            }
        }
    }

    /**
     * Toggle fullscreen for a chart
     */
    toggleFullscreen(slot) {
        const container = document.getElementById(`chart-${slot}`);
        if (!container) return;

        container.classList.toggle('fullscreen');

        // Resize chart after fullscreen toggle
        setTimeout(() => {
            const chartInfo = this.charts.get(slot);
            if (chartInfo) {
                if (chartInfo.type === 'chartjs') {
                    chartInfo.instance.resize();
                } else if (chartInfo.type === 'echarts' && chartInfo.instance.resize) {
                    chartInfo.instance.resize();
                }
            }
        }, 100);
    }

    /**
     * Handle window resize
     */
    handleResize() {
        for (const [slot, chartInfo] of this.charts) {
            if (chartInfo.type === 'echarts' && chartInfo.instance.resize) {
                chartInfo.instance.resize();
            }
        }
    }
}

// Export
window.ChartRenderer = ChartRenderer;
