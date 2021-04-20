import AccountRoute from './account/Account';
import ConnectorsRoute from './connectors/Connectors';
import AssetsRatesRoute from './assets-rates/AssetsRates';
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
    component: AssetsRatesRoute,
    nav: { label: 'Rates', visible: true, sort: 2 },
    path: '/rates',
    title: 'Current rates',
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
