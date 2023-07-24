// import React, { PropsWithChildren } from 'react';
// import { Redirect } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthProvider';

// export const RequireLogin: React.FunctionComponent<PropsWithChildren> = ({ children }) => {
//   const auth = useAuth();
//   if (auth.isLoggedIn) {
//     return <>{children}</>;
//   }
//   return (
//     <Redirect
//       to={{
//         pathname: '/login',
//       }}
//     />
//   );
// };
