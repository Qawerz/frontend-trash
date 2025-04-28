class LineChart {
    constructor(parentElement, options = {}) {
        if (!parentElement || !(parentElement instanceof HTMLElement)) {
            throw new Error("parentElement должен быть валидным DOM-элементом.");
        }
        if (!options.settings || !Array.isArray(options.charts)) {
            throw new Error("options должны содержать settings и charts.");
        }

        this.parent = parentElement;
        this.options = this._applyDefaultOptions(options);
        this.charts = this.options.charts;

        this.svgWidth = this.options.settings.width;
        this.svgHeight = this.options.settings.height;
        this.padding = 30; // внутренний отступ графика
        this.legendHeight = 40;

        this._createSvg();
        this._drawGrid();
        this._drawCharts();
        this._drawLegend();
    }

    _applyDefaultOptions(options) {
        return {
            settings: {
                width: options.settings.width || 400,
                height: options.settings.height || 200,
                background: options.settings.background || "#ffffff"
            },
            charts: options.charts || []
        };
    }

    _createSvg() {
        this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.svg.setAttribute("width", this.svgWidth);
        this.svg.setAttribute("height", this.svgHeight + this.legendHeight);
        this.svg.style.background = this.options.settings.background;
        this.svg.style.display = "block";

        this.gridGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.gridGroup.setAttribute("id", "grid");
        this.svg.appendChild(this.gridGroup);

        this.linesGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.linesGroup.setAttribute("id", "lines");
        this.svg.appendChild(this.linesGroup);

        this.legendGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.legendGroup.setAttribute("id", "legend");
        this.svg.appendChild(this.legendGroup);

        this.parent.appendChild(this.svg);
    }

    _drawGrid() {
        let gridLines = 5;
        for (let i = 0; i <= gridLines; i++) {
            let y = this.padding + ((this.svgHeight - this.padding * 2) / gridLines) * i;
            let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", this.padding);
            line.setAttribute("y1", y);
            line.setAttribute("x2", this.svgWidth - this.padding);
            line.setAttribute("y2", y);
            line.setAttribute("stroke", "#444");
            line.setAttribute("stroke-width", "1");
            this.gridGroup.appendChild(line);
        }
    }

    _drawCharts() {
        let globalData = this.charts.flatMap(chart => chart.dataArray);
        let daMax = Math.max(...globalData) + 10;
        let daMin = Math.min(...globalData) - 10;

        this.scaleY = (this.svgHeight - this.padding * 2) / (daMax - daMin);
        this.scaleX = (this.svgWidth - this.padding * 2) / (Math.max(...this.charts.map(c => c.dataArray.length)));

        this.charts.forEach(chart => {
            let dataArray = chart.dataArray;
            let color = chart.color || "#ffffff";

            let pathData = "";
            dataArray.forEach((value, index) => {
                let x = this.padding + index * this.scaleX;
                let y = this.svgHeight - this.padding - (value - daMin) * this.scaleY;

                if (index === 0) {
                    pathData += `M ${x} ${y} `;
                } else {
                    pathData += `L ${x} ${y} `;
                }
            });

            let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", pathData.trim());
            path.setAttribute("fill", "none");
            path.setAttribute("stroke", color);
            path.setAttribute("stroke-width", "2");
            path.setAttribute("stroke-linejoin", "round")
            this.linesGroup.appendChild(path);
        });
    }

    _drawLegend() {
        let itemWidth = this.svgWidth / this.charts.length;

        this.charts.forEach((chart, index) => {
            let group = document.createElementNS("http://www.w3.org/2000/svg", "g");
            let x = itemWidth * index + itemWidth / 4;
            let y = this.svgHeight + 10;

            // Цветной квадратик
            let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect.setAttribute("x", x);
            rect.setAttribute("y", y);
            rect.setAttribute("width", 10);
            rect.setAttribute("height", 10);
            rect.setAttribute("fill", chart.color || "#ffffff");
            group.appendChild(rect);

            // Текст
            let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", x + 15);
            text.setAttribute("y", y + 10);
            text.setAttribute("fill", this.options.settings.color);
            text.setAttribute("font-size", "12");
            text.textContent = chart.title || "Без имени";
            group.appendChild(text);

            this.legendGroup.appendChild(group);
        });
    }
}

// Использование:
const container = document.querySelector('#svg1');

let sina = []
for (let index = 0; index < 100; index++) {
    sina.push(Math.sin(index))
    
}

let sina2 = []
for (let index = 0; index <100; index++) {
    sina2.push(Math.sin(index) * 6)
    
}
const options = {
    settings: {
        width: 500,
        height: 250,
        background: "white",
        color: "black"
    },
    charts: [
        {
            title: "sin",
            dataArray: sina,
            color: "#ff0000"
        },
        {
            title: "sin*6",
            dataArray: sina2,
            color: "#00f"
        },
    ]
};

const myLineChart = new LineChart(container, options);

