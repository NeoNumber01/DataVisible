/**
 * DataManager - 数据管理模块
 * Handles data input, parsing, validation and storage
 */

class DataManager {
    constructor() {
        this.currentData = null;
        this.dataHistory = [];
        this.maxHistory = 10;

        // Sample datasets
        this.sampleData = {
            sales: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [
                    { label: 'Sales 2024', data: [12000, 19000, 15000, 25000, 22000, 30000, 28000, 35000, 32000, 40000, 38000, 45000] },
                    { label: 'Sales 2023', data: [10000, 15000, 12000, 20000, 18000, 25000, 23000, 28000, 26000, 32000, 30000, 38000] }
                ]
            },
            population: {
                labels: ['0-14', '15-24', '25-34', '35-44', '45-54', '55-64', '65+'],
                datasets: [
                    { label: 'Male', data: [8.5, 6.2, 7.8, 7.2, 6.8, 5.5, 4.2] },
                    { label: 'Female', data: [8.0, 5.8, 7.5, 7.0, 6.5, 5.8, 5.5] }
                ]
            },
            weather: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                    { label: 'Temperature (°C)', data: [22, 25, 28, 26, 24, 27, 30] },
                    { label: 'Humidity (%)', data: [65, 60, 55, 58, 62, 50, 45] }
                ]
            },
            stock: {
                labels: ['09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00'],
                datasets: [
                    { label: 'Stock Price', data: [150.2, 152.5, 151.8, 154.3, 153.6, 155.2, 156.8, 155.5, 157.2, 158.5] }
                ]
            },
            survey: {
                labels: ['Product Quality', 'Customer Service', 'Delivery Speed', 'Price', 'User Experience'],
                datasets: [
                    { label: 'Q1 2024', data: [4.5, 4.2, 3.8, 4.0, 4.3] },
                    { label: 'Q2 2024', data: [4.6, 4.5, 4.0, 3.9, 4.5] }
                ]
            },
            hierarchy: {
                name: 'Company',
                value: 1000,
                children: [
                    {
                        name: 'Engineering',
                        value: 400,
                        children: [
                            { name: 'Frontend', value: 150 },
                            { name: 'Backend', value: 180 },
                            { name: 'DevOps', value: 70 }
                        ]
                    },
                    {
                        name: 'Marketing',
                        value: 250,
                        children: [
                            { name: 'Digital', value: 120 },
                            { name: 'Content', value: 80 },
                            { name: 'SEO', value: 50 }
                        ]
                    },
                    {
                        name: 'Sales',
                        value: 200,
                        children: [
                            { name: 'Direct', value: 120 },
                            { name: 'Partner', value: 80 }
                        ]
                    },
                    {
                        name: 'HR',
                        value: 150,
                        children: [
                            { name: 'Recruiting', value: 80 },
                            { name: 'Training', value: 70 }
                        ]
                    }
                ]
            },
            flow: {
                nodes: [
                    { name: 'Website Visitors' },
                    { name: 'Product Page' },
                    { name: 'Add to Cart' },
                    { name: 'Checkout' },
                    { name: 'Purchase' },
                    { name: 'Bounce' }
                ],
                links: [
                    { source: 0, target: 1, value: 5000 },
                    { source: 0, target: 5, value: 3000 },
                    { source: 1, target: 2, value: 2500 },
                    { source: 1, target: 5, value: 2500 },
                    { source: 2, target: 3, value: 1500 },
                    { source: 2, target: 5, value: 1000 },
                    { source: 3, target: 4, value: 1000 },
                    { source: 3, target: 5, value: 500 }
                ]
            },
            wordfreq: {
                words: [
                    { text: 'JavaScript', weight: 100 },
                    { text: 'Python', weight: 90 },
                    { text: 'React', weight: 85 },
                    { text: 'Node.js', weight: 75 },
                    { text: 'TypeScript', weight: 70 },
                    { text: 'Vue', weight: 65 },
                    { text: 'Angular', weight: 55 },
                    { text: 'HTML', weight: 80 },
                    { text: 'CSS', weight: 78 },
                    { text: 'SQL', weight: 60 },
                    { text: 'Docker', weight: 50 },
                    { text: 'Git', weight: 72 },
                    { text: 'API', weight: 68 },
                    { text: 'Cloud', weight: 55 },
                    { text: 'AI', weight: 88 },
                    { text: 'Machine Learning', weight: 72 },
                    { text: 'Data', weight: 85 },
                    { text: 'Database', weight: 62 },
                    { text: 'DevOps', weight: 45 },
                    { text: 'Agile', weight: 40 }
                ]
            }
        };
    }

    /**
     * Get sample data by key
     */
    getSampleData(key) {
        return this.sampleData[key] || null;
    }

    /**
     * Parse JSON input
     */
    parseJSON(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            this.validateData(data);
            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Parse CSV input
     */
    parseCSV(csvString) {
        try {
            const lines = csvString.trim().split('\n');
            if (lines.length < 2) {
                throw new Error('CSV must have at least a header row and one data row');
            }

            const headers = this.parseCSVLine(lines[0]);
            const datasets = [];

            // First column is labels
            const labels = [];

            // Initialize datasets for each numeric column
            for (let i = 1; i < headers.length; i++) {
                datasets.push({
                    label: headers[i],
                    data: []
                });
            }

            // Parse data rows
            for (let i = 1; i < lines.length; i++) {
                const values = this.parseCSVLine(lines[i]);
                if (values.length > 0) {
                    labels.push(values[0]);
                    for (let j = 1; j < values.length && j <= datasets.length; j++) {
                        const num = parseFloat(values[j]);
                        datasets[j - 1].data.push(isNaN(num) ? 0 : num);
                    }
                }
            }

            const data = { labels, datasets };
            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Parse a single CSV line (handling quoted values)
     */
    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }

        result.push(current.trim());
        return result;
    }

    /**
     * Parse table data from DOM
     */
    parseTableData(tableElement) {
        try {
            const headers = [];
            const headerInputs = tableElement.querySelectorAll('thead input');
            headerInputs.forEach(input => {
                headers.push(input.value.trim());
            });

            const labels = [];
            const datasets = [];

            // Initialize datasets
            for (let i = 1; i < headers.length; i++) {
                datasets.push({
                    label: headers[i],
                    data: []
                });
            }

            // Parse rows
            const rows = tableElement.querySelectorAll('tbody tr');
            rows.forEach(row => {
                const inputs = row.querySelectorAll('td input');
                if (inputs.length > 0) {
                    labels.push(inputs[0].value.trim());
                    for (let i = 1; i < inputs.length && i <= datasets.length; i++) {
                        const num = parseFloat(inputs[i].value);
                        datasets[i - 1].data.push(isNaN(num) ? 0 : num);
                    }
                }
            });

            const data = { labels, datasets };
            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Parse file content
     */
    async parseFile(file) {
        return new Promise((resolve) => {
            const extension = file.name.split('.').pop().toLowerCase();

            // Special handling for Excel files (binary)
            if (extension === 'xlsx' || extension === 'xls') {
                const reader = new FileReader();
                reader.onload = (e) => {
                    resolve(this.parseExcel(e.target.result));
                };
                reader.onerror = () => {
                    resolve({ success: false, error: 'Failed to read file' });
                };
                reader.readAsArrayBuffer(file);
                return;
            }

            // Text-based files
            const reader = new FileReader();

            reader.onload = (e) => {
                const content = e.target.result;

                if (extension === 'json') {
                    resolve(this.parseJSON(content));
                } else if (extension === 'csv') {
                    resolve(this.parseCSV(content));
                } else if (extension === 'tsv') {
                    resolve(this.parseTSV(content));
                } else if (extension === 'xml') {
                    resolve(this.parseXML(content));
                } else if (extension === 'yaml' || extension === 'yml') {
                    resolve(this.parseYAML(content));
                } else if (extension === 'txt') {
                    resolve(this.parseTXT(content));
                } else {
                    resolve({ success: false, error: 'Unsupported file type' });
                }
            };

            reader.onerror = () => {
                resolve({ success: false, error: 'Failed to read file' });
            };

            reader.readAsText(file);
        });
    }

    /**
     * Parse TSV (Tab-Separated Values) content
     */
    parseTSV(tsvString) {
        try {
            const lines = tsvString.trim().split('\n');
            if (lines.length < 2) {
                throw new Error('TSV must have at least a header row and one data row');
            }

            const headers = lines[0].split('\t').map(h => h.trim());
            const datasets = [];
            const labels = [];

            // Initialize datasets for each numeric column
            for (let i = 1; i < headers.length; i++) {
                datasets.push({
                    label: headers[i],
                    data: []
                });
            }

            // Parse data rows
            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split('\t').map(v => v.trim());
                if (values.length > 0) {
                    labels.push(values[0]);
                    for (let j = 1; j < values.length && j <= datasets.length; j++) {
                        const num = parseFloat(values[j]);
                        datasets[j - 1].data.push(isNaN(num) ? 0 : num);
                    }
                }
            }

            const data = { labels, datasets };
            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Parse XML content
     */
    parseXML(xmlString) {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

            // Check for parse errors
            const parseError = xmlDoc.querySelector('parsererror');
            if (parseError) {
                throw new Error('Invalid XML format');
            }

            const labels = [];
            const datasets = [];
            const datasetMap = new Map();

            // Try to find data elements
            const rows = xmlDoc.querySelectorAll('row, record, item, data, entry');

            if (rows.length === 0) {
                // Try parsing direct children of root
                const root = xmlDoc.documentElement;
                const children = root.children;

                for (let i = 0; i < children.length; i++) {
                    const child = children[i];
                    const childChildren = child.children;

                    if (childChildren.length > 0) {
                        // First child is label
                        labels.push(childChildren[0].textContent.trim());

                        // Other children are data values
                        for (let j = 1; j < childChildren.length; j++) {
                            const colName = childChildren[j].tagName;
                            if (!datasetMap.has(colName)) {
                                datasetMap.set(colName, {
                                    label: colName,
                                    data: []
                                });
                            }
                            const num = parseFloat(childChildren[j].textContent);
                            datasetMap.get(colName).data.push(isNaN(num) ? 0 : num);
                        }
                    }
                }
            } else {
                // Parse structured rows
                rows.forEach((row, idx) => {
                    const children = row.children;
                    if (children.length > 0) {
                        labels.push(children[0].textContent.trim());

                        for (let j = 1; j < children.length; j++) {
                            const colName = children[j].tagName;
                            if (!datasetMap.has(colName)) {
                                datasetMap.set(colName, {
                                    label: colName,
                                    data: []
                                });
                            }
                            const num = parseFloat(children[j].textContent);
                            datasetMap.get(colName).data.push(isNaN(num) ? 0 : num);
                        }
                    }
                });
            }

            datasetMap.forEach(ds => datasets.push(ds));

            if (labels.length === 0) {
                throw new Error('No valid data found in XML');
            }

            const data = { labels, datasets };
            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Parse YAML content (simple implementation)
     */
    parseYAML(yamlString) {
        try {
            // Simple YAML parser for chart data format
            const lines = yamlString.trim().split('\n');
            let labels = [];
            const datasets = [];
            let currentDataset = null;
            let inLabels = false;
            let inDatasets = false;
            let inData = false;

            for (let line of lines) {
                const trimmed = line.trim();

                if (trimmed.startsWith('labels:')) {
                    inLabels = true;
                    inDatasets = false;
                    inData = false;
                    // Check for inline array
                    const match = trimmed.match(/labels:\s*\[(.+)\]/);
                    if (match) {
                        labels = match[1].split(',').map(l => l.trim().replace(/['"]/g, ''));
                        inLabels = false;
                    }
                } else if (trimmed.startsWith('datasets:')) {
                    inLabels = false;
                    inDatasets = true;
                    inData = false;
                } else if (inLabels && trimmed.startsWith('-')) {
                    const label = trimmed.substring(1).trim().replace(/['"]/g, '');
                    labels.push(label);
                } else if (inDatasets && trimmed.startsWith('- label:')) {
                    currentDataset = {
                        label: trimmed.split(':')[1].trim().replace(/['"]/g, ''),
                        data: []
                    };
                    datasets.push(currentDataset);
                    inData = false;
                } else if (trimmed.startsWith('label:') && currentDataset) {
                    currentDataset.label = trimmed.split(':')[1].trim().replace(/['"]/g, '');
                } else if (trimmed.startsWith('data:')) {
                    inData = true;
                    // Check for inline array
                    const match = trimmed.match(/data:\s*\[(.+)\]/);
                    if (match && currentDataset) {
                        currentDataset.data = match[1].split(',').map(n => parseFloat(n.trim()) || 0);
                        inData = false;
                    }
                } else if (inData && trimmed.startsWith('-') && currentDataset) {
                    const num = parseFloat(trimmed.substring(1).trim());
                    currentDataset.data.push(isNaN(num) ? 0 : num);
                }
            }

            if (labels.length === 0 || datasets.length === 0) {
                throw new Error('Invalid YAML format. Expected labels and datasets arrays.');
            }

            const data = { labels, datasets };
            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Parse TXT content with auto-detected delimiter
     */
    parseTXT(txtString) {
        try {
            const lines = txtString.trim().split('\n');
            if (lines.length < 2) {
                throw new Error('TXT must have at least a header row and one data row');
            }

            // Detect delimiter
            const firstLine = lines[0];
            let delimiter = ',';
            const delimiters = ['\t', ',', ';', '|', ' '];
            let maxCount = 0;

            for (const d of delimiters) {
                const count = (firstLine.match(new RegExp(d === '\t' ? '\\t' : d, 'g')) || []).length;
                if (count > maxCount) {
                    maxCount = count;
                    delimiter = d;
                }
            }

            // Parse with detected delimiter
            const headers = firstLine.split(delimiter).map(h => h.trim());
            const datasets = [];
            const labels = [];

            for (let i = 1; i < headers.length; i++) {
                datasets.push({
                    label: headers[i],
                    data: []
                });
            }

            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(delimiter).map(v => v.trim());
                if (values.length > 0 && values[0]) {
                    labels.push(values[0]);
                    for (let j = 1; j < values.length && j <= datasets.length; j++) {
                        const num = parseFloat(values[j]);
                        datasets[j - 1].data.push(isNaN(num) ? 0 : num);
                    }
                }
            }

            const data = { labels, datasets };
            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Parse Excel file using SheetJS (if available)
     */
    parseExcel(arrayBuffer) {
        try {
            // Check if XLSX library is available
            if (typeof XLSX === 'undefined') {
                return {
                    success: false,
                    error: 'Excel parsing requires SheetJS library. Please include it or convert to CSV.'
                };
            }

            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];

            // Convert to array of arrays
            const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            if (data.length < 2) {
                throw new Error('Excel file must have at least a header row and one data row');
            }

            const headers = data[0];
            const labels = [];
            const datasets = [];

            // Initialize datasets
            for (let i = 1; i < headers.length; i++) {
                datasets.push({
                    label: headers[i] || `Column ${i}`,
                    data: []
                });
            }

            // Parse data rows
            for (let i = 1; i < data.length; i++) {
                const row = data[i];
                if (row && row.length > 0) {
                    labels.push(String(row[0] || ''));
                    for (let j = 1; j < row.length && j <= datasets.length; j++) {
                        const num = parseFloat(row[j]);
                        datasets[j - 1].data.push(isNaN(num) ? 0 : num);
                    }
                }
            }

            return { success: true, data: { labels, datasets } };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Validate data structure
     */
    validateData(data) {
        if (!data) {
            throw new Error('Data is empty');
        }

        // Check for standard chart data format
        if (data.labels && data.datasets) {
            if (!Array.isArray(data.labels)) {
                throw new Error('Labels must be an array');
            }
            if (!Array.isArray(data.datasets)) {
                throw new Error('Datasets must be an array');
            }
            data.datasets.forEach((ds, i) => {
                if (!ds.data || !Array.isArray(ds.data)) {
                    throw new Error(`Dataset ${i + 1} must have a data array`);
                }
            });
        }
        // For hierarchical data (treemap, sunburst)
        else if (data.name !== undefined && data.children) {
            // Valid hierarchical structure
        }
        // For flow data (sankey)
        else if (data.nodes && data.links) {
            // Valid flow structure
        }
        // For word cloud
        else if (data.words) {
            // Valid word cloud structure
        }
        else {
            throw new Error('Invalid data format');
        }

        return true;
    }

    /**
     * Set current data
     */
    setData(data) {
        // Save to history
        if (this.currentData) {
            this.dataHistory.unshift(this.currentData);
            if (this.dataHistory.length > this.maxHistory) {
                this.dataHistory.pop();
            }
        }

        this.currentData = JSON.parse(JSON.stringify(data));
        return this.currentData;
    }

    /**
     * Get current data
     */
    getData() {
        return this.currentData;
    }

    /**
     * Export data as JSON
     */
    exportJSON() {
        if (!this.currentData) return null;
        return JSON.stringify(this.currentData, null, 2);
    }

    /**
     * Export data as CSV
     */
    exportCSV() {
        if (!this.currentData || !this.currentData.labels) return null;

        const data = this.currentData;
        let csv = '';

        // Header row
        const headers = ['Category'];
        data.datasets.forEach(ds => headers.push(ds.label || 'Data'));
        csv += headers.join(',') + '\n';

        // Data rows
        for (let i = 0; i < data.labels.length; i++) {
            const row = [data.labels[i]];
            data.datasets.forEach(ds => {
                row.push(ds.data[i] !== undefined ? ds.data[i] : '');
            });
            csv += row.join(',') + '\n';
        }

        return csv;
    }

    /**
     * Get default data for initial display
     */
    getDefaultData() {
        return {
            labels: ['A', 'B', 'C', 'D', 'E'],
            datasets: [
                { label: 'Series 1', data: [30, 50, 40, 70, 25] },
                { label: 'Series 2', data: [45, 35, 60, 25, 55] }
            ]
        };
    }

    /**
     * Parse clipboard data (from pasted text)
     * 解析剪贴板数据
     */
    parseClipboard(text) {
        // Try to detect format
        text = text.trim();

        // Check if it's JSON
        if (text.startsWith('{') || text.startsWith('[')) {
            return this.parseJSON(text);
        }

        // Check if it's Markdown table
        if (text.includes('|') && text.includes('---')) {
            return this.parseMarkdownTable(text);
        }

        // Check if it's HTML table
        if (text.includes('<table') || text.includes('<tr')) {
            return this.parseHTMLTable(text);
        }

        // Check if it's TSV (tab-separated)
        if (text.includes('\t')) {
            return this.parseTSV(text);
        }

        // Fall back to CSV
        return this.parseCSV(text);
    }

    /**
     * Parse Markdown table format
     * 解析 Markdown 表格
     */
    parseMarkdownTable(mdString) {
        try {
            const lines = mdString.trim().split('\n')
                .filter(line => line.trim() && !line.match(/^\|?\s*[-:]+\s*\|/));

            if (lines.length < 2) {
                throw new Error('Markdown table must have at least header and one data row');
            }

            const parseRow = (line) => {
                return line.split('|')
                    .map(cell => cell.trim())
                    .filter(cell => cell !== '');
            };

            const headers = parseRow(lines[0]);
            const labels = [];
            const datasets = [];

            // Initialize datasets
            for (let i = 1; i < headers.length; i++) {
                datasets.push({
                    label: headers[i],
                    data: []
                });
            }

            // Parse data rows
            for (let i = 1; i < lines.length; i++) {
                const cells = parseRow(lines[i]);
                if (cells.length > 0) {
                    labels.push(cells[0]);
                    for (let j = 1; j < cells.length && j <= datasets.length; j++) {
                        const num = parseFloat(cells[j].replace(/[,$%]/g, ''));
                        datasets[j - 1].data.push(isNaN(num) ? 0 : num);
                    }
                }
            }

            return { success: true, data: { labels, datasets } };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Parse HTML table format
     * 解析 HTML 表格
     */
    parseHTMLTable(htmlString) {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlString, 'text/html');
            const table = doc.querySelector('table');

            if (!table) {
                throw new Error('No table found in HTML');
            }

            const rows = table.querySelectorAll('tr');
            if (rows.length < 2) {
                throw new Error('Table must have at least header and one data row');
            }

            // Get headers
            const headerCells = rows[0].querySelectorAll('th, td');
            const headers = Array.from(headerCells).map(cell => cell.textContent.trim());

            const labels = [];
            const datasets = [];

            // Initialize datasets
            for (let i = 1; i < headers.length; i++) {
                datasets.push({
                    label: headers[i],
                    data: []
                });
            }

            // Parse data rows
            for (let i = 1; i < rows.length; i++) {
                const cells = rows[i].querySelectorAll('td');
                if (cells.length > 0) {
                    labels.push(cells[0].textContent.trim());
                    for (let j = 1; j < cells.length && j <= datasets.length; j++) {
                        const text = cells[j].textContent.trim().replace(/[,$%]/g, '');
                        const num = parseFloat(text);
                        datasets[j - 1].data.push(isNaN(num) ? 0 : num);
                    }
                }
            }

            return { success: true, data: { labels, datasets } };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Fetch data from URL
     * 从 URL 获取数据
     */
    async fetchFromURL(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const contentType = response.headers.get('content-type') || '';
            const text = await response.text();

            if (contentType.includes('json') || url.endsWith('.json')) {
                return this.parseJSON(text);
            } else if (url.endsWith('.csv')) {
                return this.parseCSV(text);
            } else if (url.endsWith('.tsv')) {
                return this.parseTSV(text);
            } else if (url.endsWith('.xml')) {
                return this.parseXML(text);
            } else {
                // Try to auto-detect
                return this.parseClipboard(text);
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Parse SQL result format (tab/space separated with column headers)
     * 解析 SQL 查询结果
     */
    parseSQLResult(sqlString) {
        try {
            const lines = sqlString.trim().split('\n').filter(l => l.trim());
            if (lines.length < 2) {
                throw new Error('SQL result must have at least header and one data row');
            }

            // Detect separator (multiple spaces or tabs)
            const separator = lines[0].includes('\t') ? '\t' : /\s{2,}/;

            const headers = lines[0].split(separator).map(h => h.trim()).filter(h => h);
            const labels = [];
            const datasets = [];

            for (let i = 1; i < headers.length; i++) {
                datasets.push({
                    label: headers[i],
                    data: []
                });
            }

            // Skip separator line if present (e.g., +----+----+)
            const startRow = lines[1].match(/^[\+\-\|]+$/) ? 2 : 1;

            for (let i = startRow; i < lines.length; i++) {
                if (lines[i].match(/^[\+\-\|]+$/)) continue; // Skip separator lines

                const cells = lines[i].split(separator).map(c => c.trim()).filter(c => c && c !== '|');
                if (cells.length > 0) {
                    labels.push(cells[0]);
                    for (let j = 1; j < cells.length && j <= datasets.length; j++) {
                        const num = parseFloat(cells[j].replace(/[,$%]/g, ''));
                        datasets[j - 1].data.push(isNaN(num) ? 0 : num);
                    }
                }
            }

            return { success: true, data: { labels, datasets } };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Export data as Excel using SheetJS
     * 导出为 Excel
     */
    exportExcel(filename = 'chart-data.xlsx') {
        if (!this.currentData || !this.currentData.labels) {
            return { success: false, error: 'No data to export' };
        }

        if (typeof XLSX === 'undefined') {
            return { success: false, error: 'SheetJS library not loaded' };
        }

        try {
            const data = this.currentData;
            const rows = [];

            // Header row
            const headers = ['Category'];
            data.datasets.forEach(ds => headers.push(ds.label || 'Data'));
            rows.push(headers);

            // Data rows
            for (let i = 0; i < data.labels.length; i++) {
                const row = [data.labels[i]];
                data.datasets.forEach(ds => {
                    row.push(ds.data[i] !== undefined ? ds.data[i] : '');
                });
                rows.push(row);
            }

            const ws = XLSX.utils.aoa_to_sheet(rows);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Chart Data');

            XLSX.writeFile(wb, filename);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Export data as TSV
     * 导出为 TSV
     */
    exportTSV() {
        if (!this.currentData || !this.currentData.labels) return null;

        const data = this.currentData;
        let tsv = '';

        // Header row
        const headers = ['Category'];
        data.datasets.forEach(ds => headers.push(ds.label || 'Data'));
        tsv += headers.join('\t') + '\n';

        // Data rows
        for (let i = 0; i < data.labels.length; i++) {
            const row = [data.labels[i]];
            data.datasets.forEach(ds => {
                row.push(ds.data[i] !== undefined ? ds.data[i] : '');
            });
            tsv += row.join('\t') + '\n';
        }

        return tsv;
    }

    /**
     * Export data as Markdown table
     * 导出为 Markdown 表格
     */
    exportMarkdown() {
        if (!this.currentData || !this.currentData.labels) return null;

        const data = this.currentData;
        let md = '';

        // Header row
        const headers = ['Category'];
        data.datasets.forEach(ds => headers.push(ds.label || 'Data'));
        md += '| ' + headers.join(' | ') + ' |\n';

        // Separator
        md += '| ' + headers.map(() => '---').join(' | ') + ' |\n';

        // Data rows
        for (let i = 0; i < data.labels.length; i++) {
            const row = [data.labels[i]];
            data.datasets.forEach(ds => {
                row.push(ds.data[i] !== undefined ? ds.data[i] : '');
            });
            md += '| ' + row.join(' | ') + ' |\n';
        }

        return md;
    }

    /**
     * Download file helper
     * 下载文件辅助方法
     */
    downloadFile(content, filename, type = 'text/plain') {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Export for use in other modules
window.DataManager = DataManager;

