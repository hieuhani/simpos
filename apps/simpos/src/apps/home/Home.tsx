import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthProvider';
import { useEffect } from 'react';

export const Home: React.FunctionComponent = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (auth.isLoggedIn) {
      navigate('/pos');
    } else {
      navigate('/login');
    }
  }, [auth.isLoggedIn, navigate]);
  return null;
};
