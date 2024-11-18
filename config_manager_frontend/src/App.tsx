import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import GetConfig from './components/GetConfig';
import ViewConfig from './components/ViewConfig';
import PushConfig from './components/PushConfig';
// import DeleteConfig from './components/DeleteConfig';
// import CreateConfigId from './components/CreateConfigId';
// import CreateConfig from './components/CreateConfig';
import Login from './components/Login';
import GetConfigMetadata from './components/GetConfigMetadata';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Main Route */}
        <Route path="/" element={<Login />} />

        {/* Dashboard Route */}
        <Route path="/dashboard" element={<Dashboard />}>
          {/* Nested Routes for Dashboard Pages */}
          <Route path="get-config" element={<GetConfig />} />
          <Route path="view-config" element={<ViewConfig />} />
          <Route path="push-config" element={<PushConfig />} />
          {/* <Route path="delete-config" element={<DeleteConfig />} /> */}
          {/* <Route path="create-config-id" element={<CreateConfigId />} /> */}
          {/* <Route path="create-config" element={<CreateConfig />} /> */}
          <Route path="get-config-metadata" element={<GetConfigMetadata />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
