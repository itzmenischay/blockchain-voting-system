import React from 'react'
import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements} from 'react-router'

// Page imports
import Home from './pages/Home'
import VotePage from './pages/VotePage'


const router = createBrowserRouter([
  {
    path: "/", element: <Home/>
  },
  {
    path: "/vote-page", element: <VotePage/>
  }
])
function App() {
  return (
    <RouterProvider router={router}/>
  )
}

export default App
