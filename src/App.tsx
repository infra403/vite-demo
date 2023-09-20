import {useEffect, useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/electron-vite.animate.svg'
import './App.css'
import {Button, message} from 'antd';
import {executeGetPrice, initClient} from "./worker/client.ts";
import {initWorker} from "./worker/worker.ts";

function App() {
  const [count, setCount] = useState(0)

    useEffect( () => {
        init()
    },[])

    const init = async () => {
        window.ipcRenderer.invoke("init").then(response => {
            if (response.success) {
                message.success("init success")
            } else {
                message.error(`init failed: ${response.message}`)
            }
        })
    }

    const click = async () => {
        const result = await executeGetPrice()
        console.log("click price", result)

        window.ipcRenderer.invoke("getPrice").then(response => {
            if (response.success) {
                message.success("gasPrice: " + response.data)
            } else {
                message.error(`gasPrice: ${response.message}`)
            }
        })
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
