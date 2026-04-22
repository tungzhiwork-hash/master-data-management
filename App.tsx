
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { EntityList } from './components/EntityList';
import { EntityDetail } from './components/EntityDetail';
import { ProjectList } from './components/ProjectList';
import { ProjectDetail } from './components/ProjectDetail';
import { StackingPlan } from './components/StackingPlan';
import { UnitMetadataSettings } from './components/UnitMetadataSettings';
import { ApprovalList } from './components/ApprovalList';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          {/* Default route redirects to list */}
          <Route path="/" element={<Navigate to="/entities" replace />} />
          
          {/* Main Entity List */}
          <Route path="/entities" element={<EntityList />} />
          <Route path="/entity/:id" element={<EntityDetail />} />

          {/* Project Routes */}
          <Route path="/projects" element={<ProjectList />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          
          {/* Units Route (formerly Stacking Plan) */}
          <Route path="/units" element={<StackingPlan />} />
          
          {/* Metadata & Config */}
          <Route path="/settings" element={<UnitMetadataSettings />} />
          
          {/* Workflow Approvals */}
          <Route path="/compliance" element={<ApprovalList />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
