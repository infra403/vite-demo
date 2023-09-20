import {useEffect, useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/electron-vite.animate.svg'
import './App.css'
import { Button } from 'antd';
import {executeGetPrice, initClient} from "./worker/client.ts";
import {initWorker} from "./worker/worker.ts";

function App() {
  const [count, setCount] = useState(0)

    useEffect( () => {
        init()
    },[])

    const init = async () => {
        await initClient()
        await initWorker()
    }

    const click = async () => {
        const result = await executeGetPrice()
        console.log("click price", result)
    }
  return (
    <>
      <div>
        <a href="https://electron-vite.github.io" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
          <Button onClick={click}>test</Button>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
