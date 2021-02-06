import { Container } from 'react-bootstrap';
import React from 'react';

type PageProps = {
  component: () => JSX.Element;
  title: string;
};

class Page extends React.Component<PageProps, unknown> {
  render() {
    const ComponentToRender = this.props.component;

    return (
      <Container className='pb-5'>
        <h1 className='mt-5'>{this.props.title}</h1>
        <hr className='mb-5' />
        <ComponentToRender />
      </Container>
    );
  }
}

export default Page;
