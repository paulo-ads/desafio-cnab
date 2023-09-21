import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./assets/css/app.css";
import Header from './components/common/Header'
import { Home } from './pages/home'
import { Main } from './pages/main'
import 'bootstrap/dist/css/bootstrap.min.css';


/*O aplicativo existe dentro das rotas Home (página inicial) e Main (página principal);
A página inicial lidará com o Login e Registro;
A página principal lidará com as operações CNAB*/
function App() {
  return (
    <div className='app-div'>
      <Router>
        <Header/>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/main" element={<Main/>} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
