/**
 * Advanced Charts - 高级图表实现
 * Scatter, Bubble, Radar, Area, Stacked, Polar charts
 */

/**
 * Helper function to get axis style configuration for Chart.js
 * @param {Object} options - Chart options containing axis style settings
 * @returns {Object} Axis style configuration object
 */
function getAdvancedAxisStyleConfig(options) {
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

/**
 * Calculate smart padding based on data labels visibility and font size
 * Ensures labels never get clipped by chart boundaries
 * User custom padding values ADD to the smart padding (not replace)
 * @param {Object} options - Chart options
 * @returns {Object} Padding configuration {top, right, bottom, left}
 */
function calculateSmartPadding(options) {
    const showValues = options.showValues || false;
    const labelFontSize = options.labelFontSize || 12;

    // Base padding values - minimum required for clean display
    const basePadding = {
        top: 20,
        right: 20,
        bottom: 10,
        left: 10
    };

    if (showValues) {
        // Add extra padding based on label font size to prevent clipping
        // Labels typically need ~1.5x their font size as extra space
        const labelPadding = Math.ceil(labelFontSize * 1.8);
        basePadding.top += labelPadding;
        basePadding.right += labelPadding + 20;  // Extra for percentage values like "100%"
        basePadding.bottom += Math.ceil(labelFontSize * 0.5);
    }

    // User custom padding values ADD to the smart padding (for extra anti-clipping adjustment)
    // This ensures user adjustments always increase space, never reduce below smart minimum
    if (options.layoutPadding !== undefined && options.layoutPadding > 0) {
        basePadding.top += options.layoutPadding;
    }
    if (options.paddingRight !== undefined && options.paddingRight > 0) {
        basePadding.right += options.paddingRight;
    }
    if (options.paddingBottom !== undefined && options.paddingBottom > 0) {
        basePadding.bottom += options.paddingBottom;
    }
    if (options.paddingLeft !== undefined && options.paddingLeft > 0) {
        basePadding.left += options.paddingLeft;
    }

    return basePadding;
}

/**
 * Get smart datalabels configuration that prevents clipping
 * Uses dynamic positioning based on data values
 * @param {Object} options - Chart options
 * @param {boolean} isPercentage - Whether the chart shows percentages
 * @param {Function} customFormatter - Optional custom formatter function
 * @returns {Object} Datalabels plugin configuration
 */
function getSmartDatalabelsConfig(options, isPercentage = false, customFormatter = null) {
    const showValues = options.showValues || false;
    const labelFontSize = options.labelFontSize || 12;
    const labelFontWeight = options.labelFontWeight || 'bold';
    const labelColor = options.labelColor || '#333';

    return {
        display: showValues,
        color: labelColor,
        font: {
            weight: labelFontWeight,
            size: labelFontSize
        },
        // Place labels at center to avoid edge clipping
        anchor: 'center',
        align: 'center',
        offset: 0,
        // Smart positioning: adjust based on value to avoid edges
        formatter: customFormatter || ((value, context) => {
            if (isPercentage) {
                // For percentage charts, only show if value is significant enough
                const displayValue = typeof value === 'number' ? value : 0;
                return displayValue > 8 ? `${displayValue.toFixed(0)}%` : '';
            }
            return value;
        }),
        // Clip handling - allow labels outside chart area but constrain to canvas
        clip: false,
        clamp: true,
        // Background for better readability when labels overlap
        backgroundColor: function (context) {
            // Only add background if value is at edge positions
            return null;  // No background by default, can be customized
        },
        borderRadius: 4,
        padding: { top: 2, bottom: 2, left: 4, right: 4 }
    };
}

const AdvancedCharts = {
    /**
     * Create a scatter chart
     */
    createScatterChart(ctx, data, options = {}) {
        const showValues = options.showValues || false;
        // Data label styling options
        const labelFontSize = options.labelFontSize || 12;
        const labelFontWeight = options.labelFontWeight || 'bold';
        const labelColor = options.labelColor || '#333';

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
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function (context) {
                            return `(${context.parsed.x}, ${context.parsed.y})`;
                        }
                    }
                },
                datalabels: {
                    display: showValues,
                    color: labelColor,
                    anchor: 'end',
                    align: 'top',
                    offset: 4,
                    font: { weight: labelFontWeight, size: labelFontSize },
                    formatter: (value) => value.y
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
                const axisStyle = getAdvancedAxisStyleConfig(options);
                return {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        grid: axisStyle.grid,
                        ticks: axisStyle.ticks,
                        border: axisStyle.border,
                        min: options.xAxisMin !== undefined && options.xAxisMin !== null ? options.xAxisMin : undefined,
                        max: options.xAxisMax !== undefined && options.xAxisMax !== null ? options.xAxisMax : undefined
                    },
                    y: {
                        grid: axisStyle.grid,
                        ticks: {
                            ...axisStyle.ticks,
                            stepSize: options.yAxisStep !== undefined && options.yAxisStep !== null ? options.yAxisStep : undefined
                        },
                        border: axisStyle.border,
                        min: options.yAxisMin !== undefined && options.yAxisMin !== null ? options.yAxisMin : undefined,
                        max: options.yAxisMax !== undefined && options.yAxisMax !== null ? options.yAxisMax : undefined
                    }
                };
            })(),
            animation: {
                duration: 800,
                easing: 'easeOutQuart'
            }
        };

        // Support series colors from options
        const seriesColors = options.seriesColors || {};
        const customColors = options.customColors;

        let colors;
        if (customColors && customColors.length > 0) {
            colors = BasicCharts.generateColors(customColors, data.datasets.length);
        } else {
            colors = BasicCharts.getColorPalette(data.datasets.length);
        }

        if (Object.keys(seriesColors).length > 0) {
            colors = colors.map((c, i) => seriesColors[i] || c);
        }

        // Apply fillOpacity option (default 0.6)
        const fillOpacity = options.fillOpacity !== undefined ? options.fillOpacity : 0.6;

        // Convert standard data to scatter format
        const chartData = {
            datasets: data.datasets.map((ds, i) => ({
                label: ds.label || `Dataset ${i + 1}`,
                data: ds.data.map((y, idx) => ({ x: idx + 1, y: y })),
                backgroundColor: BasicCharts.hexToRgba(colors[i], fillOpacity),
                borderColor: colors[i],
                borderWidth: options.borderWidth !== undefined ? options.borderWidth : 2,
                pointRadius: options.pointRadius !== undefined ? options.pointRadius : 8,
                pointHoverRadius: options.pointHoverRadius !== undefined ? options.pointHoverRadius : 10
            }))
        };

        return new Chart(ctx, {
            type: 'scatter',
            data: chartData,
            options: { ...defaultOptions, ...options }
        });
    },

    /**
     * Create a bubble chart
     */
    createBubbleChart(ctx, data, options = {}) {
        const showValues = options.showValues || false;
        // Data label styling options
        const labelFontSize = options.labelFontSize || 12;
        const labelFontWeight = options.labelFontWeight || 'bold';
        const labelColor = options.labelColor || '#333';

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
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function (context) {
                            const p = context.raw;
                            return `x: ${p.x}, y: ${p.y}, size: ${p.r}`;
                        }
                    }
                },
                datalabels: {
                    display: showValues,
                    color: labelColor,
                    anchor: 'center',
                    align: 'center',
                    font: { weight: labelFontWeight, size: labelFontSize },
                    formatter: (value) => value.y
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
                const axisStyle = getAdvancedAxisStyleConfig(options);
                return {
                    x: {
                        grid: axisStyle.grid,
                        ticks: axisStyle.ticks,
                        border: axisStyle.border,
                        min: options.xAxisMin !== undefined && options.xAxisMin !== null ? options.xAxisMin : undefined,
                        max: options.xAxisMax !== undefined && options.xAxisMax !== null ? options.xAxisMax : undefined
                    },
                    y: {
                        grid: axisStyle.grid,
                        ticks: {
                            ...axisStyle.ticks,
                            stepSize: options.yAxisStep !== undefined && options.yAxisStep !== null ? options.yAxisStep : undefined
                        },
                        border: axisStyle.border,
                        min: options.yAxisMin !== undefined && options.yAxisMin !== null ? options.yAxisMin : undefined,
                        max: options.yAxisMax !== undefined && options.yAxisMax !== null ? options.yAxisMax : undefined
                    }
                };
            })(),
            animation: {
                duration: 800,
                easing: 'easeOutQuart'
            }
        };

        // Support series colors from options
        const seriesColors = options.seriesColors || {};
        const customColors = options.customColors;

        let colors;
        if (customColors && customColors.length > 0) {
            colors = BasicCharts.generateColors(customColors, data.datasets.length);
        } else {
            colors = BasicCharts.getColorPalette(data.datasets.length);
        }

        if (Object.keys(seriesColors).length > 0) {
            colors = colors.map((c, i) => seriesColors[i] || c);
        }

        // Apply fillOpacity option (default 0.6)
        const fillOpacity = options.fillOpacity !== undefined ? options.fillOpacity : 0.6;

        // Convert standard data to bubble format
        const chartData = {
            datasets: data.datasets.map((ds, i) => ({
                label: ds.label || `Dataset ${i + 1}`,
                data: ds.data.map((y, idx) => ({
                    x: idx + 1,
                    y: y,
                    r: Math.sqrt(y) * 2 + 5 // Size based on value
                })),
                backgroundColor: BasicCharts.hexToRgba(colors[i], fillOpacity),
                borderColor: colors[i],
                borderWidth: options.borderWidth !== undefined ? options.borderWidth : 2,
                hoverRadius: options.hoverRadius !== undefined ? options.hoverRadius : 4
            }))
        };

        return new Chart(ctx, {
            type: 'bubble',
            data: chartData,
            options: { ...defaultOptions, ...options }
        });
    },

    /**
     * Create a radar chart
     */
    createRadarChart(ctx, data, options = {}) {
        const showValues = options.showValues || false;
        // Data label styling options
        const labelFontSize = options.labelFontSize || 12;
        const labelFontWeight = options.labelFontWeight || 'bold';
        const labelColor = options.labelColor || '#333';

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
                }
            },
            scales: (() => {
                const axisStyle = getAdvancedAxisStyleConfig(options);
                return {
                    r: {
                        beginAtZero: true,
                        angleLines: {
                            color: axisStyle.grid.color
                        },
                        grid: {
                            color: axisStyle.grid.color,
                            lineWidth: axisStyle.grid.lineWidth
                        },
                        pointLabels: {
                            font: {
                                size: axisStyle.ticks.font.size,
                                weight: axisStyle.ticks.font.weight
                            },
                            color: axisStyle.ticks.color
                        },
                        ticks: {
                            font: axisStyle.ticks.font,
                            color: axisStyle.ticks.color,
                            stepSize: options.yAxisStep !== undefined && options.yAxisStep !== null ? options.yAxisStep : undefined
                        },
                        min: options.yAxisMin !== undefined && options.yAxisMin !== null ? options.yAxisMin : undefined,
                        max: options.yAxisMax !== undefined && options.yAxisMax !== null ? options.yAxisMax : undefined
                    }
                };
            })(),
            animation: {
                duration: 800,
                easing: 'easeOutQuart'
            }
        };

        // Support series colors from options
        const seriesColors = options.seriesColors || {};
        const customColors = options.customColors;

        let colors;
        if (customColors && customColors.length > 0) {
            colors = BasicCharts.generateColors(customColors, data.datasets.length);
        } else {
            colors = BasicCharts.getColorPalette(data.datasets.length);
        }

        if (Object.keys(seriesColors).length > 0) {
            colors = colors.map((c, i) => seriesColors[i] || c);
        }
        const fillOpacity = options.fillOpacity !== undefined ? options.fillOpacity : 0.2;

        const chartData = {
            labels: data.labels,
            datasets: data.datasets.map((ds, i) => ({
                label: ds.label || `Dataset ${i + 1}`,
                data: ds.data,
                backgroundColor: BasicCharts.hexToRgba(colors[i], fillOpacity),
                borderColor: colors[i],
                borderWidth: options.borderWidth !== undefined ? options.borderWidth : 2,
                pointBackgroundColor: colors[i],
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: options.pointRadius !== undefined ? options.pointRadius : 4,
                pointHoverRadius: options.pointRadius !== undefined ? options.pointRadius + 2 : 6,
                tension: options.tension !== undefined ? options.tension : 0  // Apply user-defined curve smoothness
            }))
        };

        return new Chart(ctx, {
            type: 'radar',
            data: chartData,
            options: { ...defaultOptions, ...options }
        });
    },

    /**
     * Create an area chart (filled line chart)
     */
    createAreaChart(ctx, data, options = {}) {
        const showValues = options.showValues || false;
        // Data label styling options
        const labelFontSize = options.labelFontSize || 12;
        const labelFontWeight = options.labelFontWeight || 'bold';
        const labelColor = options.labelColor || '#333';

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
            scales: (() => {
                const axisStyle = getAdvancedAxisStyleConfig(options);
                return {
                    x: {
                        grid: {
                            display: false,
                            ...axisStyle.grid
                        },
                        ticks: axisStyle.ticks,
                        border: axisStyle.border,
                        min: options.xAxisMin !== undefined && options.xAxisMin !== null ? options.xAxisMin : undefined,
                        max: options.xAxisMax !== undefined && options.xAxisMax !== null ? options.xAxisMax : undefined
                    },
                    y: {
                        beginAtZero: true,
                        grid: axisStyle.grid,
                        ticks: {
                            ...axisStyle.ticks,
                            stepSize: options.yAxisStep !== undefined && options.yAxisStep !== null ? options.yAxisStep : undefined
                        },
                        border: axisStyle.border,
                        min: options.yAxisMin !== undefined && options.yAxisMin !== null ? options.yAxisMin : undefined,
                        max: options.yAxisMax !== undefined && options.yAxisMax !== null ? options.yAxisMax : undefined
                    }
                };
            })(),
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

        // Support series colors from options
        const seriesColors = options.seriesColors || {};
        const customColors = options.customColors;

        let colors;
        if (customColors && customColors.length > 0) {
            colors = BasicCharts.generateColors(customColors, data.datasets.length);
        } else {
            colors = BasicCharts.getColorPalette(data.datasets.length);
        }

        if (Object.keys(seriesColors).length > 0) {
            colors = colors.map((c, i) => seriesColors[i] || c);
        }
        const fillOpacity = options.fillOpacity !== undefined ? options.fillOpacity : 0.3;

        const chartData = {
            labels: data.labels,
            datasets: data.datasets.map((ds, i) => ({
                label: ds.label || `Dataset ${i + 1}`,
                data: ds.data,
                borderColor: colors[i],
                backgroundColor: BasicCharts.hexToRgba(colors[i], fillOpacity),
                borderWidth: options.borderWidth !== undefined ? options.borderWidth : 2,
                pointBackgroundColor: colors[i],
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: options.pointRadius !== undefined ? options.pointRadius : 4,
                pointHoverRadius: options.pointRadius !== undefined ? options.pointRadius + 2 : 6,
                tension: options.tension !== undefined ? options.tension : 0.4,
                fill: true
            }))
        };

        return new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: { ...defaultOptions, ...options }
        });
    },

    /**
     * Create a stacked bar chart
     */
    createStackedChart(ctx, data, options = {}) {
        const showValues = options.showValues || false;
        // Data label styling options
        const labelFontSize = options.labelFontSize || 12;
        const labelFontWeight = options.labelFontWeight || 'bold';
        const labelColor = options.labelColor || '#fff';

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
                    anchor: 'center',
                    align: 'center',
                    font: { weight: labelFontWeight, size: labelFontSize },
                    formatter: (value) => value > 0 ? value : ''
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
                const axisStyle = getAdvancedAxisStyleConfig(options);
                return {
                    x: {
                        stacked: true,
                        grid: {
                            display: false,
                            ...axisStyle.grid
                        },
                        ticks: axisStyle.ticks,
                        border: axisStyle.border,
                        min: options.xAxisMin !== undefined && options.xAxisMin !== null ? options.xAxisMin : undefined,
                        max: options.xAxisMax !== undefined && options.xAxisMax !== null ? options.xAxisMax : undefined
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true,
                        grid: axisStyle.grid,
                        ticks: {
                            ...axisStyle.ticks,
                            stepSize: options.yAxisStep !== undefined && options.yAxisStep !== null ? options.yAxisStep : undefined
                        },
                        border: axisStyle.border,
                        min: options.yAxisMin !== undefined && options.yAxisMin !== null ? options.yAxisMin : undefined,
                        max: options.yAxisMax !== undefined && options.yAxisMax !== null ? options.yAxisMax : undefined
                    }
                };
            })(),
            animation: {
                duration: 800,
                easing: 'easeOutQuart'
            }
        };

        // Support series colors from options
        const seriesColors = options.seriesColors || {};
        const customColors = options.customColors;

        let colors;
        if (customColors && customColors.length > 0) {
            colors = BasicCharts.generateColors(customColors, data.datasets.length);
        } else {
            colors = BasicCharts.getColorPalette(data.datasets.length);
        }

        if (Object.keys(seriesColors).length > 0) {
            colors = colors.map((c, i) => seriesColors[i] || c);
        }

        const chartData = {
            labels: data.labels,
            datasets: data.datasets.map((ds, i) => ({
                label: ds.label || `Dataset ${i + 1}`,
                data: ds.data,
                backgroundColor: colors[i],
                borderColor: colors[i],
                borderWidth: options.borderWidth !== undefined ? options.borderWidth : 0,
                borderRadius: options.borderRadius !== undefined ? options.borderRadius : 4
            }))
        };

        return new Chart(ctx, {
            type: 'bar',
            data: chartData,
            options: { ...defaultOptions, ...options }
        });
    },

    /**
     * Create a polar area chart
     */
    createPolarChart(ctx, data, options = {}) {
        const showValues = options.showValues || false;
        // Data label styling options
        const labelFontSize = options.labelFontSize || 12;
        const labelFontWeight = options.labelFontWeight || 'bold';
        const labelColor = options.labelColor || '#fff';

        const defaultOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        usePointStyle: true,
                        padding: 15
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    cornerRadius: 8
                },
                datalabels: {
                    display: showValues,
                    color: labelColor,
                    font: { weight: labelFontWeight, size: labelFontSize },
                    formatter: (value) => value
                }
            },
            scales: (() => {
                const axisStyle = getAdvancedAxisStyleConfig(options);
                return {
                    r: {
                        beginAtZero: true,
                        grid: {
                            color: axisStyle.grid.color,
                            lineWidth: axisStyle.grid.lineWidth
                        },
                        ticks: {
                            font: axisStyle.ticks.font,
                            color: axisStyle.ticks.color,
                            stepSize: options.yAxisStep !== undefined && options.yAxisStep !== null ? options.yAxisStep : undefined
                        },
                        min: options.yAxisMin !== undefined && options.yAxisMin !== null ? options.yAxisMin : undefined,
                        max: options.yAxisMax !== undefined && options.yAxisMax !== null ? options.yAxisMax : undefined
                    }
                };
            })(),
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 800,
                easing: 'easeOutQuart'
            }
        };

        const dataset = data.datasets[0] || { data: [] };
        // Support category colors from options
        const customColors = options.customColors;
        const categoryColors = options.categoryColors || {};

        let colors;
        if (customColors && customColors.length > 0) {
            colors = BasicCharts.generateColors(customColors, data.labels.length);
        } else {
            colors = BasicCharts.getColorPalette(data.labels.length);
        }

        if (Object.keys(categoryColors).length > 0) {
            colors = colors.map((c, i) => categoryColors[i] || c);
        }

        // Apply fillOpacity option (default 0.6)
        const fillOpacity = options.fillOpacity !== undefined ? options.fillOpacity : 0.6;

        const chartData = {
            labels: data.labels,
            datasets: [{
                data: dataset.data,
                backgroundColor: colors.map(c => BasicCharts.hexToRgba(c, fillOpacity)),
                borderColor: colors,
                borderWidth: options.borderWidth !== undefined ? options.borderWidth : 2,
                hoverOffset: options.hoverOffset !== undefined ? options.hoverOffset : 4
            }]
        };

        return new Chart(ctx, {
            type: 'polarArea',
            data: chartData,
            options: { ...defaultOptions, ...options }
        });
    },

    /**
     * Create a 100% stacked bar chart (百分比堆积柱形图)
     * Each category shows percentage composition
     */
    createStackedPercentChart(ctx, data, options = {}) {
        const showValues = options.showValues || false;
        const labelFontSize = options.labelFontSize || 12;
        const labelFontWeight = options.labelFontWeight || 'bold';
        const labelColor = options.labelColor || '#fff';

        // Calculate percentage data
        const percentData = this._calculatePercentageData(data);

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
                    labels: { usePointStyle: true, padding: 20 }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: (context) => {
                            const originalValue = data.datasets[context.datasetIndex].data[context.dataIndex];
                            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}% (${originalValue})`;
                        }
                    }
                },
                datalabels: {
                    display: showValues,
                    color: labelColor,
                    anchor: 'center',
                    align: 'center',
                    font: { weight: labelFontWeight, size: labelFontSize },
                    formatter: (value) => value > 5 ? `${value.toFixed(0)}%` : ''
                },
                zoom: {
                    zoom: { wheel: { enabled: false }, pinch: { enabled: true }, mode: 'xy' },
                    pan: { enabled: true, mode: 'xy' }
                }
            },
            scales: {
                x: { stacked: true, grid: { display: false } },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    max: 100,
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                    ticks: {
                        callback: (value) => value + '%'
                    }
                }
            },
            animation: { duration: 800, easing: 'easeOutQuart' }
        };

        const seriesColors = options.seriesColors || {};
        const customColors = options.customColors;

        let colors;
        if (customColors && customColors.length > 0) {
            colors = BasicCharts.generateColors(customColors, data.datasets.length);
        } else {
            colors = BasicCharts.getColorPalette(data.datasets.length);
        }

        if (Object.keys(seriesColors).length > 0) {
            colors = colors.map((c, i) => seriesColors[i] || c);
        }

        const chartData = {
            labels: data.labels,
            datasets: percentData.datasets.map((ds, i) => ({
                label: data.datasets[i].label || `Dataset ${i + 1}`,
                data: ds.data,
                backgroundColor: colors[i],
                borderColor: colors[i],
                borderWidth: options.borderWidth !== undefined ? options.borderWidth : 0,
                borderRadius: options.borderRadius !== undefined ? options.borderRadius : 4
            }))
        };

        return new Chart(ctx, {
            type: 'bar',
            data: chartData,
            options: { ...defaultOptions, ...options }
        });
    },

    /**
     * Create a stacked line chart (堆积折线图)
     */
    createStackedLineChart(ctx, data, options = {}) {
        const showValues = options.showValues || false;
        const labelFontSize = options.labelFontSize || 12;
        const labelFontWeight = options.labelFontWeight || 'bold';
        const labelColor = options.labelColor || '#333';

        const defaultOptions = {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    top: options.layoutPadding !== undefined ? options.layoutPadding : 20,
                    right: options.paddingRight !== undefined ? options.paddingRight : 40  // Customizable right padding
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: { usePointStyle: true, padding: 20 }
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
                    zoom: { wheel: { enabled: false }, pinch: { enabled: true }, mode: 'xy' },
                    pan: { enabled: true, mode: 'xy' }
                }
            },
            scales: {
                x: { stacked: true, grid: { display: false } },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                    min: options.yAxisMin !== undefined && options.yAxisMin !== null ? options.yAxisMin : undefined,
                    max: options.yAxisMax !== undefined && options.yAxisMax !== null ? options.yAxisMax : undefined,
                    ticks: {
                        stepSize: options.yAxisStep !== undefined && options.yAxisStep !== null ? options.yAxisStep : undefined
                    }
                }
            },
            animation: { duration: 800, easing: 'easeOutQuart' }
        };

        const seriesColors = options.seriesColors || {};
        const customColors = options.customColors;

        let colors;
        if (customColors && customColors.length > 0) {
            colors = BasicCharts.generateColors(customColors, data.datasets.length);
        } else {
            colors = BasicCharts.getColorPalette(data.datasets.length);
        }

        if (Object.keys(seriesColors).length > 0) {
            colors = colors.map((c, i) => seriesColors[i] || c);
        }

        const fillOpacity = options.fillOpacity !== undefined ? options.fillOpacity : 0.4;

        const chartData = {
            labels: data.labels,
            datasets: data.datasets.map((ds, i) => ({
                label: ds.label || `Dataset ${i + 1}`,
                data: ds.data,
                borderColor: colors[i],
                backgroundColor: BasicCharts.hexToRgba(colors[i], fillOpacity),
                borderWidth: options.borderWidth !== undefined ? options.borderWidth : 2,
                pointBackgroundColor: colors[i],
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: options.pointRadius !== undefined ? options.pointRadius : 3,
                tension: options.tension !== undefined ? options.tension : 0.4,
                fill: true
            }))
        };

        return new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: { ...defaultOptions, ...options }
        });
    },

    /**
     * Create a 100% stacked line chart (百分比堆积折线图)
     * 修复：正确计算累加数据，实现真正的堆积面积效果
     */
    createStackedPercentLineChart(ctx, data, options = {}) {
        const showValues = options.showValues || false;
        const labelFontSize = options.labelFontSize || 12;
        const labelFontWeight = options.labelFontWeight || 'bold';
        const labelColor = options.labelColor || '#333';

        // 计算各系列的独立百分比
        const percentData = this._calculatePercentageData(data);

        // 计算累加百分比数据，用于绘制堆积效果
        const numLabels = data.labels.length;
        const numDatasets = percentData.datasets.length;
        const cumulativeData = [];

        for (let dsIndex = 0; dsIndex < numDatasets; dsIndex++) {
            const cumulative = [];
            for (let labelIndex = 0; labelIndex < numLabels; labelIndex++) {
                let sum = 0;
                // 累加当前及之前所有数据集的值
                for (let prevDs = 0; prevDs <= dsIndex; prevDs++) {
                    sum += percentData.datasets[prevDs].data[labelIndex] || 0;
                }
                cumulative.push(sum);
            }
            cumulativeData.push(cumulative);
        }

        // 保存原始百分比用于 tooltip 和 datalabels
        const originalPercentages = percentData.datasets.map(ds => [...ds.data]);

        // 使用智能边距计算，确保标签不被裁剪
        const smartPadding = calculateSmartPadding(options);

        const defaultOptions = {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: smartPadding
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: { usePointStyle: true, padding: 20 }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: (context) => {
                            // 显示原始百分比和原始值
                            const originalValue = data.datasets[context.datasetIndex].data[context.dataIndex];
                            const originalPercent = originalPercentages[context.datasetIndex][context.dataIndex];
                            return `${context.dataset.label}: ${originalPercent.toFixed(1)}% (${originalValue})`;
                        }
                    }
                },
                datalabels: {
                    display: showValues,
                    color: labelColor,
                    anchor: 'center',
                    align: 'center',
                    offset: 0,
                    clamp: true,  // 防止标签溢出图表边界
                    clip: true,   // 裁剪超出边界的标签
                    font: { weight: labelFontWeight, size: labelFontSize },
                    formatter: (value, context) => {
                        // 显示原始百分比
                        const originalPercent = originalPercentages[context.datasetIndex][context.dataIndex];
                        return originalPercent > 8 ? `${originalPercent.toFixed(0)}%` : '';
                    }
                },
                zoom: {
                    zoom: { wheel: { enabled: false }, pinch: { enabled: true }, mode: 'xy' },
                    pan: { enabled: true, mode: 'xy' }
                }
            },
            scales: {
                x: { grid: { display: false } },
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                    ticks: { callback: (value) => value + '%' }
                }
            },
            animation: { duration: 800, easing: 'easeOutQuart' }
        };

        const seriesColors = options.seriesColors || {};
        const customColors = options.customColors;

        let colors;
        if (customColors && customColors.length > 0) {
            colors = BasicCharts.generateColors(customColors, data.datasets.length);
        } else {
            colors = BasicCharts.getColorPalette(data.datasets.length);
        }

        if (Object.keys(seriesColors).length > 0) {
            colors = colors.map((c, i) => seriesColors[i] || c);
        }

        const fillOpacity = options.fillOpacity !== undefined ? options.fillOpacity : 0.6;

        const chartData = {
            labels: data.labels,
            datasets: cumulativeData.map((cumData, i) => ({
                label: data.datasets[i].label || `Dataset ${i + 1}`,
                data: cumData,
                borderColor: colors[i],
                backgroundColor: BasicCharts.hexToRgba(colors[i], fillOpacity),
                borderWidth: options.borderWidth !== undefined ? options.borderWidth : 2,
                pointBackgroundColor: colors[i],
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: options.pointRadius !== undefined ? options.pointRadius : 4,
                pointHoverRadius: options.pointRadius !== undefined ? options.pointRadius + 2 : 6,
                tension: options.tension !== undefined ? options.tension : 0.4,
                fill: true
            })).reverse() // 反转顺序，确保后面的数据集在底层
        };

        // 反转颜色以匹配数据集顺序
        chartData.datasets.forEach((ds, i) => {
            const originalIndex = numDatasets - 1 - i;
            ds.borderColor = colors[originalIndex];
            ds.backgroundColor = BasicCharts.hexToRgba(colors[originalIndex], fillOpacity);
            ds.pointBackgroundColor = colors[originalIndex];
            ds.label = data.datasets[originalIndex].label || `Dataset ${originalIndex + 1}`;
        });

        // 更新 datalabels 和 tooltip 的回调以处理反转后的索引
        defaultOptions.plugins.tooltip.callbacks.label = (context) => {
            const originalIndex = numDatasets - 1 - context.datasetIndex;
            const originalValue = data.datasets[originalIndex].data[context.dataIndex];
            const originalPercent = originalPercentages[originalIndex][context.dataIndex];
            return `${context.dataset.label}: ${originalPercent.toFixed(1)}% (${originalValue})`;
        };

        defaultOptions.plugins.datalabels.formatter = (value, context) => {
            const originalIndex = numDatasets - 1 - context.datasetIndex;
            const originalPercent = originalPercentages[originalIndex][context.dataIndex];
            return originalPercent > 8 ? `${originalPercent.toFixed(0)}%` : '';
        };

        return new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: { ...defaultOptions, ...options }
        });
    },

    /**
     * Create a stacked horizontal bar chart (堆积条形图)
     */
    createStackedHorizontalBarChart(ctx, data, options = {}) {
        const showValues = options.showValues || false;
        const labelFontSize = options.labelFontSize || 12;
        const labelFontWeight = options.labelFontWeight || 'bold';
        const labelColor = options.labelColor || '#fff';

        const defaultOptions = {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: { right: options.layoutPadding !== undefined ? options.layoutPadding : 40 }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: { usePointStyle: true, padding: 20 }
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
                    anchor: 'center',
                    align: 'center',
                    font: { weight: labelFontWeight, size: labelFontSize },
                    formatter: (value) => value > 0 ? value : ''
                },
                zoom: {
                    zoom: { wheel: { enabled: false }, pinch: { enabled: true }, mode: 'xy' },
                    pan: { enabled: true, mode: 'xy' }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    beginAtZero: true,
                    grid: { color: 'rgba(0, 0, 0, 0.05)' }
                },
                y: { stacked: true, grid: { display: false } }
            },
            animation: { duration: 800, easing: 'easeOutQuart' }
        };

        const seriesColors = options.seriesColors || {};
        const customColors = options.customColors;

        let colors;
        if (customColors && customColors.length > 0) {
            colors = BasicCharts.generateColors(customColors, data.datasets.length);
        } else {
            colors = BasicCharts.getColorPalette(data.datasets.length);
        }

        if (Object.keys(seriesColors).length > 0) {
            colors = colors.map((c, i) => seriesColors[i] || c);
        }

        const chartData = {
            labels: data.labels,
            datasets: data.datasets.map((ds, i) => ({
                label: ds.label || `Dataset ${i + 1}`,
                data: ds.data,
                backgroundColor: colors[i],
                borderColor: colors[i],
                borderWidth: options.borderWidth !== undefined ? options.borderWidth : 0,
                borderRadius: options.borderRadius !== undefined ? options.borderRadius : 4
            }))
        };

        return new Chart(ctx, {
            type: 'bar',
            data: chartData,
            options: { ...defaultOptions, ...options }
        });
    },

    /**
     * Create a 100% stacked horizontal bar chart (百分比堆积条形图)
     */
    createStackedPercentHorizontalBarChart(ctx, data, options = {}) {
        const showValues = options.showValues || false;
        const labelFontSize = options.labelFontSize || 12;
        const labelFontWeight = options.labelFontWeight || 'bold';
        const labelColor = options.labelColor || '#fff';

        const percentData = this._calculatePercentageData(data);

        const defaultOptions = {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: { right: options.layoutPadding !== undefined ? options.layoutPadding : 40 }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: { usePointStyle: true, padding: 20 }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: (context) => {
                            const originalValue = data.datasets[context.datasetIndex].data[context.dataIndex];
                            return `${context.dataset.label}: ${context.parsed.x.toFixed(1)}% (${originalValue})`;
                        }
                    }
                },
                datalabels: {
                    display: showValues,
                    color: labelColor,
                    anchor: 'center',
                    align: 'center',
                    font: { weight: labelFontWeight, size: labelFontSize },
                    formatter: (value) => value > 5 ? `${value.toFixed(0)}%` : ''
                },
                zoom: {
                    zoom: { wheel: { enabled: false }, pinch: { enabled: true }, mode: 'xy' },
                    pan: { enabled: true, mode: 'xy' }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    beginAtZero: true,
                    max: 100,
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                    ticks: { callback: (value) => value + '%' }
                },
                y: { stacked: true, grid: { display: false } }
            },
            animation: { duration: 800, easing: 'easeOutQuart' }
        };

        const seriesColors = options.seriesColors || {};
        const customColors = options.customColors;

        let colors;
        if (customColors && customColors.length > 0) {
            colors = BasicCharts.generateColors(customColors, data.datasets.length);
        } else {
            colors = BasicCharts.getColorPalette(data.datasets.length);
        }

        if (Object.keys(seriesColors).length > 0) {
            colors = colors.map((c, i) => seriesColors[i] || c);
        }

        const chartData = {
            labels: data.labels,
            datasets: percentData.datasets.map((ds, i) => ({
                label: data.datasets[i].label || `Dataset ${i + 1}`,
                data: ds.data,
                backgroundColor: colors[i],
                borderColor: colors[i],
                borderWidth: options.borderWidth !== undefined ? options.borderWidth : 0,
                borderRadius: options.borderRadius !== undefined ? options.borderRadius : 4
            }))
        };

        return new Chart(ctx, {
            type: 'bar',
            data: chartData,
            options: { ...defaultOptions, ...options }
        });
    },

    /**
     * Create a stacked area chart (堆积面积图)
     */
    createStackedAreaChart(ctx, data, options = {}) {
        const showValues = options.showValues || false;
        const labelFontSize = options.labelFontSize || 12;
        const labelFontWeight = options.labelFontWeight || 'bold';
        const labelColor = options.labelColor || '#333';

        // 使用智能边距计算，确保标签不被裁剪
        const smartPadding = calculateSmartPadding(options);

        const defaultOptions = {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: smartPadding
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: { usePointStyle: true, padding: 20 }
                },
                filler: { propagate: true },
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
                    zoom: { wheel: { enabled: false }, pinch: { enabled: true }, mode: 'xy' },
                    pan: { enabled: true, mode: 'xy' }
                }
            },
            scales: {
                x: { stacked: true, grid: { display: false } },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                    min: options.yAxisMin !== undefined && options.yAxisMin !== null ? options.yAxisMin : undefined,
                    max: options.yAxisMax !== undefined && options.yAxisMax !== null ? options.yAxisMax : undefined
                }
            },
            interaction: { mode: 'nearest', axis: 'x', intersect: false },
            animation: { duration: 800, easing: 'easeOutQuart' }
        };

        const seriesColors = options.seriesColors || {};
        const customColors = options.customColors;

        let colors;
        if (customColors && customColors.length > 0) {
            colors = BasicCharts.generateColors(customColors, data.datasets.length);
        } else {
            colors = BasicCharts.getColorPalette(data.datasets.length);
        }

        if (Object.keys(seriesColors).length > 0) {
            colors = colors.map((c, i) => seriesColors[i] || c);
        }

        const fillOpacity = options.fillOpacity !== undefined ? options.fillOpacity : 0.6;

        const chartData = {
            labels: data.labels,
            datasets: data.datasets.map((ds, i) => ({
                label: ds.label || `Dataset ${i + 1}`,
                data: ds.data,
                borderColor: colors[i],
                backgroundColor: BasicCharts.hexToRgba(colors[i], fillOpacity),
                borderWidth: options.borderWidth !== undefined ? options.borderWidth : 2,
                pointBackgroundColor: colors[i],
                pointBorderColor: '#fff',
                pointBorderWidth: 1,
                pointRadius: options.pointRadius !== undefined ? options.pointRadius : 2,
                tension: options.tension !== undefined ? options.tension : 0.4,
                fill: 'origin'
            }))
        };

        return new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: { ...defaultOptions, ...options }
        });
    },

    /**
     * Create a 100% stacked area chart (百分比堆积面积图)
     * 修复：使用累积数据计算实现真正的堆积效果
     */
    createStackedPercentAreaChart(ctx, data, options = {}) {
        const showValues = options.showValues || false;
        const labelFontSize = options.labelFontSize || 12;
        const labelFontWeight = options.labelFontWeight || 'bold';
        const labelColor = options.labelColor || '#333';

        // 计算各系列的独立百分比
        const percentData = this._calculatePercentageData(data);

        // 计算累加百分比数据，用于绘制堆积效果
        const numLabels = data.labels.length;
        const numDatasets = percentData.datasets.length;
        const cumulativeData = [];

        for (let dsIndex = 0; dsIndex < numDatasets; dsIndex++) {
            const cumulative = [];
            for (let labelIndex = 0; labelIndex < numLabels; labelIndex++) {
                let sum = 0;
                // 累加当前及之前所有数据集的值
                for (let prevDs = 0; prevDs <= dsIndex; prevDs++) {
                    sum += percentData.datasets[prevDs].data[labelIndex] || 0;
                }
                cumulative.push(sum);
            }
            cumulativeData.push(cumulative);
        }

        // 保存原始百分比用于 tooltip 和 datalabels
        const originalPercentages = percentData.datasets.map(ds => [...ds.data]);

        // 使用智能边距计算，确保标签不被裁剪
        const smartPadding = calculateSmartPadding(options);

        const defaultOptions = {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: smartPadding
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: { usePointStyle: true, padding: 20 }
                },
                filler: { propagate: true },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: (context) => {
                            // 显示原始百分比和原始值
                            const originalIndex = numDatasets - 1 - context.datasetIndex;
                            const originalValue = data.datasets[originalIndex].data[context.dataIndex];
                            const originalPercent = originalPercentages[originalIndex][context.dataIndex];
                            return `${context.dataset.label}: ${originalPercent.toFixed(1)}% (${originalValue})`;
                        }
                    }
                },
                datalabels: {
                    display: showValues,
                    color: labelColor,
                    anchor: 'center',
                    align: 'center',
                    offset: 0,
                    clamp: true,  // 防止标签溢出图表边界
                    clip: true,   // 裁剪超出边界的标签
                    font: { weight: labelFontWeight, size: labelFontSize },
                    formatter: (value, context) => {
                        // 显示原始百分比
                        const originalIndex = numDatasets - 1 - context.datasetIndex;
                        const originalPercent = originalPercentages[originalIndex][context.dataIndex];
                        return originalPercent > 8 ? `${originalPercent.toFixed(0)}%` : '';
                    }
                },
                zoom: {
                    zoom: { wheel: { enabled: false }, pinch: { enabled: true }, mode: 'xy' },
                    pan: { enabled: true, mode: 'xy' }
                }
            },
            scales: {
                x: { grid: { display: false } },
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                    ticks: { callback: (value) => value + '%' }
                }
            },
            interaction: { mode: 'nearest', axis: 'x', intersect: false },
            animation: { duration: 800, easing: 'easeOutQuart' }
        };

        const seriesColors = options.seriesColors || {};
        const customColors = options.customColors;

        let colors;
        if (customColors && customColors.length > 0) {
            colors = BasicCharts.generateColors(customColors, data.datasets.length);
        } else {
            colors = BasicCharts.getColorPalette(data.datasets.length);
        }

        if (Object.keys(seriesColors).length > 0) {
            colors = colors.map((c, i) => seriesColors[i] || c);
        }

        const fillOpacity = options.fillOpacity !== undefined ? options.fillOpacity : 0.6;

        const chartData = {
            labels: data.labels,
            datasets: cumulativeData.map((cumData, i) => ({
                label: data.datasets[i].label || `Dataset ${i + 1}`,
                data: cumData,
                borderColor: colors[i],
                backgroundColor: BasicCharts.hexToRgba(colors[i], fillOpacity),
                borderWidth: options.borderWidth !== undefined ? options.borderWidth : 2,
                pointBackgroundColor: colors[i],
                pointBorderColor: '#fff',
                pointBorderWidth: 1,
                pointRadius: options.pointRadius !== undefined ? options.pointRadius : 2,
                tension: options.tension !== undefined ? options.tension : 0.4,
                fill: true
            })).reverse() // 反转顺序，确保后面的数据集在底层
        };

        // 反转颜色以匹配数据集顺序
        chartData.datasets.forEach((ds, i) => {
            const originalIndex = numDatasets - 1 - i;
            ds.borderColor = colors[originalIndex];
            ds.backgroundColor = BasicCharts.hexToRgba(colors[originalIndex], fillOpacity);
            ds.pointBackgroundColor = colors[originalIndex];
            ds.label = data.datasets[originalIndex].label || `Dataset ${originalIndex + 1}`;
        });

        return new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: { ...defaultOptions, ...options }
        });
    },

    /**
     * Create a scatter chart with smooth lines (带平滑线散点图)
     */
    createScatterSmoothChart(ctx, data, options = {}) {
        const showValues = options.showValues || false;
        const labelFontSize = options.labelFontSize || 12;
        const labelFontWeight = options.labelFontWeight || 'bold';
        const labelColor = options.labelColor || '#333';

        const defaultOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: { usePointStyle: true, padding: 20 }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: (context) => `(${context.parsed.x}, ${context.parsed.y})`
                    }
                },
                datalabels: {
                    display: showValues,
                    color: labelColor,
                    anchor: 'end',
                    align: 'top',
                    offset: 4,
                    font: { weight: labelFontWeight, size: labelFontSize },
                    formatter: (value) => value.y
                },
                zoom: {
                    zoom: { wheel: { enabled: false }, pinch: { enabled: true }, mode: 'xy' },
                    pan: { enabled: true, mode: 'xy' }
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                    min: options.xAxisMin !== undefined && options.xAxisMin !== null ? options.xAxisMin : undefined,
                    max: options.xAxisMax !== undefined && options.xAxisMax !== null ? options.xAxisMax : undefined
                },
                y: {
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                    min: options.yAxisMin !== undefined && options.yAxisMin !== null ? options.yAxisMin : undefined,
                    max: options.yAxisMax !== undefined && options.yAxisMax !== null ? options.yAxisMax : undefined
                }
            },
            animation: { duration: 800, easing: 'easeOutQuart' }
        };

        const seriesColors = options.seriesColors || {};
        const customColors = options.customColors;

        let colors;
        if (customColors && customColors.length > 0) {
            colors = BasicCharts.generateColors(customColors, data.datasets.length);
        } else {
            colors = BasicCharts.getColorPalette(data.datasets.length);
        }

        if (Object.keys(seriesColors).length > 0) {
            colors = colors.map((c, i) => seriesColors[i] || c);
        }

        const chartData = {
            datasets: data.datasets.map((ds, i) => ({
                label: ds.label || `Dataset ${i + 1}`,
                data: ds.data.map((y, idx) => ({ x: idx + 1, y: y })),
                borderColor: colors[i],
                backgroundColor: colors[i],
                borderWidth: options.borderWidth !== undefined ? options.borderWidth : 2,
                pointRadius: options.pointRadius !== undefined ? options.pointRadius : 6,
                pointHoverRadius: options.pointRadius !== undefined ? options.pointRadius + 2 : 8,
                showLine: true,
                tension: options.tension !== undefined ? options.tension : 0.4,
                fill: false
            }))
        };

        return new Chart(ctx, {
            type: 'scatter',
            data: chartData,
            options: { ...defaultOptions, ...options }
        });
    },

    /**
     * Create a scatter chart with straight lines (带直线散点图)
     */
    createScatterLineChart(ctx, data, options = {}) {
        const showValues = options.showValues || false;
        const labelFontSize = options.labelFontSize || 12;
        const labelFontWeight = options.labelFontWeight || 'bold';
        const labelColor = options.labelColor || '#333';

        const defaultOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: { usePointStyle: true, padding: 20 }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: (context) => `(${context.parsed.x}, ${context.parsed.y})`
                    }
                },
                datalabels: {
                    display: showValues,
                    color: labelColor,
                    anchor: 'end',
                    align: 'top',
                    offset: 4,
                    font: { weight: labelFontWeight, size: labelFontSize },
                    formatter: (value) => value.y
                },
                zoom: {
                    zoom: { wheel: { enabled: false }, pinch: { enabled: true }, mode: 'xy' },
                    pan: { enabled: true, mode: 'xy' }
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                    min: options.xAxisMin !== undefined && options.xAxisMin !== null ? options.xAxisMin : undefined,
                    max: options.xAxisMax !== undefined && options.xAxisMax !== null ? options.xAxisMax : undefined
                },
                y: {
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                    min: options.yAxisMin !== undefined && options.yAxisMin !== null ? options.yAxisMin : undefined,
                    max: options.yAxisMax !== undefined && options.yAxisMax !== null ? options.yAxisMax : undefined
                }
            },
            animation: { duration: 800, easing: 'easeOutQuart' }
        };

        const seriesColors = options.seriesColors || {};
        const customColors = options.customColors;

        let colors;
        if (customColors && customColors.length > 0) {
            colors = BasicCharts.generateColors(customColors, data.datasets.length);
        } else {
            colors = BasicCharts.getColorPalette(data.datasets.length);
        }

        if (Object.keys(seriesColors).length > 0) {
            colors = colors.map((c, i) => seriesColors[i] || c);
        }

        const chartData = {
            datasets: data.datasets.map((ds, i) => ({
                label: ds.label || `Dataset ${i + 1}`,
                data: ds.data.map((y, idx) => ({ x: idx + 1, y: y })),
                borderColor: colors[i],
                backgroundColor: colors[i],
                borderWidth: options.borderWidth !== undefined ? options.borderWidth : 2,
                pointRadius: options.pointRadius !== undefined ? options.pointRadius : 6,
                pointHoverRadius: options.pointRadius !== undefined ? options.pointRadius + 2 : 8,
                showLine: true,
                tension: 0,  // Straight lines
                fill: false
            }))
        };

        return new Chart(ctx, {
            type: 'scatter',
            data: chartData,
            options: { ...defaultOptions, ...options }
        });
    },

    /**
     * Helper function to calculate percentage data for stacked charts
     * @private
     */
    _calculatePercentageData(data) {
        const numLabels = data.labels.length;
        const numDatasets = data.datasets.length;

        // Calculate totals for each label (category)
        const totals = [];
        for (let i = 0; i < numLabels; i++) {
            let total = 0;
            for (let j = 0; j < numDatasets; j++) {
                total += data.datasets[j].data[i] || 0;
            }
            totals.push(total);
        }

        // Convert to percentages
        const percentDatasets = data.datasets.map(ds => ({
            ...ds,
            data: ds.data.map((value, i) => {
                if (totals[i] === 0) return 0;
                return (value / totals[i]) * 100;
            })
        }));

        return {
            labels: data.labels,
            datasets: percentDatasets
        };
    }
};

// Export
window.AdvancedCharts = AdvancedCharts;

