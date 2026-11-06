import { BrowserRouter } from 'react-router-dom';

import { DemoProvider } from './context/demo-provider';
import { AppRoutes } from './navigation/app-routes';

export default function App() {
  return (
    <DemoProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </DemoProvider>
  );
}
