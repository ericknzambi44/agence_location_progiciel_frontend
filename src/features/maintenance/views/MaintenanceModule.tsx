import { Routes, Route } from 'react-router-dom';
import { InterventionList } from './InterventionList';
import { InterventionCreate } from './InterventionCreate';
import { InterventionDetail } from './InterventionDetail';
import { PieceList } from './PieceList';
import { PieceCreate } from './PieceCreate';

export const MaintenanceModule = () => {
  return (
    <Routes>
      <Route index element={<InterventionList />} />
      <Route path="nouveau" element={<InterventionCreate />} />
      <Route path=":id" element={<InterventionDetail />} />
      <Route path="pieces" element={<PieceList />} />
      <Route path="pieces/nouvelle" element={<PieceCreate />} />
    </Routes>
  );
};