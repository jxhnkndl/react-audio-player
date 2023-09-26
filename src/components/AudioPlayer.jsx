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
  const [currentTrack, setCurrentTrack] = useState(trackData[0]);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);

  // References
  const audioRef = useRef(null);
  const progressRef = useRef(null);
  const volumeRef = useRef(null);
  const animationRef = useRef(null);

  // Set progress and volume slider starting values
  useEffect(() => {
    progressRef.current.max = duration;
    volumeRef.current.style.setProperty('--volume-level', '50%');
  }, [trackIndex, duration]);

  // Autoplay next/previous track if current track was playing
  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play()
    }
  }, [currentTrack, isPlaying]);

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

    // requestAnimationFrame() works a lot like set interval except it tells the browser to run a particular animation at a particular interval. It can be cleared the same way a named interval can.

    if (!playing) {
      audioRef.current.play();
      animationRef.current = requestAnimationFrame(syncProgressBar);
    } else {
      audioRef.current.pause();
      cancelAnimationFrame(animationRef.current);
    }
  };

  // Update tracking position in song using progress bar
  const handleProgress = () => {
    // Set audio player's current time to MATCH the progress bar's current value
    audioRef.current.currentTime = progressRef.current.value;

    updateCurrentTime();
  };

  // Synchronize the slider thumb animation with the current audio position
  const syncProgressBar = () => {
    // Update progress bar's value to MATCH audio player's progress
    progressRef.current.value = audioRef.current.currentTime;

    updateCurrentTime();

    // When function is complete, browser should call the function again and repaint the UI; this process continues looping until the user hits PAUSE and the animation frame gets terminated.
    requestAnimationFrame(syncProgressBar);
  };

  // Set progress bar's width to match percentage of song complete
  const updateCurrentTime = () => {
    // Calculate current time as a percentage
    const percentComplete = (audioRef.current.currentTime / duration) * 100;

    // Update CSS variable with percent of song complete
    // This is what moves the colored, pre-thumb progress bar
    progressRef.current.style.setProperty(
      '--time-elapsed',
      `${percentComplete}%`
    );

    setTimeElapsed(progressRef.current.value);
  };

  // Advance to next track
  const nextTrack = () => {
    if (trackIndex >= trackData.length - 1) {
      setTrackIndex(0);
      setCurrentTrack(trackData[0]);
    } else {
      const next = trackIndex + 1;
      setTrackIndex(next);
      setCurrentTrack(trackData[next]);
    }

    if (isPlaying) {
      console.log(audioRef.current)
      audioRef.current.play();
    }
  };

  // Rewind to previous track
  const prevTrack = () => {
    if (trackIndex === 0) {
      const prev = trackData.length - 1;
      setTrackIndex(prev);
      setCurrentTrack(trackData[prev]);

      if (isPlaying) {
        audioRef.current.play();
      }
    } else {
      const prev = trackIndex - 1;
      setTrackIndex(prev);
      setCurrentTrack(trackData[prev]);

      if (isPlaying) {
        audioRef.current.play();
      }
    }
  };

  // Rewind 10 seconds
  const rewind = () => {
    audioRef.current.currentTime -= 10;
  }

  // Fast forward 10 seconds
  const fastForward = () => {
    audioRef.current.currentTime += 10;
  }

  // Synchronize volume slider and audio player's volume property
  const handleVolume = () => {
    // Set current volume as
    audioRef.current.volume = volumeRef.current.value / 100;

    // Calculate percentage of song complete to feed to CSS
    const percentVolume = audioRef.current.volume * 100;

    // Update CSS variable with volume percentage to update UI
    volumeRef.current.style.setProperty('--volume-level', `${percentVolume}%`);

    console.log(volumeRef.current.value);
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
        src={currentTrack.audio}
        onLoadedMetadata={loadTrack}
      />
      <figure className={styles.imgContainer}>
        <img
          className={styles.img}
          src={currentTrack.image}
          alt={`Temp alt text`}
        />
      </figure>
      <div className={styles.detailsContainer}>
        <h2 className={styles.title}>{currentTrack.title}</h2>
        <p className={styles.artist}>{currentTrack.artist}</p>
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
        <FaFastBackward onClick={prevTrack} />
        <FaBackward onClick={rewind} />
        {isPlaying ? (
          <FaPause className={styles.playPause} onClick={togglePlayPause} />
        ) : (
          <FaPlay className={styles.playPause} onClick={togglePlayPause} />
        )}
        <FaForward onClick={fastForward} />
        <FaFastForward onClick={nextTrack} />
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
