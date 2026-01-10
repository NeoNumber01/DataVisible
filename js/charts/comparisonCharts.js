/**
 * Comparison Charts - 对比与特殊图表
 * Boxplot, Heatmap, Funnel, Treemap, Sunburst, Sankey, Gauge, WordCloud, Table
 * Using ECharts for advanced visualizations
 */

const ComparisonCharts = {
    /**
     * Create a box plot using ECharts
     */
    createBoxplotChart(container, data, options = {}) {
        const chart = echarts.init(container);

        // Parse options - support both array (colors) and object format
        const customColors = Array.isArray(options) ? options : options?.customColors;
        const boxWidth = options.boxWidth || 50;
        const showValues = options.showValues !== undefined ? options.showValues : true;

        // Data label styling options
        const labelFontSize = options.labelFontSize || 12;
        const labelFontWeight = options.labelFontWeight || 'bold';
        const labelColor = options.labelColor || '#333';

        const mainColor = customColors ? customColors[0] : '#6366f1';
        const borderColor = customColors ? customColors[1] || customColors[0] : '#4f46e5';

        // 按类别（labels）计算箱线图数据
        // 每个类别收集所有 series 的数据点来计算统计值
        const boxData = data.labels.map((label, labelIdx) => {
            // 收集该类别下所有 series 的数据
            const values = data.datasets.map(ds => ds.data[labelIdx]).filter(v => v !== undefined && !isNaN(v));

            // 如果只有一个值，需要创建虚拟分布
            if (values.length === 0) return [0, 0, 0, 0, 0];
            if (values.length === 1) {
                const v = values[0];
                return [v, v, v, v, v];
            }

            const sorted = [...values].sort((a, b) => a - b);
            const n = sorted.length;
            const min = sorted[0];
            const max = sorted[n - 1];

            // 计算四分位数
            const getQuartile = (arr, q) => {
                const pos = (arr.length - 1) * q;
                const base = Math.floor(pos);
                const rest = pos - base;
                if (arr[base + 1] !== undefined) {
                    return arr[base] + rest * (arr[base + 1] - arr[base]);
                } else {
                    return arr[base];
                }
            };

            const q1 = getQuartile(sorted, 0.25);
            const median = getQuartile(sorted, 0.5);
            const q3 = getQuartile(sorted, 0.75);

            return [min, q1, median, q3, max];
        });

        const option = {
            tooltip: {
                trigger: 'item',
                axisPointer: { type: 'shadow' },
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderWidth: 0,
                textStyle: { color: '#fff' },
                formatter: function (params) {
                    if (params.data) {
                        const d = params.data;
                        return `<b>${params.name}</b><br/>
                                最大值: ${d[4]}<br/>
                                Q3: ${d[3]}<br/>
                                中位数: ${d[2]}<br/>
                                Q1: ${d[1]}<br/>
                                最小值: ${d[0]}`;
                    }
                    return '';
                }
            },
            grid: {
                left: '10%',
                right: '10%',
                top: '12%',   // 增加顶部空间给标签
                bottom: '15%'
            },
            xAxis: {
                type: 'category',
                data: data.labels,
                boundaryGap: true,
                axisLine: { lineStyle: { color: '#ddd' } },
                axisTick: { show: false }
            },
            yAxis: {
                type: 'value',
                axisLine: { show: false },
                splitLine: { lineStyle: { color: '#eee' } }
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
                    name: 'Boxplot',
                    type: 'boxplot',
                    data: boxData,
                    boxWidth: [boxWidth + '%', boxWidth + '%'],
                    itemStyle: {
                        color: mainColor,
                        borderColor: borderColor,
                        borderWidth: 2
                    },
                    emphasis: {
                        itemStyle: {
                            borderWidth: 3,
                            shadowBlur: 5,
                            shadowColor: 'rgba(0, 0, 0, 0.3)'
                        }
                    }
                },
                // 使用 scatter 系列显示中位数标签
                {
                    name: 'Median Labels',
                    type: 'scatter',
                    data: showValues ? boxData.map((item, idx) => ({
                        value: [idx, item[4] + 2],
                        median: item[2]
                    })) : [],
                    symbolSize: 1,
                    itemStyle: {
                        color: 'transparent'
                    },
                    label: {
                        show: true,
                        position: 'top',
                        distance: 5,
                        fontSize: labelFontSize,
                        fontWeight: labelFontWeight,
                        color: labelColor,
                        formatter: (params) => params.data.median.toFixed(1)
                    },
                    silent: true,
                    z: 10
                }
            ]
        };

        chart.setOption(option);
        return chart;
    },

    /**
     * Create a heatmap using ECharts
     */
    createHeatmapChart(container, data, options = {}) {
        const chart = echarts.init(container);

        // Parse options - support both array (colors) and object format
        const customColors = Array.isArray(options) ? options : options?.customColors;
        const showValues = options.showValues !== undefined ? options.showValues : (options.showLabel !== undefined ? options.showLabel : true);

        // Data label styling options
        const labelFontSize = options.labelFontSize || 12;
        const labelFontWeight = options.labelFontWeight || 'bold';
        const labelColor = options.labelColor || '#333';

        // Generate heatmap data from standard format
        const heatmapData = [];
        data.datasets.forEach((ds, dsIdx) => {
            ds.data.forEach((val, labelIdx) => {
                heatmapData.push([labelIdx, dsIdx, val]);
            });
        });

        const maxVal = Math.max(...heatmapData.map(d => d[2]));

        // Use custom colors or default from config
        let heatColors = ['#f0f9ff', '#bae6fd', '#7dd3fc', '#38bdf8', '#0284c7', '#0369a1'];
        if (customColors && customColors.length >= 2) {
            heatColors = customColors.slice(0, 6);
        } else if (typeof ChartColorsConfig !== 'undefined') {
            const rec = ChartColorsConfig.getRecommendedColors('heatmap', 6);
            if (rec && rec.length >= 2) heatColors = rec;
        }

        const option = {
            tooltip: {
                position: 'top',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderWidth: 0,
                textStyle: { color: '#fff' }
            },
            grid: {
                left: '15%',
                right: '10%',
                top: '10%',
                bottom: '15%'
            },
            xAxis: {
                type: 'category',
                data: data.labels,
                splitArea: { show: true },
                axisLine: { show: false },
                axisTick: { show: false }
            },
            yAxis: {
                type: 'category',
                data: data.datasets.map(ds => ds.label || 'Data'),
                splitArea: { show: true },
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
            visualMap: {
                min: 0,
                max: maxVal,
                calculable: true,
                orient: 'horizontal',
                left: 'center',
                bottom: '0%',
                inRange: {
                    color: heatColors
                }
            },
            series: [{
                name: 'Heatmap',
                type: 'heatmap',
                data: heatmapData,
                label: {
                    show: showValues,
                    fontSize: labelFontSize,
                    fontWeight: labelFontWeight,
                    color: labelColor
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        };

        chart.setOption(option);
        return chart;
    },

    /**
     * Create a funnel chart using ECharts
     */
    createFunnelChart(container, data, options = {}) {
        const chart = echarts.init(container);

        // Parse options - support both array (colors) and object format
        const customColors = Array.isArray(options) ? options : options?.customColors;
        const minSize = options.minSize !== undefined ? options.minSize + '%' : '10%';
        const maxSize = options.maxSize !== undefined ? options.maxSize + '%' : '100%';
        const gap = options.gap !== undefined ? options.gap : 2;
        const sort = options.sort || 'descending';
        const showValues = options.showValues !== undefined ? options.showValues : true;

        // Data label styling options
        const labelFontSize = options.labelFontSize || 12;
        const labelFontWeight = options.labelFontWeight || 'bold';
        const labelColor = options.labelColor || '#fff';

        const dataset = data.datasets[0] || { data: [] };
        const funnelData = data.labels.map((label, i) => ({
            name: label,
            value: dataset.data[i] || 0
        }));

        let colors;
        if (customColors && customColors.length > 0) {
            colors = BasicCharts.generateColors(customColors, funnelData.length);
        } else {
            colors = BasicCharts.getColorPalette(funnelData.length);
        }

        const option = {
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c}',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderWidth: 0,
                textStyle: { color: '#fff' }
            },
            legend: {
                top: 'top',
                left: 'center'
            },
            series: [{
                name: 'Funnel',
                type: 'funnel',
                left: '10%',
                top: 60,
                bottom: 60,
                width: '80%',
                min: 0,
                max: Math.max(...dataset.data),
                minSize: minSize,
                maxSize: maxSize,
                sort: sort,
                gap: gap,
                label: {
                    show: showValues,
                    position: 'inside',
                    formatter: '{b}: {c}',
                    fontSize: labelFontSize,
                    fontWeight: labelFontWeight,
                    color: labelColor
                },
                labelLine: {
                    length: 10
                },
                itemStyle: {
                    borderColor: '#fff',
                    borderWidth: 1
                },
                emphasis: {
                    label: {
                        fontSize: 16
                    }
                },
                data: funnelData.map((d, i) => ({
                    ...d,
                    itemStyle: {
                        color: colors[i % colors.length]
                    }
                }))
            }]
        };

        chart.setOption(option);
        return chart;
    },

    /**
     * Create a treemap using ECharts
     */
    createTreemapChart(container, data, options = {}) {
        const chart = echarts.init(container);

        // Parse options - support both array (colors) and object format
        const customColors = Array.isArray(options) ? options : options?.customColors;
        const borderWidth = options.borderWidth !== undefined ? options.borderWidth : 2;
        const gapWidth = options.gapWidth !== undefined ? options.gapWidth : 2;
        const labelFontSize = options.labelFontSize || 14;
        const labelFontWeight = options.labelFontWeight || 'normal';
        const labelColor = options.labelColor || '#fff';
        const showValues = options.showValues !== undefined ? options.showValues : true;

        let colors;
        if (customColors && customColors.length > 0) {
            colors = BasicCharts.generateColors(customColors, 10);
        } else {
            colors = BasicCharts.getColorPalette(10);
        }

        // Convert standard data to treemap format
        let treemapData;
        if (data.children) {
            // Already in hierarchical format
            treemapData = [data];
        } else {
            // Convert from standard format
            const dataset = data.datasets[0] || { data: [] };
            treemapData = [{
                name: 'Total',
                children: data.labels.map((label, i) => ({
                    name: label,
                    value: dataset.data[i] || 0
                }))
            }];
        }

        const option = {
            tooltip: {
                formatter: '{b}: {c}',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderWidth: 0,
                textStyle: { color: '#fff' }
            },
            series: [{
                type: 'treemap',
                data: treemapData,
                width: '100%',
                height: '100%',
                roam: true,
                nodeClick: 'zoomToNode',
                breadcrumb: {
                    show: true,
                    height: 30
                },
                label: {
                    show: showValues,
                    formatter: showValues ? '{b}: {c}' : '{b}',
                    fontSize: labelFontSize,
                    fontWeight: labelFontWeight,
                    color: labelColor
                },
                upperLabel: {
                    show: true,
                    height: 30,
                    color: '#fff'
                },
                itemStyle: {
                    borderColor: '#fff',
                    borderWidth: borderWidth,
                    gapWidth: gapWidth
                },
                levels: [
                    {
                        itemStyle: {
                            borderColor: '#333',
                            borderWidth: borderWidth,
                            gapWidth: gapWidth
                        },
                        colorSaturation: [0.35, 0.5],
                        upperLabel: {
                            show: false
                        }
                    },
                    {
                        colorSaturation: [0.35, 0.5],
                        itemStyle: {
                            gapWidth: Math.max(1, gapWidth - 1)
                        }
                    }
                ],
                color: colors
            }]
        };

        chart.setOption(option);
        return chart;
    },

    /**
     * Create a sunburst chart using ECharts
     */
    createSunburstChart(container, data, options = {}) {
        const chart = echarts.init(container);

        // Parse options - support both array (colors) and object format
        const customColors = Array.isArray(options) ? options : options?.customColors;
        const borderWidth = options.borderWidth !== undefined ? options.borderWidth : 2;
        const showValues = options.showValues !== undefined ? options.showValues : true;

        // Data label styling options
        const labelFontSize = options.labelFontSize || 12;
        const labelFontWeight = options.labelFontWeight || 'normal';
        const labelColor = options.labelColor || '#333';

        // Convert standard data to sunburst format
        let sunburstData;
        if (data.children) {
            sunburstData = [data];
        } else {
            const dataset = data.datasets[0] || { data: [] };
            sunburstData = data.labels.map((label, i) => ({
                name: label,
                value: dataset.data[i] || 0
            }));
        }

        let colors;
        if (customColors && customColors.length > 0) {
            colors = BasicCharts.generateColors(customColors, sunburstData.length);
        } else {
            colors = BasicCharts.getColorPalette(sunburstData.length);
        }

        const option = {
            tooltip: {
                formatter: '{b}: {c}',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderWidth: 0,
                textStyle: { color: '#fff' }
            },
            color: colors,
            series: [{
                type: 'sunburst',
                data: sunburstData,
                radius: [0, '95%'],
                sort: null,
                emphasis: {
                    focus: 'ancestor'
                },
                levels: [
                    {},
                    {
                        r0: '15%',
                        r: '45%',
                        itemStyle: {
                            borderWidth: borderWidth
                        },
                        label: {
                            show: showValues,
                            rotate: 'tangential',
                            fontSize: labelFontSize,
                            fontWeight: labelFontWeight,
                            color: labelColor
                        }
                    },
                    {
                        r0: '45%',
                        r: '70%',
                        label: {
                            show: showValues,
                            align: 'right',
                            fontSize: labelFontSize,
                            fontWeight: labelFontWeight,
                            color: labelColor
                        }
                    },
                    {
                        r0: '70%',
                        r: '90%',
                        label: {
                            position: 'outside',
                            padding: 3,
                            silent: false
                        },
                        itemStyle: {
                            borderWidth: borderWidth + 1
                        }
                    }
                ]
            }]
        };

        chart.setOption(option);
        return chart;
    },

    /**
     * Create a sankey diagram using ECharts
     */
    createSankeyChart(container, data, options = {}) {
        const chart = echarts.init(container);

        // Parse options - support both array (colors) and object format
        const customColors = Array.isArray(options) ? options : options?.customColors;
        const curveness = options.curveness !== undefined ? options.curveness : 0.5;
        const nodeWidth = options.nodeWidth || 20;
        const showValues = options.showValues !== undefined ? options.showValues : true;

        // Data label styling options
        const labelFontSize = options.labelFontSize || 12;
        const labelFontWeight = options.labelFontWeight || 'bold';

        // Convert standard data to sankey format
        let sankeyData;
        if (data.nodes && data.links) {
            sankeyData = data;
        } else {
            // Create a simple flow from labels to datasets
            const nodes = [];
            const links = [];

            // Add label nodes
            data.labels.forEach(label => {
                nodes.push({ name: label });
            });

            // Add dataset nodes and links
            data.datasets.forEach((ds, dsIdx) => {
                const targetName = ds.label || `Output ${dsIdx + 1}`;
                nodes.push({ name: targetName });

                ds.data.forEach((value, labelIdx) => {
                    links.push({
                        source: data.labels[labelIdx],
                        target: targetName,
                        value: value
                    });
                });
            });

            sankeyData = { nodes, links };
        }

        // Apply colors to nodes if custom colors provided
        if (customColors && customColors.length > 0) {
            const colors = BasicCharts.generateColors(customColors, sankeyData.nodes.length);
            sankeyData.nodes = sankeyData.nodes.map((node, i) => ({
                ...node,
                itemStyle: {
                    color: colors[i % colors.length]
                }
            }));
        }

        const option = {
            tooltip: {
                trigger: 'item',
                triggerOn: 'mousemove',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderWidth: 0,
                textStyle: { color: '#fff' }
            },
            series: [{
                type: 'sankey',
                emphasis: {
                    focus: 'adjacency'
                },
                nodeAlign: 'left',
                nodeWidth: nodeWidth,
                data: sankeyData.nodes,
                links: sankeyData.links,
                lineStyle: {
                    color: 'gradient',
                    curveness: curveness
                },
                itemStyle: {
                    borderWidth: 1,
                    borderColor: '#aaa'
                },
                label: {
                    show: showValues,
                    color: 'auto',
                    fontSize: labelFontSize,
                    fontWeight: labelFontWeight
                }
            }]
        };

        chart.setOption(option);
        return chart;
    },

    /**
     * Create a gauge chart using ECharts
     */
    createGaugeChart(container, data, options = {}) {
        const chart = echarts.init(container);

        // Parse options - support both array (colors) and object format
        const customColors = Array.isArray(options) ? options : options?.customColors;
        const startAngle = options.startAngle !== undefined ? options.startAngle : 200;
        const endAngle = options.endAngle !== undefined ? options.endAngle : -20;
        const progressWidth = options.progressWidth || 18;
        const splitNumber = options.splitNumber || 10;
        const showValues = options.showValues !== undefined ? options.showValues : true;

        const gaugeColor = customColors ? customColors[0] : '#6366f1';
        const gaugeColor2 = customColors && customColors[1] ? customColors[1] : BasicCharts.hexToRgba(gaugeColor, 0.6);

        // Use first value from first dataset
        const dataset = data.datasets[0] || { data: [0] };
        const value = dataset.data[0] || 0;
        const maxValue = Math.max(...dataset.data) * 1.2 || 100;

        const option = {
            tooltip: {
                formatter: '{b}: {c}',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderWidth: 0,
                textStyle: { color: '#fff' }
            },
            series: [{
                type: 'gauge',
                startAngle: startAngle,
                endAngle: endAngle,
                min: 0,
                max: maxValue,
                splitNumber: splitNumber,
                itemStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 1, y2: 0,
                        colorStops: [
                            { offset: 0, color: gaugeColor },
                            { offset: 1, color: gaugeColor2 }
                        ]
                    }
                },
                progress: {
                    show: true,
                    roundCap: true,
                    width: progressWidth
                },
                pointer: {
                    icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
                    length: '75%',
                    width: 8,
                    offsetCenter: [0, '5%']
                },
                axisLine: {
                    roundCap: true,
                    lineStyle: {
                        width: progressWidth,
                        color: [[1, '#eee']]
                    }
                },
                axisTick: {
                    splitNumber: 2,
                    lineStyle: {
                        width: 2,
                        color: '#999'
                    }
                },
                splitLine: {
                    length: 12,
                    lineStyle: {
                        width: 3,
                        color: '#999'
                    }
                },
                axisLabel: {
                    distance: 25,
                    color: '#999',
                    fontSize: 12
                },
                title: {
                    show: true,
                    offsetCenter: [0, '70%'],
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: '#333'
                },
                detail: {
                    show: showValues,
                    fontSize: 36,
                    offsetCenter: [0, '40%'],
                    valueAnimation: true,
                    formatter: function (value) {
                        return value.toFixed(1);
                    },
                    color: gaugeColor
                },
                data: [{
                    value: value,
                    name: dataset.label || 'Value'
                }]
            }]
        };

        chart.setOption(option);
        return chart;
    },

    /**
     * Create a word cloud using ECharts
     */
    createWordCloudChart(container, data, options = {}) {
        const chart = echarts.init(container);

        // Parse options - support both array (colors) and object format
        const customColors = Array.isArray(options) ? options : options?.customColors;
        const sizeMin = options.sizeMin || 14;
        const sizeMax = options.sizeMax || 60;
        const rotationMin = options.rotationMin !== undefined ? options.rotationMin : -45;
        const rotationMax = options.rotationMax !== undefined ? options.rotationMax : 45;

        // Convert to word cloud format
        let wordData;
        if (data.words) {
            wordData = data.words;
        } else {
            // Convert from standard format
            const dataset = data.datasets[0] || { data: [] };
            wordData = data.labels.map((label, i) => ({
                name: label,
                value: dataset.data[i] || 0
            }));
        }

        let colors;
        if (customColors && customColors.length > 0) {
            colors = BasicCharts.generateColors(customColors, wordData.length);
        } else {
            colors = BasicCharts.getColorPalette(wordData.length);
        }

        const option = {
            tooltip: {
                show: true,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderWidth: 0,
                textStyle: { color: '#fff' }
            },
            series: [{
                type: 'wordCloud',
                shape: 'circle',
                left: 'center',
                top: 'center',
                width: '90%',
                height: '90%',
                sizeRange: [sizeMin, sizeMax],
                rotationRange: [rotationMin, rotationMax],
                rotationStep: 15,
                gridSize: 8,
                drawOutOfBound: false,
                textStyle: {
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 'bold',
                    color: function () {
                        return colors[Math.floor(Math.random() * colors.length)];
                    }
                },
                emphasis: {
                    textStyle: {
                        shadowBlur: 10,
                        shadowColor: '#333'
                    }
                },
                data: wordData.map(w => ({
                    name: w.text || w.name,
                    value: w.weight || w.value
                }))
            }]
        };

        // Load word cloud extension if available
        if (typeof echarts !== 'undefined' && !echarts.binPath) {
            // Word cloud requires echarts-wordcloud extension
            // Fallback to simple bar representation
            option.series = [{
                type: 'bar',
                data: wordData.map(w => w.weight || w.value),
                itemStyle: {
                    color: function (params) {
                        return colors[params.dataIndex % colors.length];
                    }
                }
            }];
            option.xAxis = {
                type: 'category',
                data: wordData.map(w => w.text || w.name),
                axisLabel: { rotate: 45 }
            };
            option.yAxis = { type: 'value' };
        }

        chart.setOption(option);
        return chart;
    },

    /**
     * Create a data table
     */
    createDataTable(container, data, options = {}) {
        container.innerHTML = '';

        // Parse custom colors
        const customColors = Array.isArray(options) ? options : options?.customColors;
        const headerBgColor = customColors && customColors[0] ? customColors[0] : null;
        const altRowColor = customColors && customColors[1] ? customColors[1] : null;

        // Helper function to get contrasting text color
        const getContrastColor = (hexColor) => {
            if (!hexColor) return '#333';
            const hex = hexColor.replace('#', '');
            const r = parseInt(hex.substr(0, 2), 16);
            const g = parseInt(hex.substr(2, 2), 16);
            const b = parseInt(hex.substr(4, 2), 16);
            const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            return luminance > 0.5 ? '#333' : '#fff';
        };

        const tableWrapper = document.createElement('div');
        tableWrapper.style.cssText = 'overflow: auto; height: 100%; padding: 10px;';

        const table = document.createElement('table');
        table.style.cssText = `
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
        `;

        // Create header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        const headers = ['Category', ...data.datasets.map(ds => ds.label || 'Data')];
        headers.forEach(h => {
            const th = document.createElement('th');
            th.textContent = h;
            let headerStyle = `
                padding: 12px 16px;
                text-align: left;
                border-bottom: 2px solid var(--border-color);
                font-weight: 600;
            `;
            if (headerBgColor) {
                headerStyle += `background: ${headerBgColor}; color: ${getContrastColor(headerBgColor)};`;
            } else {
                headerStyle += `background: var(--bg-tertiary);`;
            }
            th.style.cssText = headerStyle;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Create body
        const tbody = document.createElement('tbody');
        data.labels.forEach((label, i) => {
            const row = document.createElement('tr');

            // Apply alternating row color if set
            if (altRowColor && i % 2 === 1) {
                row.style.backgroundColor = BasicCharts.hexToRgba(altRowColor, 0.15);
            }

            const labelCell = document.createElement('td');
            labelCell.textContent = label;
            labelCell.style.cssText = `
                padding: 10px 16px;
                border-bottom: 1px solid var(--border-color);
                font-weight: 500;
            `;
            row.appendChild(labelCell);

            data.datasets.forEach(ds => {
                const cell = document.createElement('td');
                cell.textContent = ds.data[i] !== undefined ? ds.data[i] : '-';
                cell.style.cssText = `
                    padding: 10px 16px;
                    border-bottom: 1px solid var(--border-color);
                `;
                row.appendChild(cell);
            });

            tbody.appendChild(row);
        });
        table.appendChild(tbody);

        tableWrapper.appendChild(table);
        container.appendChild(tableWrapper);

        return { destroy: () => container.innerHTML = '' };
    }
};

// Export
window.ComparisonCharts = ComparisonCharts;
