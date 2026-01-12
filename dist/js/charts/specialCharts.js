/**
 * Special Charts - 特殊图表实现
 * Waterfall, Timeline, Graph, Map, Parallel, Calendar, ThemeRiver
 * Using ECharts for advanced visualizations
 */

const SpecialCharts = {
    /**
     * Create a waterfall chart using ECharts
     * 瀑布图 - 显示数据的增减变化
     */
    createWaterfallChart(container, data, options = {}) {
        // 安全清理：如果容器已有 ECharts 实例，先销毁它
        const existingChart = echarts.getInstanceByDom(container);
        if (existingChart) {
            existingChart.dispose();
        }
        const chart = echarts.init(container);

        // Parse options - support both array (colors) and object format
        const customColors = Array.isArray(options) ? options : options?.customColors;
        const barWidth = options.barWidth || 20;
        const showLabel = options.showLabel !== undefined ? options.showLabel : true;
        const showValues = options.showValues !== undefined ? options.showValues : showLabel;

        // Data label styling options
        const labelFontSize = options.labelFontSize || 12;
        const labelFontWeight = options.labelFontWeight || 'bold';
        const labelColor = options.labelColor || '#333';

        // Dual color support: positive (increase), negative (decrease)
        // Waterfall typically uses Green for increase and Red for decrease (Western style) or Red/Green (Chinese style)
        // Here we default to Green/Red (Green=Up/Increase) as per original code
        // Dual color support
        // Use ChartColorsConfig for consistent dual color strategy
        let dualColors = ChartColorsConfig?.dualColorPresets?.greenRed || { positive: '#22c55e', negative: '#ef4444' };

        if (typeof ChartColorsConfig !== 'undefined') {
            // If getRecommendedColors suggests a dual palette, use it
            const rec = ChartColorsConfig.getRecommendedColors('waterfall', 2);
            if (rec && rec.length >= 2) dualColors = { positive: rec[0], negative: rec[1] };
        }

        const positiveColor = customColors && customColors[0] ? customColors[0] : dualColors.positive;
        const negativeColor = customColors && customColors[1] ? customColors[1] : dualColors.negative;

        const dataset = data.datasets[0] || { data: [] };
        const values = dataset.data;

        // Calculate waterfall data
        let cumulative = 0;
        const positiveData = [];
        const negativeData = [];
        const totalData = [];

        values.forEach((val, idx) => {
            if (idx === 0) {
                // First bar starts from 0
                positiveData.push(val);
                negativeData.push('-');
                totalData.push(0);
                cumulative = val;
            } else if (idx === values.length - 1) {
                // Last bar shows total
                positiveData.push('-');
                negativeData.push('-');
                totalData.push(cumulative + val);
            } else {
                if (val >= 0) {
                    positiveData.push(val);
                    negativeData.push('-');
                    totalData.push(cumulative);
                    cumulative += val;
                } else {
                    positiveData.push('-');
                    negativeData.push(Math.abs(val));
                    totalData.push(cumulative + val);
                    cumulative += val;
                }
            }
        });

        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderWidth: 0,
                textStyle: { color: '#fff' }
            },
            legend: {
                data: ['Increase', 'Decrease', 'Total']
            },
            grid: {
                left: '10%',
                right: '10%',
                bottom: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: data.labels,
                axisLine: { lineStyle: { color: '#ddd' } }
            },
            yAxis: {
                type: 'value',
                axisLine: { show: false },
                splitLine: { lineStyle: { color: '#eee' } },
                min: options.yAxisMin !== undefined && options.yAxisMin !== null ? options.yAxisMin : undefined,
                max: options.yAxisMax !== undefined && options.yAxisMax !== null ? options.yAxisMax : undefined,
                interval: options.yAxisStep !== undefined && options.yAxisStep !== null ? options.yAxisStep : undefined
            },
            dataZoom: [
                {
                    type: 'inside',
                    xAxisIndex: 0,
                    filterMode: 'filter',
                    zoomOnMouseWheel: false
                },
                {
                    type: 'slider',
                    xAxisIndex: 0,
                    filterMode: 'filter',
                    bottom: 10
                }
            ],
            series: [
                {
                    name: 'Helper',
                    type: 'bar',
                    stack: 'Total',
                    itemStyle: {
                        borderColor: 'transparent',
                        color: 'transparent'
                    },
                    emphasis: {
                        itemStyle: {
                            borderColor: 'transparent',
                            color: 'transparent'
                        }
                    },
                    data: totalData
                },
                {
                    name: 'Increase',
                    type: 'bar',
                    stack: 'Total',
                    barWidth: barWidth,
                    label: { show: showValues, position: 'top', fontSize: labelFontSize, fontWeight: labelFontWeight, color: labelColor },
                    itemStyle: { color: positiveColor },
                    data: positiveData
                },
                {
                    name: 'Decrease',
                    type: 'bar',
                    stack: 'Total',
                    barWidth: barWidth,
                    label: { show: showValues, position: 'bottom', fontSize: labelFontSize, fontWeight: labelFontWeight, color: labelColor },
                    itemStyle: { color: negativeColor },
                    data: negativeData
                }
            ]
        };

        chart.setOption(option, true);
        return chart;
    },

    /**
     * Create a timeline chart using ECharts
     * 时间轴图
     */
    createTimelineChart(container, data, options = {}) {
        // 安全清理：如果容器已有 ECharts 实例，先销毁它
        const existingChart = echarts.getInstanceByDom(container);
        if (existingChart) {
            existingChart.dispose();
        }
        const chart = echarts.init(container);

        const dataset = data.datasets[0] || { data: [] };

        // Parse options - support both array (colors) and object format
        const customColors = Array.isArray(options) ? options : options?.customColors;
        const smooth = options.smooth !== undefined ? options.smooth : 0.4;
        const lineWidth = options.lineWidth || 3;
        const symbolSize = options.symbolSize || 8;
        const areaOpacity = options.areaOpacity !== undefined ? options.areaOpacity : 0.2;
        const showValues = options.showValues !== undefined ? options.showValues : false;

        // Data label styling options
        const labelFontSize = options.labelFontSize || 12;
        const labelFontWeight = options.labelFontWeight || 'bold';
        const labelColor = options.labelColor || '#333';

        let colors;
        if (customColors && customColors.length > 0) {
            colors = BasicCharts.generateColors(customColors, data.datasets.length);
        } else {
            colors = BasicCharts.getColorPalette(data.datasets.length);
        }

        const option = {
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderWidth: 0,
                textStyle: { color: '#fff' }
            },
            grid: {
                left: '10%',
                right: '10%',
                bottom: '20%'
            },
            xAxis: {
                type: 'category',
                data: data.labels,
                axisLine: { lineStyle: { color: '#ddd' } },
                axisTick: { alignWithLabel: true }
            },
            yAxis: {
                type: 'value',
                axisLine: { show: false },
                splitLine: { lineStyle: { color: '#eee' } },
                min: options.yAxisMin !== undefined && options.yAxisMin !== null ? options.yAxisMin : undefined,
                max: options.yAxisMax !== undefined && options.yAxisMax !== null ? options.yAxisMax : undefined,
                interval: options.yAxisStep !== undefined && options.yAxisStep !== null ? options.yAxisStep : undefined
            },
            dataZoom: [
                {
                    type: 'slider',
                    xAxisIndex: 0,
                    filterMode: 'filter',
                    height: 20,
                    bottom: 10,
                    handleSize: '100%'
                },
                {
                    type: 'inside',
                    xAxisIndex: 0,
                    filterMode: 'filter',
                    zoomOnMouseWheel: false
                }
            ],
            series: data.datasets.map((ds, i) => ({
                name: ds.label || `Series ${i + 1}`,
                type: 'line',
                smooth: smooth,
                symbol: 'circle',
                symbolSize: symbolSize,
                data: ds.data,
                label: {
                    show: showValues,
                    position: 'top',
                    formatter: '{c}',
                    fontSize: labelFontSize,
                    fontWeight: labelFontWeight,
                    color: labelColor
                },
                lineStyle: {
                    width: lineWidth,
                    color: colors[i]
                },
                areaStyle: {
                    opacity: areaOpacity,
                    color: colors[i]
                },
                itemStyle: {
                    color: colors[i]
                }
            }))
        };

        chart.setOption(option, true);
        return chart;
    },

    /**
     * Create a graph/network chart using ECharts
     * 关系图/网络图
     */
    createGraphChart(container, data, options = {}) {
        // 安全清理：如果容器已有 ECharts 实例，先销毁它
        const existingChart = echarts.getInstanceByDom(container);
        if (existingChart) {
            existingChart.dispose();
        }
        const chart = echarts.init(container);

        // Parse options - support both array (colors) and object format
        const customColors = Array.isArray(options) ? options : options?.customColors;
        const symbolSize = options.symbolSize || 30;
        const repulsion = options.repulsion || 200;
        const edgeLength = options.edgeLength || 100;
        const curveness = options.curveness !== undefined ? options.curveness : 0.3;
        const showValues = options.showValues !== undefined ? options.showValues : true;

        // Data label styling options
        const labelFontSize = options.labelFontSize || 12;
        const labelFontWeight = options.labelFontWeight || 'bold';
        const labelColor = options.labelColor || '#333';

        // Convert data to graph format
        let graphData;
        if (data.nodes && data.links) {
            graphData = data;
        } else {
            // Create nodes from labels
            const nodes = data.labels.map((label, i) => ({
                id: String(i),
                name: label,
                symbolSize: symbolSize + (data.datasets[0]?.data[i] || 10) / 5,
                category: i % 3
            }));

            // Create links between consecutive nodes
            const links = [];
            for (let i = 0; i < nodes.length - 1; i++) {
                links.push({
                    source: String(i),
                    target: String(i + 1),
                    value: data.datasets[0]?.data[i] || 10
                });
            }
            // Add some cross links
            if (nodes.length > 2) {
                links.push({
                    source: '0',
                    target: String(nodes.length - 1),
                    value: 5
                });
            }

            graphData = { nodes, links };
        }

        let colors;
        if (customColors && customColors.length > 0) {
            colors = BasicCharts.generateColors(customColors, 3);
        } else {
            colors = BasicCharts.getColorPalette(3);
        }

        const option = {
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderWidth: 0,
                textStyle: { color: '#fff' }
            },
            legend: {
                data: ['Category A', 'Category B', 'Category C']
            },
            series: [{
                type: 'graph',
                layout: 'force',
                data: graphData.nodes,
                links: graphData.links,
                categories: [
                    { name: 'Category A', itemStyle: { color: colors[0] } },
                    { name: 'Category B', itemStyle: { color: colors[1] } },
                    { name: 'Category C', itemStyle: { color: colors[2] } }
                ],
                roam: true,
                label: {
                    show: showValues,
                    position: 'right',
                    formatter: '{b}',
                    fontSize: labelFontSize,
                    fontWeight: labelFontWeight,
                    color: labelColor
                },
                labelLayout: {
                    hideOverlap: true
                },
                scaleLimit: {
                    min: 0.4,
                    max: 2
                },
                lineStyle: {
                    color: 'source',
                    curveness: curveness
                },
                emphasis: {
                    focus: 'adjacency',
                    lineStyle: {
                        width: 5
                    }
                },
                force: {
                    repulsion: repulsion,
                    edgeLength: edgeLength
                }
            }]
        };

        chart.setOption(option, true);
        return chart;
    },

    /**
     * Create a simple map chart using ECharts
     * 简单地图 - 注意：需要加载地图数据
     */
    createMapChart(container, data, options = {}) {
        // 安全清理：如果容器已有 ECharts 实例，先销毁它
        const existingChart = echarts.getInstanceByDom(container);
        if (existingChart) {
            existingChart.dispose();
        }
        const chart = echarts.init(container);

        // Parse options - support both array (colors) and object format
        const customColors = Array.isArray(options) ? options : options?.customColors;
        const symbolSize = options.symbolSize || 50;

        // Custom gradient colors for visualMap
        // Use ChartColorsConfig.getRecommendedColors for map gradients if available
        let gradientColors = ChartColorsConfig?.gradientPresets?.coolWarm?.colors || ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e'];

        if (customColors && customColors.length >= 2) {
            gradientColors = customColors;
        } else if (typeof ChartColorsConfig !== 'undefined') {
            const rec = ChartColorsConfig.getRecommendedColors('map', 4);
            if (rec && rec.length >= 2) gradientColors = rec;
        }

        const scatterColor = customColors && customColors[0] ? customColors[0] : (ChartColorsConfig?.presets?.default?.colors[0] || '#6366f1');

        // Since we may not have China map geo data loaded,
        // we'll create a scatter geo simulation
        const dataset = data.datasets[0] || { data: [] };

        // Create scatter data with simulated geo positions
        const scatterData = data.labels.map((label, i) => ({
            name: label,
            value: [
                100 + (i % 5) * 10 + Math.random() * 5,  // lng
                25 + Math.floor(i / 5) * 8 + Math.random() * 5,  // lat
                dataset.data[i] || 0
            ]
        }));

        const maxVal = Math.max(...dataset.data);

        const option = {
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    return `${params.name}: ${params.value[2]}`;
                },
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderWidth: 0,
                textStyle: { color: '#fff' }
            },
            visualMap: {
                min: 0,
                max: maxVal,
                calculable: true,
                inRange: {
                    color: gradientColors
                },
                textStyle: { color: '#333' }
            },
            geo: {
                map: 'china',
                roam: true,
                label: {
                    show: true,
                    color: '#333'
                },
                itemStyle: {
                    areaColor: '#e5e7eb',
                    borderColor: '#9ca3af'
                },
                emphasis: {
                    itemStyle: {
                        areaColor: '#fbbf24'
                    }
                }
            },
            series: [{
                name: 'Data',
                type: 'scatter',
                coordinateSystem: 'geo',
                data: scatterData,
                symbolSize: function (val) {
                    return Math.max(10, val[2] / maxVal * symbolSize);
                },
                encode: {
                    value: 2
                },
                label: {
                    formatter: '{b}',
                    position: 'right',
                    show: false
                },
                itemStyle: {
                    color: scatterColor
                },
                emphasis: {
                    label: {
                        show: true
                    }
                }
            }]
        };

        // Check if geo map is available
        if (!echarts.getMap('china')) {
            // Fallback to bar chart representation
            option.geo = undefined;
            option.series = [{
                type: 'bar',
                data: dataset.data,
                itemStyle: {
                    color: function (params) {
                        const customColors = Array.isArray(options) ? options : options?.customColors;
                        const colors = (customColors && customColors.length > 0)
                            ? BasicCharts.generateColors(customColors, data.labels.length)
                            : BasicCharts.getColorPalette(data.labels.length);
                        return colors[params.dataIndex % colors.length];
                    }
                }
            }];
            option.xAxis = {
                type: 'category',
                data: data.labels,
                axisLabel: { rotate: 45 }
            };
            option.yAxis = { type: 'value' };
            option.visualMap = undefined;
            option.title = {
                text: 'Map Data (geo resource required)',
                left: 'center',
                textStyle: { color: '#999', fontSize: 14 }
            };
        }

        chart.setOption(option, true);
        return chart;
    },

    /**
     * Create a parallel coordinates chart using ECharts
     * 平行坐标图 - 多维数据可视化
     */
    createParallelChart(container, data, options = {}) {
        // 安全清理：如果容器已有 ECharts 实例，先销毁它
        const existingChart = echarts.getInstanceByDom(container);
        if (existingChart) {
            existingChart.dispose();
        }
        const chart = echarts.init(container);

        // Parse options - support both array (colors) and object format
        const customColors = Array.isArray(options) ? options : options?.customColors;
        const lineWidth = options.lineWidth || 2;
        const opacity = options.opacity !== undefined ? options.opacity : 0.7;
        const showValues = options.showValues !== undefined ? options.showValues : false;

        // Create parallel axis for each label
        // Create parallel axis for each label with dynamic max/min calculation
        const parallelAxis = data.labels.map((label, i) => {
            // Find min/max values for this dimension across all datasets
            let maxVal = -Infinity;
            let minVal = Infinity;
            let hasData = false;

            data.datasets.forEach(ds => {
                const val = Number(ds.data[i]);
                if (!isNaN(val)) {
                    hasData = true;
                    if (val > maxVal) maxVal = val;
                    if (val < minVal) minVal = val;
                }
            });

            // If no valid data found for this dimension, set default range
            if (!hasData) {
                maxVal = 100;
                minVal = 0;
            }

            // Determine axis min/max
            // Standardize min to 0 if data is positive, otherwise follow data min
            const axisMin = minVal >= 0 ? 0 : Math.floor(minVal);
            // Ensure max covers the data
            const axisMax = Math.ceil(maxVal);

            return {
                dim: i,
                name: label,
                nameLocation: 'end',
                min: axisMin,
                max: axisMax,
                nameTextStyle: {
                    fontSize: 12
                }
            };
        });

        let colors;
        if (customColors && customColors.length > 0) {
            colors = BasicCharts.generateColors(customColors, data.datasets.length);
        } else {
            colors = BasicCharts.getColorPalette(data.datasets.length);
        }

        const option = {
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderWidth: 0,
                textStyle: { color: '#fff' }
            },
            legend: {
                data: data.datasets.map(ds => ds.label),
                top: 10
            },
            parallelAxis: parallelAxis,
            parallel: {
                left: '10%',
                right: '10%',
                bottom: '10%',
                top: '15%',
                parallelAxisDefault: {
                    type: 'value',
                    nameLocation: 'end',
                    nameGap: 20
                }
            },
            series: data.datasets.map((ds, i) => ({
                name: ds.label || `Series ${i + 1}`,
                type: 'parallel',
                lineStyle: {
                    width: lineWidth,
                    color: colors[i],
                    opacity: opacity
                },
                emphasis: {
                    lineStyle: {
                        width: lineWidth + 2,
                        opacity: 1
                    }
                },
                data: [ds.data],
                label: {
                    show: showValues
                }
            }))
        };

        chart.setOption(option, true);
        return chart;
    },

    /**
     * Create a calendar heatmap chart using ECharts
     * 日历热力图
     */
    createCalendarChart(container, data, options = {}) {
        // 安全清理：如果容器已有 ECharts 实例，先销毁它
        const existingChart = echarts.getInstanceByDom(container);
        if (existingChart) {
            existingChart.dispose();
        }
        const chart = echarts.init(container);

        // Parse options - support both array (colors) and object format
        const customColors = Array.isArray(options) ? options : options?.customColors;
        const cellSize = options.cellSize || 15;
        const borderWidth = options.borderWidth !== undefined ? options.borderWidth : 2;
        const showValues = options.showValues !== undefined ? options.showValues : false;

        // Gradient colors for calendar heatmap
        let gradientColors = ChartColorsConfig?.gradientPresets?.greenScale?.colors || ['#f0fdf4', '#bbf7d0', '#4ade80', '#22c55e', '#15803d'];

        if (customColors && customColors.length >= 2) {
            gradientColors = customColors;
        } else if (typeof ChartColorsConfig !== 'undefined') {
            const rec = ChartColorsConfig.getRecommendedColors('calendar', 5);
            if (rec && rec.length >= 2) gradientColors = rec;
        }

        // Generate calendar data from input
        const dataset = data.datasets[0] || { data: [] };
        const year = new Date().getFullYear();

        // Create calendar data
        const calendarData = [];
        const startDate = new Date(year, 0, 1);

        data.labels.forEach((label, i) => {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i * 7); // Weekly data
            calendarData.push([
                date.toISOString().split('T')[0],
                dataset.data[i] || 0
            ]);
        });

        // If not enough data, generate random data for demo
        if (calendarData.length < 30) {
            for (let i = 0; i < 365; i++) {
                const date = new Date(year, 0, 1);
                date.setDate(date.getDate() + i);
                calendarData.push([
                    date.toISOString().split('T')[0],
                    Math.floor(Math.random() * 100)
                ]);
            }
        }

        const maxVal = Math.max(...calendarData.map(d => d[1]));

        const option = {
            tooltip: {
                formatter: function (params) {
                    return `${params.value[0]}: ${params.value[1]}`;
                },
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderWidth: 0,
                textStyle: { color: '#fff' }
            },
            visualMap: {
                min: 0,
                max: maxVal,
                calculable: true,
                orient: 'horizontal',
                left: 'center',
                bottom: 20,
                inRange: {
                    color: gradientColors
                }
            },
            calendar: {
                top: 60,
                left: 50,
                right: 50,
                cellSize: ['auto', cellSize],
                range: year,
                itemStyle: {
                    borderWidth: borderWidth,
                    borderColor: '#fff'
                },
                yearLabel: { show: true },
                dayLabel: {
                    firstDay: 1,
                    nameMap: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
                },
                monthLabel: {
                    nameMap: 'en'
                }
            },
            series: [{
                type: 'heatmap',
                coordinateSystem: 'calendar',
                data: calendarData,
                label: {
                    show: showValues,
                    formatter: (params) => params.value[1]
                }
            }]
        };

        chart.setOption(option, true);
        return chart;
    },

    /**
     * Create a theme river chart using ECharts
     * 河流图/主题河流
     */
    createThemeRiverChart(container, data, options = {}) {
        // 安全清理：如果容器已有 ECharts 实例，先销毁它
        const existingChart = echarts.getInstanceByDom(container);
        if (existingChart) {
            existingChart.dispose();
        }
        const chart = echarts.init(container);

        // Parse options - support both array (colors) and object format
        const customColors = Array.isArray(options) ? options : options?.customColors;
        const seriesColors = options?.seriesColors || {};
        const showValues = options.showValues !== undefined ? options.showValues : false;

        // Build colors array - prioritize seriesColors over customColors
        let colors;
        if (customColors && customColors.length > 0) {
            colors = BasicCharts.generateColors(customColors, data.datasets.length);
        } else {
            colors = BasicCharts.getColorPalette(data.datasets.length);
        }

        // Apply per-series colors if set
        if (Object.keys(seriesColors).length > 0) {
            const defaultColors = BasicCharts.getColorPalette(data.datasets.length);
            colors = defaultColors.map((c, i) => seriesColors[i] || c);
        }

        // Get all series names
        const seriesNames = data.datasets.map(ds => ds.label || 'Data');

        // Convert to theme river format: [time/index, value, seriesName]
        // themeRiver requires numeric or date values for the first dimension
        const riverData = [];
        data.labels.forEach((label, i) => {
            data.datasets.forEach(ds => {
                riverData.push([
                    i,  // Use numeric index instead of category label
                    ds.data[i] || 0,
                    ds.label || 'Data'
                ]);
            });
        });

        const option = {
            color: colors,  // Colors must be at top level for themeRiver
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: 'rgba(0,0,0,0.2)',
                        width: 1,
                        type: 'solid'
                    }
                },
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderWidth: 0,
                textStyle: { color: '#fff' },
                formatter: function (params) {
                    if (!params || params.length === 0) return '';
                    const idx = params[0].value[0];
                    const label = data.labels[idx] || idx;
                    let result = `<strong>${label}</strong><br/>`;
                    params.forEach(p => {
                        result += `${p.marker} ${p.value[2]}: ${p.value[1]}<br/>`;
                    });
                    return result;
                }
            },
            legend: {
                data: seriesNames,
                top: 5
            },
            singleAxis: {
                type: 'value',
                top: 50,
                bottom: 50,
                left: 50,
                right: 50,
                min: 0,
                max: data.labels.length - 1,
                axisLabel: {
                    formatter: function (value) {
                        return data.labels[Math.round(value)] || value;
                    }
                }
            },
            series: [{
                type: 'themeRiver',
                emphasis: {
                    itemStyle: {
                        shadowBlur: 20,
                        shadowColor: 'rgba(0, 0, 0, 0.8)'
                    }
                },
                data: riverData,
                label: {
                    show: showValues,
                    position: 'inside'
                }
            }]
        };

        chart.setOption(option, true);
        return chart;
    },

    /**
     * Create a pictorial bar chart using ECharts
     * 象形柱图
     */
    createPictorialBarChart(container, data, options = {}) {
        // 安全清理：如果容器已有 ECharts 实例，先销毁它
        const existingChart = echarts.getInstanceByDom(container);
        if (existingChart) {
            existingChart.dispose();
        }
        const chart = echarts.init(container);

        const dataset = data.datasets[0] || { data: [] };
        // Support custom colors from options
        const customColors = Array.isArray(options) ? options : options?.customColors;
        const symbolSize = options.symbolSize || 20;
        const symbolMargin = options.symbolMargin || 2;
        const showValues = options.showValues !== undefined ? options.showValues : true;

        // Data label styling options
        const labelFontSize = options.labelFontSize || 12;
        const labelFontWeight = options.labelFontWeight || 'bold';
        const labelColor = options.labelColor || '#333';

        let colors;
        if (customColors && customColors.length > 0) {
            colors = BasicCharts.generateColors(customColors, data.labels.length);
        } else {
            colors = BasicCharts.getColorPalette(data.labels.length);
        }

        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderWidth: 0,
                textStyle: { color: '#fff' }
            },
            grid: {
                left: '15%',
                right: '10%',
                bottom: '10%',
                top: '10%'
            },
            xAxis: {
                type: 'value',
                axisLine: { show: false },
                axisTick: { show: false },
                splitLine: { lineStyle: { color: '#eee' } },
                min: options.xAxisMin !== undefined && options.xAxisMin !== null ? options.xAxisMin : undefined,
                max: options.xAxisMax !== undefined && options.xAxisMax !== null ? options.xAxisMax : undefined,
                interval: options.yAxisStep !== undefined && options.yAxisStep !== null ? options.yAxisStep : undefined
            },
            yAxis: {
                type: 'category',
                data: data.labels,
                axisLine: { show: false },
                axisTick: { show: false }
            },
            dataZoom: [
                {
                    type: 'inside',
                    xAxisIndex: 0,
                    filterMode: 'filter',
                    zoomOnMouseWheel: false
                },
                {
                    type: 'slider',
                    xAxisIndex: 0,
                    filterMode: 'filter',
                    bottom: 10
                }
            ],
            series: [{
                type: 'pictorialBar',
                symbol: 'roundRect',
                symbolRepeat: true,
                symbolSize: [symbolSize, symbolSize * 0.4],
                symbolMargin: symbolMargin,
                data: dataset.data.map((val, i) => ({
                    value: val,
                    itemStyle: { color: colors[i] }
                })),
                label: {
                    show: showValues,
                    position: 'right',
                    formatter: '{c}',
                    fontSize: labelFontSize,
                    fontWeight: labelFontWeight,
                    color: labelColor
                }
            }]
        };

        chart.setOption(option, true);
        return chart;
    },

    /**
     * Create a liquid fill chart using ECharts
     * 水球图 - 百分比展示
     */
    createLiquidChart(container, data, options = {}) {
        // 安全清理：如果容器已有 ECharts 实例，先销毁它
        const existingChart = echarts.getInstanceByDom(container);
        if (existingChart) {
            existingChart.dispose();
        }
        const chart = echarts.init(container);

        const dataset = data.datasets[0] || { data: [50] };
        const value = dataset.data[0] || 50;
        const maxVal = Math.max(...dataset.data) || 100;
        const percentage = value / maxVal;

        // Parse options
        const customColors = Array.isArray(options) ? options : options?.customColors;
        const progressWidth = options.progressWidth || 30;
        const roundCap = options.roundCap !== undefined ? options.roundCap : true;
        const showValues = options.showValues !== undefined ? options.showValues : true;
        const color1 = customColors && customColors[0] ? customColors[0] : '#6366f1';
        const color2 = customColors && customColors[1] ? customColors[1] : '#8b5cf6';

        // Liquid fill requires extension, fallback to gauge
        const option = {
            series: [{
                type: 'gauge',
                startAngle: 90,
                endAngle: -270,
                pointer: { show: false },
                progress: {
                    show: true,
                    overlap: false,
                    roundCap: roundCap,
                    clip: false,
                    itemStyle: {
                        color: {
                            type: 'linear',
                            x: 0, y: 0, x2: 0, y2: 1,
                            colorStops: [
                                { offset: 0, color: color1 },
                                { offset: 1, color: color2 }
                            ]
                        }
                    }
                },
                axisLine: {
                    lineStyle: {
                        width: progressWidth,
                        color: [[1, '#e5e7eb']]
                    }
                },
                splitLine: { show: false },
                axisTick: { show: false },
                axisLabel: { show: false },
                data: [{
                    value: Math.round(percentage * 100),
                    name: dataset.label || 'Progress',
                    title: {
                        show: showValues,
                        offsetCenter: ['0%', '30%'],
                        fontSize: 16,
                        color: '#666'
                    },
                    detail: {
                        show: showValues,
                        offsetCenter: ['0%', '-10%'],
                        fontSize: 40,
                        fontWeight: 'bold',
                        formatter: '{value}%',
                        color: color1
                    }
                }]
            }]
        };

        chart.setOption(option, true);
        return chart;
    }
};

// Export
window.SpecialCharts = SpecialCharts;
