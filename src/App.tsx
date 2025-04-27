import { Route, Routes } from 'react-router-dom';
import './App.css';
import ProblemDescription from './pages/Description/ProblemDescription';
import Home from './pages/home';

function App() {

  return (
    <div className='h-[100vh] overflow-hidden'>
      <Routes>
        <Route path='/' element={<Home/>} />

        <Route path='/room/:id' element={ <ProblemDescription/>} />
      </Routes>
    </div>
  );
}

export default App;
