import { Component } from 'react';
import { Alert, Button, Card, Container, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { authService } from '../../services/auth.service';

interface RegisterRouteProps {
  registered: boolean;
}

interface RegisterRouteState {
  form: {
    [k: string]: string;
  };
  errors: {
    [k: string]: string;
  };
  registered: boolean;
}

const initialState = {
  form: {},
  errors: {},
  registered: false,
};

class RegisterRoute extends Component<RegisterRouteProps, RegisterRouteState> {
  constructor(props: RegisterRouteProps) {
    super(props);

    this.state = { ...initialState };
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
            <Card.Title>Register</Card.Title>
            {!this.props.registered ? (
              <Form noValidate onSubmit={this.submitForm}>
                <Form.Group controlId='username'>
                  <Form.Control
                    type='text'
                    placeholder='Username'
                    onChange={(e) =>
                      this.updateField('username', e.target.value)
                    }
                    isInvalid={!!this.state.errors.username}
                  />
                  <Form.Control.Feedback type='invalid'>
                    {this.state.errors.username}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId='password'>
                  <Form.Control
                    type='password'
                    placeholder='Password'
                    onChange={(e) =>
                      this.updateField('password', e.target.value)
                    }
                    isInvalid={!!this.state.errors.password}
                  />
                  <Form.Control.Feedback type='invalid'>
                    {this.state.errors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId='passwordConfirm'>
                  <Form.Control
                    type='password'
                    placeholder='Confirm password'
                    onChange={(e) =>
                      this.updateField('confirmPassword', e.target.value)
                    }
                    isInvalid={!!this.state.errors.confirmPassword}
                  />
                  <Form.Control.Feedback type='invalid'>
                    {this.state.errors.confirmPassword}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button className='w-100' type='submit'>
                  Register
                </Button>

                <Button as={Link} to='/login' variant='link' className='w-100'>
                  Back to login
                </Button>
              </Form>
            ) : (
              <Alert variant='success'>
                You have been registered! Now you can
                <Button as={Link} to='/login' variant='link' className='w-100'>
                  Login
                </Button>
              </Alert>
            )}
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

    if (this.state.form['password'] !== this.state.form['confirmPassword']) {
      errors['confirmPassword'] = 'Passwords does not match';
    }

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
          authService.register(this.state.form as any);
        }
      }
    );
  };
}

const mapStateToProps = (state: any) => ({
  registered: state.user.registered,
});

export default connect(mapStateToProps)(RegisterRoute);
