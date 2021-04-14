import { Nav, Navbar } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import AppRoutes from '../../../routes/AppRoutes';
import ApiStatus from '../api-status/ApiStatus';
import UserNavigation from '../user-nav/UserNavigation';

interface AppNavigationProps {
  authenticated: boolean;
}

const AppNavigation = (props: AppNavigationProps) => {
  const location = useLocation();

  const navRoutes = AppRoutes.sort((navA, navB) =>
    navA.nav.sort < navB.nav.sort ? -1 : 1
  );

  navRoutes.forEach((route) => {
    route.active = location.pathname === route.path;
  });

  return (
    <Navbar sticky='top' bg='primary' variant='dark'>
      <Navbar.Brand as={Link} to='/'>
        Trading manager
      </Navbar.Brand>
      <Nav className='mr-auto'>
        {props.authenticated &&
          navRoutes.map(
            (route, idx) =>
              route.nav.visible && (
                <Nav.Link
                  as={Link}
                  key={idx}
                  to={route.path}
                  className={route.active ? 'active' : ''}
                >
                  {route.nav.label || route.title}
                </Nav.Link>
              )
          )}
      </Nav>
      <UserNavigation />
      <div className='ml-1'>
        <ApiStatus />
      </div>
    </Navbar>
  );
};

const mapStateToProps = (state: any) => ({
  authenticated: state.user.authenticated,
});

export default connect(mapStateToProps)(AppNavigation);
