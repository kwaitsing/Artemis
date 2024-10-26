import { useEffect, useState } from 'react'
import { serverInStore } from '../../server/src/type'
import './App.css'
import { socket } from './utils/socket'
import { FatalErr, Loading } from 'ashes-wreath'
import { ServerCard } from './components/ServerCard'
import { ServerTable } from './components/ServerTable'

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
        const returnData = await socket()
        if (returnData.status === 'ok')
          setData(returnData.data);
        if (loading) setLoading(false)
      } catch (error) {
        setERR(`${error}`)
      }
    }, 1000)
  }, [])

  if (loading || !data) return <Loading msg={'Loading data from artemis server'} />

  return (
    <>
      <header className='center-align'>
        <h5 className='large-padding'>Artemis Server Monitor</h5>
      </header>
      <article className='no-round no-margin'>
        <div className='large-margin' style={{ overflowX: 'auto' }}>
          <ServerTable servers={data.servers} />
        </div>
      </article>


      <div className='medium-padding center-align' style={{ display: 'flex' , gap: '20px', flexWrap: 'wrap'}}>
        {
          data.servers.map((server) => {
            return <ServerCard key={server.name} data={server} />
          })
        }
      </div>
      <FatalErr msg={err} />
    </>
  )
}

export default App
