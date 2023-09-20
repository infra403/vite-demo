import {useEffect, useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/electron-vite.animate.svg'
import './App.css'
import {Button, message} from 'antd';

function App() {
  const [count, setCount] = useState(0)

    useEffect( () => {
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
        window.ipcRenderer.invoke("getPrice").then(response => {
            if (response.success) {
                message.success("gasPrice: " + response.data)
            } else {
                message.error(`gasPrice: ${response.message}`)
            }
        })
    }

    const direct = async () => {
        window.ipcRenderer.invoke("getPriceDirect").then(response => {
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
          <Button onClick={init}>初始化</Button>
          <Button onClick={click}>获取gas</Button>
          <Button onClick={direct}>直接获取gas</Button>
      </div>
    </>
  )
}

export default App
