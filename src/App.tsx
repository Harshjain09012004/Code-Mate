import { Route, Routes } from 'react-router-dom';
import './App.css';
import SampleProblem1 from './constants/SampleProblem1';
import ProblemDescription from './pages/Description/ProblemDescription';
import ProblemList from './pages/ProblemList/ProblemList';
import Home from './pages/home';

function App() {

  const markdownText = SampleProblem1.problemStatement;

  return (
    <div className='h-[100vh] overflow-hidden'>
      <Routes>
        <Route path='/' element={<Home/>} />

        <Route path='/problems/list' element={<ProblemList />} />

        <Route path='/room/:id' element={ <ProblemDescription descriptionText={markdownText} />} />
      </Routes>
    </div>
  );
}

export default App;
