import { Routes, Route } from 'react-router-dom';
import { InterventionList } from './InterventionList';
import { InterventionCreate } from './InterventionCreate';
import { InterventionDetail } from './InterventionDetail';
import { PieceList } from './PieceList';
import { PieceCreate } from './PieceCreate';
import { RegleMaintenancePage } from './RegleMaintenancePage';
import { TechnicienList } from './TechnicienList';
import { TechnicienCreate } from './TechnicienCreate';

export const MaintenanceModule = () => {
  return (
    <Routes>
      <Route index element={<InterventionList />} />
      <Route path="nouveau" element={<InterventionCreate />} />
      <Route path=":id" element={<InterventionDetail />} />
      <Route path="pieces" element={<PieceList />} />
      <Route path="pieces/nouvelle" element={<PieceCreate />} />
      <Route path="regles-maintenance" element={<RegleMaintenancePage />} />
      <Route path="techniciens" element={<TechnicienList />} />
      <Route path="techniciens/nouveau" element={<TechnicienCreate />} />
    </Routes>
  );
};