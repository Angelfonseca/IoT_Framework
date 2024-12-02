import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface DataPoint {
    date: string; // Atributo de fecha
    values: { name: string; value: number }[]; // Arreglo de valores
}

interface AggregatedData {
    date: string;
    name: string;
    avg: number;
    min: number;
    max: number;
    minDate: string;
    maxDate: string;
}

interface ChartProps {
    title: string;
    datos: DataPoint[];
    chartType: 'bar' | 'line' | 'scatter';
    selectedFields: string[];
    groupBy: string;
}

const Chart: React.FC<ChartProps> = ({ title, datos, chartType, groupBy }) => {
    const chartRef = useRef<HTMLDivElement>(null);

    const groupDataBy = (data: DataPoint[], groupBy: string): DataPoint[] => {
        // Implementar la lógica de agrupación según el valor de groupBy
        // Por ejemplo, agrupar por día, 3 días, 5 días, 7 días, 15 días, 1 mes
        const groupedData: { [key: string]: DataPoint } = {};

        data.forEach((entry) => {
            const date = new Date(entry.date);
            let groupKey = '';

            switch (groupBy) {
                case 'day':
                    groupKey = date.toISOString().split('T')[0];
                    break;
                case '3days':
                    groupKey = `${date.getFullYear()}-${date.getMonth() + 1}-${Math.floor(date.getDate() / 3) * 3}`;
                    break;
                case '5days':
                    groupKey = `${date.getFullYear()}-${date.getMonth() + 1}-${Math.floor(date.getDate() / 5) * 5}`;
                    break;
                case '7days':
                    groupKey = `${date.getFullYear()}-${date.getMonth() + 1}-${Math.floor(date.getDate() / 7) * 7}`;
                    break;
                case '15days':
                    groupKey = `${date.getFullYear()}-${date.getMonth() + 1}-${Math.floor(date.getDate() / 15) * 15}`;
                    break;
                case '1month':
                    groupKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
                    break;
                default:
                    groupKey = date.toISOString().split('T')[0];
            }

            if (!groupedData[groupKey]) {
                groupedData[groupKey] = { date: groupKey, values: [] };
            }

            entry.values.forEach((value) => {
                const existingValue = groupedData[groupKey].values.find((v) => v.name === value.name);
                if (existingValue) {
                    existingValue.value += value.value;
                } else {
                    groupedData[groupKey].values.push({ ...value });
                }
            });
        });

        return Object.values(groupedData);
    };

    const processGroupedData = (data: DataPoint[]): AggregatedData[] => {
        const grouped: { [key: string]: { date: string; value: number }[] } = {};
    
        data.forEach((entry) => {
            entry.values.forEach((value) => {
                if (!grouped[value.name]) {
                    grouped[value.name] = [];
                }
                grouped[value.name].push({
                    date: entry.date,
                    value: value.value,
                });
            });
        });
    
        const aggregated: AggregatedData[] = [];
        Object.entries(grouped).forEach(([name, entries]) => {
            const values = entries.map((e) => e.value);
            const dates = entries.map((e) => e.date);
            const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
            const min = Math.min(...values);
            const max = Math.max(...values);
            const minDate = dates[values.indexOf(min)];
            const maxDate = dates[values.indexOf(max)];
    
            aggregated.push({
                date: entries[0].date,
                name,
                avg,
                min,
                max,
                minDate,
                maxDate,
            });
        });
    
        return aggregated;
    };

    useEffect(() => {
        const chart = echarts.init(chartRef.current as HTMLDivElement);

        const groupedData = groupDataBy(datos, groupBy);
        const aggregatedData = processGroupedData(groupedData);

        const uniqueDates = Array.from(new Set(groupedData.map((d) => d.date))).map((date) =>
            new Date(date).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            })
        );
        const selectedFields = groupedData[0].values.map((v) => v.name);
        const series = selectedFields.map((field) => {
            return {
                name: field,
                type: chartType,
                data: aggregatedData.filter((d) => d.name === field).map((d) => d.avg),
                lineStyle: {
                    type: 'solid',
                },
            };
        });

        const options = {
            title: {
                text: title,
                name: title,
            },
            tooltip: {
                trigger: 'axis',
                formatter: (params: any[]) => {
                    const tooltipData = params.map((p) => {
                        const dataIndex = p.dataIndex;
                        const seriesName = p.seriesName;
                        const aggregated = aggregatedData.find(
                            (d) => d.name === seriesName && d.date === groupedData[dataIndex].date
                        );

                        return `
                            <b>${seriesName}</b><br />
                            Promedio: ${aggregated?.avg.toFixed(2)}<br />
                            Mínimo: ${aggregated?.min}<br />
                            Máximo: ${aggregated?.max}<br />
                            Fecha: ${new Date(aggregated?.date || '').toLocaleString('es-ES', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        `;
                    });

                    return tooltipData.join('<br />');
                },
                position: (point: number[], params: any, dom: any, rect: any, size: any) => {
                    const [x, y] = point;
                    const { viewSize, contentSize } = size;
                    const xPos = x + contentSize[0] > viewSize[0] ? x - contentSize[0] : x;
                    const yPos = y + contentSize[1] > viewSize[1] ? y - contentSize[1] : y;
                    return [xPos, yPos];
                },
                extraCssText: 'max-width: 350px; word-wrap: break-word; overflow: visible;',
                showDelay: 0,
                hideDelay: 100,
            },
            legend: {
                data: [...new Set(aggregatedData.map((d) => d.name))],
            },
            xAxis: {
                type: 'category',
                data: uniqueDates,
            },
            yAxis: {
                type: 'value',
            },
            series,
        };

        chart.setOption(options);

        return () => {
            chart.dispose();
        };
    }, [title, datos, chartType, groupBy]);

    return <div ref={chartRef} style={{ width: '600px', height: '400px' }} />;
};

export default Chart;
