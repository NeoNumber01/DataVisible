# DataVisible

[English](#english) | [中文](#chinese)

<a name="english"></a>
## 🚀 DataVisible - Advanced Data Visualization Platform

**DataVisible** is a powerful, feature-rich, pure frontend data visualization platform. It empowers users to create stunning visualizations from simple data inputs, supporting over **45 distinct chart types** ranging from basic statistical charts to complex 3D and financial visualizations.

### ✨ Key Features

- **📈 Massive Chart Library**: Support for 45+ chart types including 2D, 3D, Financial, relational, and geographic maps.
- **🎨 Deep Customization**: Fine-tune every aspect of your charts—colors, fonts, sizes, borders, smoothing, and specific chart parameters (e.g., "Rose Type" for generic charts using ECharts).
- **🔄 Interactive Experience**: Built-in support for **Zooming & Panning**, data highlighting, and interactive tooltips.
- **👓 3D Visualization**: Native support for WebGL-powered 3D Bar, Scatter, Surface, and Globe visualizations.
- **🌓 Dark/Light Mode**: Seamless switching between optimized dark and light themes for any lighting condition.
- **🌍 Bilingual Support**: Full UI localization for both English and Chinese users.
- **💾 Flexible Data I/O**:
  - **Input**: Excel-like grid editor, JSON/CSV paste, drag-and-drop file import, and 8+ sample datasets.
  - **Export**: Save charts as **PNG, JPG, SVG, WebP** or export high-res images. Export processed data as JSON/CSV.

### 📊 Supported Chart Types

**Basic & Statistical**
- Line, Step Line
- Bar, Horizontal Bar, Pictorial Bar
- Pie, Doughnut
- Scatter, Effect Scatter
- Area, Stacked Chart
- Histogram, Box Plot

**Advanced & Relational**
- Radar, Polar Area, Rose (Nightingale)
- Bubble
- Heatmap, Calendar Heatmap
- Tree, Treemap, Sunburst
- Graph, Sankey Diagram, Parallel Coordinates
- ThemeRiver

**Financial & Progress**
- Candlestick (K-Line), Waterfall
- Bullet Chart
- Gauge, Liquid Fill Gauge
- Funnel
- Progress Bar/Ring
- Metric Cards, Sparklines, Data Table

**3D Visualization (WebGL)**
- 3D Bar Chart
- 3D Scatter Plot
- 3D Line Chart
- 3D Surface Plot
- 3D Earth Globe

**Others**
- Word Cloud
- Map (Scatter/Geographic)
- Timeline

### 🛠️ Usage

#### 1. Quick Start
Since this is a pure static web application, you can run it directly:

- **Easiest Way**: Double-click the `startUp.bat` file to automatically start a local server and open the app in your browser.
- **Direct Open**: Double-click `index.html` to open in your browser.
- **Local Server (Manual)**:
  ```bash
  # Python
  python3 -m http.server 8080
  # Node.js
  npx serve .
  ```

#### 2. Workflow
1.  **Import Data**: Paste your data or load a sample.
2.  **Select Chart**: Choose from the categorized list of charts.
3.  **Customize**: Use the sidebar to adjust colors, labels, and chart-specific settings (e.g., *Rose Type*).
4.  **Export**: Download the chart as an image or save the data.

### 📋 Data Format Examples

**Standard Series (Line, Bar, Pie, etc.)**
```json
{
  "labels": ["Mon", "Tue", "Wed", "Thu", "Fri"],
  "datasets": [
    {
      "label": "Sales",
      "data": [120, 200, 150, 80, 70]
    }
  ]
}
```

**Hierarchical (Treemap, Sunburst)**
```json
{
  "name": "Root",
  "children": [
    {
      "name": "Group A",
      "value": 100,
      "children": [
        { "name": "A-1", "value": 40 },
        { "name": "A-2", "value": 60 }
      ]
    }
  ]
}
```

**Relational (Graph, Sankey)**
```json
{
  "nodes": [{ "name": "A" }, { "name": "B" }],
  "links": [{ "source": "A", "target": "B", "value": 5 }]
}
```

---

<a name="chinese"></a>
## 🚀 DataVisible - 高级数据可视化平台

**DataVisible** 是一个功能强大、纯前端的数据可视化平台。它支持超过 **45 种图表类型**，从基础统计图表到复杂的 3D 和金融可视化，帮助用户轻松将简单数据转化为精美的可视化作品。

### ✨ 核心功能

- **📈 海量图表库**：支持 45+ 种图表，涵盖 2D、3D、金融、关系网络及地理地图等多种类型。
- **🎨 深度定制**：精细控制图表的每一个细节——包括配色、字体、尺寸、边框、平滑度以及特定图表的专用参数（如玫瑰图的模式、地图的投影等）。
- **🔄 交互体验**：内置 **缩放与平移 (Zoom & Pan)** 支持，支持数据高亮和交互式提示框。
- **👓 3D 可视化**：基于 WebGL 的高性能 3D 柱状图、散点图、曲面图和地球仪展示。
- **🌓 深色/浅色模式**：一键切换针对不同光照环境优化的深浅色主题。
- **🌍 中英双语**：界面全量中文化，支持实时语言切换。
- **💾 灵活的数据 I/O**：
  - **输入**：类 Excel 网格编辑器、JSON/CSV 粘贴、文件拖拽导入，内置 8+ 种常用示例数据。
  - **导出**：支持导出 **PNG, JPG, SVG, WebP** 等多种格式图片，或导出处理后的 JSON/CSV 数据。

### 📊 支持的图表类型

**基础与统计**
- 折线图 (Line)、阶梯线图 (Step Line)
- 柱状图 (Bar)、条形图 (Horizontal Bar)、象形柱图 (Pictorial Bar)
- 饼图 (Pie)、环形图 (Doughnut)
- 散点图 (Scatter)、涟漪散点图 (Effect Scatter)
- 面积图 (Area)、堆叠图 (Stacked)
- 直方图 (Histogram)、箱线图 (Box Plot)

**高级与关系**
- 雷达图 (Radar)、极坐标图 (Polar)、玫瑰图 (Rose)
- 气泡图 (Bubble)
- 热力图 (Heatmap)、日历热力图 (Calendar)
- 树图 (Tree)、矩形树图 (Treemap)、旭日图 (Sunburst)
- 关系图 (Graph)、桑基图 (Sankey)、平行坐标系 (Parallel)
- 主题河流图 (ThemeRiver)

**金融与进度**
- K线图 (Candlestick)、瀑布图 (Waterfall)
- 子弹图 (Bullet)
- 仪表盘 (Gauge)、水球图 (Liquid)
- 漏斗图 (Funnel)
- 进度条/环 (Progress)
- 指标卡 (Metric)、火花线 (Sparkline)、数据表格 (Table)

**3D 可视化 (WebGL)**
- 3D 柱状图 (Bar 3D)
- 3D 散点图 (Scatter 3D)
- 3D 折线图 (Line 3D)
- 3D 曲面图 (Surface 3D)
- 3D 地球仪 (Globe)

**其他**
- 词云图 (Word Cloud)
- 地图 (Map)
- 时间线 (Timeline)

### 🛠️ 使用指南

#### 1. 快速开始
本项目为纯静态 Web 应用，无需复杂的构建过程：

- **最简单方式**：直接双击 `startUp.bat` 文件，会自动启动本地服务器并在浏览器中打开应用。
- **直接打开**：直接双击 `index.html` 在浏览器中运行。
- **本地服务器（手动推荐）**：
  ```bash
  # Python
  python3 -m http.server 8080
  # Node.js
  npx serve .
  ```

#### 2. 操作流程
1.  **导入数据**：粘贴 CSV/JSON 数据，或直接加载预设示例。
2.  **选择图表**：从左侧分类菜单中选择想要的图表类型。
3.  **个性化配置**：使用右侧面板调整颜色、标签样式及图表专属参数。
4.  **导出分享**：将并在导出为高分辨率图片或保存数据。

### 📋 数据格式示例

**标准序列 (折线、柱状、饼图等)**
```json
{
  "labels": ["周一", "周二", "周三", "周四", "周五"],
  "datasets": [
    {
      "label": "销售额",
      "data": [120, 200, 150, 80, 70]
    }
  ]
}
```

**层级数据 (树图、旭日图)**
```json
{
  "name": "根节点",
  "children": [
    {
      "name": "分组 A",
      "value": 100,
      "children": [
        { "name": "子项 A-1", "value": 40 },
        { "name": "子项 A-2", "value": 60 }
      ]
    }
  ]
}
```

**关系数据 (关系图、桑基图)**
```json
{
  "nodes": [{ "name": "节点A" }, { "name": "节点B" }],
  "links": [{ "source": "节点A", "target": "节点B", "value": 5 }]
}
```

## 💻 Tech Stack / 技术栈

- **Core**: HTML5, CSS3, JavaScript (ES6+)
- **Charts**:
  - [Chart.js](https://www.chartjs.org/) (Basic 2D Charts)
  - [ECharts](https://echarts.apache.org/) (Advanced, 3D & GL Charts)
  - [Chart.js Plugin Zoom](https://github.com/chartjs/chartjs-plugin-zoom)
- **Styling**: Native CSS Variables (Theming), Inter Font
- **Icons**: [FontAwesome](https://fontawesome.com/)

## 📄 License

MIT License
