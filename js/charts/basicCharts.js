/**
 * Basic Charts - 基础图表实现
 * Bar, Line, Pie, Doughnut charts using Chart.js
 */

// Register Chart.js datalabels plugin globally
if (typeof ChartDataLabels !== 'undefined') {
    Chart.register(ChartDataLabels);
}

const BasicCharts = {
    /**
     * Create a bar chart
     */
    createBarChart(ctx, data, options = {}) {
        const showValues = options.showValues || false;

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
                    color: '#333',
                    anchor: 'end',
                    align: 'top',
                    offset: 4,
                    font: {
                        weight: 'bold',
                        size: 11
                    },
                    formatter: (value) => value
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            },
            animation: {
                duration: 800,
                easing: 'easeOutQuart'
            }
        };

        const colors = this.getColorPalette(data.datasets.length);

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
                    color: '#333',
                    anchor: 'end',
                    align: 'top',
                    offset: 4,
                    font: { weight: 'bold', size: 11 },
                    formatter: (value) => value
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
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

        const colors = this.getColorPalette(data.datasets.length);

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
                    color: '#fff',
                    font: { weight: 'bold', size: 12 },
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
        const colors = this.getColorPalette(data.labels.length);

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
                    color: '#fff',
                    font: { weight: 'bold', size: 12 },
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
        const colors = this.getColorPalette(data.labels.length);

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
     * Get color palette
     */
    getColorPalette(count) {
        const palette = [
            '#6366f1', // Indigo
            '#8b5cf6', // Purple
            '#ec4899', // Pink
            '#f43f5e', // Rose
            '#f97316', // Orange
            '#eab308', // Yellow
            '#22c55e', // Green
            '#14b8a6', // Teal
            '#06b6d4', // Cyan
            '#3b82f6', // Blue
            '#a855f7', // Violet
            '#d946ef'  // Fuchsia
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
     * Convert hex to rgba
     */
    hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    },

    /**
     * Create a rose/nightingale chart (南丁格尔玫瑰图)
     */
    createRoseChart(ctx, data, options = {}) {
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
        // Support category colors from options
        const categoryColors = options.categoryColors || {};
        let colors = this.getColorPalette(data.labels.length);

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
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    position: 'left',
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
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
        const seriesColors = options.seriesColors || {};
        let colors = this.getColorPalette(data.datasets.length);

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
        const defaultOptions = {
            indexAxis: 'y',
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
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                y: {
                    grid: {
                        display: false
                    }
                }
            },
            animation: {
                duration: 800,
                easing: 'easeOutQuart'
            }
        };

        // Support series colors from options
        const seriesColors = options.seriesColors || {};
        let colors = this.getColorPalette(data.datasets.length);

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
                borderWidth: 0,
                borderRadius: 6,
                barPercentage: 0.7,
                categoryPercentage: 0.8
            }))
        };

        return new Chart(ctx, {
            type: 'bar',
            data: chartData,
            options: { ...defaultOptions, ...options }
        });
    }
};

// Export
window.BasicCharts = BasicCharts;
