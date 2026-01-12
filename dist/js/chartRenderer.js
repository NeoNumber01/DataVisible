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
        this.zoomLevels = new Map(); // slot -> current zoom scale
        this.currentLayout = 1;
        this.data = null;

        // Handle window resize
        this.resizeHandler = debounce(this.handleResize.bind(this), 200);
        window.addEventListener('resize', this.resizeHandler);
    }

    /**
     * Handle window resize - re-render charts that need manual dimension updates
     * (like ECharts graphic elements using absolute pixels)
     */
    handleResize() {
        this.charts.forEach((chartInfo, slot) => {
            if (chartInfo.type === 'echarts' && chartInfo.instance) {
                // Always call standard resize first
                chartInfo.instance.resize();

                // For custom graphic charts (like perspective 3D bar), we MUST re-set option
                // because graphic elements are drawn using fixed pixel coordinates calculated at creation time.
                const chartType = this.chartTypes.get(slot);
                const complexGraphicCharts = [
                    'perspectiveBar3d',
                    'clusteredBar3d',
                    'stackedBar3d',
                    'percentStackedBar3d'
                ];

                if (complexGraphicCharts.includes(chartType)) {
                    // Re-render essentially re-calculates all option parameters based on new container size
                    this.renderChart(slot, chartType);
                }
            } else if (chartInfo.type === 'chartjs' && chartInfo.instance) {
                chartInfo.instance.resize();
            }
        });
    }


    /**
     * Initialize renderer with data
     */
    init(data) {
        this.data = data;
        this.setLayout(1);
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
        // Clear per-category colors when applying a scheme
        if (this.categoryColors) {
            this.categoryColors.delete(slot);
        }
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
        // Clear customColors (preset schemes like gradient colors) to avoid conflict
        this.customColors.delete(slot);
        // Clear category colors to avoid conflict (Column color mode)
        if (this.categoryColors) {
            this.categoryColors.delete(slot);
        }
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
        // Clear customColors (preset schemes like gradient colors) to avoid conflict
        this.customColors.delete(slot);
        // Clear series colors to avoid conflict (Row color mode)
        this.seriesColors.delete(slot);
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
     * Reset zoom for a specific slot
     */
    resetZoom(slot) {
        if (!this.zoomLevels) this.zoomLevels = new Map();
        if (!this.zoomOffsets) this.zoomOffsets = new Map();

        this.zoomLevels.set(slot, 1);
        this.zoomOffsets.set(slot, { x: 0, y: 0 });

        // Apply reset transform
        this.applyZoomTransform(slot, 1, { x: 0, y: 0 });
        this.updateZoomIndicator(slot, 1);

        // Reset wrapper cursor
        const wrapper = document.querySelector(`#chart-${slot} .chart-wrapper`);
        if (wrapper) {
            wrapper.style.cursor = 'default';
        }

        // Also reset internal chart zoom for completeness
        const chartInfo = this.charts.get(slot);
        if (chartInfo) {
            if (chartInfo.type === 'chartjs' && chartInfo.instance.resetZoom) {
                chartInfo.instance.resetZoom();
            } else if (chartInfo.type === 'echarts') {
                chartInfo.instance.dispatchAction({
                    type: 'restore'
                });
            }
        }
    }


    /**
     * Handle zoom in/out with improved interactive zoom
     * Supports: button click zoom, mouse wheel zoom, drag to pan
     */
    handleZoom(slot, type) {
        if (!this.zoomLevels) this.zoomLevels = new Map();
        if (!this.zoomOffsets) this.zoomOffsets = new Map();

        let currentZoom = this.zoomLevels.get(slot) || 1;
        let offset = this.zoomOffsets.get(slot) || { x: 0, y: 0 };
        const step = 0.2;
        const maxZoom = 5;
        const minZoom = 0.5;

        if (type === 'in') {
            currentZoom = Math.min(maxZoom, currentZoom + step);
        } else if (type === 'out') {
            currentZoom = Math.max(minZoom, currentZoom - step);
            // Reset offset when zooming out to prevent losing the chart
            if (currentZoom <= 1) {
                offset = { x: 0, y: 0 };
            }
        }

        // Snap to 1.0 if close
        if (Math.abs(currentZoom - 1) < 0.05) {
            currentZoom = 1;
            offset = { x: 0, y: 0 };
        }

        this.zoomLevels.set(slot, currentZoom);
        this.zoomOffsets.set(slot, offset);

        this.applyZoomTransform(slot, currentZoom, offset);
        this.updateZoomIndicator(slot, currentZoom);
    }

    /**
     * Apply zoom transform to chart elements
     */
    applyZoomTransform(slot, zoom, offset) {
        const canvas = document.getElementById(`canvas-${slot}`);
        const echartContainer = document.getElementById(`echart-${slot}`);
        const wrapper = document.querySelector(`#chart-${slot} .chart-wrapper`);

        const transform = `scale(${zoom}) translate(${offset.x}px, ${offset.y}px)`;
        const origin = 'center center';

        if (canvas) {
            canvas.style.transform = transform;
            canvas.style.transformOrigin = origin;
        }
        if (echartContainer) {
            echartContainer.style.transform = transform;
            echartContainer.style.transformOrigin = origin;
        }

        // Enable scrolling when zoomed in
        if (wrapper) {
            wrapper.style.overflow = zoom > 1 ? 'hidden' : 'hidden';
            wrapper.style.cursor = zoom > 1 ? 'grab' : 'default';
        }
    }

    /**
     * Update zoom level indicator
     */
    updateZoomIndicator(slot, zoom) {
        const container = document.getElementById(`chart-${slot}`);
        if (!container) return;

        let indicator = container.querySelector('.zoom-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'zoom-indicator';
            const wrapper = container.querySelector('.chart-wrapper');
            if (wrapper) wrapper.appendChild(indicator);
        }

        const percentage = Math.round(zoom * 100);
        indicator.textContent = `${percentage}%`;
        indicator.style.opacity = '1';

        // Auto-hide after 1.5 seconds
        clearTimeout(indicator._hideTimer);
        indicator._hideTimer = setTimeout(() => {
            indicator.style.opacity = '0';
        }, 1500);
    }

    /**
     * Initialize interactive zoom (mouse wheel + drag to pan)
     */
    initInteractiveZoom(slot) {
        const wrapper = document.querySelector(`#chart-${slot} .chart-wrapper`);
        if (!wrapper || wrapper._zoomInitialized) return;

        wrapper._zoomInitialized = true;

        // Mouse wheel zoom
        wrapper.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? 'out' : 'in';
            this.handleZoom(slot, delta);
        }, { passive: false });

        // Drag to pan when zoomed in
        let isDragging = false;
        let startX, startY;
        let startOffset;

        wrapper.addEventListener('mousedown', (e) => {
            const currentZoom = this.zoomLevels?.get(slot) || 1;
            if (currentZoom <= 1) return;

            isDragging = true;
            wrapper.style.cursor = 'grabbing';
            startX = e.clientX;
            startY = e.clientY;
            startOffset = this.zoomOffsets?.get(slot) || { x: 0, y: 0 };
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const currentZoom = this.zoomLevels?.get(slot) || 1;
            const dx = (e.clientX - startX) / currentZoom;
            const dy = (e.clientY - startY) / currentZoom;

            const newOffset = {
                x: startOffset.x + dx,
                y: startOffset.y + dy
            };

            this.zoomOffsets.set(slot, newOffset);
            this.applyZoomTransform(slot, currentZoom, newOffset);
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                const currentZoom = this.zoomLevels?.get(slot) || 1;
                wrapper.style.cursor = currentZoom > 1 ? 'grab' : 'default';
            }
        });
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
     * Set series configuration for customCombo chart
     * @param {number} slot - Chart slot number
     * @param {number} seriesIndex - Series index
     * @param {string} type - Chart type: 'bar', 'line', 'area', 'scatter'
     * @param {string} axis - Axis: 'primary' or 'secondary'
     */
    setSeriesConfig(slot, seriesIndex, type, axis) {
        const currentOptions = this.chartOptions.get(slot) || {};
        const seriesConfig = currentOptions.seriesConfig || {};

        seriesConfig[seriesIndex] = { type, axis };

        this.chartOptions.set(slot, {
            ...currentOptions,
            seriesConfig
        });

        const chartType = this.chartTypes.get(slot) || 'customCombo';
        this.renderChart(slot, chartType);
    }

    /**
     * Get series configuration for a slot
     */
    getSeriesConfig(slot) {
        const options = this.chartOptions.get(slot) || {};
        return options.seriesConfig || {};
    }

    /**
     * Initialize series config with default values based on current data
     * First series = bar, rest = line, all on primary axis
     */
    initSeriesConfig(slot) {
        if (!this.data || !this.data.datasets) return;

        const seriesConfig = {};
        this.data.datasets.forEach((ds, i) => {
            seriesConfig[i] = {
                type: i === 0 ? 'bar' : 'line',
                axis: 'primary'
            };
        });

        const currentOptions = this.chartOptions.get(slot) || {};
        this.chartOptions.set(slot, {
            ...currentOptions,
            seriesConfig
        });
    }

    /**
     * Check if chart can be updated in-place (optimization)
     * Returns true if we can reuse existing chart instance
     */
    canUpdateInPlace(slot, newChartType) {
        const chartInfo = this.charts.get(slot);
        if (!chartInfo) return false;

        const currentType = this.chartTypes.get(slot);
        if (currentType !== newChartType) return false;

        // Chart.js charts can be updated in place
        if (chartInfo.type === 'chartjs') return true;

        // ECharts charts can be updated in place
        if (chartInfo.type === 'echarts' && chartInfo.instance) return true;

        // HTML charts should be re-rendered
        return false;
    }

    /**
     * Get the library type for a chart type
     */
    getLibraryType(chartType) {
        const echartsTypes = [
            'boxplot', 'heatmap', 'funnel', 'treemap', 'sunburst', 'sankey', 'gauge', 'wordcloud', 'table',
            'waterfall', 'timeline', 'graph', 'map', 'parallel', 'calendar', 'themeriver', 'pictorial', 'liquid',
            'bar3d', 'scatter3d', 'surface3d', 'globe', 'line3d',
            'candlestick', 'effectScatter', 'bullet', 'stepLine', 'histogram', 'tree', 'progress',
            // New charts
            'volumeCandlestick', 'pie3d', 'wireframeSurface',
            // Pseudo 3D bar charts
            'clusteredBar3d', 'stackedBar3d', 'percentStackedBar3d', 'perspectiveBar3d'
        ];
        const htmlTypes = ['metric', 'sparkline'];

        if (htmlTypes.includes(chartType)) return 'html';
        if (echartsTypes.includes(chartType)) return 'echarts';
        return 'chartjs';
    }

    /**
     * Render a chart in a specific slot (with incremental update optimization)
     */
    renderChart(slot, chartType) {
        const container = document.getElementById(`chart-${slot}`);
        if (!container) return;

        const canvas = document.getElementById(`canvas-${slot}`);
        const echartContainer = document.getElementById(`echart-${slot}`);

        if (!this.data) {
            console.warn('No data available for chart rendering');
            return;
        }

        const libraryType = this.getLibraryType(chartType);
        const canUpdate = this.canUpdateInPlace(slot, chartType);

        // Optimization: Try incremental update if possible
        if (canUpdate) {
            const chartInfo = this.charts.get(slot);

            if (chartInfo.type === 'chartjs') {
                // Update Chart.js chart in place
                this.updateChartJSChart(chartInfo.instance, chartType, slot);
            } else if (chartInfo.type === 'echarts') {
                // Update ECharts chart in place
                this.updateEchartsChart(chartInfo.instance, echartContainer, chartType, slot);
            }

            // Update type tracking
            this.chartTypes.set(slot, chartType);

            return;
        }

        // Full re-render if chart type changed or no existing chart
        this.destroyChart(slot);

        if (libraryType === 'html') {
            canvas.style.display = 'none';
            echartContainer.style.display = 'block';
            echartContainer.classList.add('active');
            this.renderHtmlChart(echartContainer, chartType, slot);
        } else if (libraryType === 'echarts') {
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

        // Initialize interactive zoom (mouse wheel + drag to pan)
        this.initInteractiveZoom(slot);
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
            customColors: customColors,  // Include custom colors for charts that read from options
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
            // Pie Variants
            case 'explodedPie':
                chart = BasicCharts.createExplodedPieChart(ctx, this.data, renderOptions);
                break;
            case 'halfDoughnut':
                chart = BasicCharts.createHalfDoughnutChart(ctx, this.data, renderOptions);
                break;
            case 'nestedDoughnut':
                chart = BasicCharts.createNestedDoughnutChart(ctx, this.data, renderOptions);
                break;
            // Combo Charts
            case 'barLine':
                chart = ComboCharts.createBarLineChart(ctx, this.data, renderOptions);
                break;
            case 'areaLine':
                chart = ComboCharts.createAreaLineChart(ctx, this.data, renderOptions);
                break;
            case 'barArea':
                chart = ComboCharts.createBarAreaChart(ctx, this.data, renderOptions);
                break;
            case 'dualAxis':
                chart = ComboCharts.createDualAxisChart(ctx, this.data, renderOptions);
                break;
            case 'customCombo':
                chart = ComboCharts.createCustomComboChart(ctx, this.data, renderOptions);
                break;
            // Stacked Variants
            case 'stackedPercent':
                chart = AdvancedCharts.createStackedPercentChart(ctx, this.data, renderOptions);
                break;
            case 'stackedLine':
                chart = AdvancedCharts.createStackedLineChart(ctx, this.data, renderOptions);
                break;
            case 'stackedPercentLine':
                chart = AdvancedCharts.createStackedPercentLineChart(ctx, this.data, renderOptions);
                break;
            case 'stackedHorizontalBar':
                chart = AdvancedCharts.createStackedHorizontalBarChart(ctx, this.data, renderOptions);
                break;
            case 'stackedPercentHorizontalBar':
                chart = AdvancedCharts.createStackedPercentHorizontalBarChart(ctx, this.data, renderOptions);
                break;
            case 'stackedArea':
                chart = AdvancedCharts.createStackedAreaChart(ctx, this.data, renderOptions);
                break;
            case 'stackedPercentArea':
                chart = AdvancedCharts.createStackedPercentAreaChart(ctx, this.data, renderOptions);
                break;
            // Scatter Variants
            case 'scatterSmooth':
                chart = AdvancedCharts.createScatterSmoothChart(ctx, this.data, renderOptions);
                break;
            case 'scatterLine':
                chart = AdvancedCharts.createScatterLineChart(ctx, this.data, renderOptions);
                break;
            default:
                chart = BasicCharts.createBarChart(ctx, this.data, renderOptions);
        }

        // Note: seriesColors are already passed through renderOptions and applied with proper fillOpacity
        // during chart creation. No need to override here as it would lose the transparency settings.

        // Note: categoryColors are already passed through renderOptions and applied with proper fillOpacity
        // during chart creation. No need to override here as it would lose the transparency settings.

        // Restore original function
        if (originalGetPalette) {
            BasicCharts.getColorPalette = originalGetPalette;
        }

        this.charts.set(slot, { type: 'chartjs', instance: chart });
    }

    /**
     * Update Chart.js chart by full re-render.
     * Always destroys and recreates the chart to ensure all color, data, fillOpacity, and other options
     * are correctly applied. This approach is simpler and more reliable than incremental updates.
     */
    updateChartJSChart(chart, chartType, slot) {
        this.destroyChart(slot);
        const canvas = document.getElementById(`canvas-${slot}`);
        if (canvas) {
            this.renderChartJSChart(canvas, chartType, slot);
        }
    }

    /**
     * Update ECharts chart by full re-render.
     * Always destroys and recreates the chart to ensure all color, data, and option changes
     * are correctly applied. This approach is simpler and more reliable than incremental updates.
     */
    updateEchartsChart(chart, container, chartType, slot) {
        this.destroyChart(slot);
        this.renderEchartsChart(container, chartType, slot);
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
        const showValues = this.showValues.get(slot) || false;

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

        // Use effective colors (prioritize explicit customColors if set and not empty)
        const colorsToUse = (customColors && customColors.length > 0) ? customColors : effectiveColors;

        // Build render options object with colors, showValues, and chart options
        const renderOptions = {
            customColors: colorsToUse,
            seriesColors,
            categoryColors,
            showValues: showValues,
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
                chart = ComparisonCharts.createDataTable(container, this.data, renderOptions);
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
            // New Financial Charts
            case 'volumeCandlestick':
                chart = FinancialCharts.createVolumeCandlestickChart(container, this.data, renderOptions);
                break;
            // New 3D Charts
            case 'pie3d':
                chart = Charts3D.createPie3DChart(container, this.data, renderOptions);
                break;
            case 'wireframeSurface':
                chart = Charts3D.createWireframeSurfaceChart(container, this.data, renderOptions);
                break;
            // Pseudo 3D bar charts
            case 'clusteredBar3d':
                chart = Charts3D.createClusteredBar3DChart(container, this.data, renderOptions);
                break;
            case 'stackedBar3d':
                chart = Charts3D.createStackedBar3DChart(container, this.data, renderOptions);
                break;
            case 'percentStackedBar3d':
                chart = Charts3D.createPercentStackedBar3DChart(container, this.data, renderOptions);
                break;
            case 'perspectiveBar3d':
                chart = Charts3D.createPerspectiveBar3DChart(container, this.data, renderOptions);
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

        // Get custom colors and options
        const customColors = this.customColors.get(slot);
        const seriesColors = this.seriesColors.get(slot) || {};
        const categoryColors = this.getCategoryColors(slot);
        const chartOptions = this.chartOptions.get(slot) || {};
        const showValues = this.showValues.get(slot) || false;

        // Build effective colors based on color mode (like ECharts rendering)
        let effectiveColors = customColors;

        // If category colors are set, build a custom color array from them
        if (Object.keys(categoryColors).length > 0) {
            const defaultColors = BasicCharts.getColorPalette(this.data?.labels?.length || 10);
            effectiveColors = defaultColors.map((c, i) => categoryColors[i] || c);
        }

        // If series colors are set and we have datasets, apply them (important for sparklines)
        if (Object.keys(seriesColors).length > 0 && this.data?.datasets) {
            const defaultColors = BasicCharts.getColorPalette(this.data.datasets.length);
            effectiveColors = defaultColors.map((c, i) => seriesColors[i] || c);
        }

        // Build render options
        const renderOptions = {
            customColors: effectiveColors || customColors,
            seriesColors: seriesColors,
            categoryColors: categoryColors,
            showValues: showValues,
            ...chartOptions
        };

        switch (chartType) {
            case 'metric':
                chart = FinancialCharts.createMetricCards(container, this.data, renderOptions);
                break;
            case 'sparkline':
                chart = FinancialCharts.createSparklines(container, this.data, renderOptions);
                break;
            default:
                chart = FinancialCharts.createMetricCards(container, this.data, renderOptions);
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
                        <option value="horizontalBar">${t.horizontalBar}</option>
                        <option value="explodedPie">${t.explodedPie}</option>
                        <option value="halfDoughnut">${t.halfDoughnut}</option>
                        <option value="nestedDoughnut">${t.nestedDoughnut}</option>
                    </optgroup>
                    <optgroup label="${t.advancedCharts}">
                        <option value="scatter">${t.scatter}</option>
                        <option value="bubble">${t.bubble}</option>
                        <option value="radar">${t.radar}</option>
                        <option value="area">${t.area}</option>
                        <option value="stacked">${t.stacked}</option>
                        <option value="polar">${t.polar}</option>
                        <option value="rose">${t.rose}</option>
                        <option value="mixed">${t.mixed}</option>
                        <option value="stackedPercent">${t.stackedPercent}</option>
                        <option value="stackedLine">${t.stackedLine}</option>
                        <option value="stackedPercentLine">${t.stackedPercentLine}</option>
                        <option value="stackedHorizontalBar">${t.stackedHorizontalBar}</option>
                        <option value="stackedPercentHorizontalBar">${t.stackedPercentHorizontalBar}</option>
                        <option value="stackedArea">${t.stackedArea}</option>
                        <option value="stackedPercentArea">${t.stackedPercentArea}</option>
                        <option value="scatterSmooth">${t.scatterSmooth}</option>
                        <option value="scatterLine">${t.scatterLine}</option>
                    </optgroup>
                    <optgroup label="${t.comboCharts}">
                        <option value="barLine">${t.barLine}</option>
                        <option value="areaLine">${t.areaLine}</option>
                        <option value="barArea">${t.barArea}</option>
                        <option value="dualAxis">${t.dualAxis}</option>
                        <option value="customCombo">${t.customCombo}</option>
                    </optgroup>
                    <optgroup label="${t.distributionCharts}">
                        <option value="boxplot">${t.boxplot}</option>
                        <option value="heatmap">${t.heatmap}</option>
                        <option value="calendar">${t.calendar}</option>
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
                        <option value="waterfall">${t.waterfall}</option>
                        <option value="timeline">${t.timeline}</option>
                        <option value="graph">${t.graph}</option>
                        <option value="parallel">${t.parallel}</option>
                        <option value="themeriver">${t.themeriver}</option>
                        <option value="pictorial">${t.pictorial}</option>
                        <option value="liquid">${t.liquid}</option>
                    </optgroup>
                    <optgroup label="${t.financialCharts}">
                        <option value="candlestick">${t.candlestick}</option>
                        <option value="effectScatter">${t.effectScatter}</option>
                        <option value="bullet">${t.bullet}</option>
                        <option value="stepLine">${t.stepLine}</option>
                        <option value="histogram">${t.histogram}</option>
                        <option value="tree">${t.tree}</option>
                        <option value="progress">${t.progress}</option>
                        <option value="metric">${t.metric}</option>
                        <option value="sparkline">${t.sparkline}</option>
                        <option value="volumeCandlestick">${t.volumeCandlestick}</option>
                    </optgroup>
                    <optgroup label="${t.charts3D}">
                        <option value="bar3d">${t.bar3d}</option>
                        <option value="scatter3d">${t.scatter3d}</option>
                        <option value="surface3d">${t.surface3d}</option>
                        <option value="line3d">${t.line3d}</option>
                        <option value="globe">${t.globe}</option>
                        <option value="pie3d">${t.pie3d}</option>
                        <option value="wireframeSurface">${t.wireframeSurface}</option>
                    </optgroup>
                </select>
                <button class="chart-action-btn color-picker-btn" data-action="colorpicker" title="${t.colorPicker}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 2a10 10 0 0 0 0 20 2 2 0 0 0 2-2v-1a2 2 0 0 1 2-2h1a2 2 0 0 0 2-2 10 10 0 0 0-7-13z"/>
                        <circle cx="8" cy="9" r="1.5" fill="currentColor"/>
                        <circle cx="12" cy="7" r="1.5" fill="currentColor"/>
                        <circle cx="16" cy="9" r="1.5" fill="currentColor"/>
                        <circle cx="9" cy="13" r="1.5" fill="currentColor"/>
                    </svg>
                </button>
                <button class="chart-action-btn settings-btn" data-action="settings" title="${t.chartSettings}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="3"/>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1.08 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.08a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.08a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                    </svg>
                </button>
                <button class="chart-action-btn toggle-values-btn" data-action="togglevalues" title="${t.toggleValues}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M7 20h10"/>
                        <path d="M10 20c5.5-2.5 6.5-9 3.5-13"/>
                        <path d="M6.5 9c0 1.5 1 3 2.5 3"/>
                        <path d="M14 6.5c0-.8.5-2 1.5-2"/>
                        <text x="12" y="15" font-size="6" text-anchor="middle" fill="currentColor">123</text>
                    </svg>
                </button>
                <button class="chart-action-btn zoom-btn" data-action="zoomin" title="${t.chartActionZoomIn}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"/>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        <line x1="11" y1="8" x2="11" y2="14"/>
                        <line x1="8" y1="11" x2="14" y2="11"/>
                    </svg>
                </button>
                <button class="chart-action-btn zoom-btn" data-action="zoomout" title="${t.chartActionZoomOut}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"/>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        <line x1="8" y1="11" x2="14" y2="11"/>
                    </svg>
                </button>
                <button class="chart-action-btn reset-zoom-btn" data-action="resetzoom" title="${t.chartActionResetZoom}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"/>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        <line x1="8" y1="11" x2="14" y2="11"/>
                        <path d="M 11 8 L 11 14 M 8 11 L 14 11" transform="rotate(45 11 11)"/>
                    </svg>
                </button>
                <div class="chart-actions">
                    <button class="chart-action-btn" data-action="fullscreen" title="${t.fullscreen}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                        </svg>
                    </button>
                    <button class="chart-action-btn" data-action="download" title="${t.download}">
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
            basicCharts: 'Basic Charts',
            advancedCharts: 'Advanced Charts',
            distributionCharts: 'Distribution Charts',
            hierarchyCharts: 'Hierarchy Charts',
            specialCharts: 'Special Charts',
            financialCharts: 'Financial Charts',
            charts3D: '3D Charts',
            comboCharts: 'Combo Charts',
            // Basic charts
            bar: 'Bar Chart', line: 'Line Chart', pie: 'Pie Chart', doughnut: 'Doughnut Chart',
            horizontalBar: 'Horizontal Bar',
            explodedPie: 'Exploded Pie', halfDoughnut: 'Half Doughnut', nestedDoughnut: 'Nested Doughnut',
            // Advanced charts
            scatter: 'Scatter Chart', bubble: 'Bubble Chart', radar: 'Radar Chart',
            area: 'Area Chart', stacked: 'Stacked Chart', polar: 'Polar Area',
            rose: 'Rose Chart', mixed: 'Mixed Chart',
            // Stacked variants
            stackedPercent: '100% Stacked Bar', stackedLine: 'Stacked Line',
            stackedPercentLine: '100% Stacked Line', stackedHorizontalBar: 'Stacked Horizontal Bar',
            stackedPercentHorizontalBar: '100% Stacked Horizontal Bar',
            stackedArea: 'Stacked Area', stackedPercentArea: '100% Stacked Area',
            // Scatter variants
            scatterSmooth: 'Smooth Scatter', scatterLine: 'Line Scatter',
            // Combo charts
            barLine: 'Bar + Line', areaLine: 'Area + Line', barArea: 'Bar + Area',
            dualAxis: 'Dual Y-Axis', customCombo: 'Custom Combo',
            // Distribution/hierarchy/special charts
            boxplot: 'Box Plot', heatmap: 'Heatmap', calendar: 'Calendar Heatmap',
            treemap: 'Treemap', sunburst: 'Sunburst', sankey: 'Sankey Diagram', funnel: 'Funnel Chart',
            gauge: 'Gauge', wordcloud: 'Word Cloud', table: 'Data Table',
            waterfall: 'Waterfall', timeline: 'Timeline', graph: 'Graph',
            parallel: 'Parallel', themeriver: 'Theme River', pictorial: 'Pictorial Bar', liquid: 'Liquid',
            // Financial charts
            candlestick: 'Candlestick', effectScatter: 'Effect Scatter', bullet: 'Bullet Chart',
            stepLine: 'Step Line', histogram: 'Histogram', tree: 'Tree',
            progress: 'Progress', metric: 'Metric Cards', sparkline: 'Sparklines',
            volumeCandlestick: 'Volume Candlestick',
            // 3D charts
            bar3d: '3D Bar', scatter3d: '3D Scatter', surface3d: '3D Surface',
            line3d: '3D Line', globe: 'Globe', pie3d: '3D Pie', wireframeSurface: 'Wireframe Surface',
            // UI elements
            colorPicker: 'Color', fullscreen: 'Fullscreen', download: 'Download',
            toggleValues: 'Show/Hide Values',
            chartSettings: 'Chart Settings',
            chartActionResetZoom: 'Reset Zoom',
            chartActionZoomIn: 'Zoom In',
            chartActionZoomOut: 'Zoom Out',
            seriesColors: 'Colors by Series',
            series: 'Series',
            selectExportFormat: 'Select Export Format',
            pngDesc: 'Lossless, supports transparency',
            jpgDesc: 'Lossy, smaller file size',
            webpDesc: 'Modern format, high compression',
            svgDesc: 'Vector, infinitely scalable',
            exportQuality: 'Export Quality',
            exportScale: 'Export Scale',
            exportSuccess: 'Export successful',
            exportError: 'Export failed',
            svgNotSupported: 'SVG export not supported for this chart'
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
                <span>${t.selectExportFormat}</span>
                <button class="close-export-menu">×</button>
            </div>
            <div class="export-formats">
                <button class="export-format-btn" data-format="png" data-mime="image/png">
                    <span class="format-icon">🖼️</span>
                    <span class="format-name">PNG</span>
                    <span class="format-desc">${t.pngDesc}</span>
                </button>
                <button class="export-format-btn" data-format="jpg" data-mime="image/jpeg">
                    <span class="format-icon">📷</span>
                    <span class="format-name">JPG / JPEG</span>
                    <span class="format-desc">${t.jpgDesc}</span>
                </button>
                <button class="export-format-btn" data-format="webp" data-mime="image/webp">
                    <span class="format-icon">🌐</span>
                    <span class="format-name">WebP</span>
                    <span class="format-desc">${t.webpDesc}</span>
                </button>
                ${chartInfo.type === 'echarts' ? `
                <button class="export-format-btn" data-format="svg" data-mime="image/svg+xml">
                    <span class="format-icon">📐</span>
                    <span class="format-name">SVG</span>
                    <span class="format-desc">${t.svgDesc}</span>
                </button>
                ` : ''}
            </div>
            <div class="export-quality-section">
                <label class="quality-label">
                    <span>${t.exportQuality}</span>
                    <span class="quality-value">90%</span>
                </label>
                <input type="range" class="quality-slider" min="10" max="100" value="90" step="5">
            </div>
            <div class="export-scale-section">
                <label class="scale-label">
                    <span>${t.exportScale}</span>
                    <span class="scale-value">2x</span>
                </label>
                <input type="range" class="scale-slider" min="1" max="4" value="2" step="0.5">
            </div>
        `;

        // Position menu with boundary checks
        menu.style.position = 'fixed';
        menu.style.zIndex = '10001';  // Must be higher than fullscreen z-index (9999)

        document.body.appendChild(menu);

        // Calculate position after appending to get actual dimensions
        const menuWidth = menu.offsetWidth;
        const menuHeight = menu.offsetHeight;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Calculate initial left position
        let leftPos = rect.left - menuWidth + rect.width;

        // Ensure menu doesn't go off the right edge
        if (leftPos + menuWidth > viewportWidth - 10) {
            leftPos = viewportWidth - menuWidth - 10;
        }

        // Ensure menu doesn't go off the left edge
        if (leftPos < 10) {
            leftPos = 10;
        }

        // Calculate top position
        let topPos = rect.bottom + 8;

        // If menu would go off bottom, show above the button
        if (topPos + menuHeight > viewportHeight - 10) {
            topPos = rect.top - menuHeight - 8;
        }

        // Ensure menu doesn't go off top edge
        if (topPos < 10) {
            topPos = 10;
        }

        menu.style.top = `${topPos}px`;
        menu.style.left = `${leftPos}px`;

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
    /**
     * Export chart with specified format
     */
    async exportChartWithFormat(slot, chartInfo, format, mimeType, quality, scale) {
        let dataUrl;

        try {
            // Pseudo 3D charts use graphic elements and need html2canvas for export
            const chartType = this.chartTypes.get(slot);
            const pseudo3DCharts = ['perspectiveBar3d', 'clusteredBar3d', 'stackedBar3d', 'percentStackedBar3d'];
            const isPseudo3DChart = pseudo3DCharts.includes(chartType);

            // Check if it's an HTML-based chart (metric, sparkline) or a specialized chart without getDataURL (table)
            // Also include pseudo 3D charts that use graphic elements
            const isHtmlChart = chartInfo.type === 'html' ||
                (chartInfo.type === 'echarts' && !chartInfo.instance.getDataURL) ||
                isPseudo3DChart;

            if (isHtmlChart) {
                if (format === 'svg') {
                    console.warn('SVG export not supported for HTML charts');
                    if (window.app) {
                        const t = window.app.getTranslations();
                        window.app.showToast(t.svgNotSupported, 'warning');
                    }
                    return;
                }

                if (!window.html2canvas) {
                    console.error('html2canvas not loaded');
                    if (window.app) {
                        window.app.showToast('html2canvas library missing', 'error');
                    }
                    return;
                }

                const element = document.getElementById(`echart-${slot}`);
                const container = document.getElementById(`chart-${slot}`);

                // Temporarily hide overlay and controls for clean export
                const overlay = container?.querySelector('.pseudo-3d-overlay');
                const controls = container?.querySelector('.chart-3d-controls');
                if (overlay) overlay.style.display = 'none';
                if (controls) controls.style.display = 'none';

                // Use html2canvas to capture the element
                const canvas = await html2canvas(element, {
                    scale: scale,
                    useCORS: true,
                    backgroundColor: (format === 'jpg' || format === 'jpeg') ? '#ffffff' : null,
                    logging: false
                });

                // Restore overlay and controls
                if (overlay) overlay.style.display = '';
                if (controls) controls.style.display = 'flex';

                dataUrl = canvas.toDataURL(mimeType, quality);

            } else if (chartInfo.type === 'chartjs') {
                const canvas = document.getElementById(`canvas-${slot}`);

                if (format === 'svg') {
                    console.warn('SVG export not supported for Chart.js');
                    if (window.app) {
                        const t = window.app.getTranslations();
                        window.app.showToast(t.svgNotSupported, 'warning');
                    }
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
                window.app.showToast(t.exportSuccess, 'success');
            }
        } catch (error) {
            console.error('Export failed:', error);
            if (window.app) {
                const t = window.app.getTranslations();
                window.app.showToast(t.exportError, 'error');
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
        // Use longer delay to ensure CSS transition completes
        setTimeout(() => {
            const chartInfo = this.charts.get(slot);
            const chartType = this.chartTypes.get(slot);

            if (chartInfo) {
                // For 3D charts using graphic elements, we need full re-render
                const complexGraphicCharts = [
                    'perspectiveBar3d',
                    'clusteredBar3d',
                    'stackedBar3d',
                    'percentStackedBar3d'
                ];

                if (chartInfo.type === 'echarts' && complexGraphicCharts.includes(chartType)) {
                    // Full re-render to recalculate pixel positions
                    this.renderChart(slot, chartType);
                } else if (chartInfo.type === 'chartjs') {
                    chartInfo.instance.resize();
                } else if (chartInfo.type === 'echarts' && chartInfo.instance.resize) {
                    chartInfo.instance.resize();
                }
            }
        }, 150);
    }

    // handleResize is defined at the top of the class (lines 28-52)
    // This duplicate has been removed
}

// Export
window.ChartRenderer = ChartRenderer;
