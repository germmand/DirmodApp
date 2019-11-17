import React from 'react';
import renderer from 'react-test-renderer';

import MainPage from './main.page';

describe('MainPage Component', () => {
  it('should match snapshot', () => {
    const props = {
    };
    const component = renderer.create(
      <MainPage {...props} />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
