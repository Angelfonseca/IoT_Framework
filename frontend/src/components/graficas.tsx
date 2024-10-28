import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface DataPoint {
    date: string; // Atributo de fecha
    values: { name: string; value: number }[]; // Arreglo de valores
}

interface ChartProps {
    title: string;
    datos: DataPoint[];
    chartType: 'bar' | 'line' | 'pie' | 'scatter';
}

const Chart: React.FC<ChartProps> = ({ title, datos, chartType }) => {
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const chart = echarts.init(chartRef.current as HTMLDivElement);

        const series = datos[0].values.map((value) => ({
            name: value.name,
            type: chartType,
            data: datos.map((d) => {
                const foundValue = d.values.find((v) => v.name === value.name);
                return foundValue ? foundValue.value : null;
            }),
        }));

        const options = {
            title: {
                text: title,
            },
            tooltip: {},
            xAxis: {
                type: 'category',
                data: datos.map((d) => d.date), // Usar fechas para el eje X
            },
            yAxis: {},
            series,
        };

        chart.setOption(options);

        return () => {
            chart.dispose();
        };
    }, [title, datos, chartType]);

    return <div ref={chartRef} style={{ width: '400px', height: '300px' }} />;
};

export default Chart;