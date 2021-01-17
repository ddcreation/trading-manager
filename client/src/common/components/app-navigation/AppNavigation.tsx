import { Nav, Navbar } from 'react-bootstrap';
import ApiStatus from '../api-status/ApiStatus';

function AppNavigation() {
  return (
    <Navbar fixed='top' bg='primary' variant='dark'>
      <Navbar.Brand href='#home'>Trading manager</Navbar.Brand>
      <Nav className='mr-auto'>
        <Nav.Link href='#home'>Home</Nav.Link>
        <Nav.Link href='#features'>Features</Nav.Link>
      </Nav>
      <div>
        <ApiStatus />
      </div>
    </Navbar>
  );
}

export default AppNavigation;
