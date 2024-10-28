import React, { useEffect, useState } from 'react';
import apiService from '../services/api.service';
import DeviceDetail from '../components/detailsDevice';
import deviceImage from '../assets/iotPic.png';
import '../assets/css/viewsCss/monitorizacionView.css';

interface Device {
    _id: string;
    name: string;
    type: string;
    description: string;
}

const MonitoreoView: React.FC = () => {
    const [devices, setDevices] = useState<Device[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [newDevice, setNewDevice] = useState({ name: '', type: '', description: '' });

    useEffect(() => {
        const fetchDevices = async () => {
            try {
                const response = await apiService.get<Device[]>('/devices');
                setDevices(response);
            } catch (error) {
                console.error('Error fetching devices:', error);
            }
        };

        fetchDevices();
    }, []);

    const handleDeviceClick = (id: string) => {
        setSelectedDeviceId(prevId => (prevId === id ? null : id));
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setNewDevice({ name: '', type: '', description: '' });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewDevice(prevState => ({ ...prevState, [name]: value }));
    };

    const handleCreateDevice = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await apiService.post('/devices', newDevice);
            alert('Dispositivo creado exitosamente');
            closeModal();
            const response = await apiService.get<Device[]>('/devices');
            setDevices(response);
        } catch (error) {
            console.error('Error creando dispositivo:', error);
        }
    };

    return (
        <div className="monitoring-view">
            <h1>Monitoreo</h1>
            <button 
                onClick={openModal} 
                className="create-device-button">
                Crear dispositivo
            </button>
            <ul className="device-list">
                {devices.map(device => (
                    <div
                        key={device._id}
                        onClick={() => handleDeviceClick(device._id)}
                        className={`IOT_Container ${selectedDeviceId === device._id ? 'active' : ''}`}
                    >
                        <img className="device-image" src={deviceImage} alt="Device" />
                        <p>{device.name}</p>
                    </div>
                ))}
            </ul>
            {selectedDeviceId && (
                <DeviceDetail deviceId={selectedDeviceId} onClose={() => setSelectedDeviceId(null)} />
            )}

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Crear dispositivo</h2>
                        <form onSubmit={handleCreateDevice}>
                            <label>
                                Nombre:
                                <input type="text" name="name" value={newDevice.name} onChange={handleInputChange} required />
                            </label>
                            <label>
                                Tipo:
                                <input type="text" name="type" value={newDevice.type} onChange={handleInputChange} required />
                            </label>
                            <label>
                                Descripción:
                                <input type="text" name="description" value={newDevice.description} onChange={handleInputChange} required />
                            </label>
                            <div className="modal-buttons">
                                <button type="submit" className="modal-button confirm">
                                    Crear dispositivo
                                </button>
                                <button type="button" onClick={closeModal} className="modal-button cancel">
                                    Cancelar
                                </button>
                            </div>
                        </form >
                    </div>
                </div>
            )}
        </div>
    );
};

export default MonitoreoView;