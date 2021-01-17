import { Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AppRoutes from '../../../routes/AppRoutes';
import ApiStatus from '../api-status/ApiStatus';

function AppNavigation() {
  const navRoutes = AppRoutes.sort((navA, navB) =>
    navA.nav.sort < navB.nav.sort ? -1 : 1
  );
  return (
    <Navbar sticky='top' bg='primary' variant='dark'>
      <Navbar.Brand as={Link} to='/'>
        Trading manager
      </Navbar.Brand>
      <Nav className='mr-auto'>
        {navRoutes.map(
          (route, idx) =>
            route.nav.visible && (
              <Nav.Link key={idx} as={Link} to={route.path}>
                {route.nav.label || route.title}
              </Nav.Link>
            )
        )}
      </Nav>
      <ApiStatus />
    </Navbar>
  );
}

export default AppNavigation;
