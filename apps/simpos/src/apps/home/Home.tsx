import { Link } from 'react-router-dom';

export const Home: React.FunctionComponent = () => {
  return (
    <div>
      <Link to="/pos">Go to Point of Sale</Link>
    </div>
  );
};
