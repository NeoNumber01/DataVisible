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

        // Dual color support: positive (up), negative (down)
        const upColor = customColors && customColors[0] ? customColors[0] : '#ef4444';
        const downColor = customColors && customColors[1] ? customColors[1] : '#22c55e';

        // Convert data to OHLC format (Open, Close, Low, High)
        // If standard format, simulate OHLC from values
        let ohlcData;
        if (data.datasets[0]?.ohlc) {
            ohlcData = data.datasets[0].ohlc;
        } else {
            // Generate simulated OHLC from single values
            const values = data.datasets[0]?.data || [];
            ohlcData = values.map((val, i) => {
                const open = val * (0.95 + Math.random() * 0.1);
                const close = val;
                const low = Math.min(open, close) * (0.95 + Math.random() * 0.05);
                const high = Math.max(open, close) * (1 + Math.random() * 0.05);
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
                data: ['K线', `MA${maPeriod1}`, `MA${maPeriod2}`]
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
                splitLine: { lineStyle: { color: '#eee' } }
            },
            dataZoom: [
                {
                    type: 'inside',
                    start: 50,
                    end: 100
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
                    name: 'K线',
                    type: 'candlestick',
                    data: ohlcData,
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

        const colors = customColors || BasicCharts.getColorPalette(data.labels.length);

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
                splitLine: { lineStyle: { color: '#eee' } }
            },
            series: [{
                type: 'effectScatter',
                data: scatterData,
                rippleEffect: {
                    brushType: rippleType,
                    scale: rippleScale
                },
                label: {
                    show: true,
                    formatter: '{b}',
                    position: 'top'
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
        const colors = customColors || BasicCharts.getColorPalette(2);
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
                data: ['实际值', '目标值']
            },
            grid: {
                left: '15%',
                right: '10%',
                bottom: '10%'
            },
            xAxis: {
                type: 'value',
                axisLine: { show: false },
                splitLine: { lineStyle: { color: '#eee' } }
            },
            yAxis: {
                type: 'category',
                data: data.labels,
                axisLine: { show: false },
                axisTick: { show: false }
            },
            series: [
                {
                    name: '目标值',
                    type: 'bar',
                    barWidth: targetWidth,
                    z: 1,
                    data: targetData,
                    itemStyle: {
                        color: '#e5e7eb'
                    }
                },
                {
                    name: '实际值',
                    type: 'bar',
                    barWidth: barWidth,
                    z: 2,
                    data: dataset.data,
                    itemStyle: {
                        color: colors[0]
                    },
                    label: {
                        show: true,
                        position: 'right',
                        formatter: '{c}'
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

        const colors = customColors || BasicCharts.getColorPalette(data.datasets.length);

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
                splitLine: { lineStyle: { color: '#eee' } }
            },
            series: data.datasets.map((ds, i) => ({
                name: ds.label || `Series ${i + 1}`,
                type: 'line',
                step: step,
                data: ds.data,
                lineStyle: { width: lineWidth, color: colors[i] },
                itemStyle: { color: colors[i] },
                areaStyle: { opacity: areaOpacity }
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

        const allValues = data.datasets.flatMap(ds => ds.data);
        const min = Math.min(...allValues);
        const max = Math.max(...allValues);
        const binCount = 10;
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
                    return `${params[0].name}<br/>频数: ${params[0].value}`;
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
                name: '频数',
                axisLine: { show: false },
                splitLine: { lineStyle: { color: '#eee' } }
            },
            series: [{
                type: 'bar',
                data: bins,
                barWidth: '90%',
                itemStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: '#6366f1' },
                            { offset: 1, color: '#8b5cf6' }
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

        // Parse options
        const symbolSize = options.symbolSize || 10;
        const orient = options.orient || 'LR';
        const expandAndCollapse = options.expandAndCollapse !== undefined ? options.expandAndCollapse : true;

        // Convert to tree format
        let treeData;
        if (data.children) {
            treeData = data;
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
                    position: 'left',
                    verticalAlign: 'middle',
                    align: 'right',
                    fontSize: 12
                },
                leaves: {
                    label: {
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
        // Support custom colors from options
        const customColors = Array.isArray(options) ? options : options?.customColors;
        const colors = customColors || BasicCharts.getColorPalette(data.labels.length);

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
                    barWidth: 20,
                    z: 1,
                    data: data.labels.map(() => maxVal),
                    itemStyle: {
                        color: '#e5e7eb',
                        borderRadius: 10
                    },
                    silent: true
                },
                {
                    // Value
                    type: 'bar',
                    barWidth: 20,
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
                            borderRadius: 10
                        }
                    })),
                    label: {
                        show: true,
                        position: 'right',
                        formatter: '{c}%',
                        fontSize: 12,
                        color: '#666'
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

        const wrapper = document.createElement('div');
        wrapper.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 16px;
            padding: 16px;
            height: 100%;
            align-content: center;
        `;

        // Support custom colors from options
        const customColors = Array.isArray(options) ? options : options?.customColors;
        const colors = customColors || BasicCharts.getColorPalette(data.labels.length);
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
                <div style="font-size: 32px; font-weight: bold; margin-bottom: 8px;">
                    ${dataset.data[i]?.toLocaleString() || 0}
                </div>
                <div style="font-size: 14px; opacity: 0.9;">${label}</div>
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

        const wrapper = document.createElement('div');
        wrapper.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 12px;
            padding: 16px;
            height: 100%;
            overflow-y: auto;
        `;

        // Support custom colors from options
        const customColors = Array.isArray(options) ? options : options?.customColors;
        const colors = customColors || BasicCharts.getColorPalette(data.datasets.length);

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
            value.textContent = `${lastVal} ${trend}`;

            row.appendChild(label);
            row.appendChild(sparkContainer);
            row.appendChild(value);
            wrapper.appendChild(row);

            // Create mini chart after append
            setTimeout(() => {
                const chart = echarts.init(sparkContainer);
                chart.setOption({
                    grid: { left: 0, right: 0, top: 5, bottom: 5 },
                    xAxis: { type: 'category', show: false, data: ds.data.map((_, j) => j) },
                    yAxis: { type: 'value', show: false },
                    series: [{
                        type: 'line',
                        data: ds.data,
                        smooth: true,
                        symbol: 'none',
                        lineStyle: { width: 2, color: colors[i] },
                        areaStyle: { opacity: 0.2, color: colors[i] }
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
