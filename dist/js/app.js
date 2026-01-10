/**
 * DataVisible - Main Application
 * Initializes and coordinates all modules
 */

/**
 * Debounce utility function - prevents function from being called too frequently
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Internationalization
const i18n = {
    zh: {
        appTitle: '数据可视化平台',
        chartTypes: '图表类型',
        basicCharts: '基础图表',
        advancedCharts: '高级图表',
        distributionCharts: '分布图表',
        hierarchyCharts: '层级图表',
        specialCharts: '特殊图表',
        layoutMode: '布局模式',
        dataInput: '数据输入',
        tableInput: '表格输入',
        jsonInput: 'JSON 输入',
        csvInput: 'CSV 输入',
        fileImport: '文件导入',
        sampleData: '示例数据',
        dualColorSchemes: '涨跌/正负配色',
        gradientColorSchemes: '渐变配色',
        applyData: '应用数据',
        reset: '重置',
        export: '导出',
        addRow: '+ 添加行',
        addCol: '+ 添加列',
        clear: '清空',
        parseJSON: '解析 JSON',
        parseCSV: '解析 CSV',
        dropFile: '拖拽文件到这里，或点击选择文件',
        supportedFiles: '支持 CSV、JSON、Excel (.xlsx) 文件',
        // Chart names
        bar: '柱状图',
        line: '折线图',
        pie: '饼图',
        doughnut: '环形图',
        scatter: '散点图',
        bubble: '气泡图',
        radar: '雷达图',
        area: '面积图',
        stacked: '堆叠图',
        boxplot: '箱线图',
        heatmap: '热力图',
        polar: '极坐标图',
        treemap: '树状图',
        sunburst: '旭日图',
        sankey: '桑基图',
        funnel: '漏斗图',
        gauge: '仪表盘',
        wordcloud: '词云图',
        table: '数据表格',
        // New chart types
        rose: '玫瑰图',
        mixed: '组合图',
        horizontalBar: '水平柱状图',
        waterfall: '瀑布图',
        timeline: '时间轴图',
        graph: '关系图',
        parallel: '平行坐标',
        calendar: '日历热力图',
        themeriver: '河流图',
        pictorial: '象形柱图',
        liquid: '水球图',
        // Financial & 3D charts
        candlestick: 'K线图',
        effectScatter: '涟漪散点',
        bullet: '子弹图',
        stepLine: '步骤图',
        histogram: '直方图',
        tree: '树图',
        progress: '进度条',
        metric: '指标卡',
        sparkline: '迷你图',
        bar3d: '3D柱状图',
        scatter3d: '3D散点图',
        surface3d: '3D曲面',
        line3d: '3D折线图',
        globe: '地球仪',
        financialCharts: '金融图表',
        charts3D: '3D图表',
        // Sample data
        sales: '销售数据',
        salesDesc: '月度销售额对比',
        population: '人口统计',
        populationDesc: '年龄分布数据',
        weather: '天气数据',
        weatherDesc: '温度与降雨量',
        stock: '股票走势',
        stockDesc: '日K线数据',
        survey: '调查问卷',
        surveyDesc: '满意度评分',
        hierarchy: '组织架构',
        hierarchyDesc: '层级结构数据',
        flow: '流量数据',
        flowDesc: '用户转化路径',
        wordfreq: '词频统计',
        wordfreqDesc: '文本分析数据',
        // Messages
        dataApplied: '数据已应用',
        dataReset: '数据已重置',
        parseError: '解析错误',
        fileLoaded: '文件已加载',
        exportSuccess: '导出成功',
        // UI elements
        colorPicker: '颜色',
        fullscreen: '全屏',
        download: '下载',
        selectColor: '自定义颜色',
        colorScheme: '配色方案',
        apply: '应用',
        colorsApplied: '配色已应用',
        // Color scheme names
        schemeDefault: '默认',
        schemeOcean: '海洋',
        schemeSunset: '日落',
        schemeForest: '森林',
        schemePurple: '紫色',
        schemeMono: '灰度',
        // File types
        supportedFilesExpanded: '支持 CSV、JSON、Excel (.xlsx)、TSV、XML、YAML、TXT 文件',
        // Chart settings
        chartSettings: '图表设置',
        optionsApplied: '设置已应用',
        noOptions: '此图表暂无可调选项',
        toggleValues: '显示/隐藏数值',
        // New features
        seriesColors: '按系列设置颜色',
        columnColors: '按列设置颜色（数据系列）',
        rowColors: '按行设置颜色（数据类别）',
        series: '系列',
        valuesShown: '数值已显示',
        valuesHidden: '数值已隐藏',
        resetColors: '重置颜色',
        colorsReset: '颜色已重置',
        // Export format
        selectExportFormat: '选择导出格式',
        exportQuality: '导出质量',
        exportScale: '导出倍率',
        pngDesc: '无损压缩，支持透明',
        jpgDesc: '有损压缩，文件更小',
        webpDesc: '现代格式，高压缩比',
        svgDesc: '矢量图，可无限缩放',
        exportError: '导出失败',
        // Missing UI Translations
        layout1: '单图',
        layout2: '双图',
        layout4: '四图',
        themeToggle: '切换主题',
        togglePanel: '收起/展开',
        chartActionColor: '颜色',
        chartActionSettings: '图表设置',
        chartActionValues: '显示/隐藏数值',
        chartActionFullscreen: '全屏',
        chartActionDownload: '下载图表',
        tableHeaderCategory: '类别',
        tableHeaderValue1: '数值1',
        tableHeaderValue2: '数值2',
        resetZoom: '重置缩放',
        zoomIn: '放大',
        zoomOut: '缩小',
        chartActionResetZoom: '重置缩放',
        chartActionZoomIn: '放大',
        chartActionZoomOut: '缩小',
        // Data panel
        fullscreenMode: '全屏模式',
        exitFullscreen: '退出全屏',
        // Data actions
        clearData: '清空数据',
        resetAll: '重置一切',
        dataCleared: '数据已清空',
        allReset: '已重置所有设置'
    },

    en: {
        appTitle: 'Data Visualization Platform',
        chartTypes: 'Chart Types',
        basicCharts: 'Basic Charts',
        advancedCharts: 'Advanced Charts',
        distributionCharts: 'Distribution Charts',
        hierarchyCharts: 'Hierarchy Charts',
        specialCharts: 'Special Charts',
        layoutMode: 'Layout Mode',
        dataInput: 'Data Input',
        tableInput: 'Table Input',
        jsonInput: 'JSON Input',
        csvInput: 'CSV Input',
        fileImport: 'File Import',
        sampleData: 'Sample Data',
        dualColorSchemes: 'Positive/Negative Colors',
        gradientColorSchemes: 'Gradient Colors',
        applyData: 'Apply Data',
        reset: 'Reset',
        export: 'Export',
        addRow: '+ Add Row',
        addCol: '+ Add Column',
        clear: 'Clear',
        parseJSON: 'Parse JSON',
        parseCSV: 'Parse CSV',
        dropFile: 'Drop file here or click to select',
        supportedFiles: 'Supports CSV, JSON, Excel (.xlsx) files',
        // Chart names
        bar: 'Bar Chart',
        line: 'Line Chart',
        pie: 'Pie Chart',
        doughnut: 'Doughnut Chart',
        scatter: 'Scatter Chart',
        bubble: 'Bubble Chart',
        radar: 'Radar Chart',
        area: 'Area Chart',
        stacked: 'Stacked Chart',
        boxplot: 'Box Plot',
        heatmap: 'Heatmap',
        polar: 'Polar Area',
        treemap: 'Treemap',
        sunburst: 'Sunburst',
        sankey: 'Sankey Diagram',
        funnel: 'Funnel Chart',
        gauge: 'Gauge',
        wordcloud: 'Word Cloud',
        table: 'Data Table',
        // New chart types
        rose: 'Rose Chart',
        mixed: 'Mixed Chart',
        horizontalBar: 'Horizontal Bar',
        waterfall: 'Waterfall',
        timeline: 'Timeline',
        graph: 'Graph',
        parallel: 'Parallel',
        calendar: 'Calendar Heatmap',
        themeriver: 'Theme River',
        pictorial: 'Pictorial Bar',
        liquid: 'Liquid',
        // Financial & 3D charts
        candlestick: 'Candlestick',
        effectScatter: 'Effect Scatter',
        bullet: 'Bullet Chart',
        stepLine: 'Step Line',
        histogram: 'Histogram',
        tree: 'Tree',
        progress: 'Progress',
        metric: 'Metric Cards',
        sparkline: 'Sparklines',
        bar3d: '3D Bar',
        scatter3d: '3D Scatter',
        surface3d: '3D Surface',
        line3d: '3D Line',
        globe: 'Globe',
        financialCharts: 'Financial Charts',
        charts3D: '3D Charts',
        // Sample data
        sales: 'Sales Data',
        salesDesc: 'Monthly sales comparison',
        population: 'Population',
        populationDesc: 'Age distribution data',
        weather: 'Weather Data',
        weatherDesc: 'Temperature & rainfall',
        stock: 'Stock Trend',
        stockDesc: 'Daily K-line data',
        survey: 'Survey Results',
        surveyDesc: 'Satisfaction scores',
        hierarchy: 'Organization',
        hierarchyDesc: 'Hierarchy structure data',
        flow: 'Flow Data',
        flowDesc: 'User conversion path',
        wordfreq: 'Word Frequency',
        wordfreqDesc: 'Text analysis data',
        // Messages
        dataApplied: 'Data applied successfully',
        dataReset: 'Data has been reset',
        parseError: 'Parse error',
        fileLoaded: 'File loaded successfully',
        exportSuccess: 'Export successful',
        // UI elements
        colorPicker: 'Color',
        fullscreen: 'Fullscreen',
        download: 'Download',
        selectColor: 'Custom Colors',
        colorScheme: 'Color Scheme',
        apply: 'Apply',
        colorsApplied: 'Colors applied',
        // Color scheme names
        schemeDefault: 'Default',
        schemeOcean: 'Ocean',
        schemeSunset: 'Sunset',
        schemeForest: 'Forest',
        schemePurple: 'Purple',
        schemeMono: 'Mono',
        // File types
        supportedFilesExpanded: 'Supports CSV, JSON, Excel (.xlsx), TSV, XML, YAML, TXT files',
        // Chart settings
        chartSettings: 'Chart Settings',
        optionsApplied: 'Settings applied',
        noOptions: 'No options available for this chart',
        toggleValues: 'Show/Hide Values',
        // New features
        seriesColors: 'Colors by Series',
        columnColors: 'Colors by Column (Data Series)',
        rowColors: 'Colors by Row (Categories)',
        series: 'Series',
        valuesShown: 'Values shown',
        valuesHidden: 'Values hidden',
        resetColors: 'Reset Colors',
        colorsReset: 'Colors reset',
        // Export format
        selectExportFormat: 'Select Export Format',
        exportQuality: 'Export Quality',
        exportScale: 'Export Scale',
        pngDesc: 'Lossless, supports transparency',
        jpgDesc: 'Lossy, smaller file size',
        webpDesc: 'Modern format, high compression',
        svgDesc: 'Vector, infinitely scalable',
        exportError: 'Export failed',
        // Missing UI Translations
        layout1: 'Single Chart',
        layout2: 'Double Chart',
        layout4: 'Quad Chart',
        themeToggle: 'Toggle Theme',
        togglePanel: 'Expand/Collapse',
        chartActionColor: 'Color',
        chartActionSettings: 'Chart Settings',
        chartActionValues: 'Show/Hide Values',
        chartActionFullscreen: 'Fullscreen',
        chartActionDownload: 'Download Chart',
        tableHeaderCategory: 'Category',
        tableHeaderValue1: 'Value 1',
        tableHeaderValue2: 'Value 2',
        resetZoom: 'Reset Zoom',
        zoomIn: 'Zoom In',
        zoomOut: 'Zoom Out',
        chartActionResetZoom: 'Reset Zoom',
        chartActionZoomIn: 'Zoom In',
        chartActionZoomOut: 'Zoom Out',
        // Data panel
        fullscreenMode: 'Fullscreen Mode',
        exitFullscreen: 'Exit Fullscreen',
        // Data actions
        clearData: 'Clear Data',
        resetAll: 'Reset All',
        dataCleared: 'Data cleared',
        allReset: 'All settings reset'
    }
};



class App {
    constructor() {
        this.dataManager = new DataManager();
        this.chartRenderer = new ChartRenderer();
        this.currentLang = 'zh';
        this.currentTheme = 'light';

        this.init();
    }

    init() {
        // Load saved preferences
        this.loadPreferences();

        // Try to restore saved data, or use default
        let initialData;
        const savedDataInfo = this.dataManager.loadFromStorage();

        if (savedDataInfo && savedDataInfo.data) {
            // Use saved data
            initialData = savedDataInfo.data;
            this.dataManager.currentData = initialData;
            console.log('Restored saved data from localStorage');
        } else {
            // Use default data
            initialData = this.dataManager.getDefaultData();
            this.dataManager.setData(initialData);
        }

        this.chartRenderer.init(initialData);

        // Load saved chart configurations
        this.loadChartConfigurations();

        // Bind events
        this.bindEvents();

        // Apply language
        this.applyLanguage();

        // Optimization: Save data immediately before page unload
        // This ensures any pending debounced saves are flushed
        window.addEventListener('beforeunload', () => {
            this.dataManager.saveImmediately();
            this.saveChartConfigurations();
        });

        console.log('DataVisible initialized');
    }

    loadPreferences() {
        const savedTheme = localStorage.getItem('dv-theme');
        const savedLang = localStorage.getItem('dv-lang');

        if (savedTheme) {
            this.currentTheme = savedTheme;
            document.documentElement.setAttribute('data-theme', savedTheme);
        }

        if (savedLang) {
            this.currentLang = savedLang;
        }
    }

    savePreferences() {
        localStorage.setItem('dv-theme', this.currentTheme);
        localStorage.setItem('dv-lang', this.currentLang);
    }

    /**
     * Save chart configurations to localStorage
     */
    saveChartConfigurations() {
        try {
            const config = {
                chartTypes: Object.fromEntries(this.chartRenderer.chartTypes),
                customColors: Object.fromEntries(this.chartRenderer.customColors),
                seriesColors: Object.fromEntries(this.chartRenderer.seriesColors),
                chartOptions: Object.fromEntries(this.chartRenderer.chartOptions),
                showValues: Object.fromEntries(this.chartRenderer.showValues),
                selectedColorScheme: Object.fromEntries(this.chartRenderer.selectedColorScheme),
                currentLayout: this.chartRenderer.currentLayout
            };

            // Handle categoryColors if it exists
            if (this.chartRenderer.categoryColors) {
                config.categoryColors = Object.fromEntries(this.chartRenderer.categoryColors);
            }

            localStorage.setItem('dv-chart-config', JSON.stringify(config));
        } catch (e) {
            console.warn('Failed to save chart configurations:', e);
        }
    }

    /**
     * Load chart configurations from localStorage
     */
    loadChartConfigurations() {
        try {
            const saved = localStorage.getItem('dv-chart-config');
            if (!saved) return;

            const config = JSON.parse(saved);

            // Restore chart types
            if (config.chartTypes) {
                this.chartRenderer.chartTypes = new Map(Object.entries(config.chartTypes));
            }

            // Restore custom colors
            if (config.customColors) {
                this.chartRenderer.customColors = new Map(Object.entries(config.customColors));
            }

            // Restore series colors (need to convert string keys back to numbers)
            if (config.seriesColors) {
                this.chartRenderer.seriesColors = new Map(
                    Object.entries(config.seriesColors).map(([k, v]) => [parseInt(k), v])
                );
            }

            // Restore chart options
            if (config.chartOptions) {
                this.chartRenderer.chartOptions = new Map(
                    Object.entries(config.chartOptions).map(([k, v]) => [parseInt(k), v])
                );
            }

            // Restore show values
            if (config.showValues) {
                this.chartRenderer.showValues = new Map(
                    Object.entries(config.showValues).map(([k, v]) => [parseInt(k), v])
                );
            }

            // Restore selected color scheme
            if (config.selectedColorScheme) {
                this.chartRenderer.selectedColorScheme = new Map(
                    Object.entries(config.selectedColorScheme).map(([k, v]) => [parseInt(k), v])
                );
            }

            // Restore category colors
            if (config.categoryColors) {
                this.chartRenderer.categoryColors = new Map(
                    Object.entries(config.categoryColors).map(([k, v]) => [parseInt(k), v])
                );
            }

            // Restore layout
            if (config.currentLayout) {
                this.chartRenderer.currentLayout = config.currentLayout;
            }

            console.log('Restored chart configurations from localStorage');
        } catch (e) {
            console.warn('Failed to load chart configurations:', e);
        }
    }

    /**
     * Clear all saved data and configurations
     */
    clearAllStorage() {
        this.dataManager.clearStorage();
        localStorage.removeItem('dv-chart-config');
    }

    bindEvents() {
        // Theme toggle
        document.getElementById('themeToggle')?.addEventListener('click', () => this.toggleTheme());

        // Language switch
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setLanguage(e.target.dataset.lang);
            });
        });

        // Export button
        document.getElementById('exportBtn')?.addEventListener('click', () => this.showExportMenu());

        // Chart category toggles
        document.querySelectorAll('.category-header').forEach(header => {
            header.addEventListener('click', (e) => this.toggleCategory(e));
        });

        // Chart type buttons
        document.querySelectorAll('.chart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectChartType(e));
        });

        // Layout buttons
        document.querySelectorAll('.layout-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.setLayout(e));
        });

        // Chart type select (in chart header)
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('chart-type-select')) {
                const slot = parseInt(e.target.dataset.slot);
                this.chartRenderer.renderChart(slot, e.target.value);
            }
        });

        // Chart actions
        document.addEventListener('click', (e) => {
            const actionBtn = e.target.closest('.chart-action-btn');
            if (actionBtn) {
                const action = actionBtn.dataset.action;
                const container = actionBtn.closest('.chart-container');
                const slot = parseInt(container.id.split('-')[1]);

                if (action === 'fullscreen') {
                    this.chartRenderer.toggleFullscreen(slot);
                } else if (action === 'download') {
                    this.chartRenderer.downloadChart(slot);
                } else if (action === 'colorpicker') {
                    this.showColorPicker(slot, actionBtn);
                } else if (action === 'settings') {
                    this.showOptionsPanel(slot, actionBtn);
                } else if (action === 'togglevalues') {
                    const isShowing = this.chartRenderer.toggleShowValues(slot);
                    const t = this.getTranslations();
                    this.showToast(isShowing ? (t.valuesShown || '数值已显示') : (t.valuesHidden || '数值已隐藏'), 'success');
                    // Toggle button visual state
                    actionBtn.classList.toggle('active', isShowing);
                } else if (action === 'resetzoom') {
                    this.chartRenderer.resetZoom(slot);
                } else if (action === 'zoomin') {
                    this.chartRenderer.handleZoom(slot, 'in');
                } else if (action === 'zoomout') {
                    this.chartRenderer.handleZoom(slot, 'out');
                }
            }
        });


        // Data panel toggle
        document.getElementById('togglePanel')?.addEventListener('click', () => {
            document.body.classList.toggle('panel-collapsed');
            const dataPanel = document.querySelector('.data-panel');
            dataPanel?.classList.toggle('collapsed');

            // Update arrow icon direction
            const toggleBtn = document.getElementById('togglePanel');
            const svg = toggleBtn?.querySelector('svg polyline');
            if (svg) {
                const isCollapsed = dataPanel?.classList.contains('collapsed');
                // When collapsed, arrow points up (expand). When expanded, arrow points down (collapse).
                svg.setAttribute('points', isCollapsed ? '6,15 12,9 18,15' : '6,9 12,15 18,9');
            }

            // Trigger resize after transition to ensure charts fill the new space
            setTimeout(() => {
                this.chartRenderer.handleResize();
            }, 300);
        });

        // Tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e));
        });

        // Table controls
        document.getElementById('addRow')?.addEventListener('click', () => this.addTableRow());
        document.getElementById('addCol')?.addEventListener('click', () => this.addTableColumn());
        document.getElementById('clearTable')?.addEventListener('click', () => this.clearTable());

        // Data panel fullscreen toggle
        document.getElementById('fullscreenDataPanel')?.addEventListener('click', () => this.toggleDataPanelFullscreen());

        // Delete row buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-row-btn')) {
                e.target.closest('tr')?.remove();
            }
        });

        // Parse buttons
        document.getElementById('parseJson')?.addEventListener('click', () => this.parseJSON());
        document.getElementById('parseCsv')?.addEventListener('click', () => this.parseCSV());

        // File drop zone
        const dropZone = document.getElementById('fileDropZone');
        const fileInput = document.getElementById('fileInput');

        if (dropZone && fileInput) {
            dropZone.addEventListener('click', () => fileInput.click());
            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropZone.classList.add('dragover');
            });
            dropZone.addEventListener('dragleave', () => {
                dropZone.classList.remove('dragover');
            });
            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropZone.classList.remove('dragover');
                const file = e.dataTransfer.files[0];
                if (file) this.handleFile(file);
            });
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) this.handleFile(file);
            });
        }

        // Sample data buttons
        document.querySelectorAll('.sample-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.loadSampleData(e));
        });

        // Apply and reset buttons
        document.getElementById('applyData')?.addEventListener('click', () => this.applyTableData());
        document.getElementById('resetData')?.addEventListener('click', () => this.resetData());
        document.getElementById('clearData')?.addEventListener('click', () => this.clearData());
        document.getElementById('resetAll')?.addEventListener('click', () => this.resetAll());

        // Window resize with debounce to prevent excessive re-renders
        window.addEventListener('resize', debounce(() => this.chartRenderer.handleResize(), 200));

        // Escape key to exit fullscreen
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.chart-container.fullscreen').forEach(c => {
                    c.classList.remove('fullscreen');
                });
            }
        });
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.savePreferences();
    }

    setLanguage(lang) {
        this.currentLang = lang;
        this.applyLanguage();
        this.savePreferences();

        // Update active button
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
    }

    applyLanguage() {
        const t = i18n[this.currentLang];

        // Update text elements
        const elements = {
            '.header-title': t.appTitle,
            '.data-panel-title': t.dataInput,
            '#addRow': t.addRow,
            '#addCol': t.addCol,
            '#clearTable': t.clear,
            '#parseJson': t.parseJSON,
            '#parseCsv': t.parseCSV
        };

        for (const [selector, text] of Object.entries(elements)) {
            const el = document.querySelector(selector);
            if (el) {
                el.textContent = text;
            }
        }

        // Update buttons with icons
        const btnText = document.querySelector('#applyData .btn-text');
        if (btnText) btnText.textContent = t.applyData;

        const resetText = document.querySelector('#resetData .btn-text');
        if (resetText) resetText.textContent = t.reset;

        const clearDataText = document.querySelector('#clearData .btn-text');
        if (clearDataText) clearDataText.textContent = t.clearData || '清空数据';

        const resetAllText = document.querySelector('#resetAll .btn-text');
        if (resetAllText) resetAllText.textContent = t.resetAll || '重置一切';

        const exportText = document.querySelector('#exportBtn .btn-text');
        if (exportText) exportText.textContent = t.export;

        // Update sidebar titles
        document.querySelectorAll('.sidebar-title').forEach((el, i) => {
            if (i === 0) el.textContent = t.chartTypes;
            if (i === 1) el.textContent = t.layoutMode;
        });

        // Update category headers
        const categories = ['basicCharts', 'advancedCharts', 'distributionCharts', 'hierarchyCharts', 'specialCharts', 'financialCharts', 'charts3D'];
        document.querySelectorAll('.category-header').forEach((el, i) => {
            const textContainer = el.childNodes;
            for (const node of textContainer) {
                if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                    node.textContent = ' ' + t[categories[i]] + ' ';
                    break;
                }
            }
        });

        // Update tab buttons
        const tabs = ['tableInput', 'jsonInput', 'csvInput', 'fileImport'];
        document.querySelectorAll('.tab-btn').forEach((btn, i) => {
            if (tabs[i]) btn.textContent = t[tabs[i]];
        });

        // Update file drop zone
        const dropZone = document.querySelector('.file-drop-zone');
        if (dropZone) {
            dropZone.querySelector('p').textContent = t.dropFile;
            dropZone.querySelector('.file-types').textContent = t.supportedFiles;
        }

        // Update sidebar chart buttons
        document.querySelectorAll('.chart-btn').forEach(btn => {
            const chartType = btn.dataset.i18n || btn.dataset.chart;
            const nameSpan = btn.querySelector('.chart-name');
            if (nameSpan && t[chartType]) {
                nameSpan.textContent = t[chartType];
            }
        });

        // Update layout buttons titles
        document.querySelectorAll('.layout-btn').forEach(btn => {
            const layout = btn.dataset.layout;
            if (layout === '1') btn.title = t.layout1;
            if (layout === '2') btn.title = t.layout2;
            if (layout === '4') btn.title = t.layout4;
        });

        // Update other button titles
        const themeBtn = document.getElementById('themeToggle');
        if (themeBtn) themeBtn.title = t.themeToggle;

        const togglePanelBtn = document.getElementById('togglePanel');
        if (togglePanelBtn) togglePanelBtn.title = t.togglePanel;

        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) exportBtn.title = t.export;

        // Update chart action buttons titles
        document.querySelectorAll('.chart-action-btn').forEach(btn => {
            const action = btn.dataset.action;
            if (action === 'colorpicker') btn.title = t.chartActionColor;
            if (action === 'settings') btn.title = t.chartActionSettings;
            if (action === 'togglevalues') btn.title = t.chartActionValues;
            if (action === 'zoomin') btn.title = t.chartActionZoomIn;
            if (action === 'zoomout') btn.title = t.chartActionZoomOut;
            if (action === 'resetzoom') btn.title = t.chartActionResetZoom;
            if (action === 'fullscreen') btn.title = t.chartActionFullscreen;
            if (action === 'download') btn.title = t.chartActionDownload;
        });

        // Update table header placeholders/values if they match default
        const headerInputs = document.querySelectorAll('.header-input');
        if (headerInputs.length >= 3) {
            // Check if we should update (simple heuristic: if it matches the other language's default)
            const otherLang = this.currentLang === 'zh' ? 'en' : 'zh';
            const otherT = i18n[otherLang];

            if (headerInputs[0].value === otherT.tableHeaderCategory || headerInputs[0].value === t.tableHeaderCategory) {
                headerInputs[0].value = t.tableHeaderCategory;
            }
            if (headerInputs[1].value === otherT.tableHeaderValue1 || headerInputs[1].value === t.tableHeaderValue1) {
                headerInputs[1].value = t.tableHeaderValue1;
            }
            if (headerInputs[2].value === otherT.tableHeaderValue2 || headerInputs[2].value === t.tableHeaderValue2) {
                headerInputs[2].value = t.tableHeaderValue2;
            }
        }

        // Refresh chart selects with new language
        this.refreshChartSelects();
    }

    /**
     * Get current translations object
     */
    getTranslations() {
        return i18n[this.currentLang];
    }

    /**
     * Refresh all chart type selects with current language
     */
    refreshChartSelects() {
        document.querySelectorAll('.chart-type-select').forEach(select => {
            const currentValue = select.value;
            const t = this.getTranslations();

            select.innerHTML = `
                <optgroup label="${t.basicCharts}">
                    <option value="bar">${t.bar}</option>
                    <option value="line">${t.line}</option>
                    <option value="pie">${t.pie}</option>
                    <option value="doughnut">${t.doughnut}</option>
                    <option value="horizontalBar">${t.horizontalBar}</option>
                </optgroup>
                <optgroup label="${t.advancedCharts}">
                    <option value="scatter">${t.scatter}</option>
                    <option value="bubble">${t.bubble}</option>
                    <option value="radar">${t.radar}</option>
                    <option value="area">${t.area}</option>
                    <option value="stacked">${t.stacked}</option>
                    <option value="polar">${t.polar}</option>
                    <option value="rose">${t.rose}</option>
                    <option value="mixed">${t.mixed}</option>
                </optgroup>
                <optgroup label="${t.distributionCharts}">
                    <option value="boxplot">${t.boxplot}</option>
                    <option value="heatmap">${t.heatmap}</option>
                    <option value="calendar">${t.calendar}</option>
                </optgroup>
                <optgroup label="${t.hierarchyCharts}">
                    <option value="treemap">${t.treemap}</option>
                    <option value="sunburst">${t.sunburst}</option>
                    <option value="sankey">${t.sankey}</option>
                    <option value="funnel">${t.funnel}</option>
                </optgroup>
                <optgroup label="${t.specialCharts}">
                    <option value="gauge">${t.gauge}</option>
                    <option value="wordcloud">${t.wordcloud}</option>
                    <option value="table">${t.table}</option>
                    <option value="waterfall">${t.waterfall}</option>
                    <option value="timeline">${t.timeline}</option>
                    <option value="graph">${t.graph}</option>
                    <option value="parallel">${t.parallel}</option>
                    <option value="themeriver">${t.themeriver}</option>
                    <option value="pictorial">${t.pictorial}</option>
                    <option value="liquid">${t.liquid}</option>
                </optgroup>
                <optgroup label="${t.financialCharts || '金融图表'}">
                    <option value="candlestick">${t.candlestick}</option>
                    <option value="effectScatter">${t.effectScatter}</option>
                    <option value="bullet">${t.bullet}</option>
                    <option value="stepLine">${t.stepLine}</option>
                    <option value="histogram">${t.histogram}</option>
                    <option value="tree">${t.tree}</option>
                    <option value="progress">${t.progress}</option>
                    <option value="metric">${t.metric}</option>
                    <option value="sparkline">${t.sparkline}</option>
                </optgroup>
                <optgroup label="${t.charts3D || '3D图表'}">
                    <option value="bar3d">${t.bar3d}</option>
                    <option value="scatter3d">${t.scatter3d}</option>
                    <option value="surface3d">${t.surface3d}</option>
                    <option value="line3d">${t.line3d}</option>
                    <option value="globe">${t.globe}</option>
                </optgroup>
            `;
            select.value = currentValue;
        });
    }

    toggleCategory(e) {
        const header = e.currentTarget;
        const items = header.nextElementSibling;

        header.classList.toggle('active');
        items.classList.toggle('active');
    }

    selectChartType(e) {
        const btn = e.currentTarget;
        const chartType = btn.dataset.chart;

        // Update active state
        document.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Render chart in all visible slots
        for (let i = 1; i <= this.chartRenderer.currentLayout; i++) {
            this.chartRenderer.renderChart(i, chartType);
        }
    }

    setLayout(e) {
        const btn = e.currentTarget;
        const layout = parseInt(btn.dataset.layout);

        // Update active state
        document.querySelectorAll('.layout-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        this.chartRenderer.setLayout(layout);
    }

    /**
     * Toggle data panel fullscreen mode
     */
    toggleDataPanelFullscreen() {
        const dataPanel = document.querySelector('.data-panel');
        const mainContainer = document.querySelector('.main-container');
        const header = document.querySelector('.header');
        const fullscreenBtn = document.getElementById('fullscreenDataPanel');

        if (!dataPanel) return;

        const isFullscreen = dataPanel.classList.toggle('fullscreen');

        // Toggle main container and header visibility
        if (mainContainer) {
            mainContainer.style.display = isFullscreen ? 'none' : '';
        }
        if (header) {
            header.style.display = isFullscreen ? 'none' : '';
        }

        // Update button icon
        if (fullscreenBtn) {
            const svg = fullscreenBtn.querySelector('svg');
            if (svg) {
                if (isFullscreen) {
                    // Show exit fullscreen icon
                    svg.innerHTML = '<path d="M4 14h6m0 0v6m0-6l-7 7m17-11h-6m0 0V4m0 6l7-7" />';
                } else {
                    // Show enter fullscreen icon
                    svg.innerHTML = '<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />';
                }
            }
        }

        // Update button title
        const t = i18n[this.currentLang];
        if (fullscreenBtn) {
            fullscreenBtn.title = isFullscreen
                ? (t.exitFullscreen || '退出全屏')
                : (t.fullscreenMode || '全屏模式');
        }
    }

    switchTab(e) {
        const btn = e.currentTarget;
        const tabId = btn.dataset.tab;

        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Show corresponding tab content
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        document.getElementById(`tab-${tabId}`)?.classList.add('active');
    }

    addTableRow() {
        const tbody = document.querySelector('#dataTable tbody');
        if (!tbody) return;

        const colCount = document.querySelectorAll('#dataTable thead th').length;
        const row = document.createElement('tr');

        for (let i = 0; i < colCount - 1; i++) {
            const td = document.createElement('td');
            const input = document.createElement('input');
            input.type = i === 0 ? 'text' : 'number';
            input.value = i === 0 ? 'New' : '0';
            td.appendChild(input);
            row.appendChild(td);
        }

        const actionTd = document.createElement('td');
        actionTd.className = 'action-col';
        actionTd.innerHTML = '<button class="delete-row-btn">×</button>';
        row.appendChild(actionTd);

        tbody.appendChild(row);
    }

    addTableColumn() {
        const headerRow = document.querySelector('#dataTable thead tr');
        const tbody = document.querySelector('#dataTable tbody');
        if (!headerRow || !tbody) return;

        // Add header
        const newHeader = document.createElement('th');
        newHeader.innerHTML = `<input type="text" value="Col ${headerRow.children.length}" class="header-input">`;
        headerRow.insertBefore(newHeader, headerRow.lastElementChild);

        // Add cells to each row
        tbody.querySelectorAll('tr').forEach(row => {
            const newCell = document.createElement('td');
            newCell.innerHTML = '<input type="number" value="0">';
            row.insertBefore(newCell, row.lastElementChild);
        });
    }

    clearTable() {
        const tbody = document.querySelector('#dataTable tbody');
        if (tbody) tbody.innerHTML = '';
    }

    parseJSON() {
        const input = document.getElementById('jsonInput');
        if (!input) return;

        const result = this.dataManager.parseJSON(input.value);
        if (result.success) {
            this.dataManager.setData(result.data);
            this.chartRenderer.setData(result.data);
            this.showToast(i18n[this.currentLang].dataApplied, 'success');
        } else {
            this.showToast(`${i18n[this.currentLang].parseError}: ${result.error}`, 'error');
        }
    }

    parseCSV() {
        const input = document.getElementById('csvInput');
        if (!input) return;

        const result = this.dataManager.parseCSV(input.value);
        if (result.success) {
            this.dataManager.setData(result.data);
            this.chartRenderer.setData(result.data);
            this.showToast(i18n[this.currentLang].dataApplied, 'success');
        } else {
            this.showToast(`${i18n[this.currentLang].parseError}: ${result.error}`, 'error');
        }
    }

    async handleFile(file) {
        const result = await this.dataManager.parseFile(file);
        if (result.success) {
            this.dataManager.setData(result.data);
            this.chartRenderer.setData(result.data);
            this.showToast(i18n[this.currentLang].fileLoaded, 'success');
        } else {
            this.showToast(`${i18n[this.currentLang].parseError}: ${result.error}`, 'error');
        }
    }

    loadSampleData(e) {
        const btn = e.currentTarget;
        const sampleKey = btn.dataset.sample;
        const sampleData = this.dataManager.getSampleData(sampleKey);

        if (sampleData) {
            this.dataManager.setData(sampleData);
            this.chartRenderer.setData(sampleData);
            this.showToast(i18n[this.currentLang].dataApplied, 'success');
        }
    }

    applyTableData() {
        const table = document.getElementById('dataTable');
        if (!table) return;

        const result = this.dataManager.parseTableData(table);
        if (result.success) {
            this.dataManager.setData(result.data);
            this.chartRenderer.setData(result.data);
            this.showToast(i18n[this.currentLang].dataApplied, 'success');
        } else {
            this.showToast(`${i18n[this.currentLang].parseError}: ${result.error}`, 'error');
        }
    }

    resetData() {
        const defaultData = this.dataManager.getDefaultData();
        this.dataManager.setData(defaultData);
        this.chartRenderer.setData(defaultData);

        // Reset table UI to default state
        this.resetTableToDefault();

        // Clear JSON and CSV textareas
        const jsonInput = document.getElementById('jsonInput');
        const csvInput = document.getElementById('csvInput');
        if (jsonInput) jsonInput.value = '';
        if (csvInput) csvInput.value = '';

        this.showToast(i18n[this.currentLang].dataReset, 'success');
    }

    /**
     * Clear all data - sets data to empty state
     */
    clearData() {
        const emptyData = {
            labels: [],
            datasets: []
        };
        this.dataManager.setData(emptyData);
        this.chartRenderer.setData(emptyData);

        // Clear table inputs
        const tbody = document.querySelector('#dataTable tbody');
        if (tbody) {
            tbody.innerHTML = '';
        }

        // Clear JSON and CSV textareas
        const jsonInput = document.getElementById('jsonInput');
        const csvInput = document.getElementById('csvInput');
        if (jsonInput) jsonInput.value = '';
        if (csvInput) csvInput.value = '';

        const t = i18n[this.currentLang];
        this.showToast(t.dataCleared || '数据已清空', 'success');
    }

    /**
     * Reset everything - data, colors, options, and all chart settings
     */
    resetAll() {
        // Reset data to default
        const defaultData = this.dataManager.getDefaultData();
        this.dataManager.setData(defaultData);

        // Clear all custom settings in chart renderer
        this.chartRenderer.customColors.clear();
        this.chartRenderer.seriesColors.clear();
        this.chartRenderer.chartOptions.clear();
        this.chartRenderer.showValues.clear();
        this.chartRenderer.selectedColorScheme.clear();
        this.chartRenderer.zoomLevels.clear();
        if (this.chartRenderer.categoryColors) {
            this.chartRenderer.categoryColors.clear();
        }

        // Reset data history
        this.dataManager.dataHistory = [];

        // Reset table to default state
        this.resetTableToDefault();

        // Clear JSON and CSV textareas
        const jsonInput = document.getElementById('jsonInput');
        const csvInput = document.getElementById('csvInput');
        if (jsonInput) jsonInput.value = '';
        if (csvInput) csvInput.value = '';

        // Clear all saved data and configurations from localStorage
        this.clearAllStorage();

        // Re-render charts with default data
        this.chartRenderer.setData(defaultData);

        const t = i18n[this.currentLang];
        this.showToast(t.allReset || '已重置所有设置', 'success');
    }

    /**
     * Reset table to default state
     */
    resetTableToDefault() {
        const tbody = document.querySelector('#dataTable tbody');
        if (!tbody) return;

        const t = i18n[this.currentLang];

        // Reset header
        const headerInputs = document.querySelectorAll('#dataTable thead .header-input');
        if (headerInputs.length >= 3) {
            headerInputs[0].value = t.tableHeaderCategory || '类别';
            headerInputs[1].value = t.tableHeaderValue1 || '数值1';
            headerInputs[2].value = t.tableHeaderValue2 || '数值2';
        }

        // Reset body with default data
        tbody.innerHTML = `
            <tr>
                <td><input type="text" value="A"></td>
                <td><input type="number" value="30"></td>
                <td><input type="number" value="45"></td>
                <td class="action-col"><button class="delete-row-btn">×</button></td>
            </tr>
            <tr>
                <td><input type="text" value="B"></td>
                <td><input type="number" value="50"></td>
                <td><input type="number" value="35"></td>
                <td class="action-col"><button class="delete-row-btn">×</button></td>
            </tr>
            <tr>
                <td><input type="text" value="C"></td>
                <td><input type="number" value="40"></td>
                <td><input type="number" value="60"></td>
                <td class="action-col"><button class="delete-row-btn">×</button></td>
            </tr>
            <tr>
                <td><input type="text" value="D"></td>
                <td><input type="number" value="70"></td>
                <td><input type="number" value="25"></td>
                <td class="action-col"><button class="delete-row-btn">×</button></td>
            </tr>
            <tr>
                <td><input type="text" value="E"></td>
                <td><input type="number" value="25"></td>
                <td><input type="number" value="55"></td>
                <td class="action-col"><button class="delete-row-btn">×</button></td>
            </tr>
        `;
    }

    showExportMenu() {
        const data = this.dataManager.getData();
        if (!data) return;

        // Create export options
        const options = [
            { name: 'JSON', action: () => this.exportAsJSON() },
            { name: 'CSV', action: () => this.exportAsCSV() }
        ];

        // Simple download as JSON for now
        this.exportAsJSON();
    }

    exportAsJSON() {
        const json = this.dataManager.exportJSON();
        if (!json) return;

        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `data-${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);

        this.showToast(i18n[this.currentLang].exportSuccess, 'success');
    }

    exportAsCSV() {
        const csv = this.dataManager.exportCSV();
        if (!csv) return;

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `data-${Date.now()}.csv`;
        link.click();
        URL.revokeObjectURL(url);

        this.showToast(i18n[this.currentLang].exportSuccess, 'success');
    }

    /**
     * Show color picker for chart customization
     */
    showColorPicker(slot, triggerBtn) {
        // Remove existing picker
        document.querySelector('.color-picker-popup')?.remove();

        const t = this.getTranslations();
        const data = this.dataManager.getData();
        const seriesCount = data?.datasets?.length || 2;
        const seriesNames = data?.datasets?.map((ds, i) => ds.label || `${t.series || '系列'} ${i + 1}`) || [];

        // Get current series colors
        const currentSeriesColors = this.chartRenderer.getSeriesColors(slot);
        const currentCategoryColors = this.chartRenderer.getCategoryColors(slot);

        // Category (rows) info
        const categoryCount = data?.labels?.length || 5;
        const categoryNames = data?.labels || ['A', 'B', 'C', 'D', 'E'];

        const defaultSeriesColors = BasicCharts.getColorPalette(seriesCount);
        const defaultCategoryColors = BasicCharts.getColorPalette(categoryCount);

        // Get current chart type for intelligent color recommendations
        const currentChartType = this.chartRenderer.chartTypes.get(slot) || 'bar';
        const colorMode = ChartColorsConfig.getColorMode(currentChartType);
        const colorModeInfo = ChartColorsConfig.getColorModeDescription(currentChartType);
        const chartSuggestion = ChartColorsConfig.getChartColorSuggestion(currentChartType);

        // Get currently selected color scheme key
        const selectedSchemeKey = this.chartRenderer.getSelectedColorScheme(slot);

        // Build color schemes from ChartColorsConfig
        const colorSchemes = Object.entries(ChartColorsConfig.presets).map(([key, preset]) => ({
            key: key,
            name: preset.name,
            nameEn: preset.nameEn,
            colors: preset.colors.slice(0, 5),
            recommended: key === chartSuggestion.preset,
            selected: key === selectedSchemeKey  // Mark if this scheme is currently selected
        }));

        // Build dual color schemes for dual-color charts
        const dualSchemes = Object.entries(ChartColorsConfig.dualColorPresets).map(([key, preset]) => ({
            key: key,
            name: preset.name,
            positive: preset.positive,
            negative: preset.negative
        }));

        // Build gradient schemes for gradient charts
        const gradientSchemes = Object.entries(ChartColorsConfig.gradientPresets).map(([key, preset]) => ({
            key: key,
            name: preset.name,
            colors: preset.colors
        }));

        const isDualMode = colorMode === ChartColorsConfig.colorModes.DUAL;
        const isGradientMode = colorMode === ChartColorsConfig.colorModes.GRADIENT;
        const isCategoryMode = colorMode === ChartColorsConfig.colorModes.CATEGORY;

        const popup = document.createElement('div');
        popup.className = 'color-picker-popup';
        popup.innerHTML = `
            <div class="color-picker-header">
                <span>${t.colorScheme || '配色方案'}</span>
                <button class="close-picker">×</button>
            </div>
            <div class="color-mode-info" style="background:#f8fafc; padding:8px 12px; margin:-8px -12px 8px; border-radius:6px 6px 0 0; font-size:12px;">
                <strong style="color:#6366f1;">${this.currentLang === 'en' ? colorModeInfo.titleEn : colorModeInfo.title}</strong>
                <span style="color:#64748b; margin-left:8px;">${this.currentLang === 'en' ? chartSuggestion.tipEn : chartSuggestion.tip}</span>
            </div>
            ${isDualMode ? `
            <div class="dual-color-schemes">
                <span class="section-title" style="font-size:12px; color:#64748b;">${t.dualColorSchemes || '涨跌/正负配色'}</span>
                <div class="dual-scheme-list" style="display:flex; gap:8px; flex-wrap:wrap; margin-top:8px;">
                    ${dualSchemes.map((scheme, idx) => `
                        <div class="dual-scheme" data-dual="${idx}" style="cursor:pointer; padding:6px 12px; border:1px solid #e2e8f0; border-radius:6px; display:flex; align-items:center; gap:6px;">
                            <span class="color-dot" style="background:${scheme.positive}; width:12px; height:12px; border-radius:50%;"></span>
                            <span class="color-dot" style="background:${scheme.negative}; width:12px; height:12px; border-radius:50%;"></span>
                            <span style="font-size:12px;">${scheme.name}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : isGradientMode ? `
            <div class="gradient-schemes">
                <span class="section-title" style="font-size:12px; color:#64748b;">${t.gradientColorSchemes || '渐变配色'}</span>
                <div class="gradient-scheme-list" style="display:flex; flex-direction:column; gap:6px; margin-top:8px;">
                    ${gradientSchemes.map((scheme, idx) => `
                        <div class="gradient-scheme" data-gradient="${idx}" style="cursor:pointer; padding:6px 12px; border:1px solid #e2e8f0; border-radius:6px;">
                            <span style="font-size:12px; margin-bottom:4px; display:block;">${scheme.name}</span>
                            <div style="display:flex; height:16px; border-radius:4px; overflow:hidden;">
                                ${scheme.colors.map(c => `<div style="flex:1; background:${c};"></div>`).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : `
            <div class="color-schemes">
                ${colorSchemes.map((scheme, idx) => `
                    <div class="color-scheme ${scheme.selected ? 'selected' : ''} ${scheme.recommended ? 'recommended' : ''}" data-scheme="${idx}" data-key="${scheme.key}" style="${scheme.selected ? 'border:2px solid #6366f1;' : ''}">
                        <span class="scheme-name">${this.currentLang === 'en' ? scheme.nameEn : scheme.name} ${scheme.selected ? '✓' : ''}</span>
                        <div class="scheme-preview">
                            ${scheme.colors.map(c => `<span class="color-dot" style="background:${c}"></span>`).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
            `}
            ${isCategoryMode ? `
            <div class="category-colors">
                <span class="section-title">${t.rowColors || '按类别设置颜色'}</span>
                <div class="category-color-list">
                    ${categoryNames.map((name, i) => `
                        <div class="category-color-item" data-category="${i}">
                            <span class="category-name">${name}</span>
                            <input type="color" class="category-color-input" value="${currentCategoryColors[i] || defaultCategoryColors[i] || '#6366f1'}" data-category="${i}">
                        </div>
                    `).join('')}
                </div>
                <button class="btn btn-sm btn-primary apply-category-colors">${t.apply || '应用'}</button>
            </div>
            ` : `
            <div class="series-colors">
                <span class="section-title">${t.columnColors || '按列设置颜色（数据系列）'}</span>
                <div class="series-color-list">
                    ${seriesNames.map((name, i) => `
                        <div class="series-color-item" data-series="${i}">
                            <span class="series-name">${name}</span>
                            <input type="color" class="series-color-input" value="${currentSeriesColors[i] || defaultSeriesColors[i] || '#6366f1'}" data-series="${i}">
                        </div>
                    `).join('')}
                </div>
                <button class="btn btn-sm btn-primary apply-series-colors">${t.apply || '应用'}</button>
            </div>
            <div class="category-colors">
                <span class="section-title">${t.rowColors || '按行设置颜色（数据类别）'}</span>
                <div class="category-color-list">
                    ${categoryNames.map((name, i) => `
                        <div class="category-color-item" data-category="${i}">
                            <span class="category-name">${name}</span>
                            <input type="color" class="category-color-input" value="${currentCategoryColors[i] || defaultCategoryColors[i] || '#6366f1'}" data-category="${i}">
                        </div>
                    `).join('')}
                </div>
                <button class="btn btn-sm btn-primary apply-category-colors">${t.apply || '应用'}</button>
            </div>
            `}
            <div class="color-picker-actions">
                <button class="btn btn-sm btn-secondary reset-colors">${t.resetColors || '重置颜色'}</button>
            </div>
        `;


        // Position popup
        const rect = triggerBtn.getBoundingClientRect();
        popup.style.position = 'fixed';
        popup.style.top = `${rect.bottom + 8}px`;
        popup.style.left = `${Math.max(10, rect.left - 100)}px`;
        popup.style.zIndex = '2000';

        document.body.appendChild(popup);

        // Event handlers
        popup.querySelector('.close-picker').onclick = () => popup.remove();

        popup.querySelectorAll('.color-scheme').forEach(scheme => {
            scheme.onclick = () => {
                const idx = parseInt(scheme.dataset.scheme);
                const schemeKey = colorSchemes[idx].key;
                this.applyColorScheme(slot, colorSchemes[idx].colors, schemeKey);
                popup.remove();
            };
        });

        // Dual color scheme event handlers
        popup.querySelectorAll('.dual-scheme').forEach(scheme => {
            scheme.onclick = () => {
                const idx = parseInt(scheme.dataset.dual);
                const dual = dualSchemes[idx];
                this.applyColorScheme(slot, [dual.positive, dual.negative]);
                popup.remove();
            };
        });

        // Gradient color scheme event handlers
        popup.querySelectorAll('.gradient-scheme').forEach(scheme => {
            scheme.onclick = () => {
                const idx = parseInt(scheme.dataset.gradient);
                this.applyColorScheme(slot, gradientSchemes[idx].colors);
                popup.remove();
            };
        });

        // Apply series colors (column colors)
        const seriesBtn = popup.querySelector('.apply-series-colors');
        if (seriesBtn) {
            seriesBtn.onclick = () => {
                popup.querySelectorAll('.series-color-input').forEach(input => {
                    const seriesIndex = parseInt(input.dataset.series);
                    const color = input.value;
                    this.chartRenderer.setSeriesColor(slot, seriesIndex, color);
                });
                // Save configuration after applying series colors
                this.saveChartConfigurations();
                this.showToast(t.colorsApplied || '配色已应用', 'success');
                popup.remove();
            };
        }

        // Apply category colors (row colors)
        const categoryBtn = popup.querySelector('.apply-category-colors');
        if (categoryBtn) {
            categoryBtn.onclick = () => {
                popup.querySelectorAll('.category-color-input').forEach(input => {
                    const categoryIndex = parseInt(input.dataset.category);
                    const color = input.value;
                    this.chartRenderer.setCategoryColor(slot, categoryIndex, color);
                });
                // Save configuration after applying category colors
                this.saveChartConfigurations();
                this.showToast(t.colorsApplied || '配色已应用', 'success');
                popup.remove();
            };
        }

        // Reset colors
        popup.querySelector('.reset-colors').onclick = () => {
            this.chartRenderer.clearCustomColors(slot);
            // Save configuration after resetting colors
            this.saveChartConfigurations();
            this.showToast(t.colorsReset || '颜色已重置', 'success');
            popup.remove();
        };

        // Close on outside click
        setTimeout(() => {
            document.addEventListener('click', function closePopup(e) {
                if (!popup.contains(e.target) && e.target !== triggerBtn && !triggerBtn.contains(e.target)) {
                    popup.remove();
                    document.removeEventListener('click', closePopup);
                }
            });
        }, 100);
    }


    /**
     * Apply color scheme to chart
     * @param {number} slot - Chart slot number
     * @param {Array} colors - Color array to apply
     * @param {string} schemeKey - Optional key of the color scheme
     */
    applyColorScheme(slot, colors, schemeKey = null) {
        // Use the chartRenderer's setColors method with scheme key
        this.chartRenderer.setColors(slot, colors, schemeKey);
        // Save configuration after applying colors
        this.saveChartConfigurations();
        this.showToast(this.getTranslations().colorsApplied || '配色已应用', 'success');
    }


    /**
     * Show chart options panel
     */
    showOptionsPanel(slot, triggerBtn) {
        // Remove existing panel
        document.querySelector('.chart-options-popup')?.remove();

        const t = this.getTranslations();
        const chartType = this.chartRenderer.chartTypes.get(slot) || 'bar';
        const currentOptions = this.chartRenderer.getOptions(slot);

        // Generate options HTML using ChartOptions module
        const optionsHTML = ChartOptions.generatePanelHTML(chartType, currentOptions, this.currentLang);

        const popup = document.createElement('div');
        popup.className = 'chart-options-popup';
        popup.innerHTML = `
            <div class="options-panel-header">
                <span>${t.chartSettings || '图表设置'}</span>
                <button class="close-options">×</button>
            </div>
            <div class="options-panel-body">
                ${optionsHTML || `<p style="color: var(--text-tertiary); text-align: center;">${t.noOptions || '此图表暂无可调选项'}</p>`}
            </div>
            <div class="options-panel-footer">
                <button class="btn-reset-options">${t.reset || '重置'}</button>
                <button class="btn-apply-options">${t.apply || '应用'}</button>
            </div>
        `;

        // Position popup
        const rect = triggerBtn.getBoundingClientRect();
        popup.style.position = 'fixed';
        popup.style.top = `${rect.bottom + 8}px`;
        popup.style.left = `${Math.max(10, rect.left - 100)}px`;
        popup.style.zIndex = '2000';

        document.body.appendChild(popup);

        // Bind range input value display
        popup.querySelectorAll('input[type="range"]').forEach(input => {
            const valueSpan = input.parentElement.querySelector('.option-value');
            input.addEventListener('input', () => {
                if (valueSpan) valueSpan.textContent = input.value;
            });
        });

        // Bind color input sync (color picker <-> text input)
        popup.querySelectorAll('.color-control').forEach(control => {
            const colorInput = control.querySelector('input[type="color"]');
            const textInput = control.querySelector('.color-text');

            if (colorInput && textInput) {
                // Sync color picker -> text input
                colorInput.addEventListener('input', () => {
                    textInput.value = colorInput.value;
                });

                // Sync text input -> color picker
                textInput.addEventListener('input', () => {
                    const value = textInput.value;
                    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
                        colorInput.value = value;
                    }
                });
            }
        });

        // Close button
        popup.querySelector('.close-options').onclick = () => popup.remove();

        // Reset button
        popup.querySelector('.btn-reset-options').onclick = () => {
            const defaults = ChartOptions.getDefaults(chartType);
            // Update UI with defaults
            popup.querySelectorAll('input[type="range"]').forEach(input => {
                const key = input.dataset.key;
                if (defaults[key] !== undefined) {
                    input.value = defaults[key];
                    const valueSpan = input.parentElement.querySelector('.option-value');
                    if (valueSpan) valueSpan.textContent = defaults[key];
                }
            });
            popup.querySelectorAll('input[type="checkbox"]').forEach(input => {
                const key = input.dataset.key;
                if (defaults[key] !== undefined) {
                    input.checked = defaults[key];
                }
            });
            popup.querySelectorAll('select').forEach(select => {
                const key = select.dataset.key;
                if (defaults[key] !== undefined) {
                    select.value = defaults[key];
                }
            });
            // Reset color inputs
            popup.querySelectorAll('input[type="color"]').forEach(input => {
                const key = input.dataset.key;
                if (defaults[key] !== undefined) {
                    input.value = defaults[key];
                    const textInput = input.parentElement.querySelector('.color-text');
                    if (textInput) textInput.value = defaults[key];
                }
            });

            // Reset number inputs
            popup.querySelectorAll('input[type="number"]').forEach(input => {
                const key = input.dataset.key;
                // Axis options default is null, so we check if key exists in defaults
                // We use hasOwnProperty or simple check if key is in defaults object
                // Note: defaults object comes from getDefaults() which returns all keys defined
                if (key in defaults) {
                    const defVal = defaults[key];
                    input.value = defVal === null ? '' : defVal;
                }
            });
        };

        // Apply button
        popup.querySelector('.btn-apply-options').onclick = () => {
            const values = ChartOptions.parseValues(popup.querySelector('.options-panel-body'));
            this.chartRenderer.setOptions(slot, values);
            // Save configuration after applying options
            this.saveChartConfigurations();
            this.showToast(t.optionsApplied || '设置已应用', 'success');
            popup.remove();
        };

        // Close on outside click
        setTimeout(() => {
            document.addEventListener('click', function closePanel(e) {
                if (!popup.contains(e.target) && e.target !== triggerBtn && !triggerBtn.contains(e.target)) {
                    popup.remove();
                    document.removeEventListener('click', closePanel);
                }
            });
        }, 100);
    }

    /**
     * Show export menu for the global export button
     * Exports all visible charts
     */
    showExportMenu() {
        // Remove existing menu
        document.querySelector('.export-format-menu')?.remove();

        const exportBtn = document.getElementById('exportBtn');
        if (!exportBtn) return;

        const rect = exportBtn.getBoundingClientRect();
        const t = this.getTranslations();

        const menu = document.createElement('div');
        menu.className = 'export-format-menu';
        menu.innerHTML = `
            <div class="export-menu-header">
                <span>${t.selectExportFormat || '选择导出格式'}</span>
                <button class="close-export-menu">×</button>
            </div>
            <div class="export-formats">
                <button class="export-format-btn" data-format="png" data-mime="image/png">
                    <span class="format-icon">🖼️</span>
                    <span class="format-name">PNG</span>
                    <span class="format-desc">${t.pngDesc || '无损压缩，支持透明'}</span>
                </button>
                <button class="export-format-btn" data-format="jpg" data-mime="image/jpeg">
                    <span class="format-icon">📷</span>
                    <span class="format-name">JPG / JPEG</span>
                    <span class="format-desc">${t.jpgDesc || '有损压缩，文件更小'}</span>
                </button>
                <button class="export-format-btn" data-format="webp" data-mime="image/webp">
                    <span class="format-icon">🌐</span>
                    <span class="format-name">WebP</span>
                    <span class="format-desc">${t.webpDesc || '现代格式，高压缩比'}</span>
                </button>
                <button class="export-format-btn" data-format="svg" data-mime="image/svg+xml">
                    <span class="format-icon">📐</span>
                    <span class="format-name">SVG</span>
                    <span class="format-desc">${t.svgDesc || '矢量图，可无限缩放'}</span>
                </button>
            </div>
            <div class="export-quality-section">
                <label class="quality-label">
                    <span>${t.exportQuality || '导出质量'}</span>
                    <span class="quality-value">90%</span>
                </label>
                <input type="range" class="quality-slider" min="10" max="100" value="90" step="5">
            </div>
            <div class="export-scale-section">
                <label class="scale-label">
                    <span>${t.exportScale || '导出倍率'}</span>
                    <span class="scale-value">2x</span>
                </label>
                <input type="range" class="scale-slider" min="1" max="4" value="2" step="0.5">
            </div>
        `;

        // Position menu with boundary checks
        menu.style.position = 'fixed';
        menu.style.zIndex = '2000';

        document.body.appendChild(menu);

        // Calculate position after appending to get actual dimensions
        const menuWidth = menu.offsetWidth;
        const menuHeight = menu.offsetHeight;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Calculate initial left position (align right edge with button)
        let leftPos = rect.right - menuWidth;

        // Ensure menu doesn't go off the right edge
        if (leftPos + menuWidth > viewportWidth - 10) {
            leftPos = viewportWidth - menuWidth - 10;
        }

        // Ensure menu doesn't go off the left edge
        if (leftPos < 10) {
            leftPos = 10;
        }

        // Calculate top position
        let topPos = rect.bottom + 8;

        // If menu would go off bottom, show above the button
        if (topPos + menuHeight > viewportHeight - 10) {
            topPos = rect.top - menuHeight - 8;
        }

        // Ensure menu doesn't go off top edge
        if (topPos < 10) {
            topPos = 10;
        }

        menu.style.top = `${topPos}px`;
        menu.style.left = `${leftPos}px`;

        // Event handlers
        menu.querySelector('.close-export-menu').onclick = () => menu.remove();

        // Quality slider
        const qualitySlider = menu.querySelector('.quality-slider');
        const qualityValue = menu.querySelector('.quality-value');
        qualitySlider.addEventListener('input', () => {
            qualityValue.textContent = `${qualitySlider.value}%`;
        });

        // Scale slider
        const scaleSlider = menu.querySelector('.scale-slider');
        const scaleValue = menu.querySelector('.scale-value');
        scaleSlider.addEventListener('input', () => {
            scaleValue.textContent = `${scaleSlider.value}x`;
        });

        // Format buttons - export all visible charts
        menu.querySelectorAll('.export-format-btn').forEach(btn => {
            btn.onclick = () => {
                const format = btn.dataset.format;
                const quality = parseInt(qualitySlider.value) / 100;
                const scale = parseFloat(scaleSlider.value);

                // Export all visible charts
                for (let i = 1; i <= this.chartRenderer.currentLayout; i++) {
                    const chartInfo = this.chartRenderer.charts.get(i);
                    if (chartInfo) {
                        this.chartRenderer.exportChartWithFormat(
                            i,
                            chartInfo,
                            format,
                            btn.dataset.mime,
                            quality,
                            scale
                        );
                    }
                }
                menu.remove();
            };
        });

        // Close on outside click
        setTimeout(() => {
            document.addEventListener('click', function closeMenu(e) {
                if (!menu.contains(e.target) && e.target !== exportBtn && !exportBtn.contains(e.target)) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            });
        }, 100);
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<span class="toast-message">${message}</span>`;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
