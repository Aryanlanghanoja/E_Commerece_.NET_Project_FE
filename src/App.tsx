import { RouterProvider } from 'react-router-dom';
import { AuthProvider, CartProvider } from './context';
import { router } from './routes';
import './styles/global.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
