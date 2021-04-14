import {
  faPowerOff,
  faSignInAlt,
  faUserCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { authService } from '../../../services/auth.service';

interface UserNavigationProps {
  authenticated: boolean;
}

const UserNavigation = (props: UserNavigationProps) => {
  return props.authenticated ? (
    <React.Fragment>
      <Dropdown alignRight>
        <Dropdown.Toggle>
          <FontAwesomeIcon icon={faUserCircle} />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item as={NavLink} to='/account'>
            Account
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item
            as={Button}
            variant='outline-danger'
            onClick={authService.logout}
          >
            <FontAwesomeIcon icon={faPowerOff} /> Logout
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </React.Fragment>
  ) : (
    <Button variant='outline-light' as={Link} to='/register'>
      <FontAwesomeIcon icon={faSignInAlt} className='mr-2' />
      Register
    </Button>
  );
};

const mapStateToProps = (state: any) => ({
  authenticated: state.user.authenticated,
});

export default connect(mapStateToProps)(UserNavigation);
