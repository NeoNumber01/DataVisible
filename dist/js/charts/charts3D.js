/**
 * 3D Charts - 三维图表实现
 * Using ECharts GL for 3D visualizations
 */

const Charts3D = {
    // 存储图表的自动旋转状态
    _chartStates: new WeakMap(),

    /**
     * 创建3D图表控制按钮（播放/暂停）
     * @param {HTMLElement} container - 图表容器
     * @param {Object} chart - ECharts实例
     * @param {boolean} initialAutoRotate - 初始自动旋转状态
     */
    createControlButtons(container, chart, initialAutoRotate = true) {
        // 移除已存在的控制按钮
        const existingControls = container.querySelector('.chart-3d-controls');
        if (existingControls) {
            existingControls.remove();
        }

        // 创建控制按钮容器
        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'chart-3d-controls';
        controlsDiv.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 10px;
            z-index: 100;
        `;

        // 创建播放/暂停按钮
        const playPauseBtn = document.createElement('button');
        playPauseBtn.className = 'chart-3d-btn play-pause-btn';
        playPauseBtn.innerHTML = initialAutoRotate ? '⏸ 暂停' : '▶ 播放';
        playPauseBtn.title = initialAutoRotate ? '暂停自动旋转' : '开始自动旋转';
        playPauseBtn.style.cssText = `
            padding: 8px 16px;
            border: none;
            border-radius: 6px;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            color: white;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 6px;
        `;

        // 悬停效果
        playPauseBtn.addEventListener('mouseenter', () => {
            playPauseBtn.style.transform = 'scale(1.05)';
            playPauseBtn.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.4)';
        });
        playPauseBtn.addEventListener('mouseleave', () => {
            playPauseBtn.style.transform = 'scale(1)';
            playPauseBtn.style.boxShadow = '0 2px 8px rgba(99, 102, 241, 0.3)';
        });

        // 存储旋转状态
        let isRotating = initialAutoRotate;
        this._chartStates.set(chart, { isRotating });

        // 点击事件
        playPauseBtn.addEventListener('click', () => {
            isRotating = !isRotating;
            this._chartStates.set(chart, { isRotating });

            // 更新图表的自动旋转设置
            const option = chart.getOption();

            // 检查是否有grid3D（大多数3D图表）
            if (option.grid3D && option.grid3D.length > 0) {
                chart.setOption({
                    grid3D: {
                        viewControl: {
                            autoRotate: isRotating
                        }
                    }
                });
            }

            // 检查是否有globe（地球图）
            if (option.globe && option.globe.length > 0) {
                chart.setOption({
                    globe: {
                        viewControl: {
                            autoRotate: isRotating
                        }
                    }
                });
            }

            // 更新按钮文本
            playPauseBtn.innerHTML = isRotating ? '⏸ 暂停' : '▶ 播放';
            playPauseBtn.title = isRotating ? '暂停自动旋转' : '开始自动旋转';
        });

        // 创建重置视角按钮
        const resetBtn = document.createElement('button');
        resetBtn.className = 'chart-3d-btn reset-btn';
        resetBtn.innerHTML = '🔄 重置视角';
        resetBtn.title = '重置到初始视角';
        resetBtn.style.cssText = `
            padding: 8px 16px;
            border: none;
            border-radius: 6px;
            background: linear-gradient(135deg, #10b981, #34d399);
            color: white;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 6px;
        `;

        // 悬停效果
        resetBtn.addEventListener('mouseenter', () => {
            resetBtn.style.transform = 'scale(1.05)';
            resetBtn.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
        });
        resetBtn.addEventListener('mouseleave', () => {
            resetBtn.style.transform = 'scale(1)';
            resetBtn.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.3)';
        });

        // 重置视角点击事件
        resetBtn.addEventListener('click', () => {
            const option = chart.getOption();

            // 重置grid3D视角
            if (option.grid3D && option.grid3D.length > 0) {
                chart.setOption({
                    grid3D: {
                        viewControl: {
                            alpha: 40,
                            beta: 40,
                            distance: 200
                        }
                    }
                });
            }

            // 重置globe视角
            if (option.globe && option.globe.length > 0) {
                chart.setOption({
                    globe: {
                        viewControl: {
                            alpha: 0,
                            beta: 0,
                            distance: 200
                        }
                    }
                });
            }
        });

        // 添加提示文本
        const hintText = document.createElement('span');
        hintText.className = 'chart-3d-hint';
        hintText.textContent = '💡 拖拽鼠标旋转视角，滚轮缩放';
        hintText.style.cssText = `
            color: #64748b;
            font-size: 12px;
            margin-left: 10px;
            display: flex;
            align-items: center;
        `;

        controlsDiv.appendChild(playPauseBtn);
        controlsDiv.appendChild(resetBtn);
        controlsDiv.appendChild(hintText);

        // 确保容器有相对定位
        const containerStyle = window.getComputedStyle(container);
        if (containerStyle.position === 'static') {
            container.style.position = 'relative';
        }

        container.appendChild(controlsDiv);
    },

    /**
     * 为伪3D柱形图创建鼠标拖拽控制
     * 支持通过鼠标拖拽来调整透视角度 (depthAngleX, depthAngleY)
     * @param {HTMLElement} container - 图表容器
     * @param {Object} chart - ECharts实例
     * @param {Object} options - 当前图表选项
     * @param {string} chartType - 图表类型
     * @param {Object} data - 图表数据
     * @param {Function} renderFunc - 重新渲染函数
     */
    createPseudo3DControls(container, chart, options, chartType, data, renderFunc) {
        // 移除已存在的控制
        const existingControls = container.querySelector('.chart-3d-controls');
        if (existingControls) {
            existingControls.remove();
        }

        // 移除已存在的交互覆盖层
        const existingOverlay = container.querySelector('.pseudo-3d-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }

        // 当前透视角度
        let depthAngleX = options.depthAngleX !== undefined ? options.depthAngleX : 0.5;
        let depthAngleY = options.depthAngleY !== undefined ? options.depthAngleY : -0.3;
        const defaultAngleX = 0.5;
        const defaultAngleY = -0.3;

        // 拖拽状态
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let startAngleX = depthAngleX;
        let startAngleY = depthAngleY;

        // 灵敏度
        const sensitivityX = 0.003;
        const sensitivityY = 0.002;

        // 创建交互覆盖层（透明，用于捕获鼠标事件）
        const overlay = document.createElement('div');
        overlay.className = 'pseudo-3d-overlay';
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 60px;
            cursor: grab;
            z-index: 50;
        `;

        // 鼠标按下事件
        overlay.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startAngleX = depthAngleX;
            startAngleY = depthAngleY;
            overlay.style.cursor = 'grabbing';
            e.preventDefault();
        });

        // 鼠标移动事件
        const onMouseMove = (e) => {
            if (!isDragging) return;

            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            // 计算新的透视角度
            depthAngleX = Math.max(0, Math.min(1.5, startAngleX + deltaX * sensitivityX));
            depthAngleY = Math.max(-1, Math.min(0, startAngleY + deltaY * sensitivityY));

            // 更新选项并重新渲染
            const newOptions = {
                ...options,
                depthAngleX,
                depthAngleY
            };

            // 使用防抖重新渲染
            if (this._renderTimeout) {
                clearTimeout(this._renderTimeout);
            }
            this._renderTimeout = setTimeout(() => {
                renderFunc(container, data, newOptions);
            }, 16); // ~60fps
        };

        // 鼠标释放事件
        const onMouseUp = () => {
            if (isDragging) {
                isDragging = false;
                overlay.style.cursor = 'grab';

                // 更新options中的角度值
                options.depthAngleX = depthAngleX;
                options.depthAngleY = depthAngleY;
            }
        };

        // 添加全局事件监听
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        // 存储清理函数
        chart._pseudo3DCleanup = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        // 创建控制按钮容器
        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'chart-3d-controls';
        controlsDiv.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 10px;
            z-index: 100;
        `;

        // 创建重置视角按钮
        const resetBtn = document.createElement('button');
        resetBtn.className = 'chart-3d-btn reset-btn';
        resetBtn.innerHTML = '🔄 重置视角';
        resetBtn.title = '重置到初始视角';
        resetBtn.style.cssText = `
            padding: 8px 16px;
            border: none;
            border-radius: 6px;
            background: linear-gradient(135deg, #10b981, #34d399);
            color: white;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 6px;
        `;

        // 悬停效果
        resetBtn.addEventListener('mouseenter', () => {
            resetBtn.style.transform = 'scale(1.05)';
            resetBtn.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
        });
        resetBtn.addEventListener('mouseleave', () => {
            resetBtn.style.transform = 'scale(1)';
            resetBtn.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.3)';
        });

        // 重置视角点击事件
        resetBtn.addEventListener('click', () => {
            depthAngleX = defaultAngleX;
            depthAngleY = defaultAngleY;
            options.depthAngleX = defaultAngleX;
            options.depthAngleY = defaultAngleY;
            renderFunc(container, data, options);
        });

        // 添加提示文本
        const hintText = document.createElement('span');
        hintText.className = 'chart-3d-hint';
        hintText.textContent = '💡 拖拽鼠标调整视角';
        hintText.style.cssText = `
            color: #64748b;
            font-size: 12px;
            margin-left: 10px;
            display: flex;
            align-items: center;
        `;

        // 显示当前角度的文本
        const angleText = document.createElement('span');
        angleText.className = 'chart-3d-angle';
        angleText.textContent = `X: ${depthAngleX.toFixed(2)} Y: ${depthAngleY.toFixed(2)}`;
        angleText.style.cssText = `
            color: #6366f1;
            font-size: 12px;
            font-weight: 500;
            margin-left: 10px;
            font-family: monospace;
        `;

        controlsDiv.appendChild(resetBtn);
        controlsDiv.appendChild(hintText);
        controlsDiv.appendChild(angleText);

        // 确保容器有相对定位
        const containerStyle = window.getComputedStyle(container);
        if (containerStyle.position === 'static') {
            container.style.position = 'relative';
        }

        container.appendChild(overlay);
        container.appendChild(controlsDiv);

        // 存储角度显示元素的更新函数
        chart._updateAngleDisplay = () => {
            angleText.textContent = `X: ${depthAngleX.toFixed(2)} Y: ${depthAngleY.toFixed(2)}`;
        };
    },
    /**
     * Create a 3D bar chart
     */
    createBar3DChart(container, data, options = {}) {
        // 安全清理：如果容器已有 ECharts 实例，先销毁它
        const existingChart = echarts.getInstanceByDom(container);
        if (existingChart) {
            existingChart.dispose();
        }
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

        chart.setOption(option, true);

        // 添加控制按钮（播放/暂停、重置视角）
        this.createControlButtons(container, chart, autoRotate);

        return chart;
    },

    /**
     * Create a 3D scatter chart
     */
    createScatter3DChart(container, data, options = {}) {
        // 安全清理：如果容器已有 ECharts 实例，先销毁它
        const existingChart = echarts.getInstanceByDom(container);
        if (existingChart) {
            existingChart.dispose();
        }
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

        chart.setOption(option, true);

        // 添加控制按钮（播放/暂停、重置视角）
        this.createControlButtons(container, chart, autoRotate);

        return chart;
    },

    /**
     * Create a 3D surface chart
     */
    createSurface3DChart(container, data, options = {}) {
        // 安全清理：如果容器已有 ECharts 实例，先销毁它
        const existingChart = echarts.getInstanceByDom(container);
        if (existingChart) {
            existingChart.dispose();
        }
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

        chart.setOption(option, true);

        // 添加控制按钮（播放/暂停、重置视角）
        this.createControlButtons(container, chart, autoRotate);

        return chart;
    },

    /**
     * Create a globe chart
     */
    createGlobeChart(container, data, options = {}) {
        // 安全清理：如果容器已有 ECharts 实例，先销毁它
        const existingChart = echarts.getInstanceByDom(container);
        if (existingChart) {
            existingChart.dispose();
        }
        const chart = echarts.init(container);

        // Parse options - support both array (colors) and object format
        const customColors = Array.isArray(options) ? options : options?.customColors;
        const categoryColors = options.categoryColors || {};
        const autoRotate = options.autoRotate !== undefined ? options.autoRotate : true;
        const rotateSpeed = options.rotateSpeed || 3;
        const symbolSize = options.symbolSize || 8;
        const showValues = options.showValues !== undefined ? options.showValues : false;

        // Data label styling options
        const labelFontSize = options.labelFontSize || 12;
        const labelFontWeight = options.labelFontWeight || 'bold';
        const labelColor = options.labelColor || 'inherit';

        // Get color palette for data points
        const dataCount = data.labels.length;
        let colors;

        if (customColors && customColors.length > 0) {
            // Use custom colors and expand if needed
            colors = BasicCharts.generateColors(customColors, dataCount);
        } else {
            // Use default color palette
            colors = BasicCharts.getColorPalette(dataCount);
        }

        // Generate globe scatter data with individual colors
        const globeData = data.labels.map((label, i) => {
            // Determine color for this data point
            let pointColor = colors[i % colors.length];

            // If category colors are set, use them
            if (categoryColors[i]) {
                pointColor = categoryColors[i];
            }

            return {
                name: label,
                value: [
                    (i * 30) % 360 - 180,  // longitude
                    (i * 20) % 180 - 90,   // latitude
                    data.datasets[0]?.data[i] || 10
                ],
                itemStyle: {
                    color: pointColor
                }
            };
        });

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
                    opacity: 0.8
                },
                emphasis: {
                    itemStyle: {
                        opacity: 1
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

        chart.setOption(option, true);

        // 添加控制按钮（播放/暂停、重置视角）
        this.createControlButtons(container, chart, autoRotate);

        return chart;
    },

    /**
     * Create a 3D line chart
     */
    createLine3DChart(container, data, options = {}) {
        // 安全清理：如果容器已有 ECharts 实例，先销毁它
        const existingChart = echarts.getInstanceByDom(container);
        if (existingChart) {
            existingChart.dispose();
        }
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

        chart.setOption(option, true);

        // 添加控制按钮（播放/暂停、重置视角）
        this.createControlButtons(container, chart, autoRotate);

        return chart;
    },

    /**
     * Create a 3D pie chart (3D饼图)
     * Simulated 3D effect using ECharts with pseudo-3D styling
     */
    createPie3DChart(container, data, options = {}) {
        // 安全清理：如果容器已有 ECharts 实例，先销毁它
        const existingChart = echarts.getInstanceByDom(container);
        if (existingChart) {
            existingChart.dispose();
        }
        const chart = echarts.init(container);

        // Parse options
        const customColors = Array.isArray(options) ? options : options?.customColors;
        const categoryColors = options.categoryColors || {};
        const showValues = options.showValues !== undefined ? options.showValues : true;
        const labelFontSize = options.labelFontSize || 14;
        const labelFontWeight = options.labelFontWeight || 'bold';
        const labelColor = options.labelColor || '#333';
        const roseType = options.roseType || false; // 'radius' or 'area' for rose effect
        const depth = options.depth !== undefined ? options.depth : 25;

        const dataset = data.datasets[0] || { data: [] };
        const dataCount = data.labels.length;

        // Get colors
        let colors;
        if (customColors && customColors.length > 0) {
            colors = BasicCharts.generateColors(customColors, dataCount);
        } else {
            colors = BasicCharts.getColorPalette(dataCount);
        }

        // Apply category colors if set
        if (Object.keys(categoryColors).length > 0) {
            colors = colors.map((c, i) => categoryColors[i] || c);
        }

        // Create inner shadow effect for 3D look
        const pieData = data.labels.map((label, i) => ({
            name: label,
            value: dataset.data[i] || 0,
            itemStyle: {
                color: colors[i],
                shadowBlur: depth,
                shadowOffsetX: 0,
                shadowOffsetY: depth / 2,
                shadowColor: 'rgba(0, 0, 0, 0.3)'
            }
        }));

        const option = {
            tooltip: {
                trigger: 'item',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderWidth: 0,
                textStyle: { color: '#fff' },
                formatter: '{b}: {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                right: 10,
                top: 'center',
                textStyle: { fontSize: 12 },
                data: data.labels.map((label, i) => ({
                    name: label,
                    itemStyle: {
                        color: colors[i]
                    }
                }))
            },
            color: colors,
            series: [
                // Bottom shadow layer for 3D effect
                {
                    type: 'pie',
                    radius: ['0%', '60%'],
                    center: ['40%', '52%'],
                    silent: true,
                    z: 1,
                    itemStyle: {
                        color: 'rgba(0, 0, 0, 0.15)'
                    },
                    data: pieData.map(d => ({ ...d, itemStyle: { color: 'rgba(0, 0, 0, 0.15)' } })),
                    label: { show: false },
                    labelLine: { show: false }
                },
                // Main pie layer
                {
                    type: 'pie',
                    radius: ['0%', '60%'],
                    center: ['40%', '50%'],
                    roseType: roseType,
                    z: 2,
                    itemStyle: {
                        borderRadius: 5,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    data: pieData,
                    label: {
                        show: showValues,
                        formatter: '{b}: {d}%',
                        fontSize: labelFontSize,
                        fontWeight: labelFontWeight,
                        color: labelColor
                    },
                    labelLine: {
                        show: showValues,
                        length: 15,
                        length2: 10
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 30,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        },
                        scale: true,
                        scaleSize: 10
                    }
                }
            ]
        };

        chart.setOption(option, true);
        return chart;
    },

    /**
     * Create a wireframe-only surface chart (仅线框曲面图)
     * Shows only the wireframe without surface coloring
     */
    createWireframeSurfaceChart(container, data, options = {}) {
        // 安全清理：如果容器已有 ECharts 实例，先销毁它
        const existingChart = echarts.getInstanceByDom(container);
        if (existingChart) {
            existingChart.dispose();
        }
        const chart = echarts.init(container);

        // Parse options
        const customColors = Array.isArray(options) ? options : options?.customColors;
        const autoRotate = options.autoRotate !== undefined ? options.autoRotate : true;
        const rotateSpeed = options.rotateSpeed || 3;
        const wireframeWidth = options.wireframeWidth !== undefined ? options.wireframeWidth : 1;
        const showValues = options.showValues !== undefined ? options.showValues : false;
        const labelFontSize = options.labelFontSize || 12;
        const labelFontWeight = options.labelFontWeight || 'bold';
        const labelColor = options.labelColor || '#333';

        // Wireframe color
        let wireframeColor = '#6366f1';
        if (customColors && customColors[0]) {
            wireframeColor = customColors[0];
        }

        // Generate surface data - need a proper grid for surface chart
        const xCount = data.labels.length;
        const yCount = data.datasets.length;

        // Surface chart requires parametric mode when data doesn't form a natural grid
        // We need to generate a proper mesh grid
        const gridSize = 20; // Resolution of the wireframe mesh

        // Get the max value from data for scaling
        const maxVal = Math.max(...data.datasets.flatMap(ds => ds.data.filter(v => v != null)));
        const minVal = Math.min(...data.datasets.flatMap(ds => ds.data.filter(v => v != null)));

        // Create parametric surface function based on the data
        // This creates a smooth interpolated surface
        const option = {
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderWidth: 0,
                textStyle: { color: '#fff' },
                formatter: function (params) {
                    return `x: ${params.value[0].toFixed(1)}<br/>y: ${params.value[1].toFixed(1)}<br/>z: ${params.value[2].toFixed(1)}`;
                }
            },
            visualMap: {
                show: true,
                dimension: 2,
                min: minVal * 0.8,
                max: maxVal * 1.2,
                inRange: {
                    color: customColors && customColors.length >= 2
                        ? customColors
                        : ['#3b82f6', '#60a5fa', '#a5b4fc', '#6366f1', '#8b5cf6', '#a855f7']
                },
                textStyle: {
                    color: '#666'
                }
            },
            xAxis3D: {
                type: 'value',
                name: 'X',
                min: 0,
                max: xCount - 1
            },
            yAxis3D: {
                type: 'value',
                name: 'Y',
                min: 0,
                max: Math.max(yCount - 1, gridSize - 1)
            },
            zAxis3D: {
                type: 'value',
                name: 'Z'
            },
            grid3D: {
                viewControl: {
                    projection: 'perspective',
                    autoRotate: autoRotate,
                    autoRotateSpeed: rotateSpeed,
                    distance: 200
                },
                light: {
                    main: { intensity: 0.8 },
                    ambient: { intensity: 0.4 }
                }
            },
            series: [{
                type: 'surface',
                wireframe: {
                    show: true,
                    lineStyle: {
                        color: wireframeColor,
                        width: wireframeWidth,
                        opacity: 0.8
                    }
                },
                shading: 'color',
                itemStyle: {
                    opacity: 0.6
                },
                // Use parametric equation to generate proper surface mesh
                parametric: true,
                parametricEquation: {
                    u: {
                        min: 0,
                        max: xCount - 1,
                        step: (xCount - 1) / (gridSize - 1)
                    },
                    v: {
                        min: 0,
                        max: Math.max(yCount - 1, 1) || 1,
                        step: Math.max(yCount - 1, 1) / (gridSize - 1)
                    },
                    x: function (u, v) {
                        return u;
                    },
                    y: function (u, v) {
                        return v;
                    },
                    z: function (u, v) {
                        // Interpolate z value based on u (x index) and v (y/dataset index)
                        const xIdx = Math.floor(u);
                        const xFrac = u - xIdx;
                        const yIdx = Math.floor(v);
                        const yFrac = v - yIdx;

                        // Get values from each corner of the cell
                        const getVal = (xi, yi) => {
                            const safeXi = Math.min(Math.max(0, xi), xCount - 1);
                            const safeYi = Math.min(Math.max(0, yi), yCount - 1);
                            return data.datasets[safeYi]?.data[safeXi] || 0;
                        };

                        // Bilinear interpolation
                        const z00 = getVal(xIdx, yIdx);
                        const z10 = getVal(xIdx + 1, yIdx);
                        const z01 = getVal(xIdx, yIdx + 1);
                        const z11 = getVal(xIdx + 1, yIdx + 1);

                        const z0 = z00 * (1 - xFrac) + z10 * xFrac;
                        const z1 = z01 * (1 - xFrac) + z11 * xFrac;

                        return z0 * (1 - yFrac) + z1 * yFrac;
                    }
                },
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

        chart.setOption(option, true);

        // 添加控制按钮（播放/暂停、重置视角）
        this.createControlButtons(container, chart, autoRotate);

        return chart;
    },

    /**
     * 三维簇状柱形图 - Clustered 3D Bar Chart
     * 多系列并排的伪3D柱状图
     */
    createClusteredBar3DChart(container, data, options = {}) {
        const existingChart = echarts.getInstanceByDom(container);
        if (existingChart) {
            existingChart.dispose();
        }
        const chart = echarts.init(container);

        // Parse options
        const customColors = Array.isArray(options) ? options : options?.customColors;
        const barWidth = options.barWidth || 25;
        const depth = options.depth || 15;
        const showValues = options.showValues !== undefined ? options.showValues : false;
        const labelFontSize = options.labelFontSize || 12;
        const labelFontWeight = options.labelFontWeight || 'bold';
        const labelColor = options.labelColor || '#333';

        // Get colors
        const seriesCount = data.datasets.length;
        let colors;
        if (customColors && customColors.length > 0) {
            colors = BasicCharts.generateColors(customColors, seriesCount);
        } else {
            colors = BasicCharts.getColorPalette(seriesCount);
        }

        // Pre-calculate color variants for each series (to avoid this binding issues in renderItem)
        const colorVariants = colors.map(baseColor => ({
            base: baseColor,
            top: Charts3D.lightenColor(baseColor, 20),
            side: Charts3D.darkenColor(baseColor, 20)
        }));

        // Helper function to create 3D bar path
        const createBar3DPath = (x, y, width, height, depth) => {
            // Main face (front)
            const frontPath = `M ${x} ${y} L ${x + width} ${y} L ${x + width} ${y - height} L ${x} ${y - height} Z`;
            // Top face
            const topPath = `M ${x} ${y - height} L ${x + depth} ${y - height - depth * 0.6} L ${x + width + depth} ${y - height - depth * 0.6} L ${x + width} ${y - height} Z`;
            // Right side face
            const rightPath = `M ${x + width} ${y} L ${x + width + depth} ${y - depth * 0.6} L ${x + width + depth} ${y - height - depth * 0.6} L ${x + width} ${y - height} Z`;
            return { frontPath, topPath, rightPath };
        };

        // Create series with custom rendering
        const series = data.datasets.map((ds, seriesIndex) => ({
            type: 'custom',
            name: ds.label,
            renderItem: (params, api) => {
                const categoryIndex = api.value(0);
                const value = api.value(1);
                const barGap = 4;
                const groupWidth = (barWidth + barGap) * seriesCount;
                const startX = api.coord([categoryIndex, 0])[0] - groupWidth / 2 + seriesIndex * (barWidth + barGap);
                const startY = api.coord([categoryIndex, 0])[1];
                const endY = api.coord([categoryIndex, value])[1];
                const barHeight = startY - endY;

                const { base: baseColor, top: topColor, side: sideColor } = colorVariants[seriesIndex];

                const children = [];

                // Front face
                children.push({
                    type: 'rect',
                    shape: { x: startX, y: endY, width: barWidth, height: barHeight },
                    style: { fill: baseColor }
                });

                // Top face (parallelogram)
                children.push({
                    type: 'polygon',
                    shape: {
                        points: [
                            [startX, endY],
                            [startX + depth, endY - depth * 0.6],
                            [startX + barWidth + depth, endY - depth * 0.6],
                            [startX + barWidth, endY]
                        ]
                    },
                    style: { fill: topColor }
                });

                // Right side face
                children.push({
                    type: 'polygon',
                    shape: {
                        points: [
                            [startX + barWidth, endY],
                            [startX + barWidth + depth, endY - depth * 0.6],
                            [startX + barWidth + depth, startY - depth * 0.6],
                            [startX + barWidth, startY]
                        ]
                    },
                    style: { fill: sideColor }
                });

                // Value label
                if (showValues) {
                    children.push({
                        type: 'text',
                        style: {
                            text: value,
                            x: startX + barWidth / 2 + depth / 2,
                            y: endY - depth * 0.6 - 5,
                            fill: labelColor,
                            fontSize: labelFontSize,
                            fontWeight: labelFontWeight,
                            textAlign: 'center',
                            textVerticalAlign: 'bottom'
                        }
                    });
                }

                return { type: 'group', children };
            },
            data: data.labels.map((label, i) => [i, ds.data[i] || 0]),
            encode: { x: 0, y: 1 }
        }));

        const option = {
            color: colors,  // Explicitly set colors to match legend
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                textStyle: { color: '#fff' }
            },
            legend: {
                data: data.datasets.map(ds => ds.label),
                top: 10
            },
            grid: {
                left: '5%',
                right: '5%',
                bottom: '10%',
                top: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: data.labels,
                axisLine: { lineStyle: { color: '#999' } }
            },
            yAxis: {
                type: 'value',
                axisLine: { lineStyle: { color: '#999' } },
                splitLine: { lineStyle: { color: '#eee' } }
            },
            series: series
        };

        chart.setOption(option, true);
        return chart;
    },

    /**
     * 三维堆积柱形图 - Stacked 3D Bar Chart
     * 垂直堆叠的伪3D柱状图
     */
    createStackedBar3DChart(container, data, options = {}) {
        const existingChart = echarts.getInstanceByDom(container);
        if (existingChart) {
            existingChart.dispose();
        }
        const chart = echarts.init(container);

        // Parse options
        const customColors = Array.isArray(options) ? options : options?.customColors;
        const barWidth = options.barWidth || 40;
        const depth = options.depth || 18;
        const showValues = options.showValues !== undefined ? options.showValues : false;
        const labelFontSize = options.labelFontSize || 11;
        const labelFontWeight = options.labelFontWeight || 'bold';
        const labelColor = options.labelColor || '#fff';

        // Get colors
        const seriesCount = data.datasets.length;
        let colors;
        if (customColors && customColors.length > 0) {
            colors = BasicCharts.generateColors(customColors, seriesCount);
        } else {
            colors = BasicCharts.getColorPalette(seriesCount);
        }

        // Pre-calculate color variants for each series
        const colorVariants = colors.map(baseColor => ({
            base: baseColor,
            top: Charts3D.lightenColor(baseColor, 25),
            topMid: Charts3D.lightenColor(baseColor, 15),
            side: Charts3D.darkenColor(baseColor, 25)
        }));

        // Calculate cumulative values for stacking
        const cumulativeData = data.labels.map((_, labelIndex) => {
            let cumulative = 0;
            return data.datasets.map((ds, dsIndex) => {
                const start = cumulative;
                const value = ds.data[labelIndex] || 0;
                cumulative += value;
                return { start, value, end: cumulative };
            });
        });

        // Create stacked series
        const series = data.datasets.map((ds, seriesIndex) => ({
            type: 'custom',
            name: ds.label,
            renderItem: (params, api) => {
                const categoryIndex = api.value(0);
                const stackInfo = cumulativeData[categoryIndex][seriesIndex];
                const startX = api.coord([categoryIndex, 0])[0] - barWidth / 2;
                const baseY = api.coord([categoryIndex, stackInfo.start])[1];
                const topY = api.coord([categoryIndex, stackInfo.end])[1];
                const barHeight = baseY - topY;

                const { base: baseColor, top: topColor, topMid: topMidColor, side: sideColor } = colorVariants[seriesIndex];

                const children = [];
                const isTop = seriesIndex === seriesCount - 1;

                // Front face
                children.push({
                    type: 'rect',
                    shape: { x: startX, y: topY, width: barWidth, height: barHeight },
                    style: { fill: baseColor }
                });

                // Top face (only for top segment)
                if (isTop || stackInfo.value > 0) {
                    children.push({
                        type: 'polygon',
                        shape: {
                            points: [
                                [startX, topY],
                                [startX + depth, topY - depth * 0.6],
                                [startX + barWidth + depth, topY - depth * 0.6],
                                [startX + barWidth, topY]
                            ]
                        },
                        style: { fill: isTop ? topColor : topMidColor }
                    });
                }

                // Right side face
                children.push({
                    type: 'polygon',
                    shape: {
                        points: [
                            [startX + barWidth, topY],
                            [startX + barWidth + depth, topY - depth * 0.6],
                            [startX + barWidth + depth, baseY - depth * 0.6],
                            [startX + barWidth, baseY]
                        ]
                    },
                    style: { fill: sideColor }
                });

                // Value label
                if (showValues && stackInfo.value > 0) {
                    children.push({
                        type: 'text',
                        style: {
                            text: stackInfo.value,
                            x: startX + barWidth / 2,
                            y: topY + barHeight / 2,
                            fill: labelColor,
                            fontSize: labelFontSize,
                            fontWeight: labelFontWeight,
                            textAlign: 'center',
                            textVerticalAlign: 'middle'
                        }
                    });
                }

                return { type: 'group', children };
            },
            data: data.labels.map((label, i) => [i, ds.data[i] || 0]),
            encode: { x: 0, y: 1 }
        }));

        const maxTotal = Math.max(...data.labels.map((_, i) =>
            data.datasets.reduce((sum, ds) => sum + (ds.data[i] || 0), 0)
        ));

        const option = {
            color: colors,  // Explicitly set colors to match legend
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                textStyle: { color: '#fff' }
            },
            legend: {
                data: data.datasets.map(ds => ds.label),
                top: 10
            },
            grid: {
                left: '5%',
                right: '5%',
                bottom: '10%',
                top: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: data.labels,
                axisLine: { lineStyle: { color: '#999' } }
            },
            yAxis: {
                type: 'value',
                max: Math.ceil(maxTotal * 1.1),
                axisLine: { lineStyle: { color: '#999' } },
                splitLine: { lineStyle: { color: '#eee' } }
            },
            series: series
        };

        chart.setOption(option, true);
        return chart;
    },

    /**
     * 三维百分比堆积柱形图 - Percent Stacked 3D Bar Chart
     * 100%比例堆叠的伪3D柱状图
     */
    createPercentStackedBar3DChart(container, data, options = {}) {
        const existingChart = echarts.getInstanceByDom(container);
        if (existingChart) {
            existingChart.dispose();
        }
        const chart = echarts.init(container);

        // Parse options
        const customColors = Array.isArray(options) ? options : options?.customColors;
        const barWidth = options.barWidth || 40;
        const depth = options.depth || 18;
        const showValues = options.showValues !== undefined ? options.showValues : false;
        const labelFontSize = options.labelFontSize || 11;
        const labelFontWeight = options.labelFontWeight || 'bold';
        const labelColor = options.labelColor || '#fff';

        // Get colors
        const seriesCount = data.datasets.length;
        let colors;
        if (customColors && customColors.length > 0) {
            colors = BasicCharts.generateColors(customColors, seriesCount);
        } else {
            colors = BasicCharts.getColorPalette(seriesCount);
        }

        // Pre-calculate color variants for each series
        const colorVariants = colors.map(baseColor => ({
            base: baseColor,
            top: Charts3D.lightenColor(baseColor, 25),
            topMid: Charts3D.lightenColor(baseColor, 15),
            side: Charts3D.darkenColor(baseColor, 25)
        }));

        // Calculate percentage values
        const totals = data.labels.map((_, i) =>
            data.datasets.reduce((sum, ds) => sum + (ds.data[i] || 0), 0)
        );

        const percentData = data.labels.map((_, labelIndex) => {
            let cumulative = 0;
            return data.datasets.map((ds, dsIndex) => {
                const start = cumulative;
                const rawValue = ds.data[labelIndex] || 0;
                const percent = totals[labelIndex] > 0 ? (rawValue / totals[labelIndex]) * 100 : 0;
                cumulative += percent;
                return { start, percent, end: cumulative, rawValue };
            });
        });

        // Create percent stacked series
        const series = data.datasets.map((ds, seriesIndex) => ({
            type: 'custom',
            name: ds.label,
            renderItem: (params, api) => {
                const categoryIndex = api.value(0);
                const stackInfo = percentData[categoryIndex][seriesIndex];
                const startX = api.coord([categoryIndex, 0])[0] - barWidth / 2;
                const baseY = api.coord([categoryIndex, stackInfo.start])[1];
                const topY = api.coord([categoryIndex, stackInfo.end])[1];
                const barHeight = baseY - topY;

                const { base: baseColor, top: topColor, topMid: topMidColor, side: sideColor } = colorVariants[seriesIndex];

                const children = [];
                const isTop = seriesIndex === seriesCount - 1;

                // Front face
                children.push({
                    type: 'rect',
                    shape: { x: startX, y: topY, width: barWidth, height: barHeight },
                    style: { fill: baseColor }
                });

                // Top face
                if (isTop || stackInfo.percent > 0) {
                    children.push({
                        type: 'polygon',
                        shape: {
                            points: [
                                [startX, topY],
                                [startX + depth, topY - depth * 0.6],
                                [startX + barWidth + depth, topY - depth * 0.6],
                                [startX + barWidth, topY]
                            ]
                        },
                        style: { fill: isTop ? topColor : topMidColor }
                    });
                }

                // Right side face
                children.push({
                    type: 'polygon',
                    shape: {
                        points: [
                            [startX + barWidth, topY],
                            [startX + barWidth + depth, topY - depth * 0.6],
                            [startX + barWidth + depth, baseY - depth * 0.6],
                            [startX + barWidth, baseY]
                        ]
                    },
                    style: { fill: sideColor }
                });

                // Percent label
                if (showValues && stackInfo.percent > 5) {
                    children.push({
                        type: 'text',
                        style: {
                            text: Math.round(stackInfo.percent) + '%',
                            x: startX + barWidth / 2,
                            y: topY + barHeight / 2,
                            fill: labelColor,
                            fontSize: labelFontSize,
                            fontWeight: labelFontWeight,
                            textAlign: 'center',
                            textVerticalAlign: 'middle'
                        }
                    });
                }

                return { type: 'group', children };
            },
            data: data.labels.map((label, i) => [i, ds.data[i] || 0]),
            encode: { x: 0, y: 1 }
        }));

        const option = {
            color: colors,  // Explicitly set colors to match legend
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                textStyle: { color: '#fff' },
                formatter: (params) => {
                    let result = params[0].axisValue + '<br/>';
                    params.forEach(p => {
                        const info = percentData[p.dataIndex][p.seriesIndex];
                        result += `${p.marker} ${p.seriesName}: ${info.rawValue} (${Math.round(info.percent)}%)<br/>`;
                    });
                    return result;
                }
            },
            legend: {
                data: data.datasets.map(ds => ds.label),
                top: 10
            },
            grid: {
                left: '5%',
                right: '5%',
                bottom: '10%',
                top: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: data.labels,
                axisLine: { lineStyle: { color: '#999' } }
            },
            yAxis: {
                type: 'value',
                max: 100,
                axisLabel: { formatter: '{value}%' },
                axisLine: { lineStyle: { color: '#999' } },
                splitLine: { lineStyle: { color: '#eee' } }
            },
            series: series
        };

        chart.setOption(option, true);
        return chart;
    },

    /**
     * 三维柱形图（透视） - Perspective 3D Bar Chart
     * 严格复刻Word/Excel效果：左侧墙面 + 后侧墙面
     * Y轴在左前侧，网格线先斜向右上（深度），再水平向右（宽度）
     */
    createPerspectiveBar3DChart(container, data, options = {}) {
        const existingChart = echarts.getInstanceByDom(container);
        if (existingChart) {
            existingChart.dispose();
        }
        const chart = echarts.init(container);

        // Parse options
        const customColors = Array.isArray(options) ? options : options?.customColors;
        const barWidthOpt = options.barWidth || 40;
        const depthOpt = options.depth || 16;
        const depthGapOpt = options.depthGap || 25;
        const showValues = options.showValues !== undefined ? options.showValues : true;
        const labelFontSize = options.labelFontSize || 11;
        const labelFontWeight = options.labelFontWeight || 'bold';
        const labelColor = options.labelColor || '#333';

        // Get colors
        const seriesCount = data.datasets.length;
        const categoryCount = data.labels.length;
        let colors;
        if (customColors && customColors.length > 0) {
            colors = BasicCharts.generateColors(customColors, seriesCount);
        } else {
            colors = BasicCharts.getColorPalette(seriesCount);
        }

        // 3D parameters
        // Depth (Left Wall) Vector: Going Upper-Right
        // Use options if provided, otherwise default
        const depthAngleX = options.depthAngleX !== undefined ? options.depthAngleX : 0.5;
        const depthAngleY = options.depthAngleY !== undefined ? options.depthAngleY : -0.3;
        const totalDepth = seriesCount * depthGapOpt;

        // Chart dimensions
        const chartWidth = container.clientWidth || 800;
        const chartHeight = container.clientHeight || 400;
        const margin = {
            top: 40 + Math.abs(totalDepth * depthAngleY),
            right: 60,
            bottom: 60,
            left: 60
        };

        // Important: plotWidth applies to the "Back Wall" width
        const plotWidth = chartWidth - margin.left - margin.right - (totalDepth * depthAngleX);
        const plotHeight = chartHeight - margin.top - margin.bottom;

        // Calculate max value for Y-axis scaling
        const maxValue = Math.max(...data.datasets.flatMap(ds => ds.data)) * 1.15;
        const yScale = plotHeight / maxValue;

        const categoryWidth = plotWidth / categoryCount;
        const barWidth = Math.min(barWidthOpt, categoryWidth * 0.55);
        const barDepth = depthOpt;

        const colorVariants = colors.map(baseColor => ({
            base: baseColor,
            top: Charts3D.lightenColor(baseColor, 20),
            side: Charts3D.darkenColor(baseColor, 30)
        }));

        const graphicElements = [];
        const gridColor = '#ccc';
        const wallFill = '#fcfcfc';

        // ===== Coordinates =====
        // Origin: Front-Left-Bottom (Base of Y-axis)
        const originX = margin.left;
        const originY = margin.top + plotHeight;

        // Key Vectors
        const depthVec = { x: totalDepth * depthAngleX, y: totalDepth * depthAngleY };
        const widthVec = { x: plotWidth, y: 0 };
        const heightVec = { x: 0, y: -plotHeight }; // Up is negative

        // Key Points
        const p0 = { x: originX, y: originY }; // Front-Left-Bottom
        const p1 = { x: originX + depthVec.x, y: originY + depthVec.y }; // Back-Left-Bottom
        const p2 = { x: p1.x + widthVec.x, y: p1.y + widthVec.y }; // Back-Right-Bottom
        const p3 = { x: p0.x + widthVec.x, y: p0.y + widthVec.y }; // Front-Right-Bottom

        const p0_top = { x: p0.x, y: p0.y + heightVec.y }; // Front-Left-Top
        const p1_top = { x: p1.x, y: p1.y + heightVec.y }; // Back-Left-Top
        const p2_top = { x: p2.x, y: p2.y + heightVec.y }; // Back-Right-Top
        const p3_top = { x: p3.x, y: p3.y + heightVec.y }; // Front-Right-Top

        // ===== 1. Draw Walls (Background) =====

        // Left Wall (Diagonal)
        graphicElements.push({
            type: 'polygon',
            z: 0,
            shape: {
                points: [
                    [p0.x, p0.y], [p1.x, p1.y],
                    [p1_top.x, p1_top.y], [p0_top.x, p0_top.y]
                ]
            },
            style: { fill: wallFill, stroke: gridColor, lineWidth: 1 }
        });

        // Back Wall (Horizontal)
        graphicElements.push({
            type: 'polygon',
            z: 0,
            shape: {
                points: [
                    [p1.x, p1.y], [p2.x, p2.y],
                    [p2_top.x, p2_top.y], [p1_top.x, p1_top.y]
                ]
            },
            style: { fill: wallFill, stroke: gridColor, lineWidth: 1 }
        });

        // Floor
        graphicElements.push({
            type: 'polygon',
            z: 0,
            shape: {
                points: [
                    [p0.x, p0.y], [p3.x, p3.y],
                    [p2.x, p2.y], [p1.x, p1.y]
                ]
            },
            style: { fill: '#fff', stroke: gridColor, lineWidth: 1 }
        });

        // ===== 2. Draw Grid Lines =====
        const numYLines = 5;
        for (let i = 0; i <= numYLines; i++) {
            const yVal = (maxValue / numYLines) * i;
            const yOffset = yVal * yScale;

            const currY_Front = p0.y - yOffset;
            const currY_Back = p1.y - yOffset;

            // Line on Left Wall (Diagonal)
            graphicElements.push({
                type: 'line',
                z: 1,
                shape: {
                    x1: p0.x, y1: currY_Front,
                    x2: p1.x, y2: currY_Back
                },
                style: { stroke: gridColor, lineWidth: 1 }
            });

            // Line on Back Wall (Horizontal)
            graphicElements.push({
                type: 'line',
                z: 1,
                shape: {
                    x1: p1.x, y1: currY_Back,
                    x2: p2.x, y2: currY_Back
                },
                style: { stroke: gridColor, lineWidth: 1 }
            });

            // Y-axis Label (Left of Y-axis)
            graphicElements.push({
                type: 'text',
                z: 10,
                style: {
                    text: Math.round(yVal),
                    x: p0.x - 10,
                    y: currY_Front,
                    fill: '#666',
                    fontSize: 11,
                    textAlign: 'right',
                    textVerticalAlign: 'middle'
                }
            });
        }

        // ===== 3. Draw Depth Lines (on Floor and Left Wall) =====
        // We draw lines separating series
        for (let s = 0; s <= seriesCount; s++) {
            const sOffset = s * depthGapOpt;
            const sx = sOffset * depthAngleX;
            const sy = sOffset * depthAngleY;

            // Point on Left Edge (p0->p1)
            const lx = p0.x + sx;
            const ly = p0.y + sy;

            // Point on Right Edge (p3->p2)
            const rx = p3.x + sx;
            const ry = p3.y + sy;

            // Floor line
            graphicElements.push({
                type: 'line',
                z: 0,
                shape: { x1: lx, y1: ly, x2: rx, y2: ry },
                style: { stroke: gridColor, lineWidth: 1, lineDash: [2, 2] }
            });

            // Vertical line on Left Wall
            graphicElements.push({
                type: 'line',
                z: 0,
                shape: { x1: lx, y1: ly, x2: lx, y2: ly + heightVec.y },
                style: { stroke: '#eee', lineWidth: 1 }
            });
        }

        // ===== 4. Draw Bars (Back to Front) =====
        for (let sIdx = seriesCount - 1; sIdx >= 0; sIdx--) {
            const ds = data.datasets[sIdx];
            const sOffset = sIdx * depthGapOpt;
            const sx = sOffset * depthAngleX;
            const sy = sOffset * depthAngleY;

            const { base, top, side } = colorVariants[sIdx];

            for (let cIdx = 0; cIdx < categoryCount; cIdx++) {
                const value = ds.data[cIdx] || 0;
                const barH = value * yScale;

                // Base Position on the "Series Line"
                const catOffset = cIdx * categoryWidth + (categoryWidth - barWidth) / 2;

                const barBaseX = p0.x + sx + catOffset;
                const barBaseY = p0.y + sy;
                const topY = barBaseY - barH;

                // Front Face
                graphicElements.push({
                    type: 'rect',
                    z: (seriesCount - sIdx) * 10 + 2,
                    shape: { x: barBaseX, y: topY, width: barWidth, height: barH },
                    style: { fill: base, stroke: Charts3D.darkenColor(base, 20), lineWidth: 1 }
                });

                // Top Face (Parallelogram)
                graphicElements.push({
                    type: 'polygon',
                    z: (seriesCount - sIdx) * 10 + 2,
                    shape: {
                        points: [
                            [barBaseX, topY],
                            [barBaseX + barDepth * depthAngleX, topY + barDepth * depthAngleY],
                            [barBaseX + barWidth + barDepth * depthAngleX, topY + barDepth * depthAngleY],
                            [barBaseX + barWidth, topY]
                        ]
                    },
                    style: { fill: top, stroke: Charts3D.darkenColor(base, 10), lineWidth: 1 }
                });

                // Side Face
                graphicElements.push({
                    type: 'polygon',
                    z: (seriesCount - sIdx) * 10 + 2,
                    shape: {
                        points: [
                            [barBaseX + barWidth, topY],
                            [barBaseX + barWidth + barDepth * depthAngleX, topY + barDepth * depthAngleY],
                            [barBaseX + barWidth + barDepth * depthAngleX, barBaseY + barDepth * depthAngleY],
                            [barBaseX + barWidth, barBaseY]
                        ]
                    },
                    style: { fill: side, stroke: Charts3D.darkenColor(base, 25), lineWidth: 1 }
                });

                // Value Label
                if (showValues) {
                    graphicElements.push({
                        type: 'text',
                        z: 100,
                        style: {
                            text: value,
                            x: barBaseX + barWidth / 2 + (barDepth * depthAngleX) / 2,
                            y: topY + (barDepth * depthAngleY) / 2 - 5,
                            fill: labelColor,
                            fontSize: labelFontSize,
                            fontWeight: labelFontWeight,
                            textAlign: 'center',
                            textVerticalAlign: 'bottom'
                        }
                    });
                }
            }
        }

        // ===== 5. Axes & Labels =====

        // Y-axis (Front Left Vertical)
        graphicElements.push({
            type: 'line', z: 20,
            shape: { x1: p0.x, y1: p0.y, x2: p0_top.x, y2: p0_top.y },
            style: { stroke: '#666', lineWidth: 2 }
        });

        // Category Labels (Front Bottom)
        for (let cIdx = 0; cIdx < categoryCount; cIdx++) {
            const catOffset = cIdx * categoryWidth + categoryWidth / 2;
            const lx = p0.x + catOffset;
            const ly = p0.y + 20;

            graphicElements.push({
                type: 'text', z: 20,
                style: {
                    text: data.labels[cIdx],
                    x: lx, y: ly,
                    fill: '#333', fontSize: 12, textAlign: 'center'
                }
            });
        }

        // Series Labels (Depth Axis on Right)
        for (let sIdx = 0; sIdx < seriesCount; sIdx++) {
            const sOffset = (sIdx + 0.5) * depthGapOpt;
            const sx = sOffset * depthAngleX;
            const sy = sOffset * depthAngleY;

            const px = p3.x + sx + 15;
            const py = p3.y + sy;

            graphicElements.push({
                type: 'text', z: 20,
                style: {
                    text: data.datasets[sIdx].label,
                    x: px, y: py,
                    fill: colors[sIdx], fontSize: 11, fontWeight: 'bold',
                    textAlign: 'left', textVerticalAlign: 'middle'
                }
            });
        }

        // Axis line on Right Edge
        graphicElements.push({
            type: 'line', z: 5,
            shape: { x1: p3.x, y1: p3.y, x2: p2.x, y2: p2.y },
            style: { stroke: '#aaa', lineWidth: 1 }
        });

        const option = {
            graphic: { elements: graphicElements },
            xAxis: { show: false },
            yAxis: { show: false },
            legend: {
                data: data.datasets.map(ds => ds.label),
                bottom: 5,
                left: 'center',
                itemWidth: 15,
                itemHeight: 10
            },
            color: colors,
            series: data.datasets.map(ds => ({
                type: 'custom',
                name: ds.label,
                renderItem: () => null,
                data: []
            }))
        };

        chart.setOption(option, true);

        // 添加鼠标拖拽控制
        this.createPseudo3DControls(container, chart, options, 'perspectiveBar3d', data,
            this.createPerspectiveBar3DChart.bind(this));

        return chart;
    },

    // Helper function to lighten a color
    lightenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.min(255, (num >> 16) + amt);
        const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
        const B = Math.min(255, (num & 0x0000FF) + amt);
        return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
    },

    // Helper function to darken a color
    darkenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.max(0, (num >> 16) - amt);
        const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
        const B = Math.max(0, (num & 0x0000FF) - amt);
        return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
    }
};

// Export
window.Charts3D = Charts3D;

