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
  const [tracks, setTracks] = useState(trackData);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);

  // References
  const audioRef = useRef(null);
  const progressRef = useRef(null);
  const volumeRef = useRef(null);

  // Set progress and volume slider starting values
  useEffect(() => {
    progressRef.current.max = duration;
    volumeRef.current.style.setProperty('--volume-level', '50%');
  }, [duration]);

  // Load track metadata
  const loadTrack = () => {
    const totalSeconds = Math.floor(audioRef?.current?.duration);
    const totalSecondsElapsed = Math.floor(audioRef?.current?.currentTime);

    setDuration(totalSeconds);
    setTimeElapsed(totalSecondsElapsed);
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    const playing = isPlaying;

    setIsPlaying((prev) => !prev);

    if (!playing) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };

  // Update tracking position in song using progress bar
  const handleProgress = () => {
    // Set the audio track's current time as the progress bar's value
    audioRef.current.currentTime = progressRef.current.value;

    // Calculate percentage of song complete to feed to CSS
    const percentComplete = (audioRef.current.currentTime / duration) * 100;

    // Update CSS variable with percent of song complete
    // This is what moves the colored, pre-thumb progress bar
    progressRef.current.style.setProperty(
      '--time-elapsed',
      `${percentComplete}%`
    );

    // Update time elapsed with progress bar's value
    setTimeElapsed(progressRef.current.value);
  };

  // Synchronize volume slider and audio player's volume property
  const handleVolume = () => {
    // Set current volume as 
    audioRef.current.volume = volumeRef.current.value / 100;

    // Calculate percentage of song complete to feed to CSS
    const percentVolume = audioRef.current.volume  * 100;

    // Update CSS variable with volume percentage to update UI
    volumeRef.current.style.setProperty('--volume-level', `${percentVolume}%`);

    console.log(volumeRef.current.value)
  };

  // Format displayed duration and time elapsed
  const formatTime = (time) => {
    if (time && !isNaN(time)) {
      let mins = Math.floor(time / 60);
      let secs = Math.floor(time % 60);

      // Add leading 0 to seconds when less than 10 remain
      secs = secs < 10 ? `0${secs}` : secs;

      return `${mins}:${secs}`;
    }

    return '0:00';
  };

  return (
    <section className={styles.playerContainer}>
      <audio
        ref={audioRef}
        src={trackData[1].audio}
        onLoadedMetadata={loadTrack}
      />
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
        <input
          ref={progressRef}
          className={styles.progressBar}
          type="range"
          defaultValue={0}
          onChange={handleProgress}
        />
        <div className={styles.timeContainer}>
          <p>{formatTime(timeElapsed)}</p>
          <p>{formatTime(duration)}</p>
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
        <input
          ref={volumeRef}
          className={styles.volumeSlider}
          type="range"
          onChange={handleVolume}
          defaultValue={50}
        />
      </div>
    </section>
  );
};
