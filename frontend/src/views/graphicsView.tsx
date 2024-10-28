import React from 'react';
import ReactDOM from 'react-dom';
import Chart from '../components/graficas'; // Asegúrate de que la ruta sea correcta

const graficas = () => {
    const data = [
        {
            date: '2023-10-01',
            values: [
                { name: 'Atributo 1', value: 120 },
                { name: 'Atributo 2', value: 200 },
                { name: 'Atributo 3', value: 150 },
                { name: 'Atributo 4', value: 180 },
                // Agrega más atributos...
            ],
        },
        {
            date: '2023-10-02',
            values: [
                { name: 'Atributo 1', value: 180 },
                { name: 'Atributo 2', value: 230 },
                { name: 'Atributo 3', value: 170 },
                { name: 'Atributo 4', value: 210 },
            ],
        },
        // Agrega más datos para las semanas siguientes...
    ];

    return (
        <div>
            <h1>Gráfico de Múltiples Atributos</h1>
            <Chart title="Gráfico de Atributos por Fecha" datos={data} chartType="pie" />
        </div>
    );
};

export default graficas;