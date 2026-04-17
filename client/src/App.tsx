import { useEffect, useState } from 'react'
import { api } from './api'

function App() {
  const [status, setStatus] = useState('')

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await api.get('/api/health')
        setStatus(response.data.status)
      } catch (error) {
        setStatus('Error connecting to backend')
        console.error(error)
      }
    }

    checkHealth()
  }, [])

  return (
    <div>
      <h1>MealMatri</h1>
      <p>Backend Status: {status}</p>
    </div>
  )
}

export default App