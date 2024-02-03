import { useEffect, useState } from "react";
import "../../index.css";

/**Dependencies*/
import axios from "axios";
import Tilt from "react-parallax-tilt";

/**Icons */
import { FaPause, FaPlay } from "react-icons/fa";
import { FaShuffle } from "react-icons/fa6";
import { TiArrowLoop } from "react-icons/ti";
import { HiSpeakerWave, HiMiniSpeakerXMark } from "react-icons/hi2";
import { IoPlayBack, IoPlayForward } from "react-icons/io5";
const Home = () => {
  const [allLanguageSongs, setAllLanguageSongs] = useState(() => {
    return [];
  });

  const [songPlaying, setSelectedSong] = useState(() => {
    return [];
  });

  const [playSong, setPlaySong] = useState(false);
  const [loop, setLoop] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [volume, setVolume] = useState(10);
  const [playendDetect, setDetect] = useState(false);
  const audiotag = document.getElementById("audiotag");
  const [playingLang, setPlayingLag] = useState(() => {
    return [];
  });

  useEffect(() => {
    getTrendingSongs();
  }, []);

  useEffect(() => {
    if (playendDetect === true) {
      if (loop === true) {
        // console.log("looping");
        audiotag.play();
        setDetect(false);
      } else if (shuffle === true) {
        // console.log("shuffiling");
        const randomNumber = Math.floor(Math.random() * playingLang.length);
        playSelectedSong([playingLang[randomNumber]][0].id, playingLang);
        setDetect(false);
      } else if (shuffle === false) {
        // console.log("next-song");
        for (let i = 0; i < playingLang.length; i++) {
          if (playingLang[i].id === songPlaying[0].id) {
            if (i === playingLang.length - 1) {
              playSelectedSong([playingLang[0]][0].id, playingLang);
            } else if (i !== playingLang.length - 1) {
              playSelectedSong([playingLang[i + 1]][0].id, playingLang);
            }
          }
        }
        setDetect(false);
      }
    }
  }, [playendDetect]);

  const getTrendingSongs = async () => {
    try {
      const allLanguages = [
        "hindi",
        "english",
        "punjabi",
        "tamil",
        "telugu",
        "marathi",
        "gujarati",
        "bengali",
        "kannada",
        "bhojpuri",
        "malayalam",
        "urdu",
        "haryanvi",
        "rajasthani",
        "odia",
        "assamese",
      ];

      const promises = allLanguages.map(async (each) => {
        const url = `${import.meta.env.VITE_ROOT_URL}/modules?language=${each}`;
        const res = await axios?.get(url);
        if (res.status === 200) {
          return { [each]: res.data.data };
        }
      });

      const allLanguageSongs = await Promise.all(promises);
      setAllLanguageSongs(allLanguageSongs);
    } catch (error) {
      console.error("Error TrendingNow", error);
    }
  };

  const playSelectedSong = async (songId, selectedSongsArr) => {
    try {
      const url = `${import.meta.env.VITE_ROOT_URL}/songs?id=${songId}`;
      const res = await axios.get(url);

      if (res.status === 200) {
        setSelectedSong(res.data.data);
        setPlaySong(true);
        audiotag.pause();
        audiotag.src =
          res.data.data[0].downloadUrl[
            res.data.data[0].downloadUrl.length - 1
          ].link;
        audiotag.play();
      }
    } catch (error) {
      console.error("Searched Song", error);
    }

    audiotag.addEventListener("ended", function () {
      setDetect(true);
    });
    setPlayingLag(selectedSongsArr);
  };

  const handleVolume = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audiotag) {
      audiotag.volume = newVolume;
    }
  };

  const changeSongs = (direction) => {
    for (let i = 0; i < playingLang.length; i++) {
      if (playingLang[i].id === songPlaying[0].id) {
        if (direction === "prev" && i === 0) {
          playSelectedSong(
            [playingLang[playingLang.length - 1]][0].id,
            playingLang
          );
        } else if (direction === "prev" && i !== 0) {
          playSelectedSong([playingLang[i - 1]][0].id, playingLang);
        } else if (direction === "next" && i === playingLang.length - 1) {
          playSelectedSong([playingLang[0]][0].id, playingLang);
        } else if (direction === "next" && i !== playingLang.length - 1) {
          playSelectedSong([playingLang[i + 1]][0].id, playingLang);
        }
      }
    }
  };

  return (
    <>
      <audio id="audiotag" type="audio/mp3" controls="" />
      <div className="home-con">
        <div className="home-sidebar">
          <img src="/logo.webp" />
        </div>
        <div className="home-page">
          {allLanguageSongs.length !== undefined &&
            allLanguageSongs.map(
              (ea) =>
                ea[Object.keys(ea).join(", ")].trending.songs.length > 0 && (
                  <>
                    <h1>{Object.keys(ea).join(", ")}</h1>
                    <div>
                      {ea[Object.keys(ea).join(", ")].trending.songs.map(
                        (each) => (
                          <Tilt
                            onClick={() => {
                              const songsArr =
                                ea[Object.keys(ea).join(", ")].trending.songs;
                              playSelectedSong(each.id, songsArr);
                            }}
                            className="songs"
                            key={each.id}
                          >
                            <img
                              onClick={() => {
                                const songsArr =
                                  ea[Object.keys(ea).join(", ")].trending.songs;
                                playSelectedSong(each.id, songsArr);
                              }}
                              className="songs-logo"
                              src="/logo.webp"
                              alt="logo"
                            />
                            <img
                              onClick={() => {
                                const songsArr =
                                  ea[Object.keys(ea).join(", ")].trending.songs;
                                playSelectedSong(each.id, songsArr);
                              }}
                              src={each.image[each.image.length - 1].link}
                              alt={each.name}
                            />
                            <p
                              onClick={() => {
                                const songsArr =
                                  ea[Object.keys(ea).join(", ")].trending.songs;
                                playSelectedSong(each.id, songsArr);
                              }}
                              style={{ cursor: "pointer" }}
                            >
                              {each.name}
                            </p>

                            {songPlaying.length > 0 ? (
                              <>
                                {songPlaying[0].id !== each.id && (
                                  <button
                                    className="songs-button"
                                    type="button"
                                  >
                                    <FaPlay />
                                  </button>
                                )}

                                {songPlaying[0].id === each.id &&
                                playSong === true ? (
                                  <button
                                    className="animate-bounce"
                                    type="button"
                                  >
                                    <FaPause />
                                  </button>
                                ) : (
                                  <button
                                    className="songs-button"
                                    type="button"
                                  >
                                    <FaPlay />
                                  </button>
                                )}
                              </>
                            ) : (
                              <button
                                onClick={() => {
                                  const songsArr = ea[
                                    Object.keys(ea).join(", ")
                                  ].trending.songsplaySelectedSong(
                                    each.id,
                                    songsArr
                                  );
                                }}
                                className="songs-button"
                                type="button"
                              >
                                <FaPlay />
                              </button>
                            )}
                          </Tilt>
                        )
                      )}
                    </div>
                  </>
                )
            )}

          <div id={songPlaying.length > 0 ? "player" : "player1"}>
            {songPlaying.length > 0 && (
              <>
                <img
                  src={
                    songPlaying[0].image[songPlaying[0].image.length - 1].link
                  }
                  alt={songPlaying[0].name}
                />
                <div>
                  <h4>{songPlaying[0].name}</h4>
                  <p>{songPlaying[0].primaryArtists}</p>
                </div>
                <div className="player-box">
                  {shuffle ? (
                    <button
                      onClick={() => {
                        setShuffle(!shuffle);
                      }}
                      type="button"
                    >
                      <FaShuffle />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setShuffle(!shuffle);
                      }}
                      type="button"
                    >
                      <FaShuffle className="text-white" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      changeSongs("prev");
                    }}
                    className="active:text-white"
                  >
                    <IoPlayBack />
                  </button>
                  {!playSong && (
                    <button
                      onClick={() => {
                        audiotag.play();
                        setPlaySong(true);
                      }}
                      type="button"
                    >
                      <FaPlay />
                    </button>
                  )}
                  {playSong && (
                    <button
                      onClick={() => {
                        audiotag.pause();
                        setPlaySong(false);
                      }}
                      type="button"
                    >
                      <FaPause />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      changeSongs("next");
                    }}
                    className="active:text-white"
                  >
                    <IoPlayForward />
                  </button>
                  {loop ? (
                    <button
                      onClick={() => {
                        setLoop(false);
                      }}
                      type="button"
                    >
                      <TiArrowLoop className="text-4xl" />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setLoop(true);
                      }}
                      type="button"
                    >
                      <TiArrowLoop className="text-4xl text-white" />
                    </button>
                  )}
                </div>
                <div className="volume-box">
                  {volume === 0 ? (
                    <button type="button">
                      <HiMiniSpeakerXMark />
                    </button>
                  ) : (
                    <button type="button">
                      <HiSpeakerWave />
                    </button>
                  )}
                  <input
                    onChange={handleVolume}
                    type="range"
                    id="volumeControl"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default Home;
