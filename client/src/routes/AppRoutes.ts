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
    component: Home,
    nav: { visible: true, sort: 0 },
    path: '/',
    title: 'Home',
  },
];

export default AppRoutes;
