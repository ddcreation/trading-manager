import { Component } from 'react';
import { Button, Card, Container, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { authService } from '../../services/auth.service';

interface LoginRouteState {
  form: {
    [k: string]: string;
  };
  errors: {
    [k: string]: string;
  };
}

class LoginRoute extends Component<unknown, LoginRouteState> {
  constructor(props: unknown) {
    super(props);

    this.state = {
      form: {},
      errors: {},
    };
  }

  updateField(name: string, value: string) {
    this.setState({
      form: { ...this.state.form, [name]: value },
    });
  }

  render() {
    return (
      <Container>
        <Card className='col-md-4 mx-auto mt-5 text-center'>
          <Card.Body>
            <Card.Title>Login</Card.Title>
            <Form noValidate onSubmit={this.submitForm}>
              <Form.Group controlId='username'>
                <Form.Control
                  type='text'
                  placeholder='Username'
                  onChange={(e) => this.updateField('username', e.target.value)}
                  isInvalid={!!this.state.errors.username}
                />
                <Form.Control.Feedback type='invalid'>
                  {this.state.errors.username}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId='password'>
                <Form.Control
                  type='password'
                  name='password'
                  placeholder='Password'
                  onChange={(e) => this.updateField('password', e.target.value)}
                  isInvalid={!!this.state.errors.password}
                />
                <Form.Control.Feedback type='invalid'>
                  {this.state.errors.password}
                </Form.Control.Feedback>
              </Form.Group>

              <Button className='w-100' type='submit'>
                Login
              </Button>

              <Button as={Link} to='/register' variant='link' className='w-100'>
                Register
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  public submitForm = (event: any) => {
    event.preventDefault();

    const errors: { [k: string]: string } = {};
    ['username', 'password'].forEach((field) => {
      if (!this.state.form[field] || this.state.form[field].length === 0) {
        errors[field] = 'Required';
      }
    });

    this.setState(
      {
        errors,
      },
      () => {
        if (
          Object.keys(this.state.errors).filter(
            (key: string) => this.state.errors[key]
          ).length === 0
        ) {
          authService.login(this.state.form as any);
        }
      }
    );
  };
}

export default LoginRoute;
