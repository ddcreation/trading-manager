import CryptoRates from './crypto-rates/crypto-rates';
import Home from './home/Home';
import Opportunities from './opportunities/Opportunities';

export type RouteProps = {
  children?: RouteProps[];
  component: any;
  nav: { label?: string; visible: boolean; sort: number };
  path: string;
  title: string;
};

const AppRoutes: RouteProps[] = [
  {
    component: Opportunities,
    nav: { visible: true, sort: 1 },
    path: '/opportunities',
    title: 'Opportunities',
  },
  {
    component: CryptoRates,
    nav: { label: 'Crypto', visible: true, sort: 2 },
    path: '/crypto',
    title: 'Crypto currencies',
  },
  {
    component: Home,
    nav: { visible: true, sort: 0 },
    path: '/',
    title: 'Home',
  },
];

export default AppRoutes;
