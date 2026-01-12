/**
 * Combo Charts - 组合图表实现
 * Bar+Line, Area+Line, Bar+Area, Dual Axis charts using Chart.js
 * Allows overlaying different chart types for advanced data visualization
 */

/**
 * Helper function to get axis style configuration for Chart.js combo charts
 * @param {Object} options - Chart options containing axis style settings
 * @returns {Object} Axis style configuration object
 */
function getComboAxisStyleConfig(options) {
    const axisFontSize = options.axisFontSize || 12;
    const axisFontColor = options.axisFontColor || '#666666';
    const axisFontWeight = options.axisFontWeight || 'normal';
    const axisLineWidth = options.axisLineWidth !== undefined ? options.axisLineWidth : 1;
    const axisLineColor = options.axisLineColor || '#cccccc';
    const gridLineWidth = options.gridLineWidth !== undefined ? options.gridLineWidth : 1;
    const gridLineColor = options.gridLineColor || '#eeeeee';

    return {
        ticks: {
            font: {
                size: axisFontSize,
                weight: axisFontWeight
            },
            color: axisFontColor
        },
        border: {
            color: axisLineColor,
            width: axisLineWidth
        },
        grid: {
            color: gridLineColor,
            lineWidth: gridLineWidth
        }
    };
}

const ComboCharts = {
    /**
     * Create a bar + line combo chart (柱线组合图)
     * First dataset as bar, remaining as line with optional dual Y-axis
     */
    createBarLineChart(ctx, data, options = {}) {
        const showValues = options.showValues || false;
        const labelFontSize = options.labelFontSize || 12;
        const labelFontWeight = options.labelFontWeight || 'bold';
        const labelColor = options.labelColor || '#333';
        const useDualAxis = options.useDualAxis !== undefined ? options.useDualAxis : true;

        const defaultOptions = {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    top: options.layoutPadding !== undefined ? options.layoutPadding : 20
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    cornerRadius: 8
                },
                datalabels: {
                    display: showValues,
                    color: labelColor,
                    anchor: 'end',
                    align: 'top',
                    offset: 4,
                    font: { weight: labelFontWeight, size: labelFontSize },
                    formatter: (value) => value
                },
                zoom: {
                    zoom: {
                        wheel: { enabled: false },
                        pinch: { enabled: true },
                        mode: 'xy'
                    },
                    pan: {
                        enabled: true,
                        mode: 'xy'
                    }
                }
            },
            scales: (() => {
                const axisStyle = getComboAxisStyleConfig(options);
                return {
                    x: {
                        grid: { display: false, ...axisStyle.grid },
                        ticks: axisStyle.ticks,
                        border: axisStyle.border,
                        min: options.xAxisMin ?? undefined,
                        max: options.xAxisMax ?? undefined
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        beginAtZero: true,
                        grid: axisStyle.grid,
                        ticks: {
                            ...axisStyle.ticks,
                            stepSize: options.yAxisStep ?? undefined
                        },
                        border: axisStyle.border,
                        min: options.yAxisMin ?? undefined,
                        max: options.yAxisMax ?? undefined,
                        title: {
                            display: options.yAxisLabel ? true : false,
                            text: options.yAxisLabel || ''
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: useDualAxis,
                        position: 'right',
                        beginAtZero: true,
                        grid: { drawOnChartArea: false },
                        ticks: axisStyle.ticks,
                        border: axisStyle.border,
                        title: {
                            display: options.y1AxisLabel ? true : false,
                            text: options.y1AxisLabel || ''
                        }
                    }
                };
            })(),
            animation: {
                duration: 800,
                easing: 'easeOutQuart'
            }
        };

        // Get colors
        const customColors = options.customColors;
        const seriesColors = options.seriesColors || {};

        let colors;
        if (customColors && customColors.length > 0) {
            colors = BasicCharts.generateColors(customColors, data.datasets.length);
        } else {
            colors = BasicCharts.getColorPalette(data.datasets.length);
        }

        if (Object.keys(seriesColors).length > 0) {
            colors = colors.map((c, i) => seriesColors[i] || c);
        }

        const barBorderRadius = options.barBorderRadius !== undefined ? options.barBorderRadius : 6;
        const lineTension = options.lineTension !== undefined ? options.lineTension : 0.4;
        const lineWidth = options.lineWidth !== undefined ? options.lineWidth : 3;

        const chartData = {
            labels: data.labels,
            datasets: data.datasets.map((ds, i) => {
                if (i === 0) {
                    // First dataset as bar
                    return {
                        label: ds.label || `数据集 ${i + 1}`,
                        data: ds.data,
                        type: 'bar',
                        backgroundColor: BasicCharts.hexToRgba(colors[i], 0.7),
                        borderColor: colors[i],
                        borderWidth: 0,
                        borderRadius: barBorderRadius,
                        yAxisID: 'y',
                        order: 2
                    };
                } else {
                    // Other datasets as line
                    return {
                        label: ds.label || `数据集 ${i + 1}`,
                        data: ds.data,
                        type: 'line',
                        borderColor: colors[i],
                        backgroundColor: BasicCharts.hexToRgba(colors[i], 0.1),
                        borderWidth: lineWidth,
                        pointBackgroundColor: colors[i],
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        tension: lineTension,
                        fill: false,
                        yAxisID: useDualAxis ? 'y1' : 'y',
                        order: 1
                    };
                }
            })
        };

        return new Chart(ctx, {
            type: 'bar',
            data: chartData,
            options: { ...defaultOptions, ...options }
        });
    },

    /**
     * Create an area + line combo chart (面积线组合图)
     * First dataset as area, remaining as line
     */
    createAreaLineChart(ctx, data, options = {}) {
        const showValues = options.showValues || false;
        const labelFontSize = options.labelFontSize || 12;
        const labelFontWeight = options.labelFontWeight || 'bold';
        const labelColor = options.labelColor || '#333';
        const useDualAxis = options.useDualAxis !== undefined ? options.useDualAxis : true;

        const defaultOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    cornerRadius: 8
                },
                datalabels: {
                    display: showValues,
                    color: labelColor,
                    anchor: 'end',
                    align: 'top',
                    offset: 4,
                    font: { weight: labelFontWeight, size: labelFontSize },
                    formatter: (value) => value
                },
                zoom: {
                    zoom: {
                        wheel: { enabled: false },
                        pinch: { enabled: true },
                        mode: 'xy'
                    },
                    pan: {
                        enabled: true,
                        mode: 'xy'
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    min: options.xAxisMin ?? undefined,
                    max: options.xAxisMax ?? undefined
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    beginAtZero: true,
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                    min: options.yAxisMin ?? undefined,
                    max: options.yAxisMax ?? undefined,
                    ticks: {
                        stepSize: options.yAxisStep ?? undefined
                    }
                },
                y1: {
                    type: 'linear',
                    display: useDualAxis,
                    position: 'right',
                    beginAtZero: true,
                    grid: { drawOnChartArea: false }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            },
            animation: {
                duration: 800,
                easing: 'easeOutQuart'
            }
        };

        const customColors = options.customColors;
        const seriesColors = options.seriesColors || {};

        let colors;
        if (customColors && customColors.length > 0) {
            colors = BasicCharts.generateColors(customColors, data.datasets.length);
        } else {
            colors = BasicCharts.getColorPalette(data.datasets.length);
        }

        if (Object.keys(seriesColors).length > 0) {
            colors = colors.map((c, i) => seriesColors[i] || c);
        }

        const areaTension = options.areaTension !== undefined ? options.areaTension : 0.4;
        // Support both fillOpacity and areaOpacity for consistency with other charts
        const areaOpacity = options.fillOpacity !== undefined ? options.fillOpacity : (options.areaOpacity !== undefined ? options.areaOpacity : 0.3);
        const lineTension = options.lineTension !== undefined ? options.lineTension : 0.4;
        const lineWidth = options.lineWidth !== undefined ? options.lineWidth : 3;

        const chartData = {
            labels: data.labels,
            datasets: data.datasets.map((ds, i) => {
                if (i === 0) {
                    // First dataset as area
                    return {
                        label: ds.label || `数据集 ${i + 1}`,
                        data: ds.data,
                        borderColor: colors[i],
                        backgroundColor: BasicCharts.hexToRgba(colors[i], areaOpacity),
                        borderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        pointBackgroundColor: colors[i],
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        tension: areaTension,
                        fill: true,
                        yAxisID: 'y',
                        order: 2
                    };
                } else {
                    // Other datasets as line
                    return {
                        label: ds.label || `数据集 ${i + 1}`,
                        data: ds.data,
                        borderColor: colors[i],
                        backgroundColor: 'transparent',
                        borderWidth: lineWidth,
                        pointBackgroundColor: colors[i],
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        tension: lineTension,
                        fill: false,
                        yAxisID: useDualAxis ? 'y1' : 'y',
                        order: 1
                    };
                }
            })
        };

        return new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: { ...defaultOptions, ...options }
        });
    },

    /**
     * Create a bar + area combo chart (柱面组合图)
     * First dataset as bar, remaining as area
     */
    createBarAreaChart(ctx, data, options = {}) {
        const showValues = options.showValues || false;
        const labelFontSize = options.labelFontSize || 12;
        const labelFontWeight = options.labelFontWeight || 'bold';
        const labelColor = options.labelColor || '#333';
        const useDualAxis = options.useDualAxis !== undefined ? options.useDualAxis : true;

        const defaultOptions = {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    top: options.layoutPadding !== undefined ? options.layoutPadding : 20
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    cornerRadius: 8
                },
                datalabels: {
                    display: showValues,
                    color: labelColor,
                    anchor: 'end',
                    align: 'top',
                    offset: 4,
                    font: { weight: labelFontWeight, size: labelFontSize },
                    formatter: (value) => value
                },
                zoom: {
                    zoom: {
                        wheel: { enabled: false },
                        pinch: { enabled: true },
                        mode: 'xy'
                    },
                    pan: {
                        enabled: true,
                        mode: 'xy'
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    min: options.xAxisMin ?? undefined,
                    max: options.xAxisMax ?? undefined
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    beginAtZero: true,
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                    min: options.yAxisMin ?? undefined,
                    max: options.yAxisMax ?? undefined,
                    ticks: {
                        stepSize: options.yAxisStep ?? undefined
                    }
                },
                y1: {
                    type: 'linear',
                    display: useDualAxis,
                    position: 'right',
                    beginAtZero: true,
                    grid: { drawOnChartArea: false }
                }
            },
            animation: {
                duration: 800,
                easing: 'easeOutQuart'
            }
        };

        const customColors = options.customColors;
        const seriesColors = options.seriesColors || {};

        let colors;
        if (customColors && customColors.length > 0) {
            colors = BasicCharts.generateColors(customColors, data.datasets.length);
        } else {
            colors = BasicCharts.getColorPalette(data.datasets.length);
        }

        if (Object.keys(seriesColors).length > 0) {
            colors = colors.map((c, i) => seriesColors[i] || c);
        }

        const barBorderRadius = options.barBorderRadius !== undefined ? options.barBorderRadius : 6;
        const areaTension = options.areaTension !== undefined ? options.areaTension : 0.4;
        // Support both fillOpacity and areaOpacity for consistency with other charts
        const areaOpacity = options.fillOpacity !== undefined ? options.fillOpacity : (options.areaOpacity !== undefined ? options.areaOpacity : 0.3);

        const chartData = {
            labels: data.labels,
            datasets: data.datasets.map((ds, i) => {
                if (i === 0) {
                    // First dataset as bar
                    return {
                        label: ds.label || `数据集 ${i + 1}`,
                        data: ds.data,
                        type: 'bar',
                        backgroundColor: BasicCharts.hexToRgba(colors[i], 0.7),
                        borderColor: colors[i],
                        borderWidth: 0,
                        borderRadius: barBorderRadius,
                        yAxisID: 'y',
                        order: 2
                    };
                } else {
                    // Other datasets as area (line with fill)
                    return {
                        label: ds.label || `数据集 ${i + 1}`,
                        data: ds.data,
                        type: 'line',
                        borderColor: colors[i],
                        backgroundColor: BasicCharts.hexToRgba(colors[i], areaOpacity),
                        borderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        pointBackgroundColor: colors[i],
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        tension: areaTension,
                        fill: true,
                        yAxisID: useDualAxis ? 'y1' : 'y',
                        order: 1
                    };
                }
            })
        };

        return new Chart(ctx, {
            type: 'bar',
            data: chartData,
            options: { ...defaultOptions, ...options }
        });
    },

    /**
     * Create a dual axis chart (双Y轴图)
     * Customizable primary and secondary chart types
     */
    createDualAxisChart(ctx, data, options = {}) {
        const showValues = options.showValues || false;
        const labelFontSize = options.labelFontSize || 12;
        const labelFontWeight = options.labelFontWeight || 'bold';
        const labelColor = options.labelColor || '#333';

        // Allow user to specify chart types for each axis
        const primaryType = options.primaryType || 'bar';
        const secondaryType = options.secondaryType || 'line';

        const defaultOptions = {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    top: options.layoutPadding !== undefined ? options.layoutPadding : 20
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    cornerRadius: 8
                },
                datalabels: {
                    display: showValues,
                    color: labelColor,
                    anchor: 'end',
                    align: 'top',
                    offset: 4,
                    font: { weight: labelFontWeight, size: labelFontSize },
                    formatter: (value) => value
                },
                zoom: {
                    zoom: {
                        wheel: { enabled: false },
                        pinch: { enabled: true },
                        mode: 'xy'
                    },
                    pan: {
                        enabled: true,
                        mode: 'xy'
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    min: options.xAxisMin ?? undefined,
                    max: options.xAxisMax ?? undefined
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    beginAtZero: true,
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                    min: options.yAxisMin ?? undefined,
                    max: options.yAxisMax ?? undefined,
                    ticks: {
                        stepSize: options.yAxisStep ?? undefined
                    },
                    title: {
                        display: options.yAxisLabel ? true : false,
                        text: options.yAxisLabel || ''
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    beginAtZero: true,
                    grid: { drawOnChartArea: false },
                    min: options.y1AxisMin ?? undefined,
                    max: options.y1AxisMax ?? undefined,
                    ticks: {
                        stepSize: options.y1AxisStep ?? undefined
                    },
                    title: {
                        display: options.y1AxisLabel ? true : false,
                        text: options.y1AxisLabel || ''
                    }
                }
            },
            animation: {
                duration: 800,
                easing: 'easeOutQuart'
            }
        };

        const customColors = options.customColors;
        const seriesColors = options.seriesColors || {};

        let colors;
        if (customColors && customColors.length > 0) {
            colors = BasicCharts.generateColors(customColors, data.datasets.length);
        } else {
            colors = BasicCharts.getColorPalette(data.datasets.length);
        }

        if (Object.keys(seriesColors).length > 0) {
            colors = colors.map((c, i) => seriesColors[i] || c);
        }

        const createDataset = (ds, i, type, yAxisID, order) => {
            const color = colors[i];
            const baseDataset = {
                label: ds.label || `数据集 ${i + 1}`,
                data: ds.data,
                yAxisID: yAxisID,
                order: order
            };

            if (type === 'bar') {
                return {
                    ...baseDataset,
                    type: 'bar',
                    backgroundColor: BasicCharts.hexToRgba(color, 0.7),
                    borderColor: color,
                    borderWidth: 0,
                    borderRadius: options.barBorderRadius ?? 6
                };
            } else if (type === 'line') {
                return {
                    ...baseDataset,
                    type: 'line',
                    borderColor: color,
                    backgroundColor: BasicCharts.hexToRgba(color, 0.1),
                    borderWidth: options.lineWidth ?? 3,
                    pointBackgroundColor: color,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    tension: options.lineTension ?? 0.4,
                    fill: false
                };
            } else if (type === 'area') {
                return {
                    ...baseDataset,
                    type: 'line',
                    borderColor: color,
                    backgroundColor: BasicCharts.hexToRgba(color, options.areaOpacity ?? 0.3),
                    borderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointBackgroundColor: color,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    tension: options.areaTension ?? 0.4,
                    fill: true
                };
            }
            return baseDataset;
        };

        const chartData = {
            labels: data.labels,
            datasets: data.datasets.map((ds, i) => {
                if (i === 0) {
                    return createDataset(ds, i, primaryType, 'y', 2);
                } else {
                    return createDataset(ds, i, secondaryType, 'y1', 1);
                }
            })
        };

        return new Chart(ctx, {
            type: primaryType === 'bar' ? 'bar' : 'line',
            data: chartData,
            options: { ...defaultOptions, ...options }
        });
    },

    /**
     * Create a fully customizable combo chart (自定义组合图)
     * Each series can have its own chart type (bar/line/area/scatter) and axis (primary/secondary)
     * 
     * seriesConfig format: { 0: { type: 'bar', axis: 'primary' }, 1: { type: 'line', axis: 'secondary' }, ... }
     * Supported types: 'bar', 'line', 'area', 'scatter'
     * Supported axis: 'primary' (left Y-axis), 'secondary' (right Y-axis)
     */
    createCustomComboChart(ctx, data, options = {}) {
        const showValues = options.showValues || false;
        const labelFontSize = options.labelFontSize || 12;
        const labelFontWeight = options.labelFontWeight || 'bold';
        const labelColor = options.labelColor || '#333';

        // Get series configuration from options
        const seriesConfig = options.seriesConfig || {};

        // Determine if we need dual axis
        const needsDualAxis = Object.values(seriesConfig).some(cfg => cfg.axis === 'secondary');

        // Style options
        const barBorderRadius = options.barBorderRadius !== undefined ? options.barBorderRadius : 6;
        const barPercentage = options.barPercentage !== undefined ? options.barPercentage : 0.7;
        const lineTension = options.lineTension !== undefined ? options.lineTension : 0.4;
        const lineWidth = options.lineWidth !== undefined ? options.lineWidth : 3;
        const areaOpacity = options.areaOpacity !== undefined ? options.areaOpacity : 0.3;
        const pointRadius = options.pointRadius !== undefined ? options.pointRadius : 5;
        const scatterPointRadius = options.scatterPointRadius !== undefined ? options.scatterPointRadius : 8;

        const defaultOptions = {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    top: options.layoutPadding !== undefined ? options.layoutPadding : 20
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    cornerRadius: 8
                },
                datalabels: {
                    display: showValues,
                    color: labelColor,
                    anchor: 'end',
                    align: 'top',
                    offset: 4,
                    font: { weight: labelFontWeight, size: labelFontSize },
                    formatter: (value) => value
                },
                zoom: {
                    zoom: {
                        wheel: { enabled: false },
                        pinch: { enabled: true },
                        mode: 'xy'
                    },
                    pan: {
                        enabled: true,
                        mode: 'xy'
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    min: options.xAxisMin ?? undefined,
                    max: options.xAxisMax ?? undefined
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    beginAtZero: true,
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                    min: options.yAxisMin ?? undefined,
                    max: options.yAxisMax ?? undefined,
                    ticks: {
                        stepSize: options.yAxisStep ?? undefined
                    },
                    title: {
                        display: options.yAxisLabel ? true : false,
                        text: options.yAxisLabel || ''
                    }
                },
                y1: {
                    type: 'linear',
                    display: needsDualAxis,
                    position: 'right',
                    beginAtZero: true,
                    grid: { drawOnChartArea: false },
                    min: options.y1AxisMin ?? undefined,
                    max: options.y1AxisMax ?? undefined,
                    ticks: {
                        stepSize: options.y1AxisStep ?? undefined
                    },
                    title: {
                        display: options.y1AxisLabel ? true : false,
                        text: options.y1AxisLabel || ''
                    }
                }
            },
            animation: {
                duration: 800,
                easing: 'easeOutQuart'
            }
        };

        // Get colors
        const customColors = options.customColors;
        const seriesColors = options.seriesColors || {};

        let colors;
        if (customColors && customColors.length > 0) {
            colors = BasicCharts.generateColors(customColors, data.datasets.length);
        } else {
            colors = BasicCharts.getColorPalette(data.datasets.length);
        }

        if (Object.keys(seriesColors).length > 0) {
            colors = colors.map((c, i) => seriesColors[i] || c);
        }

        /**
         * Create dataset configuration based on type
         */
        const createDatasetConfig = (ds, index, config) => {
            const color = colors[index];
            const type = config.type || (index === 0 ? 'bar' : 'line');
            const axis = config.axis || 'primary';
            const yAxisID = axis === 'secondary' ? 'y1' : 'y';

            const baseConfig = {
                label: ds.label || `系列 ${index + 1}`,
                data: ds.data,
                yAxisID: yAxisID
            };

            switch (type) {
                case 'bar':
                    return {
                        ...baseConfig,
                        type: 'bar',
                        backgroundColor: BasicCharts.hexToRgba(color, 0.7),
                        borderColor: color,
                        borderWidth: 0,
                        borderRadius: barBorderRadius,
                        barPercentage: barPercentage,
                        order: 3  // Bars render behind lines
                    };

                case 'line':
                    return {
                        ...baseConfig,
                        type: 'line',
                        borderColor: color,
                        backgroundColor: 'transparent',
                        borderWidth: lineWidth,
                        pointBackgroundColor: color,
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: pointRadius,
                        pointHoverRadius: pointRadius + 2,
                        tension: lineTension,
                        fill: false,
                        order: 1  // Lines render on top
                    };

                case 'area':
                    // Use fillOpacity if provided, otherwise fall back to areaOpacity
                    const effectiveAreaOpacity = options.fillOpacity !== undefined ? options.fillOpacity : areaOpacity;
                    return {
                        ...baseConfig,
                        type: 'line',
                        borderColor: color,
                        backgroundColor: BasicCharts.hexToRgba(color, effectiveAreaOpacity),
                        borderWidth: 2,
                        pointBackgroundColor: color,
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: pointRadius - 1,
                        pointHoverRadius: pointRadius + 1,
                        tension: lineTension,
                        fill: true,
                        order: 2  // Areas render between bars and lines
                    };

                case 'scatter':
                    // Convert array data to scatter-compatible {x, y} format
                    const scatterData = Array.isArray(ds.data) && typeof ds.data[0] === 'number'
                        ? ds.data.map((y, idx) => ({ x: idx, y: y }))
                        : ds.data;  // Already in correct format
                    return {
                        ...baseConfig,
                        type: 'scatter',
                        data: scatterData,  // Override baseConfig.data with converted format
                        backgroundColor: BasicCharts.hexToRgba(color, 0.7),
                        borderColor: color,
                        borderWidth: 2,
                        pointRadius: scatterPointRadius,
                        pointHoverRadius: scatterPointRadius + 3,
                        pointStyle: 'circle',
                        order: 0  // Scatter points render on very top
                    };

                default:
                    // Default to line
                    return {
                        ...baseConfig,
                        type: 'line',
                        borderColor: color,
                        backgroundColor: 'transparent',
                        borderWidth: lineWidth,
                        pointRadius: pointRadius,
                        tension: lineTension,
                        fill: false,
                        order: 1
                    };
            }
        };

        // Build datasets with per-series configuration
        const chartData = {
            labels: data.labels,
            datasets: data.datasets.map((ds, i) => {
                // Get config for this series, or use defaults
                const config = seriesConfig[i] || {
                    type: i === 0 ? 'bar' : 'line',
                    axis: 'primary'
                };
                return createDatasetConfig(ds, i, config);
            })
        };

        // Determine base chart type (prefer bar if any bars exist)
        const hasBar = Object.values(seriesConfig).some(cfg => cfg.type === 'bar') ||
            (Object.keys(seriesConfig).length === 0 && data.datasets.length > 0);
        const baseType = hasBar ? 'bar' : 'line';

        return new Chart(ctx, {
            type: baseType,
            data: chartData,
            options: { ...defaultOptions, ...options }
        });
    }
};

// Export
window.ComboCharts = ComboCharts;

