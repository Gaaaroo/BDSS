import AppRoutes from './routes/AppRoutes';
import { AppProvider } from './Contexts/AppContext';
import { LoadScript } from '@react-google-maps/api';
import { ToastContainer } from 'react-toastify';

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
// Thư viện cần load thêm từ Google (autocomplete)
const libraries = ['places'];
export default function App() {
  return (
    <AppProvider>
      <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
        <AppRoutes />
      </LoadScript>
      <ToastContainer />
    </AppProvider>
  );
}
