import '../assets/css/viewsCss/mainView.css';

const mainView = () => {
    return (
        <div className="main-container">
            <h1 className="title">¡Bienvenido a LIA!</h1>
            <p className="introduction">
                El sistema de monitoreo de invernaderos LIA está diseñado para optimizar el manejo y la supervisión de invernaderos a través de la integración de tecnologías IoT (Internet de las Cosas). Este sistema permitirá a los usuarios gestionar y analizar datos en tiempo real provenientes de diversos sensores distribuidos en el invernadero, facilitando la toma de decisiones informadas para mejorar la producción agrícola.
            </p>
            <h2 className="features-title">Características Principales</h2>
            <ul className="features-list">
                <li><strong>Modelos de Datos:</strong> LIA permitirá la creación de modelos de datos específicos para cada tipo de sensor, facilitando la comunicación entre los dispositivos IoT y la plataforma.</li>
                <li><strong>Monitoreo de Datos:</strong> Interfaz intuitiva para la monitorización en tiempo real de los datos recolectados por los sensores, incluyendo temperatura, humedad, luz, y otros parámetros críticos.</li>
                <li><strong>Graficación de Datos:</strong> Herramientas de visualización que permitirán graficar los datos a lo largo del tiempo y comparar información de diferentes sensores en fechas específicas.</li>
                <li><strong>Comparaciones de Datos:</strong> Capacidad de comparar datos de diferentes sensores en distintos momentos para identificar tendencias y patrones en el ambiente del invernadero.</li>
            </ul>
            <div className="image-container">
                <img src="" alt="Imagen de Invernadero" className="image" />
                <img src="" alt="Imagen de Sensor" className="image" />
                <img src="" alt="Imagen de Gráfica" className="image" />
            </div>
        </div>
    );
}

export default mainView;