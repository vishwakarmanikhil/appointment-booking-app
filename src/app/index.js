import React from 'react'
import { ConfigProvider } from 'antd'
import Router from '../router/router'
import Header from '../components/topbar'
import styles from './app.module.css'
import classNames from 'classnames'

function App() {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#00b96b' } }}>
      <div className={classNames(styles.main__container)}>
        <Header />
        <main className={classNames(styles.main__wrapper)}>
          <Router />
        </main>
      </div>
    </ConfigProvider>
  )
}

export default App
