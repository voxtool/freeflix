import { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import './App.css';
import { AuthContext } from './context/AuthContext';
import Navigation from './components/Navigation/Navigation';
import Footer from './components/Footer/Footer';
import Homescreen from './components/HomeScreen/HomeScreen';
import LandingScreen from './components/LandingScreen/LandingScreen';
import SignScreen from './components/SignScreen/SignScreen';
import Search from './components/Search/Search';
import Genres from './components/Genres/Genres';
import Details from './components/Details/Details';
import Watch from './components/Watch/Watch';
import Profile from './components/Profile/Profile';
import Favourites from './components/Favourites/Favourites';
import NotFound from './components/NotFound/NotFound';


function App() {

  const { user, loading } = useContext(AuthContext);

  return (
    !loading
      ? <div className="App">
        <Navigation user={user} />
        <Switch>
          <Route exact path="/" render={() => (!user ? <LandingScreen /> : <Homescreen />)} />
          <Route path="/sign-in" render={() => (!user ? <SignScreen /> : <Redirect to="/" />)} />
          <Route path="/sign-up" render={() => (!user ? <SignScreen /> : <Redirect to="/" />)} />
          <Route path="/profile" render={() => (!user ? <Redirect to="/sign-in" /> : <Profile />)} />
          <Route path="/search" render={() => (!user ? <Redirect to="/sign-in" /> : <Search />)} />
          <Route path="/my-list" render={() => (!user ? <Redirect to="/sign-in" /> : <Favourites />)} />
          <Route path="/movies/:genre" render={() => (!user ? <Redirect to="/sign-in" /> : <Genres />)} />
          <Route path="/details/:id" render={() => (!user ? <Redirect to="/sign-in" /> : <Details />)} />
          <Route path="/watch/:id" render={() => (!user ? <Redirect to="/sign-in" /> : <Watch />)} />
          <Route component={NotFound}/>
        </Switch>
        <Footer />
      </div>
      : null
  );
}

export default App;
