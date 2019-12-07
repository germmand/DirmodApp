import axios from 'axios';

export default axios.create({
  // We use the window object because this url has to be injected at "runtime" to test multiple environments.
  // The way that this works is that every time the app is ran (i.e. in a container) a script will read the environment
  // and adjust the js file that's in charge of changing these values.
  // This way we can test multiple environments without having to trigger a whole rebuild.
  baseURL: window._env_.REACT_APP_DIRMOD_API_DOMAIN,
});
