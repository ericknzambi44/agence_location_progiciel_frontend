import { Routes, Route } from 'react-router-dom';
import { AgenceList } from './AgenceList';
import { AgenceCreate } from './AgenceCreate';
import { ModuleList } from './ModuleList';

export const AdministrationModule = () => {
  return (
    <Routes>
      <Route index element={<AgenceList />} />
      <Route path="nouveau" element={<AgenceCreate />} />
      <Route path="modules" element={<ModuleList />} />
    </Routes>
  );
};