class BarChart {
    constructor(parentElement, dataArray, width, height) {
        if (!parentElement || !(parentElement instanceof HTMLElement)) {
            throw new Error("parentElement должен быть валидным DOM-элементом.");
        }
        if (!Array.isArray(dataArray) || dataArray.length === 0) {
            throw new Error("dataArray должен быть непустым массивом чисел.");
        }

        this.parent = parentElement;
        this.data = dataArray;

        this.svgWidth = width
        this.svgHeight = height

        this.daMax = Math.max(...this.data) + 10;
        this.daMin = Math.min(...this.data) > 0 ? 0 : Math.min(...this.data) - 10; // чтобы ноль был видим
        this.scaleY = this.svgHeight / (this.daMax - this.daMin);

        this.barWidth = this.svgWidth / this.data.length * 0.6; // ширина столбика
        this.barSpacing = (this.svgWidth / this.data.length) * 0.4; // расстояние между столбиками

        this._createSvg();
        this._drawGrid();
        this._drawBars();
    }

    _createSvg() {
        this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.svg.setAttribute("width", this.svgWidth);
        this.svg.setAttribute("height", this.svgHeight);
        this.svg.style.background = "white";

        this.gridGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.gridGroup.setAttribute("id", "grid");
        this.svg.appendChild(this.gridGroup);

        this.barsGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.barsGroup.setAttribute("id", "bars");
        this.svg.appendChild(this.barsGroup);

        this.parent.appendChild(this.svg);
    }

    _drawGrid() {
        // Вертикальные линии
        let xDivisions = this.data.length;
        for (let i = 0; i < xDivisions; i++) {
            let x = (this.svgWidth / xDivisions) * i;
            let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", x);
            line.setAttribute("y1", 0);
            line.setAttribute("x2", x);
            line.setAttribute("y2", this.svgHeight);
            line.setAttribute("stroke", "#ccc");
            line.setAttribute("stroke-width", "1");
            this.gridGroup.appendChild(line);
        }

        // Горизонтальные линии
        let yDivisions = 5;
        for (let i = 0; i <= yDivisions; i++) {
            let y = (this.svgHeight / yDivisions) * i;
            let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", 0);
            line.setAttribute("y1", y);
            line.setAttribute("x2", this.svgWidth);
            line.setAttribute("y2", y);
            line.setAttribute("stroke", "#ccc");
            line.setAttribute("stroke-width", "1");
            this.gridGroup.appendChild(line);
        }
    }

    _drawBars() {
        this.data.forEach((number, index) => {
            const x = index * (this.barWidth + this.barSpacing);
            const height = Math.abs(number) * this.scaleY;
            const y = number >= 0 
                ? this.svgHeight - (number - this.daMin) * this.scaleY 
                : this.svgHeight - (0 - this.daMin) * this.scaleY;

            const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect.setAttribute("x", x + this.barSpacing / 2);
            rect.setAttribute("y", number >= 0 ? y : y); 
            rect.setAttribute("width", this.barWidth);
            rect.setAttribute("height", height);
            rect.setAttribute("fill", number >= 0 ? "steelblue" : "tomato");

            this.barsGroup.appendChild(rect);
        });
    }
}

// Использование:
const container2 = document.querySelector('#svg2');
const dataArray2 = [10, 20, 40, 20, 30, -40, 11, 5, 42, 22, 10];

const myBarChart = new BarChart(container2, dataArray2, 400, 200);


class PieChart {
    constructor(parentElement, dataArray, width, height) {
        if (!parentElement || !(parentElement instanceof HTMLElement)) {
            throw new Error("parentElement должен быть валидным DOM-элементом.");
        }
        if (!Array.isArray(dataArray) || dataArray.length === 0) {
            throw new Error("dataArray должен быть непустым массивом чисел.");
        }

        this.parent = parentElement;
        this.data = dataArray;
        this.total = this.data.reduce((sum, val) => sum + Math.abs(val), 0);

        this.svgWidth = width;
        this.svgHeight = height;
        this.radius = Math.min(this.svgWidth, this.svgHeight) / 2 - 10;

        this.colors = [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', 
            '#FF9F40', '#E7E9ED', '#8E44AD', '#2ECC71', '#3498DB'
        ];

        this._createSvg();
        this._drawPie();
    }

    _createSvg() {
        this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.svg.setAttribute("width", this.svgWidth);
        this.svg.setAttribute("height", this.svgHeight);
        this.svg.style.background = "white";

        this.pieGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.pieGroup.setAttribute("transform", `translate(${this.svgWidth/2}, ${this.svgHeight/2})`);
        this.svg.appendChild(this.pieGroup);

        this.parent.appendChild(this.svg);
    }

    _polarToCartesian(centerX, centerY, radius, angleInDegrees) {
        const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    }

    _describeArc(x, y, radius, startAngle, endAngle) {
        const start = this._polarToCartesian(x, y, radius, endAngle);
        const end = this._polarToCartesian(x, y, radius, startAngle);

        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

        const d = [
            "M", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
            "L", x, y,
            "Z"
        ].join(" ");

        return d;
    }

    _drawPie() {
        let startAngle = 0;

        this.data.forEach((value, index) => {
            const sliceAngle = (Math.abs(value) / this.total) * 360;
            const endAngle = startAngle + sliceAngle;

            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", this._describeArc(0, 0, this.radius, startAngle, endAngle));
            path.setAttribute("fill", this.colors[index % this.colors.length]);
            path.setAttribute("stroke", "#ffffff");
            path.setAttribute("stroke-width", "2");

            this.pieGroup.appendChild(path);

            startAngle += sliceAngle;
        });
    }
}

// Использование:
const container3 = document.querySelector('#svg3');
const dataArray3 = [150, 300, 220];

const myPieChart = new PieChart(container3, dataArray3, 200, 200);

