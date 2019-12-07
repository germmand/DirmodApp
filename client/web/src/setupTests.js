/* eslint-disable */
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({
    adapter: new Adapter()
});

// For future googlers: global *is* window in jest.
// Here we'll mock the "runtime" environment.
global._env_ =  jest.fn().mockImplementation(() => ({
    REACT_APP_DIRMOD_API_DOMAIN: 'http://test.app.com',
}));
