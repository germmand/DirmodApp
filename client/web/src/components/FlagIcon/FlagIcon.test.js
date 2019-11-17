import React from 'react';
import renderer from 'react-test-renderer';

import FlagIcon from './FlagIcon';

describe('FlagIcon Component', () => {
  it('should match snapshot', () => {
    const props = {
      code: 'EUR',
      size: 25,
    };
    const component = renderer.create(
      <FlagIcon {...props} />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});