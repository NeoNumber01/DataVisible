# DataVisible - 数据可视化平台

一个功能丰富的纯前端数据可视化平台，支持 15+ 种图表类型，中英文切换，深色/浅色主题。

## 功能特点

### 📊 支持的图表类型

#### 基础图表
- 柱状图 (Bar Chart)
- 折线图 (Line Chart)
- 饼图 (Pie Chart)
- 环形图 (Doughnut Chart)

#### 高级图表
- 散点图 (Scatter Chart)
- 气泡图 (Bubble Chart)
- 雷达图 (Radar Chart)
- 面积图 (Area Chart)
- 堆叠图 (Stacked Chart)
- 极坐标图 (Polar Area)

#### 分布图表
- 箱线图 (Box Plot)
- 热力图 (Heatmap)

#### 层级图表
- 树状图 (Treemap)
- 旭日图 (Sunburst)
- 桑基图 (Sankey Diagram)
- 漏斗图 (Funnel Chart)

#### 特殊图表
- 仪表盘 (Gauge)
- 词云图 (Word Cloud)
- 数据表格 (Data Table)

### 📥 数据输入方式

1. **表格输入** - 类似 Excel 的网格编辑器，支持添加行/列
2. **JSON 输入** - 直接粘贴 JSON 格式数据
3. **CSV 输入** - 粘贴 CSV 格式数据
4. **文件导入** - 拖拽或选择 CSV/JSON 文件
5. **示例数据** - 8 种预设数据集快速体验

### 🎨 界面特性

- 🌓 深色/浅色主题一键切换
- 🌍 中英文双语支持
- 📱 响应式布局，适配不同屏幕
- 🖼️ 1/2/4 图表对比布局
- ⬇️ 图表导出为 PNG 图片
- 📤 数据导出为 JSON/CSV

## 使用方法

### 本地运行

直接在浏览器中打开 `index.html` 文件即可使用。

```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

### 使用本地服务器（推荐）

```bash
# 使用 Python
python3 -m http.server 8080

# 使用 Node.js
npx serve .

# 然后访问 http://localhost:8080
```

## 数据格式

### 标准格式（适用于大多数图表）

```json
{
  "labels": ["A", "B", "C", "D", "E"],
  "datasets": [
    {
      "label": "Series 1",
      "data": [30, 50, 40, 70, 25]
    },
    {
      "label": "Series 2",
      "data": [45, 35, 60, 25, 55]
    }
  ]
}
```

### 层级格式（适用于 Treemap, Sunburst）

```json
{
  "name": "Root",
  "children": [
    {
      "name": "Category A",
      "value": 100,
      "children": [
        { "name": "Sub A1", "value": 60 },
        { "name": "Sub A2", "value": 40 }
      ]
    }
  ]
}
```

### 流程格式（适用于 Sankey）

```json
{
  "nodes": [
    { "name": "Source" },
    { "name": "Target" }
  ],
  "links": [
    { "source": 0, "target": 1, "value": 100 }
  ]
}
```

## 项目结构

```
DataVisible/
├── index.html              # 主页面
├── css/
│   └── styles.css          # 样式文件
├── js/
│   ├── app.js              # 应用入口
│   ├── dataManager.js      # 数据管理
│   ├── chartRenderer.js    # 图表渲染引擎
│   └── charts/
│       ├── basicCharts.js  # 基础图表
│       ├── advancedCharts.js # 高级图表
│       └── comparisonCharts.js # 特殊图表
└── README.md               # 说明文档
```

## 技术栈

- HTML5 / CSS3 / JavaScript (ES6+)
- [Chart.js](https://www.chartjs.org/) - 基础图表
- [ECharts](https://echarts.apache.org/) - 高级图表
- [Inter Font](https://fonts.google.com/specimen/Inter) - 字体

## 浏览器支持

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## License

MIT License
