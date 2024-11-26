# IOpenDataLink

IOpenDataLink es un framework de código abierto para dispositivos IoT que permite generar modelos de datos relacionados con los dispositivos creados. Ofrece generación automática de JSON para POST y visualización de datos a través de gráficas.

## Estructura del Proyecto

Este proyecto está dividido en dos partes:
1. **Frontend**: Interfaz de usuario para interactuar con los dispositivos y visualizar los datos.
2. **Backend**: API y lógica de negocio para gestionar los dispositivos y modelos de datos.

## Requerimientos

- Node.js
- MongoDB

## Instalación

1. Clona este repositorio:
    ```sh
    git clone https://github.com/Angelfonseca/IoT_Framework.git
    cd IOpenDataLink
    ```

2. Instala las dependencias del backend y frontend:
    ```sh
    cd backend
    npm install
    cd ../frontend
    npm install
    ```

## Ejecución

1. En la carpeta raíz del proyecto, corre el servidor y el frontend:
    ```sh
    cd backend
    npm run dev
    cd ../frontend
    npm run dev
    ```

## Uso

1. **Modelado de Datos**: Genera modelos de datos que se relacionan con tus dispositivos IoT de manera sencilla.
2. **Generación de JSON**: Obtén el JSON correspondiente para hacer POST con tus datos.
3. **Visualización de Datos**: Genera y visualiza gráficas con los datos recolectados por tus dispositivos.

## Contribuir

¡Nos encantaría tu ayuda! Por favor, sigue estos pasos para contribuir:

1. Haz un fork del proyecto.
2. Crea una nueva rama (`git checkout -b feature-nueva-caracteristica`).
3. Realiza tus cambios y haz un commit (`git commit -m 'Agregar nueva característica'`).
4. Empuja tu rama (`git push origin feature-nueva-caracteristica`).
5. Abre un Pull Request.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.
