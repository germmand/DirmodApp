import React from 'react';
import PropTypes from 'prop-types';

import BR_FLAG from '../../assets/flags/BR.svg';
import EU_FLAG from '../../assets/flags/EU.svg';
import US_FLAG from '../../assets/flags/US.svg';

const Flags = {
  "BRL": BR_FLAG,
  "EUR": EU_FLAG,
  "USD": US_FLAG,
};

const FlagIcon = ({ code, style, size }) => (
  <img
    alt={code}
    src={Flags[code]}
    style={{
      ...style,
      height: `${size}px`,
      width: `${size}px`,
      display: 'inline-block'
    }}
  />
);

FlagIcon.propTypes = {
  code: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  style: PropTypes.objectOf(PropTypes.string),
};

FlagIcon.defaultProps = {
  style: {},
};

export default FlagIcon;
