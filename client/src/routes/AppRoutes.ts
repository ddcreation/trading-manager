import AccountRoute from './account/Account';
import ConnectorsRoute from './connectors/Connectors';
import CryptoRatesRoute from './crypto-rates/CryptoRates';
import DashboardRoute from './dashboard/Dashboard';
import OpportunitiesRoute from './opportunities/Opportunities';

export type RouteProps = {
  active?: boolean;
  children?: RouteProps[];
  component: any;
  nav: { label?: string; visible: boolean; sort: number };
  path: string;
  title: string;
};

const AppRoutes: RouteProps[] = [
  {
    component: OpportunitiesRoute,
    nav: { visible: true, sort: 1 },
    path: '/opportunities',
    title: 'Opportunities',
  },
  {
    component: CryptoRatesRoute,
    nav: { label: 'Crypto', visible: true, sort: 2 },
    path: '/crypto',
    title: 'Crypto currencies',
  },
  {
    component: AccountRoute,
    nav: { label: 'Account', visible: false, sort: 99 },
    path: '/account',
    title: 'Account',
  },
  {
    component: ConnectorsRoute,
    nav: { label: 'Connectors', visible: false, sort: 99 },
    path: '/connectors',
    title: 'Account',
  },
  {
    component: DashboardRoute,
    nav: { visible: true, sort: 0 },
    path: '/dashboard',
    title: 'Dashboard',
  },
];

export default AppRoutes;
