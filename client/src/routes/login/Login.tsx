import { Component } from 'react';
import { Button, Card, Container, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class LoginRoute extends Component {
  render() {
    return (
      <Container>
        <Card className='col-md-4 mx-auto mt-5 text-center'>
          <Card.Body>
            <Card.Title>Login</Card.Title>
            <Form>
              <Form.Group controlId='username'>
                <Form.Control type='text' placeholder='Username' />
              </Form.Group>

              <Form.Group controlId='password'>
                <Form.Control type='password' placeholder='Password' />
              </Form.Group>

              <Button className='w-100'>Login</Button>

              <Button as={Link} to='/register' variant='link' className='w-100'>
                Register
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    );
  }
}

export default LoginRoute;
