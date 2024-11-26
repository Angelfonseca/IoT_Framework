// FilterList.tsx
import React, { useEffect, useState } from 'react';
import { Filter } from '../types';
import apiService from '../services/api.service';
import '../assets/css/componentsCss/filterList.css';

const FilterList: React.FC = () => {
    const [filters, setFilters] = useState<Filter[]>([]);

    useEffect(() => {
        const fetchFilters = async () => {
            const data = await apiService.get<Filter[]>('/filters/getall');
            setFilters(data);
        };
        fetchFilters();
    }, []);

    const handleDelete = async (id: string) => {
        await apiService.delete(`/filters/${id}`);
        setFilters(filters.filter(filter => filter._id !== _id));
    };

    return (
        <div>
            <h3>Gestionar Filtros</h3>
            <table>
                <thead>
                    <tr>
                        <th>Dispositivo</th>
                        <th>Modulo</th>
                        <th>Campo</th>
                        <th>Condiciónes</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filters.map((filter) => (
                        <tr key={filter._id}>
                            <td>{filter.device}</td>
                            <td>{filter.module}</td>
                            <td>{filter.field}</td>
                            <td>
                                {filter.conditions.map((cond, i) => (
                                    <div key={i}>
                                        Condition: {cond.condition}, Threshold: {cond.threshold}
                                    </div>
                                ))}
                            </td>
                            <td>
                                <button onClick={() => handleDelete(filter._id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FilterList;
