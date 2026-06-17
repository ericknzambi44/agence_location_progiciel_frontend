import { Routes, Route } from 'react-router-dom';
import { InterventionList } from './InterventionList';
import { InterventionCreate } from './InterventionCreate';
import { InterventionDetail } from './InterventionDetail';

export const MaintenanceModule = () => {
  return (
    <Routes>
      <Route index element={<InterventionList />} />
      <Route path="nouveau" element={<InterventionCreate />} />
      <Route path=":id" element={<InterventionDetail />} />
    </Routes>
  );
};