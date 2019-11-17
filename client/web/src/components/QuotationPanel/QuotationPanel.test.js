import React from 'react';
import renderer from 'react-test-renderer';

import { shallow } from 'enzyme';

import QuotationPanel from './QuotationPanel';

describe('QuotationPanel Component', () => {
  it('should match snapshot', () => {
    const props = {
      code: 'USD',
      symbol: '$',
      quotation: 45.55,
      isRefreshing: false,
    };
    const component = renderer.create(
      <QuotationPanel {...props} />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render spinner when isRefreshing equals true', () => {
    const props = {
      code: 'USD',
      symbol: '$',
      quotation: 45.55,
      isRefreshing: false,
    };
    const wrapper = shallow(
      <QuotationPanel {...props} />
    );
    expect(wrapper.find('Spinner')).toHaveLength(0);
    wrapper.setProps({
      isRefreshing: true,
    });
    expect(wrapper.find('Spinner')).toHaveLength(1);
  });
});