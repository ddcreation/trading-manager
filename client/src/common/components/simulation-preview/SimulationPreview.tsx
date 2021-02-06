import React from 'react';

interface SimulationPreviewProps {
  simulation: unknown;
}

class SimulationPreview extends React.Component<
  SimulationPreviewProps,
  unknown
> {
  state = { loading: true, history: [] };

  componentDidMount() {}

  render() {
    return <div>SimulationPreview x</div>;
  }
}

export default SimulationPreview;
