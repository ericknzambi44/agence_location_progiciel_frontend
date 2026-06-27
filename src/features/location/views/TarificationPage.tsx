import { RegleTarificationList } from "../components/RegleTarificationList";


export const TarificationPage = () => {
  return (
    <div className="space-y-6 animate-in fade-in">
      <h1 className="text-3xl font-bold">Tarification</h1>
      <p className="text-muted-foreground">
        Gérez les règles de tarification (remises, forfaits, majorations) pour les locations.
      </p>
      <RegleTarificationList />
    </div>
  );
};