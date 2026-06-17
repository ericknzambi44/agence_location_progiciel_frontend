import { Routes, Route } from 'react-router-dom';
import { EmployeList } from './EmployeList';
import { EmployeCreate } from './EmployeCreate';
import { EmployeDetail } from './EmployeDetail';

export const RHModule = () => {
  return (
    <Routes>
      <Route index element={<EmployeList />} />
      <Route path="nouveau" element={<EmployeCreate />} />
      <Route path=":id" element={<EmployeDetail />} />
    </Routes>
  );
};