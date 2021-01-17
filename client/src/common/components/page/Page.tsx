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
      <Container>
        <h1>{this.props.title}</h1>
        <ComponentToRender />
      </Container>
    );
  }
}

export default Page;
