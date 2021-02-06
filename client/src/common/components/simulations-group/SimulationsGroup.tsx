import React from 'react';

interface SimulationsGroupProps {
  symbol: string;
}

interface SimulationsGroupState {
  loading: boolean;
}

class SimulationsGroup extends React.Component<
  SimulationsGroupProps,
  SimulationsGroupState
> {
  state = { loading: true };

  render() {
    return <div>SimulationsGroup X</div>;
  }
}

export default SimulationsGroup;
