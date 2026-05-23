import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import MapPage from '../pages/map/map-page';
import AddStoryPage from '../pages/add/add-story-page';
import LoginPage from '../pages/auth/login-page';
import RegisterPage from '../pages/auth/register-page';

const routes = {
  '/': new HomePage(),
  '/about': new AboutPage(),
  '/map': new MapPage(),
  '/add': new AddStoryPage(),
  '/login': new LoginPage(),
  '/register': new RegisterPage(),
};

export default routes;
