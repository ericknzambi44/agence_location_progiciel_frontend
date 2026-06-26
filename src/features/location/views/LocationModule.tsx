import { Routes, Route } from 'react-router-dom';
import { ClientList } from '../components/ClientList';
import { ClientCreate } from '../components/ClientCreate';
import { ContratCreate } from '../components/ContratCreate';
import { ContratList } from '../components/ContratList';
import { TarificationPage } from './TarificationPage';
import { ContratDetail } from './ContratDetail';


export const LocationModule = () => {
  return (
    <Routes>
      <Route path="clients" element={<ClientList />} />
      <Route path="clients/nouveau" element={<ClientCreate />} />
      <Route path="contrats" element={<ContratList />} />
      <Route path="contrats/nouveau" element={<ContratCreate />} />
      <Route path="tarification" element={<TarificationPage />} />
      <Route path="contrats/:id" element={<ContratDetail />} />
    </Routes>
  );
};