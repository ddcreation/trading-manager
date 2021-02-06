import React from 'react';
import { Spinner } from 'react-bootstrap';

const TmLoader = () => {
  return (
    <div className='text-center'>
      <Spinner animation='border' role='status'>
        <span className='sr-only'>Loading...</span>
      </Spinner>
    </div>
  );
};

export default TmLoader;
