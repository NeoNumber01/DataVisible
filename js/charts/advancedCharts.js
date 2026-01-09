/**
 * Advanced Charts - 高级图表实现
 * Scatter, Bubble, Radar, Area, Stacked, Polar charts
 */

const AdvancedCharts = {
    /**
     * Create a scatter chart
     */
    createScatterChart(ctx, data, options = {}) {
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
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                y: {
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

        // Support series colors from options
        const seriesColors = options.seriesColors || {};
        let colors = BasicCharts.getColorPalette(data.datasets.length);
        if (Object.keys(seriesColors).length > 0) {
            colors = colors.map((c, i) => seriesColors[i] || c);
        }

        // Convert standard data to scatter format
        const chartData = {
            datasets: data.datasets.map((ds, i) => ({
                label: ds.label || `Dataset ${i + 1}`,
                data: ds.data.map((y, idx) => ({ x: idx + 1, y: y })),
                backgroundColor: BasicCharts.hexToRgba(colors[i], 0.6),
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
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                y: {
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

        // Support series colors from options
        const seriesColors = options.seriesColors || {};
        let colors = BasicCharts.getColorPalette(data.datasets.length);
        if (Object.keys(seriesColors).length > 0) {
            colors = colors.map((c, i) => seriesColors[i] || c);
        }

        // Convert standard data to bubble format
        const chartData = {
            datasets: data.datasets.map((ds, i) => ({
                label: ds.label || `Dataset ${i + 1}`,
                data: ds.data.map((y, idx) => ({
                    x: idx + 1,
                    y: y,
                    r: Math.sqrt(y) * 2 + 5 // Size based on value
                })),
                backgroundColor: BasicCharts.hexToRgba(colors[i], 0.6),
                borderColor: colors[i],
                borderWidth: 2
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
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    angleLines: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    pointLabels: {
                        font: {
                            size: 12
                        }
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
        let colors = BasicCharts.getColorPalette(data.datasets.length);
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
                pointHoverRadius: options.pointRadius !== undefined ? options.pointRadius + 2 : 6
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

        // Support series colors from options
        const seriesColors = options.seriesColors || {};
        let colors = BasicCharts.getColorPalette(data.datasets.length);
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
                    stacked: true,
                    grid: {
                        display: false
                    }
                },
                y: {
                    stacked: true,
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

        // Support series colors from options
        const seriesColors = options.seriesColors || {};
        let colors = BasicCharts.getColorPalette(data.datasets.length);
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
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
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
        let colors = BasicCharts.getColorPalette(data.labels.length);
        if (Object.keys(categoryColors).length > 0) {
            colors = colors.map((c, i) => categoryColors[i] || c);
        }

        const chartData = {
            labels: data.labels,
            datasets: [{
                data: dataset.data,
                backgroundColor: colors.map(c => BasicCharts.hexToRgba(c, 0.6)),
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
    }
};

// Export
window.AdvancedCharts = AdvancedCharts;
