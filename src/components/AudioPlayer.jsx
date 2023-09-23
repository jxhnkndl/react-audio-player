//#region *** MAIN IMPORTS ***
import { useRef, useState, useEffect } from 'react';
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
  FaVolumeMute,
} from 'react-icons/fa';
//#endregion

export const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  // References
  const audioRef = useRef(null);

  // Toggle play/pause
  const togglePlayPause = () => {
    const playing = isPlaying;

    setIsPlaying(prev => !prev);

    if (!playing) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }

  return (
    <section className={styles.playerContainer}>
      <audio ref={audioRef} src={trackData[1].audio} />
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
        {isPlaying ? (
          <FaPause className={styles.playPause} onClick={togglePlayPause} />
        ) : (
          <FaPlay className={styles.playPause} onClick={togglePlayPause} />
        )}
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
