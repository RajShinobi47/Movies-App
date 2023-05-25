import logo from './logo.svg';
import './App.css';
import Navbar from './Components/Navbar';
import Banner from './Components/Banner';
import Movies from './Components/Movies';
import Favourite from './Components/Favourite';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import { Fragment } from 'react';

function App() {
  return (
     
        <Router> 
          <Navbar />
          <Routes>
            <Route path='/' exact element={[<Banner />, <Movies />]}></Route>       
            <Route path='/favourites' element={<Favourite/>}></Route>
          </Routes>
          {/* <Movies/>
          <Favourite/> */}
        </Router>
    
  );
}

export default App;
