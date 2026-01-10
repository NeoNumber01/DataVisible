/**
 * Financial Charts - 金融图表实现
 * K-Line/Candlestick, Effect Scatter, etc.
 */

const FinancialCharts = {
    /**
     * Create a candlestick/K-line chart
     * K线图 - 股票蜡烛图
     */
    createCandlestickChart(container, data, options = {}) {
        const chart = echarts.init(container);

        // Parse options - support both array (colors) and object format
        const customColors = Array.isArray(options) ? options : options?.customColors;
        const maPeriod1 = options.maPeriod1 || 5;
        const maPeriod2 = options.maPeriod2 || 10;
        const showValues = options.showValues !== undefined ? options.showValues : false;

        // Data label styling options
        const labelFontSize = options.labelFontSize || 12;
        const labelFontWeight = options.labelFontWeight || 'bold';
        const labelColor = options.labelColor || 'inherit'; // Inherit from item color by default for K-line

        // Dual color support: positive (up), negative (down)
        // Use ChartColorsConfig for consistent dual color strategy
        let dualColors = { positive: '#ef4444', negative: '#22c55e' }; // Default Red/Green

        if (typeof ChartColorsConfig !== 'undefined') {
            // If getRecommendedColors suggests a dual palette, use it
            const rec = ChartColorsConfig.getRecommendedColors('candlestick', 2);
            if (rec && rec.length >= 2) {
                // Assuming the config returns [positive, negative] for candlestick
                dualColors = { positive: rec[0], negative: rec[1] };
            } else if (ChartColorsConfig.dualColorPresets && ChartColorsConfig.dualColorPresets.redGreen) {
                dualColors = ChartColorsConfig.dualColorPresets.redGreen;
            }
        }

        const upColor = customColors && customColors[0] ? customColors[0] : dualColors.positive;
        const downColor = customColors && customColors[1] ? customColors[1] : dualColors.negative;

        // Convert data to OHLC format (Open, Close, Low, High)
        // If standard format, simulate OHLC from values
        let ohlcData;
        if (data.datasets[0]?.ohlc) {
            ohlcData = data.datasets[0].ohlc;
        } else {
            // Generate simulated OHLC from single values
            const values = data.datasets[0]?.data || [];
            ohlcData = values.map((val, i) => {
                // Determine trend based on previous value to make it look more realistic
                const prevVal = i > 0 ? values[i - 1] : val;

                // Randomize open price more significantly (+/- 5-15% variance)
                // Use a deterministic-like random to keep it consistent on re-renders if possible, 
                // but Math.random() is fine for now.
                // We ensure open is at least 3% different from close (val) to show a body
                let direction = Math.random() > 0.5 ? 1 : -1;
                let variance = 0.03 + Math.random() * 0.12; // 3% to 15%

                const open = val * (1 + direction * variance);
                const close = val;

                // Ensure High/Low envelop the body
                const bodyMin = Math.min(open, close);
                const bodyMax = Math.max(open, close);

                const low = bodyMin * (0.92 + Math.random() * 0.05); // 3-8% below body min
                const high = bodyMax * (1.03 + Math.random() * 0.05); // 3-8% above body max

                return [open, close, low, high];
            });
        }

        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'cross' },
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderWidth: 0,
                textStyle: { color: '#fff' }
            },
            legend: {
                data: ['Candlestick', `MA${maPeriod1}`, `MA${maPeriod2}`]
            },
            grid: {
                left: '10%',
                right: '10%',
                bottom: '15%'
            },
            xAxis: {
                type: 'category',
                data: data.labels,
                axisLine: { lineStyle: { color: '#8392A5' } }
            },
            yAxis: {
                scale: true,
                axisLine: { lineStyle: { color: '#8392A5' } },
                splitLine: { lineStyle: { color: '#eee' } },
                min: options.yAxisMin !== undefined && options.yAxisMin !== null ? options.yAxisMin : undefined,
                max: options.yAxisMax !== undefined && options.yAxisMax !== null ? options.yAxisMax : undefined,
                interval: options.yAxisStep !== undefined && options.yAxisStep !== null ? options.yAxisStep : undefined
            },
            dataZoom: [
                {
                    type: 'inside',
                    start: 50,
                    end: 100,
                    zoomOnMouseWheel: false
                },
                {
                    show: true,
                    type: 'slider',
                    bottom: 10,
                    start: 50,
                    end: 100
                }
            ],
            series: [
                {
                    name: 'Candlestick',
                    type: 'candlestick',
                    data: ohlcData,
                    label: {
                        show: showValues,
                        position: 'top',
                        formatter: (params) => params.value ? params.value[1] : '',
                        fontSize: labelFontSize,
                        fontWeight: labelFontWeight,
                        color: labelColor
                    },
                    itemStyle: {
                        color: upColor,      // 涨
                        color0: downColor,   // 跌
                        borderColor: upColor,
                        borderColor0: downColor
                    }
                },
                {
                    name: `MA${maPeriod1}`,
                    type: 'line',
                    data: this.calculateMA(maPeriod1, ohlcData),
                    smooth: true,
                    lineStyle: { opacity: 0.5, width: 2 },
                    itemStyle: { color: '#6366f1' }
                },
                {
                    name: `MA${maPeriod2}`,
                    type: 'line',
                    data: this.calculateMA(maPeriod2, ohlcData),
                    smooth: true,
                    lineStyle: { opacity: 0.5, width: 2 },
                    itemStyle: { color: '#f97316' }
                }
            ]
        };

        chart.setOption(option);
        return chart;
    },

    /**
     * Calculate Moving Average
     */
    calculateMA(dayCount, data) {
        const result = [];
        for (let i = 0; i < data.length; i++) {
            if (i < dayCount - 1) {
                result.push('-');
                continue;
            }
            let sum = 0;
            for (let j = 0; j < dayCount; j++) {
                sum += data[i - j][1]; // Close price
            }
            result.push((sum / dayCount).toFixed(2));
        }
        return result;
    },

    /**
     * Create an effect scatter chart
     * 涟漪散点图 - 带动画效果
     */
    createEffectScatterChart(container, data, options = {}) {
        const chart = echarts.init(container);

        const dataset = data.datasets[0] || { data: [] };
        const maxVal = Math.max(...dataset.data);

        // Parse options - support both array (colors) and object format
        const customColors = Array.isArray(options) ? options : options?.customColors;
        const rippleScale = options.rippleScale || 3;
        const symbolSize = options.symbolSize || 20;
        const rippleType = options.rippleType || 'stroke';
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

        const scatterData = data.labels.map((label, i) => ({
            name: label,
            value: [i, dataset.data[i] || 0],
            symbolSize: Math.max(10, (dataset.data[i] / maxVal) * symbolSize),
            itemStyle: { color: colors[i] }
        }));

        const option = {
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c}',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderWidth: 0,
                textStyle: { color: '#fff' }
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
            series: [{
                type: 'effectScatter',
                data: scatterData,
                rippleEffect: {
                    brushType: rippleType,
                    scale: rippleScale
                },
                label: {
                    show: showValues,
                    formatter: '{b}',
                    position: 'top',
                    fontSize: labelFontSize,
                    fontWeight: labelFontWeight,
                    color: labelColor
                },
                emphasis: {
                    scale: true
                }
            }]
        };

        chart.setOption(option);
        return chart;
    },

    /**
     * Create a bullet chart
     * 子弹图 - 目标进度对比
     */
    createBulletChart(container, data, options = {}) {
        const chart = echarts.init(container);

        // Support custom colors from options
        const customColors = Array.isArray(options) ? options : options?.customColors;
        const barWidth = options.barWidth || 15;
        const targetWidth = options.targetWidth || 30;
        const showValues = options.showValues !== undefined ? options.showValues : true;

        // Data label styling options
        const labelFontSize = options.labelFontSize || 12;
        const labelFontWeight = options.labelFontWeight || 'bold';
        const labelColor = options.labelColor || '#333';

        let colors;
        if (customColors && customColors.length > 0) {
            colors = BasicCharts.generateColors(customColors, 2);
        } else {
            colors = BasicCharts.getColorPalette(2);
        }
        const dataset = data.datasets[0] || { data: [] };
        const targetData = data.datasets[1]?.data || dataset.data.map(v => v * 1.2);

        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderWidth: 0,
                textStyle: { color: '#fff' }
            },
            legend: {
                data: ['Actual', 'Target']
            },
            grid: {
                left: '15%',
                right: '10%',
                bottom: '10%'
            },
            xAxis: {
                type: 'value',
                axisLine: { show: false },
                splitLine: { lineStyle: { color: '#eee' } },
                min: options.xAxisMin !== undefined && options.xAxisMin !== null ? options.xAxisMin : undefined,
                max: options.xAxisMax !== undefined && options.xAxisMax !== null ? options.xAxisMax : undefined,
                interval: options.yAxisStep !== undefined && options.yAxisStep !== null ? options.yAxisStep : undefined // Map yAxisStep to value axis (which is x here)
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
            series: [
                {
                    name: 'Target',
                    type: 'bar',
                    barWidth: targetWidth,
                    z: 1,
                    data: targetData,
                    itemStyle: {
                        color: '#e5e7eb'
                    }
                },
                {
                    name: 'Actual',
                    type: 'bar',
                    barWidth: barWidth,
                    z: 2,
                    data: dataset.data,
                    itemStyle: {
                        color: colors[0]
                    },
                    label: {
                        show: showValues,
                        position: 'right',
                        formatter: '{c}',
                        fontSize: labelFontSize,
                        fontWeight: labelFontWeight,
                        color: labelColor
                    }
                }
            ]
        };

        chart.setOption(option);
        return chart;
    },

    /**
     * Create a step line chart
     * 步骤图/阶梯图
     */
    createStepLineChart(container, data, options = {}) {
        const chart = echarts.init(container);

        // Parse options - support both array (colors) and object format
        const customColors = Array.isArray(options) ? options : options?.customColors;
        const lineWidth = options.lineWidth || 3;
        const areaOpacity = options.areaOpacity !== undefined ? options.areaOpacity : 0.1;
        const step = options.step || 'middle';
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
            legend: {
                data: data.datasets.map(ds => ds.label)
            },
            grid: {
                left: '10%',
                right: '10%',
                bottom: '10%'
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
            series: data.datasets.map((ds, i) => ({
                name: ds.label || `Series ${i + 1}`,
                type: 'line',
                step: step,
                data: ds.data,
                lineStyle: { width: lineWidth, color: colors[i] },
                itemStyle: { color: colors[i] },
                areaStyle: { opacity: areaOpacity },
                label: {
                    show: showValues,
                    position: 'top',
                    formatter: '{c}',
                    fontSize: labelFontSize,
                    fontWeight: labelFontWeight,
                    color: labelColor
                }
            }))
        };

        chart.setOption(option);
        return chart;
    },

    /**
     * Create a histogram chart
     * 直方图 - 数据分布
     */
    createHistogramChart(container, data, options = {}) {
        const chart = echarts.init(container);

        // Parse options - support both array (colors) and object format
        const customColors = Array.isArray(options) ? options : options?.customColors;
        const binCount = options.binCount || 10;
        const showValues = options.showValues !== undefined ? options.showValues : (options.showLabel !== undefined ? options.showLabel : false);

        // Data label styling options
        const labelFontSize = options.labelFontSize || 12;
        const labelFontWeight = options.labelFontWeight || 'bold';
        const labelColor = options.labelColor || '#333';

        // Custom gradient colors
        let color1, color2;
        if (customColors && customColors.length >= 2) {
            color1 = customColors[0];
            color2 = customColors[1];
        } else if (customColors && customColors.length === 1) {
            color1 = customColors[0];
            color2 = BasicCharts.hexToRgba(color1, 0.6);
        } else {
            color1 = '#6366f1';
            color2 = '#8b5cf6';
        }

        const allValues = data.datasets.flatMap(ds => ds.data);
        const min = Math.min(...allValues);
        const max = Math.max(...allValues);
        const binSize = (max - min) / binCount;

        // Calculate histogram bins
        const bins = new Array(binCount).fill(0);
        allValues.forEach(val => {
            const binIndex = Math.min(Math.floor((val - min) / binSize), binCount - 1);
            bins[binIndex]++;
        });

        const binLabels = bins.map((_, i) => {
            const start = (min + i * binSize).toFixed(1);
            const end = (min + (i + 1) * binSize).toFixed(1);
            return `${start}-${end}`;
        });

        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderWidth: 0,
                textStyle: { color: '#fff' },
                formatter: function (params) {
                    return `${params[0].name}<br/>Frequency: ${params[0].value}`;
                }
            },
            grid: {
                left: '10%',
                right: '10%',
                bottom: '15%'
            },
            xAxis: {
                type: 'category',
                data: binLabels,
                axisLabel: { rotate: 45 },
                axisLine: { lineStyle: { color: '#ddd' } }
            },
            yAxis: {
                type: 'value',
                name: 'Frequency',
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
            series: [{
                type: 'bar',
                data: bins,
                barWidth: '90%',
                label: {
                    show: showValues,
                    position: 'top',
                    fontSize: labelFontSize,
                    fontWeight: labelFontWeight,
                    color: labelColor
                },
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
            }]
        };

        chart.setOption(option);
        return chart;
    },

    /**
     * Create a tree chart
     * 树图 - 层级结构
     */
    createTreeChart(container, data, options = {}) {
        const chart = echarts.init(container);

        // Parse options - support both array (colors) and object format
        const customColors = Array.isArray(options) ? options : options?.customColors;
        const symbolSize = options.symbolSize || 10;
        const orient = options.orient || 'LR';
        const expandAndCollapse = options.expandAndCollapse !== undefined ? options.expandAndCollapse : true;
        const lineWidth = options.lineWidth || 1;
        const labelFontSize = options.labelFontSize || 12;
        const showValues = options.showValues !== undefined ? options.showValues : true;

        // Get color palette
        let colors;
        if (customColors && customColors.length > 0) {
            colors = BasicCharts.generateColors(customColors, data.labels.length);
        } else {
            colors = BasicCharts.getColorPalette(data.labels.length);
        }

        // Convert to tree format
        let treeData;
        if (data.children) {
            treeData = JSON.parse(JSON.stringify(data)); // Deep copy to avoid mutating original
        } else {
            // Create from standard format
            treeData = {
                name: 'Root',
                children: data.labels.map((label, i) => ({
                    name: label,
                    value: data.datasets[0]?.data[i] || 0,
                    children: data.datasets.slice(1).map((ds, j) => ({
                        name: `${label}-${ds.label || j}`,
                        value: ds.data[i] || 0
                    }))
                }))
            };
        }

        // Helper to recursively apply colors
        // Assign distinct colors to first-level children, then propagate down
        const applyColors = (node, color, level = 0, childIndex = 0) => {
            // Root node usually keeps a neutral or specific color, or inherits the first one
            // Level 0 = Root
            // Level 1 = Main Categories (these get the palette colors)

            let myColor = color;

            if (level === 0) {
                myColor = colors[0]; // Root color
            } else if (level === 1) {
                myColor = colors[childIndex % colors.length];
            }
            // Level > 1 inherits myColor from parent (which validly passed down)

            if (!node.itemStyle) node.itemStyle = {};
            node.itemStyle.color = myColor;
            node.itemStyle.borderColor = myColor;

            if (node.children) {
                node.children.forEach((child, i) => {
                    applyColors(child, myColor, level + 1, i);
                });
            }
        };

        // Apply colors to the tree
        applyColors(treeData, colors[0]);

        const option = {
            tooltip: {
                trigger: 'item',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderWidth: 0,
                textStyle: { color: '#fff' }
            },
            series: [{
                type: 'tree',
                data: [treeData],
                top: '5%',
                left: '15%',
                bottom: '5%',
                right: '15%',
                symbolSize: symbolSize,
                orient: orient,
                label: {
                    show: showValues,
                    position: 'left',
                    verticalAlign: 'middle',
                    align: 'right',
                    fontSize: labelFontSize
                },
                leaves: {
                    label: {
                        show: showValues,
                        position: 'right',
                        verticalAlign: 'middle',
                        align: 'left'
                    }
                },
                expandAndCollapse: expandAndCollapse,
                animationDuration: 550,
                animationDurationUpdate: 750
            }]
        };

        chart.setOption(option);
        return chart;
    },

    /**
     * Create a progress bar chart
     * 进度条图
     */
    createProgressChart(container, data, options = {}) {
        const chart = echarts.init(container);

        const dataset = data.datasets[0] || { data: [] };
        const maxVal = Math.max(...dataset.data, 100);

        // Parse options
        const customColors = Array.isArray(options) ? options : options?.customColors;
        const barWidth = options.barWidth || 20;
        const borderRadius = options.borderRadius || 10;
        const showValues = options.showValues !== undefined ? options.showValues : true;

        // Data label styling options
        const labelFontSize = options.labelFontSize || 12;
        const labelFontWeight = options.labelFontWeight || 'bold';
        const labelColor = options.labelColor || '#666';

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
                textStyle: { color: '#fff' },
                formatter: function (params) {
                    const val = params[0].value;
                    return `${params[0].name}: ${val}%`;
                }
            },
            grid: {
                left: '20%',
                right: '15%',
                top: '10%',
                bottom: '10%'
            },
            xAxis: {
                type: 'value',
                max: maxVal,
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: { show: false },
                splitLine: { show: false }
            },
            yAxis: {
                type: 'category',
                data: data.labels,
                axisLine: { show: false },
                axisTick: { show: false },
                inverse: true
            },
            series: [
                {
                    // Background
                    type: 'bar',
                    barWidth: barWidth,
                    z: 1,
                    data: data.labels.map(() => maxVal),
                    itemStyle: {
                        color: '#e5e7eb',
                        borderRadius: borderRadius
                    },
                    silent: true
                },
                {
                    // Value
                    type: 'bar',
                    barWidth: barWidth,
                    z: 2,
                    data: dataset.data.map((val, i) => ({
                        value: val,
                        itemStyle: {
                            color: {
                                type: 'linear',
                                x: 0, y: 0, x2: 1, y2: 0,
                                colorStops: [
                                    { offset: 0, color: colors[i] },
                                    { offset: 1, color: BasicCharts.hexToRgba(colors[i], 0.6) }
                                ]
                            },
                            borderRadius: borderRadius
                        }
                    })),
                    label: {
                        show: showValues,
                        position: 'right',
                        formatter: '{c}%',
                        fontSize: labelFontSize,
                        fontWeight: labelFontWeight,
                        color: labelColor
                    },
                    barGap: '-100%'
                }
            ]
        };

        chart.setOption(option);
        return chart;
    },

    /**
     * Create metric cards display
     * 指标卡
     */
    createMetricCards(container, data, options = {}) {
        container.innerHTML = '';

        // Parse options
        const customColors = Array.isArray(options) ? options : options?.customColors;
        const cardMinWidth = options.cardMinWidth || 150;
        const valueFontSize = options.valueFontSize || 32;
        const labelFontSize = options.labelFontSize || 14;
        const showValues = options.showValues !== undefined ? options.showValues : true;

        const wrapper = document.createElement('div');
        wrapper.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(${cardMinWidth}px, 1fr));
            gap: 16px;
            padding: 16px;
            height: 100%;
            align-content: center;
        `;

        let colors;
        if (customColors && customColors.length > 0) {
            colors = BasicCharts.generateColors(customColors, data.labels.length);
        } else {
            colors = BasicCharts.getColorPalette(data.labels.length);
        }
        const dataset = data.datasets[0] || { data: [] };

        data.labels.forEach((label, i) => {
            const card = document.createElement('div');
            card.style.cssText = `
                background: linear-gradient(135deg, ${colors[i]}, ${BasicCharts.hexToRgba(colors[i], 0.7)});
                border-radius: 12px;
                padding: 20px;
                color: white;
                text-align: center;
                box-shadow: 0 4px 15px ${BasicCharts.hexToRgba(colors[i], 0.3)};
                transition: transform 0.3s ease;
            `;
            card.innerHTML = `
                <div style="font-size: ${valueFontSize}px; font-weight: bold; margin-bottom: 8px;">
                    ${showValues ? (dataset.data[i]?.toLocaleString() || 0) : '***'}
                </div>
                <div style="font-size: ${labelFontSize}px; opacity: 0.9;">${label}</div>
            `;
            card.onmouseenter = () => card.style.transform = 'translateY(-5px)';
            card.onmouseleave = () => card.style.transform = 'translateY(0)';
            wrapper.appendChild(card);
        });

        container.appendChild(wrapper);
        return { destroy: () => container.innerHTML = '' };
    },

    /**
     * Create sparklines
     * 迷你图
     */
    createSparklines(container, data, options = {}) {
        container.innerHTML = '';

        // Parse options
        const customColors = Array.isArray(options) ? options : options?.customColors;
        const lineWidth = options.lineWidth || 2;
        const areaOpacity = options.areaOpacity !== undefined ? options.areaOpacity : 0.2;
        const smooth = options.smooth !== undefined ? options.smooth : true;
        const showValues = options.showValues !== undefined ? options.showValues : true;

        const wrapper = document.createElement('div');
        wrapper.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 12px;
            padding: 16px;
            height: 100%;
            overflow-y: auto;
        `;

        // Get colors with proper fallback like other charts
        let colors;
        if (customColors && customColors.length > 0) {
            colors = BasicCharts.generateColors(customColors, data.datasets.length);
        } else {
            colors = BasicCharts.getColorPalette(data.datasets.length);
        }

        data.datasets.forEach((ds, i) => {
            const row = document.createElement('div');
            row.style.cssText = `
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 8px 12px;
                background: var(--bg-secondary, #f9fafb);
                border-radius: 8px;
            `;

            const label = document.createElement('div');
            label.style.cssText = 'width: 100px; font-weight: 500; font-size: 14px;';
            label.textContent = ds.label || `Series ${i + 1}`;

            const sparkContainer = document.createElement('div');
            sparkContainer.style.cssText = 'flex: 1; height: 40px;';
            sparkContainer.id = `spark-${i}-${Date.now()}`;

            const value = document.createElement('div');
            value.style.cssText = `width: 60px; text-align: right; font-weight: bold; color: ${colors[i]};`;
            const lastVal = ds.data[ds.data.length - 1] || 0;
            const prevVal = ds.data[ds.data.length - 2] || lastVal;
            const trend = lastVal >= prevVal ? '↑' : '↓';
            value.textContent = showValues ? `${lastVal} ${trend}` : `-- ${trend}`;

            row.appendChild(label);
            row.appendChild(sparkContainer);
            row.appendChild(value);
            wrapper.appendChild(row);

            // Create mini chart after append with configurable options
            setTimeout(() => {
                const chart = echarts.init(sparkContainer);
                chart.setOption({
                    grid: { left: 0, right: 0, top: 5, bottom: 5 },
                    xAxis: { type: 'category', show: false, data: ds.data.map((_, j) => j) },
                    yAxis: { type: 'value', show: false },
                    series: [{
                        type: 'line',
                        data: ds.data,
                        smooth: smooth,
                        symbol: 'none',
                        lineStyle: { width: lineWidth, color: colors[i] },
                        areaStyle: { opacity: areaOpacity, color: colors[i] }
                    }]
                });
            }, 0);
        });

        container.appendChild(wrapper);
        return { destroy: () => container.innerHTML = '' };
    }
};

// Export
window.FinancialCharts = FinancialCharts;
