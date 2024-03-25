import { HashRouter as Router, Route, Routes } from "react-router-dom"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Auth0Provider } from '@auth0/auth0-react';

import Navigation from "./components/ui/navigation"
import { PageErrors } from "./components/ui/error";
import MySkillsPage from "./Pages/MySkills"
import SkillsPage from "./Pages/SkillsManifest"
import SkillPage from "./Pages/SkillDetails";
import PeoplePage from "./Pages/PeopleManifest"
import PersonPage from "./Pages/PersonDetails"
import HomePage from "./Pages/Home"
import './App.css'

const queryClient = new QueryClient()

const AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN
const AUTH0_CLIENT_ID = import.meta.env.VITE_AUTH0_CLIENT_ID
const AUTH0_CALLBACK_URL = import.meta.env.VITE_AUTH0_CALLBACK_URL

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Auth0Provider
          domain={AUTH0_DOMAIN}
          clientId={AUTH0_CLIENT_ID}
          authorizationParams={{
            redirect_uri: AUTH0_CALLBACK_URL || window.location.origin
          }}
        >
          <PageErrors>
            <Navigation />
            <div className='flex justify-center routes-wrapper'>
              <div className='w-11/12'>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/skills" element={<SkillsPage />} />
                  <Route path="/skills/:id" element={<SkillPage />} />
                  <Route path="/my-skills" element={<MySkillsPage />} />
                  <Route path="/people" element={<PeoplePage />} />
                  <Route path="/people/:id" element={<PersonPage />} />
                  <Route path="/*" element={<SkillsPage />} />
                </Routes>
              </div>
            </div>
          </PageErrors>
        </Auth0Provider>
      </Router>
    </QueryClientProvider>
  )
}

export default App
