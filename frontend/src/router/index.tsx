import { createBrowserRouter } from 'react-router-dom';
import LoginView from '../views/loginView';
import Layout from '../layouts/layout';
import HomeView from '../views/mainView';
import ModelosView from '../views/modelosView';
import MonitoreoView from '../views/monitorizacionView';
import DeviceView from '../views/deviceView';
import AlertList from '../views/alertsView';
import GraficasView from '../views/chartsView';

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
        path: 'monitorizacion',
        element: <MonitoreoView />,
      },
      {
        path: 'monitorizacion/:id',
        element: <DeviceView />
      },
      {
        path: 'graficas/:id',
        element: <GraficasView/>
      },
      {
        path: 'alertas',
        element: <AlertList />
      }
    ] 
  }
]);

export default router;