//#region *** MAIN IMPORTS ***
import styles from './AudioPlayer.module.css';
import { trackData } from '../trackData';
//#endregion

//#region *** ICON IMPORTS ***
import {
  FaFastForward,
  FaFastBackward,
  FaForward,
  FaBackward,
  FaPlay,
  FaPause,
  FaVolumeOff,
  FaVolumeDown,
  FaVolumeUp,
  FaVolumeMute
} from 'react-icons/fa';
//#endregion

export const AudioPlayer = () => {
  return (
    <section className={styles.playerContainer}>
      <figure className={styles.imgContainer}>
        <img
          className={styles.img}
          src={trackData[1].image}
          alt={`Temp alt text`}
        />
      </figure>
      <div className={styles.detailsContainer}>
        <h2 className={styles.title}>{trackData[1].title}</h2>
        <p className={styles.artist}>{trackData[1].artist}</p>
      </div>
      <div className={styles.progressContainer}>
        <input className={styles.progressBar} type="range" />
        <div className={styles.timeContainer}>
          <p>00:00</p>
          <p>3:15</p>
        </div>
      </div>
      <div className={styles.controlsContainer}>
        <FaFastBackward />
        <FaBackward />
        <FaPlay className={styles.playPause} />
        <FaForward />
        <FaFastForward />
      </div>
      <div className={styles.volumeContainer}>
        <FaVolumeDown />
        <input className={styles.volumeSlider} type="range" />
      </div>
    </section>
  );
};
