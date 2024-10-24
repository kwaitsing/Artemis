import { useEffect, useState } from 'react'
import { serverInStore } from '../../server/src/type'
import './App.css'
import { socket } from './utils/socket'
import { FatalErr, Loading } from 'ashes-wreath'

function App() {

  const [loading, setLoading] = useState(true)
  const [err, setERR] = useState('')
  const [data, setData] = useState<{
    servers: serverInStore[],
    timestamp: number
  }>()

  useEffect(() => {
    setInterval(async () => {
      try {
        setData(await socket())
        if (loading) setLoading(false)
      } catch (error) {
        setERR(`${error}`)
      }
    }, 1000)
  }, [])

  if (loading) return <Loading msg={'Loading data from artemis server'} />

  return (
    <>
    <FatalErr msg={err} />
    </>
  )
}

export default App
