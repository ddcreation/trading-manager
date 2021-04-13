import { Component } from 'react';
import { Button, Card, Container, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class RegisterRoute extends Component {
  render() {
    return (
      <Container>
        <Card className='col-md-4 mx-auto mt-5 text-center'>
          <Card.Body>
            <Card.Title>Register</Card.Title>
            <Form>
              <Form.Group controlId='username'>
                <Form.Control type='text' placeholder='Username' />
              </Form.Group>

              <Form.Group controlId='password'>
                <Form.Control type='password' placeholder='Password' />
              </Form.Group>

              <Form.Group controlId='passwordConfirm'>
                <Form.Control type='password' placeholder='Confirm password' />
              </Form.Group>

              <Button className='w-100' type='submit'>
                Register
              </Button>

              <Button as={Link} to='/login' variant='link' className='w-100'>
                Back to login
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    );
  }
}

export default RegisterRoute;
