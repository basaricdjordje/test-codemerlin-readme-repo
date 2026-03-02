import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const { t } = useTranslation()
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>{t('app.title')}</h1>
      <nav>
        <a href="#home">{t('navigation.home')}</a>
        <a href="#settings">{t('navigation.settings')}</a>
        <a href="#profile">{t('navigation.profile')}</a>
        <button type="button">{t('navigation.logout')}</button>
      </nav>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          <button type="button">{t('common.save')}</button>
          <button type="button">{t('common.cancel')}</button>
        </p>
      </div>
      <p className="read-the-docs">
        {t('common.loading')}
      </p>
    </>
  )
}

export default App
