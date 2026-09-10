import { getDashboardStats } from '@/services/stock.service';
import { DashboardClient } from './DashboardClient';

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return <DashboardClient stats={stats} />;
}
