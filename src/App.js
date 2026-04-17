import './App.css';
import './stylesheets/text-elements.css'
import './stylesheets/form-elements.css'
import './stylesheets/theme.css'
import './stylesheets/layout.css'
import './stylesheets/alignments.css'
import './stylesheets/custom-components.css'
import './stylesheets/pages.css'
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Registrer';
import Home from './pages/Home'
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Transactions from './pages/Transactions';
import Users from './pages/Users';



function App() {
  return (
    <div> 
      <Router>
        <Routes>
          <Route path='/' element={<ProtectedRoute><Home/></ProtectedRoute>} ></Route>
          <Route path='/transactions' element={<ProtectedRoute><Transactions/></ProtectedRoute>} ></Route>
          <Route path='/login' element={<PublicRoute><Login/></PublicRoute>} ></Route>
          <Route path='/register' element={<PublicRoute><Register/></PublicRoute>} ></Route>
          <Route path='/users' element={<ProtectedRoute><Users/></ProtectedRoute>} ></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
