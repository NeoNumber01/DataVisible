/**
 * Basic Charts - 基础图表实现
 * Bar, Line, Pie, Doughnut charts using Chart.js
 */

// Register Chart.js datalabels plugin globally
if (typeof ChartDataLabels !== 'undefined') {
    Chart.register(ChartDataLabels);
}

// Register Chart.js zoom plugin globally
if (typeof ChartZoom !== 'undefined') {
    Chart.register(ChartZoom);
} else if (window.ChartZoom) {
    Chart.register(window.ChartZoom);
}

const BasicCharts = {
    /**
     * Create a bar chart
     */
    createBarChart(ctx, data, options = {}) {
        const showValues = options.showValues || false;

        // Data label styling options
        const labelFontSize = options.labelFontSize || 12;
        const labelFontWeight = options.labelFontWeight || 'bold';
        const labelColor = options.labelColor || '#333';

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
                    font: {
                        weight: labelFontWeight,
                        size: labelFontSize
                    },
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
                    grid: {
                        display: false
                    },
                    min: options.xAxisMin !== undefined && options.xAxisMin !== null ? options.xAxisMin : undefined,
                    max: options.xAxisMax !== undefined && options.xAxisMax !== null ? options.xAxisMax : undefined
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    min: options.yAxisMin !== undefined && options.yAxisMin !== null ? options.yAxisMin : undefined,
                    max: options.yAxisMax !== undefined && options.yAxisMax !== null ? options.yAxisMax : undefined,
                    ticks: {
                        stepSize: options.yAxisStep !== undefined && options.yAxisStep !== null ? options.yAxisStep : undefined
                    }
                }
            },
            animation: {
                duration: 800,
                easing: 'easeOutQuart'
            }
        };

        // Support custom colors from options
        const customColors = options.customColors;
        // Support series colors from options
        const seriesColors = options.seriesColors || {};

        let colors;
        if (customColors && customColors.length > 0) {
            colors = BasicCharts.generateColors(customColors, data.datasets.length);
        } else {
            colors = this.getColorPalette(data.datasets.length);
        }

        // Apply series colors if set
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
                borderRadius: options.borderRadius !== undefined ? options.borderRadius : 6,
                barPercentage: options.barPercentage !== undefined ? options.barPercentage : 0.7,
                categoryPercentage: options.categoryPercentage !== undefined ? options.categoryPercentage : 0.8
            }))
        };

        return new Chart(ctx, {
            type: 'bar',
            data: chartData,
            options: { ...defaultOptions, ...options }
        });
    },


    /**
     * Create a line chart
     */
    createLineChart(ctx, data, options = {}) {
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
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    min: options.xAxisMin !== undefined && options.xAxisMin !== null ? options.xAxisMin : undefined,
                    max: options.xAxisMax !== undefined && options.xAxisMax !== null ? options.xAxisMax : undefined
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    min: options.yAxisMin !== undefined && options.yAxisMin !== null ? options.yAxisMin : undefined,
                    max: options.yAxisMax !== undefined && options.yAxisMax !== null ? options.yAxisMax : undefined,
                    ticks: {
                        stepSize: options.yAxisStep !== undefined && options.yAxisStep !== null ? options.yAxisStep : undefined
                    }
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

        // Support custom colors from options
        const customColors = options.customColors;
        const seriesColors = options.seriesColors || {};

        let colors;
        if (customColors && customColors.length > 0) {
            colors = BasicCharts.generateColors(customColors, data.datasets.length);
        } else {
            colors = this.getColorPalette(data.datasets.length);
        }

        if (Object.keys(seriesColors).length > 0) {
            colors = colors.map((c, i) => seriesColors[i] || c);
        }

        const chartData = {
            labels: data.labels,
            datasets: data.datasets.map((ds, i) => ({
                label: ds.label || `Dataset ${i + 1}`,
                data: ds.data,
                borderColor: colors[i],
                backgroundColor: this.hexToRgba(colors[i], options.fillOpacity || 0.1),
                borderWidth: options.borderWidth !== undefined ? options.borderWidth : 3,
                pointBackgroundColor: colors[i],
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: options.showPoints === false ? 0 : (options.pointRadius !== undefined ? options.pointRadius : 5),
                pointHoverRadius: options.showPoints === false ? 0 : (options.pointRadius !== undefined ? options.pointRadius + 2 : 7),
                tension: options.tension !== undefined ? options.tension : 0,
                fill: options.fill || false
            }))
        };

        return new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: { ...defaultOptions, ...options }
        });
    },

    /**
     * Create a pie chart
     */
    createPieChart(ctx, data, options = {}) {
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
                    cornerRadius: 8,
                    callbacks: {
                        label: function (context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.raw / total) * 100).toFixed(1);
                            return `${context.label}: ${context.raw} (${percentage}%)`;
                        }
                    }
                },
                datalabels: {
                    display: showValues,
                    color: labelColor,
                    font: { weight: labelFontWeight, size: labelFontSize },
                    formatter: (value, context) => {
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${percentage}%`;
                    }
                }
            },
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 800,
                easing: 'easeOutQuart'
            }
        };

        // Use first dataset for pie chart
        const dataset = data.datasets[0] || { data: [] };

        // Support custom colors from options
        const customColors = options.customColors;
        // Support category colors from options
        const categoryColors = options.categoryColors || {};

        let colors;
        if (customColors && customColors.length > 0) {
            colors = BasicCharts.generateColors(customColors, data.labels.length);
        } else {
            colors = this.getColorPalette(data.labels.length);
        }

        // Apply category colors if set
        if (Object.keys(categoryColors).length > 0) {
            colors = colors.map((c, i) => categoryColors[i] || c);
        }

        // Apply rotation option
        if (options.rotation !== undefined) {
            defaultOptions.rotation = options.rotation * (Math.PI / 180); // Convert to radians
        }

        const chartData = {
            labels: data.labels,
            datasets: [{
                data: dataset.data,
                backgroundColor: colors,
                borderColor: '#fff',
                borderWidth: options.borderWidth !== undefined ? options.borderWidth : 2,
                hoverOffset: options.hoverOffset !== undefined ? options.hoverOffset : 10
            }]
        };

        return new Chart(ctx, {
            type: 'pie',
            data: chartData,
            options: { ...defaultOptions, ...options }
        });
    },

    /**
     * Create a doughnut chart
     */
    createDoughnutChart(ctx, data, options = {}) {
        const showValues = options.showValues || false;

        // Data label styling options
        const labelFontSize = options.labelFontSize || 12;
        const labelFontWeight = options.labelFontWeight || 'bold';
        const labelColor = options.labelColor || '#fff';

        const defaultOptions = {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '60%',
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
                    cornerRadius: 8,
                    callbacks: {
                        label: function (context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.raw / total) * 100).toFixed(1);
                            return `${context.label}: ${context.raw} (${percentage}%)`;
                        }
                    }
                },
                datalabels: {
                    display: showValues,
                    color: labelColor,
                    font: { weight: labelFontWeight, size: labelFontSize },
                    formatter: (value, context) => {
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${percentage}%`;
                    }
                }
            },
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 800,
                easing: 'easeOutQuart'
            }
        };

        // Apply cutout option (ring width)
        if (options.cutout !== undefined) {
            defaultOptions.cutout = options.cutout + '%';
        }

        // Apply rotation option
        if (options.rotation !== undefined) {
            defaultOptions.rotation = options.rotation * (Math.PI / 180); // Convert to radians
        }

        // Use first dataset for doughnut chart
        const dataset = data.datasets[0] || { data: [] };

        // Support custom colors
        const customColors = options.customColors;
        const categoryColors = options.categoryColors || {};

        let colors;
        if (customColors && customColors.length > 0) {
            colors = BasicCharts.generateColors(customColors, data.labels.length);
        } else {
            colors = this.getColorPalette(data.labels.length);
        }

        // Apply category colors
        if (Object.keys(categoryColors).length > 0) {
            colors = colors.map((c, i) => categoryColors[i] || c);
        }

        const chartData = {
            labels: data.labels,
            datasets: [{
                data: dataset.data,
                backgroundColor: colors,
                borderColor: '#fff',
                borderWidth: options.borderWidth !== undefined ? options.borderWidth : 2,
                hoverOffset: options.hoverOffset !== undefined ? options.hoverOffset : 10
            }]
        };

        return new Chart(ctx, {
            type: 'doughnut',
            data: chartData,
            options: { ...defaultOptions, ...options }
        });
    },

    /**
     * Generate colors from a base set
     * Repeats/extends colors to match the required count
     */
    generateColors(baseColors, count) {
        if (!baseColors || baseColors.length === 0) {
            return this.getColorPalette(count);
        }

        const colors = [];
        for (let i = 0; i < count; i++) {
            colors.push(baseColors[i % baseColors.length]);
        }
        return colors;
    },

    /**
     * Get color palette
     * Updated to use ChartColorsConfig
     */
    getColorPalette(count) {
        // Use global configuration if available, otherwise fallback
        if (typeof ChartColorsConfig !== 'undefined') {
            return ChartColorsConfig.getRecommendedColors('bar', count, 'default');
        }

        // Fallback if config is missing (safe default)
        const palette = [
            '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316',
            '#eab308', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6'
        ];

        if (count <= palette.length) {
            return palette.slice(0, count);
        }

        // Generate more colors if needed
        const colors = [...palette];
        for (let i = palette.length; i < count; i++) {
            const hue = (i * 137.508) % 360; // Golden angle
            colors.push(`hsl(${hue}, 70%, 55%)`);
        }
        return colors;
    },

    /**
     * Convert any color format to rgba
     * Supports: hex (#RRGGBB, #RGB), rgb(), rgba(), hsl()
     */
    hexToRgba(color, alpha) {
        // Handle null/undefined
        if (!color) {
            return `rgba(100, 100, 100, ${alpha})`;
        }

        // If already rgba format, adjust alpha
        if (color.startsWith('rgba')) {
            return color.replace(/[\d.]+\)$/, `${alpha})`);
        }

        // If rgb format, convert to rgba
        if (color.startsWith('rgb(')) {
            return color.replace('rgb(', 'rgba(').replace(')', `, ${alpha})`);
        }

        // Handle HSL format: hsl(h, s%, l%)
        if (color.startsWith('hsl')) {
            const match = color.match(/hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/);
            if (match) {
                const [, h, s, l] = match.map(Number);
                const rgb = this.hslToRgb(h, s, l);
                return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
            }
            // Fallback if hsl parsing fails
            return `rgba(100, 100, 100, ${alpha})`;
        }

        // Handle Hex format
        if (color.startsWith('#')) {
            let hex = color.slice(1);
            // Support 3-character shorthand (#RGB -> #RRGGBB)
            if (hex.length === 3) {
                hex = hex.split('').map(c => c + c).join('');
            }
            const r = parseInt(hex.slice(0, 2), 16);
            const g = parseInt(hex.slice(2, 4), 16);
            const b = parseInt(hex.slice(4, 6), 16);
            if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
                return `rgba(${r}, ${g}, ${b}, ${alpha})`;
            }
        }

        // Fallback: return gray with specified alpha
        return `rgba(100, 100, 100, ${alpha})`;
    },

    /**
     * Convert HSL to RGB
     * @param {number} h - Hue (0-360)
     * @param {number} s - Saturation (0-100)
     * @param {number} l - Lightness (0-100)
     * @returns {{r: number, g: number, b: number}}
     */
    hslToRgb(h, s, l) {
        s /= 100;
        l /= 100;
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l - c / 2;
        let r = 0, g = 0, b = 0;

        if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
        else if (h >= 60 && h < 120) { r = x; g = c; b = 0; }
        else if (h >= 120 && h < 180) { r = 0; g = c; b = x; }
        else if (h >= 180 && h < 240) { r = 0; g = x; b = c; }
        else if (h >= 240 && h < 300) { r = x; g = 0; b = c; }
        else { r = c; g = 0; b = x; }

        return {
            r: Math.round((r + m) * 255),
            g: Math.round((g + m) * 255),
            b: Math.round((b + m) * 255)
        };
    },

    /**
     * Create a rose/nightingale chart (南丁格尔玫瑰图)
     */
    createRoseChart(ctx, data, options = {}) {
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
                    cornerRadius: 8,
                    callbacks: {
                        label: function (context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.raw / total) * 100).toFixed(1);
                            return `${context.label}: ${context.raw} (${percentage}%)`;
                        }
                    }
                },
                datalabels: {
                    display: showValues,
                    color: labelColor,
                    font: { weight: labelFontWeight, size: labelFontSize },
                    formatter: (value, context) => {
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${percentage}%`;
                    }
                }
            },
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 800,
                easing: 'easeOutQuart'
            }
        };

        const dataset = data.datasets[0] || { data: [] };

        // Support custom colors
        const customColors = options.customColors;
        const categoryColors = options.categoryColors || {};

        let colors;
        if (customColors && customColors.length > 0) {
            colors = BasicCharts.generateColors(customColors, data.labels.length);
        } else {
            colors = this.getColorPalette(data.labels.length);
        }

        // Apply category colors if set
        if (Object.keys(categoryColors).length > 0) {
            colors = colors.map((c, i) => categoryColors[i] || c);
        }

        const chartData = {
            labels: data.labels,
            datasets: [{
                data: dataset.data,
                backgroundColor: colors.map(c => this.hexToRgba(c, 0.8)),
                borderColor: colors,
                borderWidth: 2,
                hoverOffset: 15
            }]
        };

        return new Chart(ctx, {
            type: 'polarArea',
            data: chartData,
            options: { ...defaultOptions, ...options }
        });
    },

    /**
     * Create a mixed/combo chart (组合图 - 柱状图+折线图)
     */
    createMixedChart(ctx, data, options = {}) {
        const showValues = options.showValues || false;

        // Data label styling options
        const labelFontSize = options.labelFontSize || 12;
        const labelFontWeight = options.labelFontWeight || 'bold';
        const labelColor = options.labelColor || '#333';

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
                    grid: {
                        display: false
                    },
                    min: options.xAxisMin !== undefined && options.xAxisMin !== null ? options.xAxisMin : undefined,
                    max: options.xAxisMax !== undefined && options.xAxisMax !== null ? options.xAxisMax : undefined
                },
                y: {
                    beginAtZero: true,
                    position: 'left',
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    min: options.yAxisMin !== undefined && options.yAxisMin !== null ? options.yAxisMin : undefined,
                    max: options.yAxisMax !== undefined && options.yAxisMax !== null ? options.yAxisMax : undefined,
                    ticks: {
                        stepSize: options.yAxisStep !== undefined && options.yAxisStep !== null ? options.yAxisStep : undefined
                    }
                },
                y1: {
                    beginAtZero: true,
                    position: 'right',
                    grid: {
                        drawOnChartArea: false
                    }
                }
            },
            animation: {
                duration: 800,
                easing: 'easeOutQuart'
            }
        };

        // Support series colors from options
        const customColors = options.customColors;
        const seriesColors = options.seriesColors || {};

        let colors;
        if (customColors && customColors.length > 0) {
            colors = BasicCharts.generateColors(customColors, data.datasets.length);
        } else {
            colors = this.getColorPalette(data.datasets.length);
        }

        // Apply series colors if set
        if (Object.keys(seriesColors).length > 0) {
            colors = colors.map((c, i) => seriesColors[i] || c);
        }

        const chartData = {
            labels: data.labels,
            datasets: data.datasets.map((ds, i) => {
                // First dataset as bar, others as line
                if (i === 0) {
                    return {
                        label: ds.label || `Dataset ${i + 1}`,
                        data: ds.data,
                        type: 'bar',
                        backgroundColor: this.hexToRgba(colors[i], 0.7),
                        borderColor: colors[i],
                        borderWidth: 0,
                        borderRadius: 6,
                        yAxisID: 'y',
                        order: 2
                    };
                } else {
                    return {
                        label: ds.label || `Dataset ${i + 1}`,
                        data: ds.data,
                        type: 'line',
                        borderColor: colors[i],
                        backgroundColor: this.hexToRgba(colors[i], 0.1),
                        borderWidth: 3,
                        pointBackgroundColor: colors[i],
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        tension: 0.4,
                        fill: false,
                        yAxisID: i === 1 ? 'y1' : 'y',
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
     * Create a horizontal bar chart (水平柱状图)
     */
    createHorizontalBarChart(ctx, data, options = {}) {
        const showValues = options.showValues || false;

        // Data label styling options
        const labelFontSize = options.labelFontSize || 12;
        const labelFontWeight = options.labelFontWeight || 'bold';
        const labelColor = options.labelColor || '#333';

        const defaultOptions = {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    right: options.layoutPadding !== undefined ? options.layoutPadding : 40
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
                    align: 'end',
                    offset: 4,
                    font: {
                        weight: labelFontWeight,
                        size: labelFontSize
                    },
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
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    min: options.xAxisMin !== undefined && options.xAxisMin !== null ? options.xAxisMin : undefined,
                    max: options.xAxisMax !== undefined && options.xAxisMax !== null ? options.xAxisMax : undefined,
                    ticks: {
                        stepSize: options.yAxisStep !== undefined && options.yAxisStep !== null ? options.yAxisStep : undefined // Use yAxisStep for value axis (which is x here)
                    }
                },
                y: {
                    grid: {
                        display: false
                    },
                    min: options.yAxisMin !== undefined && options.yAxisMin !== null ? options.yAxisMin : undefined,
                    max: options.yAxisMax !== undefined && options.yAxisMax !== null ? options.yAxisMax : undefined
                }
            },
            animation: {
                duration: 800,
                easing: 'easeOutQuart'
            }
        };

        // Support series colors from options
        const customColors = options.customColors;
        const seriesColors = options.seriesColors || {};

        let colors;
        if (customColors && customColors.length > 0) {
            colors = BasicCharts.generateColors(customColors, data.datasets.length);
        } else {
            colors = this.getColorPalette(data.datasets.length);
        }

        // Apply series colors if set
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
                borderRadius: options.borderRadius !== undefined ? options.borderRadius : 6,
                barPercentage: options.barPercentage !== undefined ? options.barPercentage : 0.7,
                categoryPercentage: options.categoryPercentage !== undefined ? options.categoryPercentage : 0.8
            }))
        };

        return new Chart(ctx, {
            type: 'bar', // Chart.js handles horizontal via indexAxis: 'y'
            data: chartData,
            options: { ...defaultOptions, ...options }
        });
    }
};

// Export
window.BasicCharts = BasicCharts;
