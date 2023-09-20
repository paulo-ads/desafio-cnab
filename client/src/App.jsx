import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header'
import { Home } from './pages/home'
import { Main } from './pages/main'

/*O aplicativo existe dentro das rotas Home (página inicial) e Main (página principal);
A página inicial lidará com o Login e Registro;
A página principal lidará com as operações CNAB*/
function App() {
  return (
    <>
      <Router>
        <Header/>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/main" element={<Main/>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
