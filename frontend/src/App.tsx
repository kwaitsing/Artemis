import { useEffect, useState } from 'react'
import { serverInStore } from '../../server/src/type'
import './App.css'
import { socket } from './utils/socket'
import { FatalErr, Loading } from 'ashes-wreath'
import { ServerCard } from './components/ServerCard'
import { ServerTable } from './components/ServerTable'

function App() {

  const [loading, setLoading] = useState(false)
  const [err, setERR] = useState('')
  const [data, setData] = useState<{
    servers: serverInStore[],
    timestamp: number
  }>()
  const [displayDown, setDisplayDown] = useState(false)
  const [down, setDown] = useState<serverInStore[]>([])

  const [currentTS, setCurrentTS] = useState(Math.floor(new Date().getTime() / 1000));

  useEffect(() => {
    const int = setInterval(() => {
      setCurrentTS(Math.floor(new Date().getTime() / 1000));
    }, 1000);

    return () => clearInterval(int);
  }, []);

  useEffect(() => {
    const mainfn = async () => {
      try {
        const returnData = await socket()
        if (returnData.status === 'ok') {
          let downServer: serverInStore[] = []
          const onlineServers: serverInStore[] = (returnData.data.servers as serverInStore[]).filter((server) => {
            if (currentTS - server.timestamp > 60) {
              downServer.push(server)
              return false
            } else {
              return true
            }
          })

          setDown(downServer)
          setData({
            servers: onlineServers,
            timestamp: returnData.data.timestamp
          })
        }
        if (loading) setLoading(false);
      } catch (error) {
        setERR(`${error}`)
        setLoading(false)
      }
    }
    mainfn()
  }, [currentTS])

  if (loading || !data) return <Loading msg={'Loading data from artemis server'} />

  return (
    <>
      <header className='center-align'>
        <h5 className='top-padding large-padding'>Artemis Server Monitor</h5>
        <span className='down-padding'>DimLight@build1.0.0</span>
      </header>

      <article className='no-round no-margin'>
      {
            down.length > 0 ? (
              <article onClick={() => setDisplayDown(!displayDown)} className="button small-padding small-round no-elevate round fill responsive">
                <nav>
                  <div className={`chip no-margin red no-elevate`}>{down.length}</div>
                  <div className="max">Server(s) down</div>
                  <i>{displayDown ? 'collapse_all' : 'expand_all'}</i>
                </nav>
              </article>
            ) : ''
          }
        <div className='small-margin' style={{ overflowX: 'auto' }}>
          <ServerTable currentTS={currentTS} servers={data.servers} downServers={down} displayDown={displayDown} />
        </div>
      </article>

      <div className='medium-padding center-align' style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {
          data.servers.map((server) => {
            return <ServerCard currentTS={currentTS} key={server.name} data={server} />
          })
        }
        {
          displayDown ? down.map((server) => {
            return <ServerCard currentTS={currentTS} key={server.name} data={server} />
          }) : ''
        }
      </div>
      <FatalErr msg={err} />
    </>
  )
}

export default App
