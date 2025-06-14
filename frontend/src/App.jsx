import AppRoutes from './routes/AppRoutes';
import { AppProvider } from './Contexts/AppContext';

export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}
