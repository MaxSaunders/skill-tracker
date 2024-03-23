import { HashRouter as Router, Route, Routes } from "react-router-dom"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Auth0Provider } from '@auth0/auth0-react';

import Navigation from "./components/ui/navigation"
import MySkills from "./Pages/MySkills/myskills"
import Skills from "./Pages/Skills/skills"
import People from "./Pages/People/people"
import Person from "./Pages/Person/person"
import Home from "./Pages/Home/home"
import './App.css'

const queryClient = new QueryClient()

const AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN
const AUTH0_CLIENT_ID = import.meta.env.VITE_AUTH0_CLIENT_ID

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router basename="/skill-tracker">
        <Auth0Provider
          domain={AUTH0_DOMAIN}
          clientId={AUTH0_CLIENT_ID}
          authorizationParams={{
            redirect_uri: window.location.origin
          }}
        >
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
        </Auth0Provider>
      </Router>
    </QueryClientProvider>
  )
}

export default App
