import { createBrowserRouter } from 'react-router-dom';
import LoginView from '../views/loginView';
import Layout from '../layouts/layout';
import HomeView from '../views/mainView';
import ModelosView from '../views/modelosView';
import GraficasView from '../views/graphicsView';
import MonitoreoView from '../views/monitorizacionView';
import DeviceView from '../views/deviceView';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginView />
  },
  { 
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <HomeView />
      },
      {
        path: 'modelos', 
        element: <ModelosView />
      },
      {
        path: 'graficas',
        element: <GraficasView />
      },
      {
        path: 'monitorizacion',
        element: <MonitoreoView />,
      },
      {
        path: 'monitorizacion/:id',
        element: <DeviceView />
      }
    ] 
  }
]);

export default router;