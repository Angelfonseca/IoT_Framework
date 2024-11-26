import React, { useEffect, useState, useRef } from 'react';
import apiService from '../services/api.service';
import { useNavigate } from 'react-router-dom';  // Hook para redirigir
import '../assets/css/componentsCss/detailsIot.css';

interface DeviceDetailProps {
    deviceId: string | null;
    onClose: () => void;
}

interface DeviceDetail {
    _id: string;
    name: string;
    type: string;
    description: string;
}

const DeviceDetail: React.FC<DeviceDetailProps> = ({ deviceId, onClose }) => {
    const [deviceDetail, setDeviceDetail] = useState<DeviceDetail | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDeviceDetail = async () => {
            if (deviceId) {
                try {
                    const response = await apiService.get<DeviceDetail>(`/devices/byid/${deviceId}`);
                    setDeviceDetail(response);
                } catch (error) {
                    console.error('Error fetching device detail:', error);
                }
            }
        };

        fetchDeviceDetail();
    }, [deviceId]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    if (!deviceDetail) return <div>Cargando detalles...</div>;

    return (
        <>
            <div className="modal-backdrop" onClick={onClose}></div>
            <div className="device-detail-modal" ref={modalRef}>
                <h2>Detalles del Dispositivo</h2>
                <p><strong>Nombre:</strong> {deviceDetail.name}</p>
                <p><strong>Tipo:</strong> {deviceDetail.type}</p>
                <p><strong>Descripción:</strong> {deviceDetail.description}</p>
                <button
                    className='redirect-btn'
                    onClick={() => navigate(`/monitorizacion/${deviceId}`)}  // Asegúrate de pasar el ID correcto
                >
                    Ir a dispositivo
                </button>
                <button className="close-btn" onClick={onClose}>Cerrar</button>
            </div>
        </>
    );
};

export default DeviceDetail;
