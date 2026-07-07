import {RouterProvider} from "react-router"
import {router} from "./App.routes.jsx"
import { AuthProvider } from "./features/Auth/Auth.context.jsx" 
import { useInterview } from "./features/Interview-prep/hooks/useInterview.js"
import { InterviewProvider } from "./features/Interview-prep/Interview.context.jsx"

function App() {

  return (
    <AuthProvider>
      <InterviewProvider>
      <RouterProvider router={router} />
      </InterviewProvider>
    </AuthProvider>
  )
}

export default App
