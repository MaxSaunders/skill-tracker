import { HashRouter, Route, Routes } from "react-router-dom"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import Navigation from "./components/ui/navigation"
import MySkills from "./Pages/MySkills/myskills"
import Skills from "./Pages/Skills/skills"
import People from "./Pages/People/people"
import Person from "./Pages/Person/person"
import Home from "./Pages/Home/home"
import './App.css'

const queryClient = new QueryClient()

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Navigation />
        <div className='flex justify-center routes-wrapper'>
          <div className='w-11/12'>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="/my-skills" element={<MySkills />} />
              <Route path="/people" element={<People />} />
              <Route path="/people/:id" element={<Person />} />
              <Route path="/*" element={<Skills />} />
            </Routes>
          </div>
        </div>
      </HashRouter>
    </QueryClientProvider>
  )
}

export default App
