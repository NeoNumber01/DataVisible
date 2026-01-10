/**
 * 3D Charts - 三维图表实现
 * Using ECharts GL for 3D visualizations
 */

const Charts3D = {
    /**
     * Create a 3D bar chart
     */
    createBar3DChart(container, data, options = {}) {
        const chart = echarts.init(container);

        // Parse options - support both array (colors) and object format
        const customColors = Array.isArray(options) ? options : options?.customColors;
        const autoRotate = options.autoRotate !== undefined ? options.autoRotate : true;
        const rotateSpeed = options.rotateSpeed || 10;
        const shadow = options.shadow !== undefined ? options.shadow : true;
        const showValues = options.showValues !== undefined ? options.showValues : false;

        // Data label styling options
        const labelFontSize = options.labelFontSize || 12;
        const labelFontWeight = options.labelFontWeight || 'bold';
        const labelColor = options.labelColor || '#333';

        // Convert standard data to 3D format
        const bar3DData = [];
        data.labels.forEach((label, x) => {
            data.datasets.forEach((ds, y) => {
                bar3DData.push([x, y, ds.data[x] || 0]);
            });
        });

        const maxVal = Math.max(...data.datasets.flatMap(ds => ds.data));

        const option = {
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderWidth: 0,
                textStyle: { color: '#fff' }
            },
            visualMap: {
                max: maxVal,
                inRange: {
                    color: customColors || ChartColorsConfig?.presets?.default?.colors.slice(0, 5) || ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316']
                }
            },
            xAxis3D: {
                type: 'category',
                data: data.labels,
                name: 'Category'
            },
            yAxis3D: {
                type: 'category',
                data: data.datasets.map(ds => ds.label),
                name: 'Series'
            },
            zAxis3D: {
                type: 'value',
                name: 'Value'
            },
            grid3D: {
                boxWidth: 200,
                boxDepth: 80,
                viewControl: {
                    projection: 'perspective',
                    autoRotate: autoRotate,
                    autoRotateSpeed: rotateSpeed
                },
                light: {
                    main: {
                        intensity: 1.2,
                        shadow: shadow
                    },
                    ambient: {
                        intensity: 0.3
                    }
                }
            },
            series: [{
                type: 'bar3D',
                data: bar3DData.map(item => ({
                    value: [item[0], item[1], item[2]]
                })),
                shading: 'lambert',
                label: {
                    show: showValues,
                    formatter: function (params) {
                        return params.value[2];
                    },
                    textStyle: {
                        fontSize: labelFontSize,
                        fontWeight: labelFontWeight,
                        color: labelColor
                    }
                },
                emphasis: {
                    label: {
                        show: true,
                        formatter: function (params) {
                            return params.value[2];
                        },
                        textStyle: {
                            fontSize: labelFontSize,
                            fontWeight: labelFontWeight,
                            color: labelColor
                        }
                    }
                }
            }]
        };

        chart.setOption(option);
        return chart;
    },

    /**
     * Create a 3D scatter chart
     */
    createScatter3DChart(container, data, options = {}) {
        const chart = echarts.init(container);

        // Parse options - support both array (colors) and object format
        const customColors = Array.isArray(options) ? options : options?.customColors;
        const symbolSize = options.symbolSize || 12;
        const autoRotate = options.autoRotate !== undefined ? options.autoRotate : true;
        const rotateSpeed = options.rotateSpeed || 5;
        const showValues = options.showValues !== undefined ? options.showValues : false;

        // Data label styling options
        const labelFontSize = options.labelFontSize || 12;
        const labelFontWeight = options.labelFontWeight || 'bold';
        const labelColor = options.labelColor || 'inherit';

        // Generate 3D scatter data
        const scatter3DData = [];
        let colors;
        if (customColors && customColors.length > 0) {
            colors = BasicCharts.generateColors(customColors, data.datasets.length);
        } else {
            colors = BasicCharts.getColorPalette(data.datasets.length);
        }

        data.datasets.forEach((ds, idx) => {
            ds.data.forEach((val, i) => {
                scatter3DData.push({
                    value: [i, val, Math.random() * 50 + val / 2],
                    itemStyle: {
                        color: colors[idx]
                    }
                });
            });
        });

        const option = {
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderWidth: 0,
                textStyle: { color: '#fff' }
            },
            xAxis3D: {
                type: 'value',
                name: 'X'
            },
            yAxis3D: {
                type: 'value',
                name: 'Y'
            },
            zAxis3D: {
                type: 'value',
                name: 'Z'
            },
            grid3D: {
                viewControl: {
                    projection: 'perspective',
                    autoRotate: autoRotate,
                    autoRotateSpeed: rotateSpeed
                },
                light: {
                    main: { intensity: 1.2 },
                    ambient: { intensity: 0.3 }
                }
            },
            series: [{
                type: 'scatter3D',
                data: scatter3DData,
                symbolSize: symbolSize,
                itemStyle: {
                    opacity: 0.8
                },
                label: {
                    show: showValues,
                    formatter: function (params) {
                        return params.value[1];
                    },
                    textStyle: {
                        fontSize: labelFontSize,
                        fontWeight: labelFontWeight,
                        color: labelColor
                    }
                },
                emphasis: {
                    itemStyle: {
                        opacity: 1
                    }
                }
            }]
        };

        chart.setOption(option);
        return chart;
    },

    /**
     * Create a 3D surface chart
     */
    createSurface3DChart(container, data, options = {}) {
        const chart = echarts.init(container);

        // Parse options - support both array (colors) and object format
        const customColors = Array.isArray(options) ? options : options?.customColors;
        const autoRotate = options.autoRotate !== undefined ? options.autoRotate : true;
        const rotateSpeed = options.rotateSpeed || 3;
        const wireframe = options.wireframe !== undefined ? options.wireframe : true;
        const showValues = options.showValues !== undefined ? options.showValues : false;

        // Data label styling options
        const labelFontSize = options.labelFontSize || 12;
        const labelFontWeight = options.labelFontWeight || 'bold';
        const labelColor = options.labelColor || '#333';

        // Custom gradient colors for surface
        let gradientColors = ChartColorsConfig?.gradientPresets?.coolWarm?.colors || ['#3b82f6', '#60a5fa', '#fef3c7', '#fbbf24', '#f97316', '#ef4444'];

        if (customColors && customColors.length >= 2) {
            gradientColors = customColors;
        } else if (typeof ChartColorsConfig !== 'undefined') {
            const rec = ChartColorsConfig.getRecommendedColors('surface', 6);
            if (rec && rec.length >= 2) gradientColors = rec;
        }

        // Generate surface data from input
        const surfaceData = [];
        const xCount = data.labels.length;
        const yCount = data.datasets.length;

        for (let y = 0; y < yCount; y++) {
            for (let x = 0; x < xCount; x++) {
                surfaceData.push([x, y, data.datasets[y].data[x] || 0]);
            }
        }

        const option = {
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderWidth: 0,
                textStyle: { color: '#fff' }
            },
            visualMap: {
                show: true,
                dimension: 2,
                min: 0,
                max: Math.max(...data.datasets.flatMap(ds => ds.data)),
                inRange: {
                    color: gradientColors
                }
            },
            xAxis3D: {
                type: 'value',
                name: 'X'
            },
            yAxis3D: {
                type: 'value',
                name: 'Y'
            },
            zAxis3D: {
                type: 'value',
                name: 'Z'
            },
            grid3D: {
                viewControl: {
                    projection: 'perspective',
                    autoRotate: autoRotate,
                    autoRotateSpeed: rotateSpeed
                }
            },
            series: [{
                type: 'surface',
                wireframe: {
                    show: wireframe
                },
                shading: 'color',
                data: surfaceData,
                label: {
                    show: showValues,
                    textStyle: {
                        fontSize: labelFontSize,
                        fontWeight: labelFontWeight,
                        color: labelColor
                    }
                }
            }]
        };

        chart.setOption(option);
        return chart;
    },

    /**
     * Create a globe chart
     */
    createGlobeChart(container, data, options = {}) {
        const chart = echarts.init(container);

        // Parse options - support both array (colors) and object format
        const customColors = Array.isArray(options) ? options : options?.customColors;
        const autoRotate = options.autoRotate !== undefined ? options.autoRotate : true;
        const rotateSpeed = options.rotateSpeed || 3;
        const symbolSize = options.symbolSize || 8;
        const showValues = options.showValues !== undefined ? options.showValues : false;

        // Data label styling options
        const labelFontSize = options.labelFontSize || 12;
        const labelFontWeight = options.labelFontWeight || 'bold';
        const labelColor = options.labelColor || 'inherit';

        // Custom color for scatter points
        const defaultColors = ChartColorsConfig?.presets?.default?.colors || ['#f97316', '#ec4899'];
        const mainColor = customColors && customColors[0] ? customColors[0] : (defaultColors[4] || '#f97316');
        const emphasisColor = customColors && customColors[1] ? customColors[1] : (defaultColors[2] || '#ec4899');

        // Generate globe scatter data
        const globeData = data.labels.map((label, i) => ({
            name: label,
            value: [
                (i * 30) % 360 - 180,  // longitude
                (i * 20) % 180 - 90,   // latitude
                data.datasets[0]?.data[i] || 10
            ]
        }));

        const option = {
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderWidth: 0,
                textStyle: { color: '#fff' },
                formatter: function (params) {
                    return `${params.name}: ${params.value[2]}`;
                }
            },
            globe: {
                baseTexture: 'data:image/svg+xml,' + encodeURIComponent(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="2048" height="1024">
                        <rect fill="#1a365d" width="2048" height="1024"/>
                        <rect fill="#2d4a6f" x="100" y="200" width="400" height="300" rx="20"/>
                        <rect fill="#2d4a6f" x="600" y="100" width="300" height="400" rx="20"/>
                        <rect fill="#2d4a6f" x="1000" y="300" width="500" height="350" rx="20"/>
                        <rect fill="#2d4a6f" x="1600" y="150" width="350" height="500" rx="20"/>
                    </svg>
                `),
                shading: 'lambert',
                environment: 'auto',
                viewControl: {
                    autoRotate: autoRotate,
                    autoRotateSpeed: rotateSpeed
                },
                light: {
                    ambient: { intensity: 0.5 },
                    main: { intensity: 1.5 }
                }
            },
            series: [{
                type: 'scatter3D',
                coordinateSystem: 'globe',
                data: globeData,
                symbolSize: function (val) {
                    return Math.max(symbolSize, val[2] / 5);
                },
                itemStyle: {
                    color: mainColor,
                    opacity: 0.8
                },
                emphasis: {
                    itemStyle: {
                        color: emphasisColor
                    }
                },
                label: {
                    show: showValues,
                    formatter: function (params) {
                        return params.name + ': ' + params.value[2];
                    },
                    textStyle: {
                        fontSize: labelFontSize,
                        fontWeight: labelFontWeight,
                        color: labelColor
                    }
                }
            }]
        };

        chart.setOption(option);
        return chart;
    },

    /**
     * Create a 3D line chart
     */
    createLine3DChart(container, data, options = {}) {
        const chart = echarts.init(container);

        // Parse options - support both array (colors) and object format
        const customColors = Array.isArray(options) ? options : options?.customColors;
        const lineWidth = options.lineWidth || 4;
        const autoRotate = options.autoRotate !== undefined ? options.autoRotate : true;
        const rotateSpeed = options.rotateSpeed || 5;
        const showValues = options.showValues !== undefined ? options.showValues : false;

        // Data label styling options
        const labelFontSize = options.labelFontSize || 12;
        const labelFontWeight = options.labelFontWeight || 'bold';
        const labelColor = options.labelColor || 'inherit';

        let colors;
        if (customColors && customColors.length > 0) {
            colors = BasicCharts.generateColors(customColors, data.datasets.length);
        } else {
            colors = BasicCharts.getColorPalette(data.datasets.length);
        }

        const series = data.datasets.map((ds, idx) => ({
            type: 'line3D',
            data: ds.data.map((val, i) => [i, idx, val]),
            lineStyle: {
                width: lineWidth,
                color: colors[idx]
            },
            label: {
                show: showValues,
                formatter: function (params) {
                    return params.value[2];
                },
                textStyle: {
                    fontSize: labelFontSize,
                    fontWeight: labelFontWeight,
                    color: labelColor
                }
            }
        }));

        const option = {
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderWidth: 0,
                textStyle: { color: '#fff' }
            },
            xAxis3D: {
                type: 'value',
                name: 'Index'
            },
            yAxis3D: {
                type: 'value',
                name: 'Series'
            },
            zAxis3D: {
                type: 'value',
                name: 'Value'
            },
            grid3D: {
                viewControl: {
                    projection: 'perspective',
                    autoRotate: autoRotate,
                    autoRotateSpeed: rotateSpeed
                }
            },
            series: series
        };

        chart.setOption(option);
        return chart;
    }
};

// Export
window.Charts3D = Charts3D;
