import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"; 
import store from './store';
import { persistor } from "./store/storeSetup";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import Routes
import { authProtectedRoutes, publicRoutes } from "./routes";
import AuthMiddleware from "./routes/routes";
import Layout from "./components/Layout/Layout";
import useThemeBackground from "./utils/hooks/useThemeBackground";

const AppContent: React.FC = () => {
  useThemeBackground();
  return (
    <>
      <ToastContainer />
      <Router>  
        <Routes>
          {publicRoutes.map((route, idx) => (
            <Route
              key={idx}
              path={route?.path}
              element={
                <AuthMiddleware isAuthProtected={false}>
                  <route.component /> {/* Pass route component as children */}
                </AuthMiddleware>
              }
            />
          ))}
          {authProtectedRoutes?.map((route, idx) => (
            <Route
              key={idx}
              path={route.path}
              element={
                <AuthMiddleware isAuthProtected={true} layout={Layout}>
                  <route.component /> {/* Pass route component as children */}
                </AuthMiddleware>
              }
            />
          ))}
          <Route path="*" element={<Navigate replace to="/dashboard" />} />
        </Routes>
      </Router>
    </>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
};

export default App;
