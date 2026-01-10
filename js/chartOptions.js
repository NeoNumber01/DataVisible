/**
 * Chart Options - 图表自定义选项配置
 * Defines customizable options for each chart type
 */

const ChartOptions = {
    /**
     * Option definitions for each chart type
     * Each option has: key, label, type, default, min, max, step (for range)
     */
    definitions: {
        // Axis Options (Shared)
        axisOptions: [
            { key: 'yAxisMin', label: 'yAxisMin', labelZh: 'Y轴最小值', type: 'number', default: null, step: 1 },
            { key: 'yAxisMax', label: 'yAxisMax', labelZh: 'Y轴最大值', type: 'number', default: null, step: 1 },
            { key: 'yAxisStep', label: 'yAxisStep', labelZh: 'Y轴刻度步长', type: 'number', default: null, step: 1 },
            { key: 'xAxisMin', label: 'xAxisMin', labelZh: 'X轴最小值', type: 'number', default: null, step: 1 },
            { key: 'xAxisMax', label: 'xAxisMax', labelZh: 'X轴最大值', type: 'number', default: null, step: 1 }
        ],

        // Line Chart Options
        line: [
            { key: 'tension', label: 'lineTension', labelZh: '曲线平滑度', type: 'range', default: 0, min: 0, max: 1, step: 0.1 },
            { key: 'borderWidth', label: 'lineWidth', labelZh: '线条粗细', type: 'range', default: 3, min: 1, max: 8, step: 1 },
            { key: 'pointRadius', label: 'pointSize', labelZh: '点大小', type: 'range', default: 5, min: 0, max: 12, step: 1 },
            { key: 'fill', label: 'fillArea', labelZh: '填充区域', type: 'boolean', default: false },
            { key: 'fillOpacity', label: 'fillOpacity', labelZh: '填充透明度', type: 'range', default: 0.1, min: 0, max: 1, step: 0.1 },
            { key: 'showPoints', label: 'showPoints', labelZh: '显示数据点', type: 'boolean', default: true }
        ],

        // Bar Chart Options
        bar: [
            { key: 'borderRadius', label: 'cornerRadius', labelZh: '圆角大小', type: 'range', default: 6, min: 0, max: 20, step: 1 },
            { key: 'barPercentage', label: 'barWidth', labelZh: '柱宽度', type: 'range', default: 0.7, min: 0.1, max: 1, step: 0.1 },
            { key: 'categoryPercentage', label: 'barSpacing', labelZh: '柱间距', type: 'range', default: 0.8, min: 0.1, max: 1, step: 0.1 },
            { key: 'borderWidth', label: 'borderWidth', labelZh: '边框粗细', type: 'range', default: 0, min: 0, max: 5, step: 1 },
            { key: 'layoutPadding', label: 'paddingTop', labelZh: '顶部边距', type: 'range', default: 20, min: 0, max: 100, step: 5 }
        ],

        // Horizontal Bar Chart Options
        horizontalBar: [
            { key: 'borderRadius', label: 'cornerRadius', labelZh: '圆角大小', type: 'range', default: 6, min: 0, max: 20, step: 1 },
            { key: 'barPercentage', label: 'barWidth', labelZh: '柱宽度', type: 'range', default: 0.7, min: 0.1, max: 1, step: 0.1 },
            { key: 'categoryPercentage', label: 'barSpacing', labelZh: '柱间距', type: 'range', default: 0.8, min: 0.1, max: 1, step: 0.1 },
            { key: 'borderWidth', label: 'borderWidth', labelZh: '边框粗细', type: 'range', default: 0, min: 0, max: 5, step: 1 },
            { key: 'layoutPadding', label: 'paddingRight', labelZh: '右侧边距', type: 'range', default: 40, min: 0, max: 150, step: 5 }
        ],

        // Pie Chart Options
        pie: [
            { key: 'hoverOffset', label: 'hoverOffset', labelZh: '悬停偏移', type: 'range', default: 10, min: 0, max: 30, step: 2 },
            { key: 'borderWidth', label: 'borderWidth', labelZh: '边框粗细', type: 'range', default: 2, min: 0, max: 8, step: 1 },
            { key: 'rotation', label: 'startAngle', labelZh: '起始角度', type: 'range', default: 0, min: 0, max: 360, step: 15 }
        ],

        // Doughnut Chart Options
        doughnut: [
            { key: 'cutout', label: 'ringWidth', labelZh: '环宽度 %', type: 'range', default: 60, min: 20, max: 90, step: 5 },
            { key: 'hoverOffset', label: 'hoverOffset', labelZh: '悬停偏移', type: 'range', default: 10, min: 0, max: 30, step: 2 },
            { key: 'borderWidth', label: 'borderWidth', labelZh: '边框粗细', type: 'range', default: 2, min: 0, max: 8, step: 1 },
            { key: 'rotation', label: 'startAngle', labelZh: '起始角度', type: 'range', default: 0, min: 0, max: 360, step: 15 }
        ],

        // Scatter Chart Options
        scatter: [
            { key: 'fillOpacity', label: 'fillOpacity', labelZh: '填充透明度', type: 'range', default: 0.6, min: 0.1, max: 1, step: 0.1 },
            { key: 'pointRadius', label: 'pointSize', labelZh: '点大小', type: 'range', default: 8, min: 2, max: 20, step: 1 },
            { key: 'pointHoverRadius', label: 'hoverSize', labelZh: '悬停大小', type: 'range', default: 10, min: 4, max: 25, step: 1 },
            { key: 'borderWidth', label: 'borderWidth', labelZh: '边框粗细', type: 'range', default: 2, min: 0, max: 6, step: 1 }
        ],

        // Bubble Chart Options
        bubble: [
            { key: 'fillOpacity', label: 'fillOpacity', labelZh: '填充透明度', type: 'range', default: 0.6, min: 0.1, max: 1, step: 0.1 },
            { key: 'hoverRadius', label: 'hoverRadius', labelZh: '悬停放大', type: 'range', default: 4, min: 0, max: 10, step: 1 },
            { key: 'borderWidth', label: 'borderWidth', labelZh: '边框粗细', type: 'range', default: 2, min: 0, max: 6, step: 1 }
        ],

        // Radar Chart Options
        radar: [
            { key: 'borderWidth', label: 'lineWidth', labelZh: '线条粗细', type: 'range', default: 2, min: 1, max: 6, step: 1 },
            { key: 'pointRadius', label: 'pointSize', labelZh: '点大小', type: 'range', default: 4, min: 0, max: 10, step: 1 },
            { key: 'fillOpacity', label: 'fillOpacity', labelZh: '填充透明度', type: 'range', default: 0.2, min: 0, max: 1, step: 0.1 }
        ],

        // Area Chart Options
        area: [
            { key: 'tension', label: 'lineTension', labelZh: '曲线平滑度', type: 'range', default: 0.4, min: 0, max: 1, step: 0.1 },
            { key: 'borderWidth', label: 'lineWidth', labelZh: '线条粗细', type: 'range', default: 2, min: 1, max: 6, step: 1 },
            { key: 'fillOpacity', label: 'fillOpacity', labelZh: '填充透明度', type: 'range', default: 0.3, min: 0, max: 1, step: 0.1 },
            { key: 'pointRadius', label: 'pointSize', labelZh: '点大小', type: 'range', default: 4, min: 0, max: 10, step: 1 }
        ],

        // Stacked Chart Options
        stacked: [
            { key: 'borderRadius', label: 'cornerRadius', labelZh: '圆角大小', type: 'range', default: 4, min: 0, max: 15, step: 1 },
            { key: 'borderWidth', label: 'borderWidth', labelZh: '边框粗细', type: 'range', default: 0, min: 0, max: 4, step: 1 },
            { key: 'layoutPadding', label: 'paddingTop', labelZh: '顶部边距', type: 'range', default: 20, min: 0, max: 100, step: 5 }
        ],

        // Polar Area Chart Options
        polar: [
            { key: 'fillOpacity', label: 'fillOpacity', labelZh: '填充透明度', type: 'range', default: 0.6, min: 0.1, max: 1, step: 0.1 },
            { key: 'borderWidth', label: 'borderWidth', labelZh: '边框粗细', type: 'range', default: 2, min: 0, max: 6, step: 1 },
            { key: 'hoverOffset', label: 'hoverOffset', labelZh: '悬停偏移', type: 'range', default: 4, min: 0, max: 15, step: 1 }
        ],

        // Rose Chart Options
        rose: [
            { key: 'fillOpacity', label: 'fillOpacity', labelZh: '填充透明度', type: 'range', default: 0.8, min: 0.1, max: 1, step: 0.1 },
            { key: 'borderWidth', label: 'borderWidth', labelZh: '边框粗细', type: 'range', default: 2, min: 0, max: 6, step: 1 },
            { key: 'hoverOffset', label: 'hoverOffset', labelZh: '悬停偏移', type: 'range', default: 15, min: 0, max: 30, step: 2 }
        ],

        // Mixed Chart Options
        mixed: [
            { key: 'barBorderRadius', label: 'barRadius', labelZh: '柱状圆角', type: 'range', default: 6, min: 0, max: 15, step: 1 },
            { key: 'lineTension', label: 'lineTension', labelZh: '折线平滑度', type: 'range', default: 0.4, min: 0, max: 1, step: 0.1 },
            { key: 'lineWidth', label: 'lineWidth', labelZh: '折线粗细', type: 'range', default: 3, min: 1, max: 6, step: 1 },
            { key: 'layoutPadding', label: 'paddingTop', labelZh: '顶部边距', type: 'range', default: 20, min: 0, max: 100, step: 5 }
        ],

        // Heatmap Options (ECharts)
        heatmap: [
            { key: 'labelFontSize', label: 'labelSize', labelZh: '标签字号', type: 'range', default: 12, min: 8, max: 20, step: 1 },
            { key: 'showLabel', label: 'showLabel', labelZh: '显示数值', type: 'boolean', default: true }
        ],

        // Funnel Options (ECharts)
        funnel: [
            { key: 'fillOpacity', label: 'fillOpacity', labelZh: '填充透明度', type: 'range', default: 0.85, min: 0.1, max: 1, step: 0.05 },
            { key: 'minSize', label: 'minSize', labelZh: '最小宽度 %', type: 'range', default: 10, min: 0, max: 50, step: 5 },
            { key: 'maxSize', label: 'maxSize', labelZh: '最大宽度 %', type: 'range', default: 100, min: 50, max: 100, step: 5 },
            { key: 'gap', label: 'gap', labelZh: '间距', type: 'range', default: 2, min: 0, max: 10, step: 1 },
            {
                key: 'sort', label: 'sortOrder', labelZh: '排序方式', type: 'select', default: 'descending', options: [
                    { value: 'descending', label: '降序', labelEn: 'Descending' },
                    { value: 'ascending', label: '升序', labelEn: 'Ascending' },
                    { value: 'none', label: '无排序', labelEn: 'None' }
                ]
            }
        ],

        // Gauge Options (ECharts)
        gauge: [
            { key: 'startAngle', label: 'startAngle', labelZh: '起始角度', type: 'range', default: 200, min: 90, max: 270, step: 10 },
            { key: 'endAngle', label: 'endAngle', labelZh: '结束角度', type: 'range', default: -20, min: -90, max: 90, step: 10 },
            { key: 'progressWidth', label: 'progressWidth', labelZh: '进度条粗细', type: 'range', default: 18, min: 8, max: 30, step: 2 },
            { key: 'splitNumber', label: 'splitNumber', labelZh: '刻度数量', type: 'range', default: 10, min: 4, max: 20, step: 1 }
        ],

        // Treemap Options (ECharts)
        treemap: [
            { key: 'fillOpacity', label: 'fillOpacity', labelZh: '填充透明度', type: 'range', default: 0.9, min: 0.1, max: 1, step: 0.05 },
            { key: 'borderWidth', label: 'borderWidth', labelZh: '边框粗细', type: 'range', default: 2, min: 0, max: 6, step: 1 },
            { key: 'gapWidth', label: 'gapWidth', labelZh: '间距', type: 'range', default: 2, min: 0, max: 8, step: 1 },
            { key: 'labelFontSize', label: 'labelSize', labelZh: '标签字号', type: 'range', default: 14, min: 10, max: 24, step: 1 }
        ],

        // Boxplot Options (ECharts)
        boxplot: [
            { key: 'fillOpacity', label: 'fillOpacity', labelZh: '填充透明度', type: 'range', default: 0.8, min: 0.1, max: 1, step: 0.05 },
            { key: 'boxWidth', label: 'boxWidth', labelZh: '箱体宽度', type: 'range', default: 50, min: 20, max: 100, step: 5 }
        ],

        // Wordcloud Options (ECharts)
        wordcloud: [
            { key: 'sizeMin', label: 'minSize', labelZh: '最小字号', type: 'range', default: 14, min: 8, max: 24, step: 1 },
            { key: 'sizeMax', label: 'maxSize', labelZh: '最大字号', type: 'range', default: 60, min: 30, max: 100, step: 5 },
            { key: 'rotationMin', label: 'rotationMin', labelZh: '最小旋转角', type: 'range', default: -45, min: -90, max: 0, step: 15 },
            { key: 'rotationMax', label: 'rotationMax', labelZh: '最大旋转角', type: 'range', default: 45, min: 0, max: 90, step: 15 }
        ],

        // Waterfall Options (ECharts)
        waterfall: [
            { key: 'barWidth', label: 'barWidth', labelZh: '柱宽度', type: 'range', default: 20, min: 10, max: 50, step: 2 },
            { key: 'showLabel', label: 'showLabel', labelZh: '显示标签', type: 'boolean', default: true }
        ],

        // Timeline Options (ECharts)
        timeline: [
            { key: 'smooth', label: 'smooth', labelZh: '曲线平滑度', type: 'range', default: 0.4, min: 0, max: 1, step: 0.1 },
            { key: 'lineWidth', label: 'lineWidth', labelZh: '线条粗细', type: 'range', default: 3, min: 1, max: 8, step: 1 },
            { key: 'symbolSize', label: 'symbolSize', labelZh: '点大小', type: 'range', default: 8, min: 4, max: 16, step: 1 },
            { key: 'areaOpacity', label: 'areaOpacity', labelZh: '填充透明度', type: 'range', default: 0.2, min: 0, max: 1, step: 0.1 }
        ],

        // Graph Options (ECharts)
        graph: [
            { key: 'symbolSize', label: 'symbolSize', labelZh: '节点大小', type: 'range', default: 30, min: 10, max: 60, step: 5 },
            { key: 'repulsion', label: 'repulsion', labelZh: '斥力强度', type: 'range', default: 200, min: 50, max: 500, step: 25 },
            { key: 'edgeLength', label: 'edgeLength', labelZh: '边长度', type: 'range', default: 100, min: 30, max: 200, step: 10 },
            { key: 'curveness', label: 'curveness', labelZh: '曲线弯曲度', type: 'range', default: 0.3, min: 0, max: 1, step: 0.1 }
        ],

        // Parallel Options (ECharts)
        parallel: [
            { key: 'lineWidth', label: 'lineWidth', labelZh: '线条粗细', type: 'range', default: 2, min: 1, max: 6, step: 1 },
            { key: 'opacity', label: 'opacity', labelZh: '透明度', type: 'range', default: 0.7, min: 0.1, max: 1, step: 0.1 }
        ],

        // Calendar Options (ECharts)
        calendar: [
            { key: 'cellSize', label: 'cellSize', labelZh: '单元格大小', type: 'range', default: 15, min: 8, max: 30, step: 1 },
            { key: 'borderWidth', label: 'borderWidth', labelZh: '边框粗细', type: 'range', default: 2, min: 0, max: 6, step: 1 }
        ],

        // ThemeRiver Options (ECharts)
        themeriver: [
            { key: 'smooth', label: 'smooth', labelZh: '平滑度', type: 'range', default: 0.5, min: 0, max: 1, step: 0.1 }
        ],

        // Pictorial Bar Options (ECharts)
        pictorial: [
            { key: 'symbolSize', label: 'symbolSize', labelZh: '符号大小', type: 'range', default: 20, min: 10, max: 40, step: 2 },
            { key: 'symbolMargin', label: 'symbolMargin', labelZh: '符号间距', type: 'range', default: 2, min: 0, max: 10, step: 1 }
        ],

        // Liquid Options (ECharts)
        liquid: [
            { key: 'progressWidth', label: 'progressWidth', labelZh: '进度条粗细', type: 'range', default: 30, min: 10, max: 50, step: 2 },
            { key: 'roundCap', label: 'roundCap', labelZh: '圆角端点', type: 'boolean', default: true }
        ],

        // Candlestick Options (ECharts)
        candlestick: [
            { key: 'maPeriod1', label: 'maPeriod1', labelZh: 'MA周期1', type: 'range', default: 5, min: 3, max: 20, step: 1 },
            { key: 'maPeriod2', label: 'maPeriod2', labelZh: 'MA周期2', type: 'range', default: 10, min: 5, max: 30, step: 1 }
        ],

        // Effect Scatter Options (ECharts)
        effectScatter: [
            { key: 'rippleScale', label: 'rippleScale', labelZh: '涟漪缩放', type: 'range', default: 3, min: 1, max: 6, step: 0.5 },
            { key: 'symbolSize', label: 'symbolSize', labelZh: '点大小', type: 'range', default: 20, min: 10, max: 50, step: 2 },
            {
                key: 'rippleType', label: 'rippleType', labelZh: '涟漪类型', type: 'select', default: 'stroke', options: [
                    { value: 'stroke', label: '描边', labelEn: 'Stroke' },
                    { value: 'fill', label: '填充', labelEn: 'Fill' }
                ]
            }
        ],

        // Bullet Options (ECharts)
        bullet: [
            { key: 'barWidth', label: 'barWidth', labelZh: '实际值柱宽度', type: 'range', default: 15, min: 8, max: 30, step: 1 },
            { key: 'targetWidth', label: 'targetWidth', labelZh: '目标值柱宽度', type: 'range', default: 30, min: 15, max: 50, step: 2 }
        ],

        // Step Line Options (ECharts)
        stepLine: [
            { key: 'lineWidth', label: 'lineWidth', labelZh: '线条粗细', type: 'range', default: 3, min: 1, max: 8, step: 1 },
            { key: 'areaOpacity', label: 'areaOpacity', labelZh: '填充透明度', type: 'range', default: 0.1, min: 0, max: 1, step: 0.1 },
            {
                key: 'step', label: 'step', labelZh: '阶梯类型', type: 'select', default: 'middle', options: [
                    { value: 'start', label: '起点', labelEn: 'Start' },
                    { value: 'middle', label: '中点', labelEn: 'Middle' },
                    { value: 'end', label: '终点', labelEn: 'End' }
                ]
            }
        ],

        // Histogram Options (ECharts)
        histogram: [
            { key: 'binCount', label: 'binCount', labelZh: '分箱数量', type: 'range', default: 10, min: 5, max: 30, step: 1 },
            { key: 'showLabel', label: 'showLabel', labelZh: '显示标签', type: 'boolean', default: false }
        ],

        // Tree Options (ECharts)
        tree: [
            { key: 'symbolSize', label: 'symbolSize', labelZh: '节点大小', type: 'range', default: 10, min: 5, max: 20, step: 1 },
            {
                key: 'orient', label: 'orient', labelZh: '展开方向', type: 'select', default: 'LR', options: [
                    { value: 'LR', label: '从左到右', labelEn: 'Left to Right' },
                    { value: 'RL', label: '从右到左', labelEn: 'Right to Left' },
                    { value: 'TB', label: '从上到下', labelEn: 'Top to Bottom' },
                    { value: 'BT', label: '从下到上', labelEn: 'Bottom to Top' }
                ]
            },
            { key: 'expandAndCollapse', label: 'expandAndCollapse', labelZh: '可展开/折叠', type: 'boolean', default: true }
        ],

        // Progress Options (ECharts)
        progress: [
            { key: 'barWidth', label: 'barWidth', labelZh: '进度条粗细', type: 'range', default: 20, min: 10, max: 40, step: 2 },
            { key: 'borderRadius', label: 'borderRadius', labelZh: '圆角', type: 'range', default: 10, min: 0, max: 20, step: 2 }
        ],

        // 3D Bar Options (ECharts GL)
        bar3d: [
            { key: 'autoRotate', label: 'autoRotate', labelZh: '自动旋转', type: 'boolean', default: true },
            { key: 'rotateSpeed', label: 'rotateSpeed', labelZh: '旋转速度', type: 'range', default: 10, min: 0, max: 30, step: 2 },
            { key: 'shadow', label: 'shadow', labelZh: '显示阴影', type: 'boolean', default: true }
        ],

        // 3D Scatter Options (ECharts GL)
        scatter3d: [
            { key: 'symbolSize', label: 'symbolSize', labelZh: '点大小', type: 'range', default: 12, min: 4, max: 30, step: 2 },
            { key: 'autoRotate', label: 'autoRotate', labelZh: '自动旋转', type: 'boolean', default: true },
            { key: 'rotateSpeed', label: 'rotateSpeed', labelZh: '旋转速度', type: 'range', default: 5, min: 0, max: 20, step: 1 }
        ],

        // 3D Surface Options (ECharts GL)
        surface3d: [
            { key: 'wireframe', label: 'wireframe', labelZh: '显示线框', type: 'boolean', default: true },
            { key: 'autoRotate', label: 'autoRotate', labelZh: '自动旋转', type: 'boolean', default: true },
            { key: 'rotateSpeed', label: 'rotateSpeed', labelZh: '旋转速度', type: 'range', default: 3, min: 0, max: 15, step: 1 }
        ],

        // Globe Options (ECharts GL)
        globe: [
            { key: 'autoRotate', label: 'autoRotate', labelZh: '自动旋转', type: 'boolean', default: true },
            { key: 'rotateSpeed', label: 'rotateSpeed', labelZh: '旋转速度', type: 'range', default: 3, min: 0, max: 15, step: 1 },
            { key: 'symbolSize', label: 'symbolSize', labelZh: '点大小', type: 'range', default: 10, min: 4, max: 30, step: 2 }
        ],

        // 3D Line Options (ECharts GL)
        line3d: [
            { key: 'lineWidth', label: 'lineWidth', labelZh: '线条粗细', type: 'range', default: 4, min: 1, max: 10, step: 1 },
            { key: 'autoRotate', label: 'autoRotate', labelZh: '自动旋转', type: 'boolean', default: true },
            { key: 'rotateSpeed', label: 'rotateSpeed', labelZh: '旋转速度', type: 'range', default: 5, min: 0, max: 20, step: 1 }
        ],

        // Sunburst Options (ECharts)
        sunburst: [
            { key: 'fillOpacity', label: 'fillOpacity', labelZh: '填充透明度', type: 'range', default: 0.85, min: 0.1, max: 1, step: 0.05 },
            { key: 'borderWidth', label: 'borderWidth', labelZh: '边框粗细', type: 'range', default: 2, min: 0, max: 6, step: 1 }
        ],

        // Sankey Options (ECharts)
        sankey: [
            { key: 'curveness', label: 'curveness', labelZh: '曲线弯曲度', type: 'range', default: 0.5, min: 0, max: 1, step: 0.1 },
            { key: 'nodeWidth', label: 'nodeWidth', labelZh: '节点宽度', type: 'range', default: 20, min: 10, max: 40, step: 2 }
        ],

        // Map Options (ECharts)
        map: [
            { key: 'symbolSize', label: 'symbolSize', labelZh: '散点大小', type: 'range', default: 50, min: 20, max: 100, step: 5 }
        ],

        // Metric Cards Options
        metric: [
            { key: 'cardMinWidth', label: 'cardMinWidth', labelZh: '卡片最小宽度', type: 'range', default: 150, min: 100, max: 250, step: 10 },
            { key: 'valueFontSize', label: 'valueFontSize', labelZh: '数值字号', type: 'range', default: 32, min: 20, max: 60, step: 2 },
            { key: 'labelFontSize', label: 'labelFontSize', labelZh: '标签字号', type: 'range', default: 14, min: 10, max: 24, step: 1 }
        ],

        // Sparkline Options
        sparkline: [
            { key: 'lineWidth', label: 'lineWidth', labelZh: '线条粗细', type: 'range', default: 2, min: 1, max: 6, step: 1 },
            { key: 'areaOpacity', label: 'areaOpacity', labelZh: '填充透明度', type: 'range', default: 0.2, min: 0, max: 1, step: 0.1 },
            { key: 'smooth', label: 'smooth', labelZh: '曲线平滑', type: 'boolean', default: true }
        ],

        // Table Options
        table: [
            { key: 'fontSize', label: 'fontSize', labelZh: '字体大小', type: 'range', default: 14, min: 10, max: 20, step: 1 },
            { key: 'cellPadding', label: 'cellPadding', labelZh: '单元格内边距', type: 'range', default: 10, min: 5, max: 20, step: 1 }
        ],

        // Default/fallback options (for charts without specific options)
        default: [
            { key: 'animationDuration', label: 'animationSpeed', labelZh: '动画时长(ms)', type: 'range', default: 800, min: 0, max: 2000, step: 100 }
        ]
    },

    /**
     * Data label style options - 数据标签字体样式选项
     * These apply to the values displayed on charts (e.g., bar tops, pie slices)
     */
    dataLabelOptions: [
        { key: 'labelFontSize', label: 'labelFontSize', labelZh: '数据标签字号', type: 'range', default: 12, min: 8, max: 24, step: 1 },
        {
            key: 'labelFontWeight', label: 'labelFontWeight', labelZh: '数据标签粗细', type: 'select', default: 'bold', options: [
                { value: 'normal', label: '正常', labelEn: 'Normal' },
                { value: 'bold', label: '粗体', labelEn: 'Bold' },
                { value: 'lighter', label: '细体', labelEn: 'Lighter' },
                { value: '500', label: '中等', labelEn: 'Medium' },
                { value: '600', label: '半粗', labelEn: 'Semi-bold' },
                { value: '700', label: '加粗', labelEn: 'Bold 700' },
                { value: '800', label: '特粗', labelEn: 'Extra Bold' }
            ]
        },
        { key: 'labelColor', label: 'labelColor', labelZh: '数据标签颜色', type: 'color', default: '#333333' }
    ],

    /**
     * Get options definition for a chart type
     */
    getDefinition(chartType) {
        const baseOptions = this.definitions[chartType] || this.definitions.default;

        // Add axis options for Cartesian charts
        const cartesianCharts = ['line', 'bar', 'horizontalBar', 'scatter', 'bubble', 'area', 'stacked', 'mixed'];
        let extendedOptions = [...baseOptions];

        if (cartesianCharts.includes(chartType)) {
            extendedOptions = [...extendedOptions, ...this.definitions.axisOptions];
        }

        // Add data label options for all chart types
        return [...extendedOptions, ...this.dataLabelOptions];
    },

    /**
     * Get default values for a chart type
     */
    getDefaults(chartType) {
        const defs = this.getDefinition(chartType);
        const defaults = {};
        defs.forEach(opt => {
            defaults[opt.key] = opt.default;
        });
        return defaults;
    },

    /**
     * Generate options panel HTML
     */
    generatePanelHTML(chartType, currentValues = {}, lang = 'zh') {
        const defs = this.getDefinition(chartType);
        const values = { ...this.getDefaults(chartType), ...currentValues };

        let html = '';

        defs.forEach(opt => {
            const label = lang === 'zh' ? opt.labelZh : opt.label;
            const value = values[opt.key];

            if (opt.type === 'range') {
                html += `
                    <div class="option-item">
                        <label>${label}</label>
                        <div class="option-control">
                            <input type="range" 
                                   data-key="${opt.key}" 
                                   min="${opt.min}" 
                                   max="${opt.max}" 
                                   step="${opt.step}" 
                                   value="${value}">
                            <span class="option-value">${value}</span>
                        </div>
                    </div>
                `;
            } else if (opt.type === 'boolean') {
                html += `
                    <div class="option-item">
                        <label>${label}</label>
                        <div class="option-control">
                            <label class="switch">
                                <input type="checkbox" 
                                       data-key="${opt.key}" 
                                       ${value ? 'checked' : ''}>
                                <span class="slider"></span>
                            </label>
                        </div>
                    </div>
                `;
            } else if (opt.type === 'select') {
                html += `
                    <div class="option-item">
                        <label>${label}</label>
                        <div class="option-control">
                            <select data-key="${opt.key}">
                                ${opt.options.map(o => `
                                    <option value="${o.value}" ${value === o.value ? 'selected' : ''}>
                                        ${lang === 'zh' ? o.label : o.labelEn}
                                    </option>
                                `).join('')}
                            </select>
                        </div>
                    </div>
                `;
            } else if (opt.type === 'color') {
                html += `
                    <div class="option-item">
                        <label>${label}</label>
                        <div class="option-control color-control">
                            <input type="color" 
                                   data-key="${opt.key}" 
                                   value="${value}">
                            <input type="text" 
                                   class="color-text" 
                                   data-key="${opt.key}" 
                                   value="${value}" 
                                   pattern="^#[0-9A-Fa-f]{6}$"
                                   title="${lang === 'zh' ? '请输入十六进制颜色值,例如 #333333' : 'Please enter hex color code, e.g., #333333'}">
                        </div>
                    </div>
                `;
            } else if (opt.type === 'number') {
                html += `
                    <div class="option-item">
                        <label>${label}</label>
                        <div class="option-control">
                            <input type="number" 
                                   class="number-input"
                                   data-key="${opt.key}" 
                                   step="${opt.step || 1}" 
                                   placeholder="Auto"
                                   value="${value !== null ? value : ''}">
                        </div>
                    </div>
                `;
            }
        });

        return html;
    },

    /**
     * Parse values from options panel
     */
    parseValues(panelElement) {
        const values = {};

        // Range inputs
        panelElement.querySelectorAll('input[type="range"]').forEach(input => {
            values[input.dataset.key] = parseFloat(input.value);
        });

        // Checkbox inputs
        panelElement.querySelectorAll('input[type="checkbox"]').forEach(input => {
            values[input.dataset.key] = input.checked;
        });

        // Select inputs
        panelElement.querySelectorAll('select').forEach(select => {
            values[select.dataset.key] = select.value;
        });

        // Color inputs
        panelElement.querySelectorAll('input[type="color"]').forEach(input => {
            values[input.dataset.key] = input.value;
        });

        // Number inputs
        panelElement.querySelectorAll('input[type="number"]').forEach(input => {
            const val = input.value.trim();
            values[input.dataset.key] = val === '' ? null : parseFloat(val);
        });

        return values;
    }
};

// Export
window.ChartOptions = ChartOptions;
