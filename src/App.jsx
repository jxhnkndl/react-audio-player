import styles from './App.module.css';

import { AudioPlayer } from "./components/AudioPlayer"

export const App = () => {
  return (
    <main className={styles.appContainer}>
      <AudioPlayer />
    </main>
  )
}
