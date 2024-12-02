import React, { useEffect, useState, useRef } from 'react';
import apiService from '../services/api.service';
import { useNavigate } from 'react-router-dom';
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDeviceDetail = async () => {
            if (deviceId) {
                try {
                    const response = await apiService.get<DeviceDetail>(`/devices/byid/${deviceId}`);
                    setDeviceDetail(response);
                    setError(null);
                } catch (error) {
                    console.error('Error fetching device detail:', error);
                    setError('No se pudo obtener la información del dispositivo.');
                } finally {
                    setLoading(false);
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

    const handleDelete = async () => {
        if (!deviceId) return;
        try {
            await apiService.delete(`/devices/delete/${deviceId}`);
            alert('Dispositivo eliminado correctamente.');
            onClose();
            window.location.reload();
        } catch (error) {
            console.error('Error deleting device:', error);
            alert('No se pudo eliminar el dispositivo. Intente nuevamente.');
        }
    };

    if (loading) return <div>Cargando detalles...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <div className="modal-backdrop" onClick={onClose}></div>
            <div className="device-detail-modal" ref={modalRef}>
                <h2>Detalles del Dispositivo</h2>
                {deviceDetail && (
                    <>
                        <p><strong>Nombre:</strong> {deviceDetail.name}</p>
                        <p><strong>Tipo:</strong> {deviceDetail.type}</p>
                        <p><strong>Descripción:</strong> {deviceDetail.description}</p>
                        <div className="button-container">
                            <button
                                className="redirect-btn"
                                onClick={() => navigate(`/monitorizacion/${deviceId}`)}
                            >
                                Ir a dispositivo
                            </button>
                            <button
                                className="delete-btn"
                                onClick={handleDelete}
                            >
                                Borrar dispositivo
                            </button>
                        </div>
                    </>
                )}
                <button className="close-btn" onClick={onClose}>Cerrar</button>
            </div>
        </>
    );
};

export default DeviceDetail;