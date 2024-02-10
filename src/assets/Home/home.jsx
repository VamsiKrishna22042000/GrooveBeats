import { useEffect, useState } from "react";
import "../../index.css";

/**Component Imports */
import Albums from "./Albums";

/**Dependencies*/
import axios from "axios";
import Tilt from "react-parallax-tilt";

/**Icons */
import { FaPause, FaPlay } from "react-icons/fa";
import { FaShuffle } from "react-icons/fa6";
import { TiArrowLoop } from "react-icons/ti";
import { HiSpeakerWave, HiMiniSpeakerXMark } from "react-icons/hi2";
import { IoPlayBack, IoPlayForward } from "react-icons/io5";

import { RxCross2 } from "react-icons/rx";

const displayingContent = {
  home: "home",
  albums: "albums",
  playlists: "playlists",
  charts: "charts",
};

const Home = () => {
  const [selectedLanguages, setSelectedLanguages] = useState([]);

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

  const [searchBar, setSearchBar] = useState({ animation: "", search: "" });
  const [searchTimeId, setSearchTimeId] = useState();
  const [searchResults, setSearchResults] = useState(() => {
    return [];
  });

  const [albumToSearch, setAlbumToSearch] = useState("");
  const [obtainedAlbum, setObtaindAlbum] = useState(() => {
    return null;
  });
  const [whatToDisplay, setWhatToDisplay] = useState(displayingContent.home);
  const [load, setLoad] = useState(false);

  /**Observer Animation */

  useEffect(() => {
    const tiltCards = document.querySelectorAll(".tiltcon");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    tiltCards.forEach((tilt) => {
      observer.observe(tilt);
    });

    return () => {
      tiltCards.forEach((tilt) => {
        observer.unobserve(tilt);
      });
    };
  });

  /**Observer animation */

  useEffect(() => {
    if (searchBar.animation === "searchresults1" && searchBar.search !== "") {
      clearTimeout(searchTimeId);
      setSearchBar({ ...searchBar, animation: "searchresults2" });
    } else if (
      searchBar.animation === "searchresults2" &&
      searchBar.search === ""
    ) {
      document.getElementById("search").blur();
      setSearchBar({ ...searchBar, animation: "searchresults3" });
      setTimeout(() => {
        setSearchBar({ ...searchBar, animation: "" });
      }, 1000);
    }
  }, [searchBar.search]);

  useEffect(() => {
    if (searchBar.search !== "") {
      searchFunction();
    }
  }, [searchBar.search]);

  useEffect(() => {
    if (localStorage.getItem("selectedlang") !== null) {
      getTrendingSongs(JSON.parse(localStorage.getItem("selectedlang")));
    }
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

  useEffect(() => {
    if (albumToSearch !== "") {
      getAlbum();
    }
  }, [albumToSearch]);

  const getTrendingSongs = async (songsArr) => {
    try {
      const promises = songsArr.map(async (each) => {
        const url = `${import.meta.env.VITE_ROOT_URL}/modules?language=${each}`;
        const res = await axios?.get(url);
        if (res.status === 200) {
          setLoad(true);
          return { [each]: res.data.data };
        }
      });

      const allLanguageSongs = await Promise.all(promises);

      setAllLanguageSongs(allLanguageSongs);
    } catch (error) {
      setLoad(true);
      console.error("Error TrendingNow", error);
    }
  };

  const getAlbum = async () => {
    setLoad(false);
    try {
      const url = `${
        import.meta.env.VITE_ROOT_URL
      }/albums/?id=${albumToSearch}`;

      const res = await axios.get(url);
      if (res.status === 200) {
        setObtaindAlbum(res.data.data);
        setWhatToDisplay(displayingContent.albums);
      }
    } catch (error) {
      setLoad(true);
      console.error(`Error to Fetch Album`, error);
    }
  };

  const playSelectedSong = async (songId, selectedSongsArr) => {
    setLoad(false);
    try {
      const url = `${import.meta.env.VITE_ROOT_URL}/songs?id=${songId}`;
      const res = await axios.get(url);

      if (res.status === 200) {
        setLoad(true);
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
      setLoad(true);
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

  let cancelTokenSource = null;

  const searchFunction = async () => {
    try {
      setSearchResults([]);
      if (cancelTokenSource) {
        cancelTokenSource.cancel("Operation canceled due to new search");
      }

      cancelTokenSource = axios.CancelToken.source();

      const url = `${import.meta.env.VITE_ROOT_URL}/search/all?query=${
        searchBar.search
      }`;

      const res = await axios.get(url, {
        cancelToken: cancelTokenSource.token,
      });

      if (res.status === 200) {
        const obtainedData = [
          {
            songs:
              res.data.data.songs !== undefined
                ? res.data.data.songs.results
                : [],
          },
          {
            albums:
              res.data.data.albums !== undefined
                ? res.data.data.albums.results
                : [],
          },
          {
            playlists:
              res.data.data.playlists !== undefined
                ? res.data.data.playlists.results
                : [],
          },
          {
            topQuery:
              res.data.data.topQuery !== undefined
                ? res.data.data.topQuery.results
                : [],
          },
          {
            artists:
              res.data.data.artists !== undefined
                ? res.data.data.artists.results
                : [],
          },
        ];
        if (
          obtainedData[0].songs.length === 0 &&
          obtainedData[1].albums.length === 0 &&
          obtainedData[2].playlists.length === 0 &&
          obtainedData[3].topQuery.length === 0 &&
          obtainedData[4].artists.length === 0
        ) {
          setSearchResults([]);
        } else {
          setSearchResults(obtainedData);
        }
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.warn("Request canceled:", error.message);
      } else {
        console.error(error);
      }
    }
  };

  const SelectLanguages = () => {
    const [allLanguages, setAllLang] = useState([
      { language: "hindi", letter: "अ", backgroundColor: "#ffcccb" },
      { language: "english", letter: "A", backgroundColor: "#b3e0ff" },
      { language: "punjabi", letter: "ਪ", backgroundColor: "#ffb3b3" },
      { language: "tamil", letter: "த", backgroundColor: "#c2f0c2" },
      { language: "telugu", letter: "త", backgroundColor: "#ffd699" },
      { language: "marathi", letter: "म", backgroundColor: "#ccffcc" },
      { language: "gujarati", letter: "ગ", backgroundColor: "#ffb366" },
      { language: "bengali", letter: "ব", backgroundColor: "#e6ccff" },
      { language: "kannada", letter: "ಕ", backgroundColor: "#ff6666" },
      { language: "bhojpuri", letter: "भ", backgroundColor: "#99ccff" },
      { language: "malayalam", letter: "മ", backgroundColor: "#ffcc99" },
      { language: "urdu", letter: "ا", backgroundColor: "#ccff99" },
      { language: "haryanvi", letter: "ह", backgroundColor: "#ff9966" },
      { language: "rajasthani", letter: "र", backgroundColor: "#ffb3e6" },
      { language: "odia", letter: "ଓ", backgroundColor: "#ffdb4d" },
      { language: "assamese", letter: "অ", backgroundColor: "#99ffcc" },
    ]);
    const [selectedHere, setSelectedHere] = useState([]);

    const handleSelectHere = (sentlanguage) => {
      let filterdlanguages = [];
      let selectedLanguages = [];
      allLanguages.filter((options) =>
        options.language !== sentlanguage
          ? filterdlanguages.push(options)
          : selectedLanguages.push(options.language)
      );
      setAllLang(filterdlanguages);
      setSelectedHere([...selectedHere, ...selectedLanguages]);
    };

    return (
      <>
        <div className="selectedBackGround">
          <h1 className=" text-white font-semibold text-3xl  ml-[25%] mt-[2%]">
            Select Languages
          </h1>
          {selectedHere.length > 0 && (
            <button
              onClick={() => {
                localStorage.setItem(
                  "selectedlang",
                  JSON.stringify(selectedHere)
                );
                window.location.reload();
              }}
              type="button"
              className="  text-black font-semibold text-md absolute bottom-8 bg-white px-5 py-2 rounded-lg right-[10%] active:scale-90 transition-all duration-300"
            >
              Submit
            </button>
          )}
        </div>
        <div className="selectedSongCon">
          {allLanguages.map((each) => (
            <div
              onClick={() => {
                handleSelectHere(each.language);
              }}
              key={each.backgroundColor}
              style={{ backgroundColor: `${each.backgroundColor}` }}
              className="text-center p-[1%] w-[15%] m-[5%] rounded-lg cursor-pointer active:scale-75 transition-all duration-300"
            >
              <p className="capitalize  font-[500]">{each.language}</p>
              <h1>{each.letter}</h1>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <>
      <audio id="audiotag" type="audio/mp3" controls="" />
      <div className="home-con">
        <div className="home-sidebar">
          <div>
            <img src="/logo.webp" />
            <span>Groove Beats</span>
          </div>
          <button
            className="w-full text-lg ml-1 font-sand font-semibold text-white  mt-5 cursor-pointer text-start"
            type="button"
            onClick={() => {
              setWhatToDisplay(displayingContent.home);
              setTimeout(() => {
                const trendingsongsElement =
                  document.getElementById("trendingsongs");
                trendingsongsElement.scrollIntoView({ behavior: "smooth" });
              }, 50);
            }}
          >
            Trending Songs
          </button>
          <button
            className="w-full text-lg ml-1 font-sand font-semibold text-white  mt-5 cursor-pointer text-start"
            type="button"
            onClick={() => {
              setWhatToDisplay(displayingContent.home);
              setTimeout(() => {
                const trendingsongsElement =
                  document.getElementById("trendingalbums");
                trendingsongsElement.scrollIntoView({ behavior: "smooth" });
              }, 50);
            }}
          >
            Trending Albums
          </button>
          <button
            className="w-full text-lg ml-1 font-sand font-semibold text-white  mt-5 cursor-pointer text-start"
            type="button"
            onClick={() => {
              setWhatToDisplay(displayingContent.home);
              setTimeout(() => {
                const trendingsongsElement =
                  document.getElementById("otheralbums");
                trendingsongsElement.scrollIntoView({ behavior: "smooth" });
              }, 50);
            }}
          >
            Other Albums
          </button>
          <button
            className="w-full text-lg ml-1 font-sand font-semibold text-white  mt-5 cursor-pointer text-start"
            type="button"
            onClick={() => {
              setWhatToDisplay(displayingContent.home);
              setTimeout(() => {
                const trendingsongsElement =
                  document.getElementById("playlists");
                trendingsongsElement.scrollIntoView({ behavior: "smooth" });
              }, 50);
            }}
          >
            Playlists
          </button>
          <button
            className="w-full text-lg ml-1 font-sand font-semibold text-white  mt-5 cursor-pointer text-start"
            type="button"
            onClick={() => {
              setWhatToDisplay(displayingContent.home);
              setTimeout(() => {
                const trendingsongsElement = document.getElementById("charts");
                trendingsongsElement.scrollIntoView({ behavior: "smooth" });
              }, 50);
            }}
          >
            Top Charts
          </button>
        </div>

        {localStorage.getItem("selectedlang") === null ? (
          <SelectLanguages />
        ) : (
          <div className="home-page">
            {allLanguageSongs.length === 0 ? (
              <>
                <img
                  className="h-[20vh] w-[10vw] absolute left-[40%] top-[40%] animate-ping"
                  src="/logo.webp"
                />
                <img
                  className="h-[20vh] w-[10vw] absolute left-[40%] top-[40%] "
                  src="/logo.webp"
                />
              </>
            ) : (
              <>
                <div
                  className={
                    !load
                      ? "fixed h-[100vh!important] bg-[#111928BF] w-full top-0 left-0 z-10 backdrop-blur-sm saturate-180"
                      : "hidden1"
                  }
                >
                  <img
                    className={
                      !load
                        ? "h-[20vh] w-[10vw] absolute left-[45%] top-[40%] animate-ping"
                        : "hidden1"
                    }
                    src="/logo.webp"
                  />
                  <img
                    className={
                      !load
                        ? "h-[20vh] w-[10vw] absolute left-[45%] top-[40%]"
                        : "hidden1"
                    }
                    src="/logo.webp"
                  />
                </div>
                <div id="nav-bar">
                  <div className="searchbox">
                    <input
                      id="search"
                      className="searchbar"
                      type="search"
                      value={searchBar.search}
                      placeholder="Search"
                      onChange={(e) => {
                        setSearchBar({ ...searchBar, search: e.target.value });
                      }}
                      onFocus={() => {
                        setSearchBar({
                          ...searchBar,
                          animation: "searchresults1",
                        });
                        const timeId = setTimeout(() => {
                          setSearchBar({
                            ...searchBar,
                            animation: "searchresults2",
                          });
                        }, 1000);
                        setSearchTimeId(timeId);
                      }}
                      onBlur={() => {
                        // document.querySelectorAll("*").forEach((element) => {
                        //   if (element?.className === "searchresults2") {
                        //     console.log(true);
                        //   } else {
                        //     console.log(false);
                        //   }
                        // });
                        // setSearchBar({
                        //   ...searchBar,
                        //   animation: "searchresults3",
                        // });
                        // setTimeout(() => {
                        //   setSearchBar({ ...searchBar, animation: "" });
                        // }, 1000);
                      }}
                    />
                    {searchBar.search !== "" && (
                      <RxCross2
                        className="cross cursor-pointer text-white"
                        onClick={() => {
                          setSearchBar({ ...searchBar, search: "" });
                        }}
                      />
                    )}
                  </div>
                  <div className={searchBar.animation}>
                    {searchBar.animation === "searchresults2" && (
                      <RxCross2
                        className="cross cursor-pointer mr-5 text-white"
                        onClick={() => {
                          setSearchBar({ ...searchBar, search: "" });
                        }}
                      />
                    )}
                    {searchResults.length <= 0 && (
                      <h1 className="text-white text-5xl ml-52 mt-48">
                        No Results Found
                      </h1>
                    )}
                    {searchBar.animation === "searchresults2" &&
                    searchBar.search === "" ? (
                      <>
                        <div className="search-re">
                          <h5 className="search-re">Trending Songs</h5>
                          <div>
                            {allLanguageSongs.length !== undefined &&
                              allLanguageSongs.map(
                                (ea) =>
                                  ea[Object.keys(ea).join(", ")].trending.songs
                                    .length > 0 && (
                                    <>
                                      <h1 className="capitalize">
                                        {Object.keys(ea).join(", ")}
                                      </h1>
                                      <div>
                                        {ea[
                                          Object.keys(ea).join(", ")
                                        ].trending.songs.map((each) => (
                                          <div
                                            onClick={() => {
                                              setSearchBar({
                                                ...searchBar,
                                                animation: "searchresults3",
                                              });
                                              setTimeout(() => {
                                                setSearchBar({
                                                  ...searchBar,
                                                  animation: "",
                                                });
                                              }, 1000);
                                              const songsArr =
                                                ea[Object.keys(ea).join(", ")]
                                                  .trending.songs;
                                              playSelectedSong(
                                                each.id,
                                                songsArr
                                              );
                                            }}
                                            className="songs-search"
                                            key={each.id}
                                          >
                                            <img
                                              onClick={() => {
                                                setSearchBar({
                                                  ...searchBar,
                                                  animation: "searchresults3",
                                                });
                                                setTimeout(() => {
                                                  setSearchBar({
                                                    ...searchBar,
                                                    animation: "",
                                                  });
                                                }, 1000);
                                                const songsArr =
                                                  ea[Object.keys(ea).join(", ")]
                                                    .trending.songs;
                                                playSelectedSong(
                                                  each.id,
                                                  songsArr
                                                );
                                              }}
                                              id="songs-logo-search"
                                              src="/logo.webp"
                                              alt="logo"
                                            />
                                            <img
                                              onClick={() => {
                                                setSearchBar({
                                                  ...searchBar,
                                                  animation: "searchresults3",
                                                });
                                                setTimeout(() => {
                                                  setSearchBar({
                                                    ...searchBar,
                                                    animation: "",
                                                  });
                                                }, 1000);
                                                const songsArr =
                                                  ea[Object.keys(ea).join(", ")]
                                                    .trending.songs;
                                                playSelectedSong(
                                                  each.id,
                                                  songsArr
                                                );
                                              }}
                                              src={
                                                each.image[
                                                  each.image.length - 1
                                                ].link
                                              }
                                              alt={each.name}
                                            />
                                            <p
                                              onClick={() => {
                                                setSearchBar({
                                                  ...searchBar,
                                                  animation: "searchresults3",
                                                });
                                                setTimeout(() => {
                                                  setSearchBar({
                                                    ...searchBar,
                                                    animation: "",
                                                  });
                                                }, 1000);

                                                const songsArr =
                                                  ea[Object.keys(ea).join(", ")]
                                                    .trending.songs;
                                                playSelectedSong(
                                                  each.id,
                                                  songsArr
                                                );
                                              }}
                                              style={{ cursor: "pointer" }}
                                            >
                                              {each.name}
                                            </p>
                                          </div>
                                        ))}
                                      </div>
                                    </>
                                  )
                              )}
                          </div>
                        </div>
                        <div>
                          <h5>Trending Albums</h5>
                          <div>
                            {allLanguageSongs.length !== undefined &&
                              allLanguageSongs.map(
                                (ea) =>
                                  ea[Object.keys(ea).join(", ")].trending.albums
                                    .length > 0 && (
                                    <>
                                      <h1 className="capitalize">
                                        {Object.keys(ea).join(", ")}
                                      </h1>
                                      <div>
                                        {ea[
                                          Object.keys(ea).join(", ")
                                        ].trending.albums.map((each) => (
                                          <div
                                            onClick={() => {
                                              setSearchBar({
                                                ...searchBar,
                                                animation: "searchresults3",
                                              });
                                              setTimeout(() => {
                                                setSearchBar({
                                                  ...searchBar,
                                                  animation: "",
                                                });
                                              }, 1000);
                                              setAlbumToSearch(each.id);
                                            }}
                                            className="songs-search"
                                            key={each.id}
                                          >
                                            <img
                                              onClick={() => {
                                                setSearchBar({
                                                  ...searchBar,
                                                  animation: "searchresults3",
                                                });
                                                setTimeout(() => {
                                                  setSearchBar({
                                                    ...searchBar,
                                                    animation: "",
                                                  });
                                                }, 1000);
                                                setAlbumToSearch(each.id);
                                              }}
                                              id="songs-logo-search"
                                              src="/logo.webp"
                                              alt="logo"
                                            />
                                            <img
                                              onClick={() => {
                                                setSearchBar({
                                                  ...searchBar,
                                                  animation: "searchresults3",
                                                });
                                                setTimeout(() => {
                                                  setSearchBar({
                                                    ...searchBar,
                                                    animation: "",
                                                  });
                                                }, 1000);

                                                setAlbumToSearch(each.id);
                                              }}
                                              src={
                                                each.image[
                                                  each.image.length - 1
                                                ].link
                                              }
                                              alt={each.name}
                                            />
                                            <p
                                              onClick={() => {
                                                setSearchBar({
                                                  ...searchBar,
                                                  animation: "searchresults3",
                                                });
                                                setTimeout(() => {
                                                  setSearchBar({
                                                    ...searchBar,
                                                    animation: "",
                                                  });
                                                }, 1000);
                                                setAlbumToSearch(each.id);
                                              }}
                                              style={{ cursor: "pointer" }}
                                            >
                                              {each.name}
                                            </p>
                                          </div>
                                        ))}
                                      </div>
                                    </>
                                  )
                              )}
                          </div>
                        </div>
                        <div>
                          <h5>Other Albums</h5>
                          <div>
                            {allLanguageSongs.length !== undefined &&
                              allLanguageSongs.map(
                                (ea) =>
                                  ea[Object.keys(ea).join(", ")].albums.length >
                                    0 && (
                                    <>
                                      <h1 className="capitalize">
                                        {Object.keys(ea).join(", ")}
                                      </h1>
                                      <div>
                                        {ea[
                                          Object.keys(ea).join(", ")
                                        ].albums.map((each) => (
                                          <div
                                            onClick={() => {
                                              setSearchBar({
                                                ...searchBar,
                                                animation: "searchresults3",
                                              });
                                              setTimeout(() => {
                                                setSearchBar({
                                                  ...searchBar,
                                                  animation: "",
                                                });
                                              }, 1000);

                                              const songsArr =
                                                ea[Object.keys(ea).join(", ")]
                                                  .albums;

                                              if (each.type === "album") {
                                                setAlbumToSearch(each.id);
                                              } else if (each.type === "song") {
                                                playSelectedSong(
                                                  each.id,
                                                  songsArr
                                                );
                                              }
                                            }}
                                            className="songs-search"
                                            key={each.id}
                                          >
                                            <img
                                              onClick={() => {
                                                setSearchBar({
                                                  ...searchBar,
                                                  animation: "searchresults3",
                                                });
                                                setTimeout(() => {
                                                  setSearchBar({
                                                    ...searchBar,
                                                    animation: "",
                                                  });
                                                }, 1000);
                                                const songsArr =
                                                  ea[Object.keys(ea).join(", ")]
                                                    .albums;

                                                if (each.type === "album") {
                                                  setAlbumToSearch(each.id);
                                                } else if (
                                                  each.type === "song"
                                                ) {
                                                  playSelectedSong(
                                                    each.id,
                                                    songsArr
                                                  );
                                                }
                                              }}
                                              id="songs-logo-search"
                                              src="/logo.webp"
                                              alt="logo"
                                            />
                                            <img
                                              onClick={() => {
                                                setSearchBar({
                                                  ...searchBar,
                                                  animation: "searchresults3",
                                                });
                                                setTimeout(() => {
                                                  setSearchBar({
                                                    ...searchBar,
                                                    animation: "",
                                                  });
                                                }, 1000);
                                                const songsArr =
                                                  ea[Object.keys(ea).join(", ")]
                                                    .albums;

                                                if (each.type === "album") {
                                                  setAlbumToSearch(each.id);
                                                } else if (
                                                  each.type === "song"
                                                ) {
                                                  playSelectedSong(
                                                    each.id,
                                                    songsArr
                                                  );
                                                }
                                              }}
                                              src={
                                                each.image[
                                                  each.image.length - 1
                                                ].link
                                              }
                                              alt={each.name}
                                            />
                                            <p
                                              onClick={() => {
                                                setSearchBar({
                                                  ...searchBar,
                                                  animation: "searchresults3",
                                                });
                                                setTimeout(() => {
                                                  setSearchBar({
                                                    ...searchBar,
                                                    animation: "",
                                                  });
                                                }, 1000);
                                                const songsArr =
                                                  ea[Object.keys(ea).join(", ")]
                                                    .albums;

                                                if (each.type === "album") {
                                                  setAlbumToSearch(each.id);
                                                } else if (
                                                  each.type === "song"
                                                ) {
                                                  playSelectedSong(
                                                    each.id,
                                                    songsArr
                                                  );
                                                }
                                              }}
                                              style={{ cursor: "pointer" }}
                                            >
                                              {each.name}
                                            </p>
                                          </div>
                                        ))}
                                      </div>
                                    </>
                                  )
                              )}
                          </div>
                        </div>
                        <div>
                          <h5>Playlists</h5>
                          <div>
                            {allLanguageSongs.length !== undefined &&
                              allLanguageSongs.map(
                                (ea) =>
                                  ea[Object.keys(ea).join(", ")].playlists
                                    .length > 0 && (
                                    <>
                                      <h1 className="capitalize">
                                        {Object.keys(ea).join(", ")}
                                      </h1>
                                      <div>
                                        {ea[
                                          Object.keys(ea).join(", ")
                                        ].playlists.map((each) => (
                                          <div
                                            onClick={() => {
                                              setSearchBar({
                                                ...searchBar,
                                                animation: "searchresults3",
                                              });
                                              setTimeout(() => {
                                                setSearchBar({
                                                  ...searchBar,
                                                  animation: "",
                                                });
                                              }, 1000);
                                              // const songsArr =
                                              //   ea[Object.keys(ea).join(", ")]
                                              //     .trending.albums;
                                              // playSelectedSong(each.id, songsArr);
                                            }}
                                            className="songs-search"
                                            key={each.id}
                                          >
                                            <img
                                              onClick={() => {
                                                setSearchBar({
                                                  ...searchBar,
                                                  animation: "searchresults3",
                                                });
                                                setTimeout(() => {
                                                  setSearchBar({
                                                    ...searchBar,
                                                    animation: "",
                                                  });
                                                }, 1000);
                                                // const songsArr =
                                                //   ea[Object.keys(ea).join(", ")]
                                                //     .trending.songs;
                                                // playSelectedSong(each.id, songsArr);
                                              }}
                                              id="songs-logo-search"
                                              src="/logo.webp"
                                              alt="logo"
                                            />
                                            <img
                                              onClick={() => {
                                                setSearchBar({
                                                  ...searchBar,
                                                  animation: "searchresults3",
                                                });
                                                setTimeout(() => {
                                                  setSearchBar({
                                                    ...searchBar,
                                                    animation: "",
                                                  });
                                                }, 1000);
                                                // const songsArr =
                                                //   ea[Object.keys(ea).join(", ")]
                                                //     .trending.songs;
                                                // playSelectedSong(each.id, songsArr);
                                              }}
                                              src={
                                                each.image[
                                                  each.image.length - 1
                                                ].link
                                              }
                                              alt={each.titile}
                                            />
                                            <p
                                              onClick={() => {
                                                setSearchBar({
                                                  ...searchBar,
                                                  animation: "searchresults3",
                                                });
                                                setTimeout(() => {
                                                  setSearchBar({
                                                    ...searchBar,
                                                    animation: "",
                                                  });
                                                }, 1000);
                                                // const songsArr =
                                                //   ea[Object.keys(ea).join(", ")]
                                                //     .trending.songs;
                                                // playSelectedSong(each.id, songsArr);
                                              }}
                                              style={{ cursor: "pointer" }}
                                            >
                                              {each.title}
                                            </p>
                                          </div>
                                        ))}
                                      </div>
                                    </>
                                  )
                              )}
                          </div>
                        </div>
                        <div>
                          <h5>Top Charts</h5>
                          <div>
                            {allLanguageSongs.length !== undefined &&
                              allLanguageSongs.map(
                                (ea) =>
                                  ea[Object.keys(ea).join(", ")].charts.length >
                                    0 && (
                                    <>
                                      <h1 className="capitalize">
                                        {Object.keys(ea).join(", ")}
                                      </h1>
                                      <div>
                                        {ea[
                                          Object.keys(ea).join(", ")
                                        ].charts.map((each) => (
                                          <div
                                            onClick={() => {
                                              setSearchBar({
                                                ...searchBar,
                                                animation: "searchresults3",
                                              });
                                              setTimeout(() => {
                                                setSearchBar({
                                                  ...searchBar,
                                                  animation: "",
                                                });
                                              }, 1000);
                                              // const songsArr =
                                              //   ea[Object.keys(ea).join(", ")]
                                              //     .trending.albums;
                                              // playSelectedSong(each.id, songsArr);
                                            }}
                                            className="songs-search"
                                            key={each.id}
                                          >
                                            <img
                                              onClick={() => {
                                                setSearchBar({
                                                  ...searchBar,
                                                  animation: "searchresults3",
                                                });
                                                setTimeout(() => {
                                                  setSearchBar({
                                                    ...searchBar,
                                                    animation: "",
                                                  });
                                                }, 1000);
                                                // const songsArr =
                                                //   ea[Object.keys(ea).join(", ")]
                                                //     .trending.songs;
                                                // playSelectedSong(each.id, songsArr);
                                              }}
                                              id="songs-logo-search"
                                              src="/logo.webp"
                                              alt="logo"
                                            />
                                            <img
                                              onClick={() => {
                                                setSearchBar({
                                                  ...searchBar,
                                                  animation: "searchresults3",
                                                });
                                                setTimeout(() => {
                                                  setSearchBar({
                                                    ...searchBar,
                                                    animation: "",
                                                  });
                                                }, 1000);
                                                // const songsArr =
                                                //   ea[Object.keys(ea).join(", ")]
                                                //     .trending.songs;
                                                // playSelectedSong(each.id, songsArr);
                                              }}
                                              src={
                                                each.image[
                                                  each.image.length - 1
                                                ].link
                                              }
                                              alt={each.titile}
                                            />
                                            <p
                                              onClick={() => {
                                                setSearchBar({
                                                  ...searchBar,
                                                  animation: "searchresults3",
                                                });
                                                setTimeout(() => {
                                                  setSearchBar({
                                                    ...searchBar,
                                                    animation: "",
                                                  });
                                                }, 1000);
                                                // const songsArr =
                                                //   ea[Object.keys(ea).join(", ")]
                                                //     .trending.songs;
                                                // playSelectedSong(each.id, songsArr);
                                              }}
                                              style={{ cursor: "pointer" }}
                                            >
                                              {each.title}
                                            </p>
                                          </div>
                                        ))}
                                      </div>
                                    </>
                                  )
                              )}
                          </div>
                        </div>
                      </>
                    ) : (
                      searchBar.animation === "searchresults2" &&
                      searchBar.search !== "" &&
                      searchResults.length > 0 && (
                        <>
                          {searchResults[0].songs.length > 0 && (
                            <div>
                              <h5>Songs</h5>
                              <div>
                                {searchResults.length !== undefined && (
                                  <div>
                                    {searchResults[0].songs.map((each) => (
                                      <div
                                        onClick={() => {
                                          setSearchBar({
                                            search: "",
                                            animation: "searchresults3",
                                          });
                                          setTimeout(() => {
                                            setSearchBar({
                                              search: "",
                                              animation: "",
                                            });
                                          }, 1000);
                                          const songsArr =
                                            searchResults[0].songs;

                                          playSelectedSong(each.id, songsArr);
                                        }}
                                        className="songs-search"
                                        key={each.id}
                                      >
                                        <img
                                          onClick={() => {
                                            setSearchBar({
                                              search: "",
                                              animation: "searchresults3",
                                            });
                                            setTimeout(() => {
                                              setSearchBar({
                                                search: "",
                                                animation: "",
                                              });
                                            }, 1000);
                                            const songsArr =
                                              searchResults[0].songs;
                                            playSelectedSong(each.id, songsArr);
                                          }}
                                          id="songs-logo-search"
                                          src="/logo.webp"
                                          alt="logo"
                                        />
                                        <img
                                          onClick={() => {
                                            setSearchBar({
                                              search: "",
                                              animation: "searchresults3",
                                            });
                                            setTimeout(() => {
                                              setSearchBar({
                                                search: "",
                                                animation: "",
                                              });
                                            }, 1000);
                                            const songsArr =
                                              searchResults[0].songs;
                                            playSelectedSong(each.id, songsArr);
                                          }}
                                          src={
                                            each.image[each.image.length - 1]
                                              .link
                                          }
                                          alt={each.title}
                                        />
                                        <p
                                          onClick={() => {
                                            setSearchBar({
                                              search: "",
                                              animation: "searchresults3",
                                            });
                                            setTimeout(() => {
                                              setSearchBar({
                                                search: "",
                                                animation: "",
                                              });
                                            }, 1000);

                                            const songsArr =
                                              searchResults[0].songs;
                                            playSelectedSong(each.id, songsArr);
                                          }}
                                          style={{ cursor: "pointer" }}
                                        >
                                          {each.title}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          {searchResults[1].albums.length > 0 && (
                            <div>
                              <h5>Albums</h5>
                              <div>
                                {searchResults.length !== undefined && (
                                  <div>
                                    {searchResults[1].albums.map((each) => (
                                      <div
                                        onClick={() => {
                                          setSearchBar({
                                            search: "",
                                            animation: "searchresults3",
                                          });
                                          setTimeout(() => {
                                            setSearchBar({
                                              search: "",
                                              animation: "",
                                            });
                                          }, 1000);

                                          setAlbumToSearch(each.id);
                                        }}
                                        className="songs-search"
                                        key={each.id}
                                      >
                                        <img
                                          onClick={() => {
                                            setSearchBar({
                                              search: "",
                                              animation: "searchresults3",
                                            });
                                            setTimeout(() => {
                                              setSearchBar({
                                                search: "",
                                                animation: "",
                                              });
                                            }, 1000);
                                            setAlbumToSearch(each.id);
                                          }}
                                          id="songs-logo-search"
                                          src="/logo.webp"
                                          alt="logo"
                                        />
                                        <img
                                          onClick={() => {
                                            setSearchBar({
                                              search: "",
                                              animation: "searchresults3",
                                            });
                                            setTimeout(() => {
                                              setSearchBar({
                                                search: "",
                                                animation: "",
                                              });
                                            }, 1000);
                                            setAlbumToSearch(each.id);
                                          }}
                                          src={
                                            each.image[each.image.length - 1]
                                              .link
                                          }
                                          alt={each.title}
                                        />
                                        <p
                                          onClick={() => {
                                            setSearchBar({
                                              search: "",
                                              animation: "searchresults3",
                                            });
                                            setTimeout(() => {
                                              setSearchBar({
                                                search: "",
                                                animation: "",
                                              });
                                            }, 1000);

                                            setAlbumToSearch(each.id);
                                          }}
                                          style={{ cursor: "pointer" }}
                                        >
                                          {each.title}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          {searchResults[2].playlists.length > 0 && (
                            <div>
                              <h5>Playlists</h5>
                              <div>
                                {searchResults.length !== undefined && (
                                  <div>
                                    {searchResults[2].playlists.map((each) => (
                                      <div
                                        onClick={() => {
                                          setSearchBar({
                                            search: "",
                                            animation: "searchresults3",
                                          });
                                          setTimeout(() => {
                                            setSearchBar({
                                              search: "",
                                              animation: "",
                                            });
                                          }, 1000);
                                          const songsArr =
                                            searchResults[0].songs;

                                          playSelectedSong(each.id, songsArr);
                                        }}
                                        className="songs-search"
                                        key={each.id}
                                      >
                                        <img
                                          onClick={() => {
                                            setSearchBar({
                                              search: "",
                                              animation: "searchresults3",
                                            });
                                            setTimeout(() => {
                                              setSearchBar({
                                                search: "",
                                                animation: "",
                                              });
                                            }, 1000);
                                            const songsArr =
                                              searchResults[0].songs;
                                            playSelectedSong(each.id, songsArr);
                                          }}
                                          id="songs-logo-search"
                                          src="/logo.webp"
                                          alt="logo"
                                        />
                                        <img
                                          onClick={() => {
                                            setSearchBar({
                                              search: "",
                                              animation: "searchresults3",
                                            });
                                            setTimeout(() => {
                                              setSearchBar({
                                                search: "",
                                                animation: "",
                                              });
                                            }, 1000);
                                            const songsArr =
                                              searchResults[0].songs;
                                            playSelectedSong(each.id, songsArr);
                                          }}
                                          src={
                                            each.image[each.image.length - 1]
                                              .link
                                          }
                                          alt={each.title}
                                        />
                                        <p
                                          onClick={() => {
                                            setSearchBar({
                                              search: "",
                                              animation: "searchresults3",
                                            });
                                            setTimeout(() => {
                                              setSearchBar({
                                                search: "",
                                                animation: "",
                                              });
                                            }, 1000);

                                            const songsArr =
                                              searchResults[0].songs;
                                            playSelectedSong(each.id, songsArr);
                                          }}
                                          style={{ cursor: "pointer" }}
                                        >
                                          {each.title}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          {searchResults[3].topQuery.length > 0 && (
                            <div>
                              <h5>Top Query</h5>
                              <div>
                                {searchResults.length !== undefined && (
                                  <div>
                                    {searchResults[3].topQuery.map((each) => (
                                      <div
                                        onClick={() => {
                                          setSearchBar({
                                            search: "",
                                            animation: "searchresults3",
                                          });
                                          setTimeout(() => {
                                            setSearchBar({
                                              search: "",
                                              animation: "",
                                            });
                                          }, 1000);
                                          const songsArr =
                                            searchResults[0].songs;

                                          playSelectedSong(each.id, songsArr);
                                        }}
                                        className="songs-search"
                                        key={each.id}
                                      >
                                        <img
                                          onClick={() => {
                                            setSearchBar({
                                              search: "",
                                              animation: "searchresults3",
                                            });
                                            setTimeout(() => {
                                              setSearchBar({
                                                search: "",
                                                animation: "",
                                              });
                                            }, 1000);
                                            const songsArr =
                                              searchResults[0].songs;
                                            playSelectedSong(each.id, songsArr);
                                          }}
                                          id="songs-logo-search"
                                          src="/logo.webp"
                                          alt="logo"
                                        />
                                        <img
                                          onClick={() => {
                                            setSearchBar({
                                              search: "",
                                              animation: "searchresults3",
                                            });
                                            setTimeout(() => {
                                              setSearchBar({
                                                search: "",
                                                animation: "",
                                              });
                                            }, 1000);
                                            const songsArr =
                                              searchResults[0].songs;
                                            playSelectedSong(each.id, songsArr);
                                          }}
                                          src={
                                            each.image[each.image.length - 1]
                                              .link
                                          }
                                          alt={each.title}
                                        />
                                        <p
                                          onClick={() => {
                                            setSearchBar({
                                              search: "",
                                              animation: "searchresults3",
                                            });
                                            setTimeout(() => {
                                              setSearchBar({
                                                search: "",
                                                animation: "",
                                              });
                                            }, 1000);

                                            const songsArr =
                                              searchResults[0].songs;
                                            playSelectedSong(each.id, songsArr);
                                          }}
                                          style={{ cursor: "pointer" }}
                                        >
                                          {each.title}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          {searchResults[4].artists.length > 0 && (
                            <div>
                              <h5>Artists</h5>
                              <div>
                                {searchResults.length !== undefined && (
                                  <div>
                                    {searchResults[4].artists.map((each) => (
                                      <div
                                        onClick={() => {
                                          setSearchBar({
                                            search: "",
                                            animation: "searchresults3",
                                          });
                                          setTimeout(() => {
                                            setSearchBar({
                                              search: "",
                                              animation: "",
                                            });
                                          }, 1000);
                                          const songsArr =
                                            searchResults[0].songs;

                                          playSelectedSong(each.id, songsArr);
                                        }}
                                        className="songs-search"
                                        key={each.id}
                                      >
                                        <img
                                          onClick={() => {
                                            setSearchBar({
                                              search: "",
                                              animation: "searchresults3",
                                            });
                                            setTimeout(() => {
                                              setSearchBar({
                                                search: "",
                                                animation: "",
                                              });
                                            }, 1000);
                                            const songsArr =
                                              searchResults[0].songs;
                                            playSelectedSong(each.id, songsArr);
                                          }}
                                          id="songs-logo-search"
                                          src="/logo.webp"
                                          alt="logo"
                                        />
                                        <img
                                          onClick={() => {
                                            setSearchBar({
                                              search: "",
                                              animation: "searchresults3",
                                            });
                                            setTimeout(() => {
                                              setSearchBar({
                                                search: "",
                                                animation: "",
                                              });
                                            }, 1000);
                                            const songsArr =
                                              searchResults[0].songs;
                                            playSelectedSong(each.id, songsArr);
                                          }}
                                          src={
                                            each.image[each.image.length - 1]
                                              .link
                                          }
                                          alt={each.title}
                                        />
                                        <p
                                          onClick={() => {
                                            setSearchBar({
                                              search: "",
                                              animation: "searchresults3",
                                            });
                                            setTimeout(() => {
                                              setSearchBar({
                                                search: "",
                                                animation: "",
                                              });
                                            }, 1000);

                                            const songsArr =
                                              searchResults[0].songs;
                                            playSelectedSong(each.id, songsArr);
                                          }}
                                          style={{ cursor: "pointer" }}
                                        >
                                          {each.title}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </>
                      )
                    )}
                  </div>
                </div>
                {obtainedAlbum !== null && (
                  <img
                    onClick={() => {
                      setWhatToDisplay(
                        whatToDisplay === displayingContent.albums
                          ? displayingContent.home
                          : displayingContent.albums
                      );
                    }}
                    className="fixed z-10 h-16 w-16 rounded-full top-10 right-5 object-fill animate-bounce cursor-pointer"
                    src={
                      obtainedAlbum.image[obtainedAlbum.image.length - 1].link
                    }
                    alt={obtainedAlbum.id}
                  />
                )}
                {whatToDisplay === displayingContent.home ? (
                  <>
                    {/**Trending songs */}
                    <h2
                      className="text-5xl font-sand font-bold text-white ml-2.5 mb-4"
                      id="trendingsongs"
                    >
                      Trending Songs
                    </h2>
                    {allLanguageSongs.length !== undefined &&
                      allLanguageSongs.map(
                        (ea) =>
                          ea[Object.keys(ea).join(", ")].trending.songs.length >
                            0 && (
                            <>
                              <h1>{Object.keys(ea).join(", ")}</h1>
                              <div className="tiltcon">
                                {ea[
                                  Object.keys(ea).join(", ")
                                ].trending.songs.map((each) => (
                                  <Tilt
                                    onClick={() => {
                                      const songsArr =
                                        ea[Object.keys(ea).join(", ")].trending
                                          .songs;
                                      playSelectedSong(each.id, songsArr);
                                    }}
                                    className="songs"
                                    key={each.id}
                                  >
                                    <img
                                      onClick={() => {
                                        const songsArr =
                                          ea[Object.keys(ea).join(", ")]
                                            .trending.songs;
                                        playSelectedSong(each.id, songsArr);
                                      }}
                                      className="songs-logo"
                                      src="/logo.webp"
                                      alt="logo"
                                    />
                                    <img
                                      onClick={() => {
                                        const songsArr =
                                          ea[Object.keys(ea).join(", ")]
                                            .trending.songs;
                                        playSelectedSong(each.id, songsArr);
                                      }}
                                      src={
                                        each.image[each.image.length - 1].link
                                      }
                                      alt={each.name}
                                    />
                                    <p
                                      onClick={() => {
                                        const songsArr =
                                          ea[Object.keys(ea).join(", ")]
                                            .trending.songs;
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
                                ))}
                              </div>
                            </>
                          )
                      )}

                    {/**Trending Albums */}

                    <h2
                      id="trendingalbums"
                      className="text-5xl font-sand font-bold text-white ml-2.5 mb-4"
                    >
                      Trending Albums
                    </h2>
                    {allLanguageSongs.length !== undefined &&
                      allLanguageSongs.map(
                        (ea) =>
                          ea[Object.keys(ea).join(", ")].trending.albums
                            .length > 0 && (
                            <>
                              <h1>{Object.keys(ea).join(", ")}</h1>
                              <div className="tiltcon">
                                {ea[
                                  Object.keys(ea).join(", ")
                                ].trending.albums.map((each) => (
                                  <Tilt
                                    onClick={() => {
                                      setAlbumToSearch(each.id);
                                    }}
                                    className="songs"
                                    key={each.id}
                                  >
                                    <img
                                      onClick={() => {
                                        setAlbumToSearch(each.id);
                                      }}
                                      className="songs-logo"
                                      src="/logo.webp"
                                      alt="logo"
                                    />
                                    <img
                                      onClick={() => {
                                        setAlbumToSearch(each.id);
                                      }}
                                      src={
                                        each.image[each.image.length - 1].link
                                      }
                                      alt={each.name}
                                    />
                                    <p
                                      onClick={() => {
                                        setAlbumToSearch(each.id);
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
                                          setAlbumToSearch(each.id);
                                        }}
                                        className="songs-button"
                                        type="button"
                                      >
                                        <FaPlay />
                                      </button>
                                    )}
                                  </Tilt>
                                ))}
                              </div>
                            </>
                          )
                      )}

                    {/**Other Albums */}

                    <h2
                      id="otheralbums"
                      className="text-5xl font-sand font-bold text-white ml-2.5 mb-4"
                    >
                      Other Albums
                    </h2>
                    {allLanguageSongs.length !== undefined &&
                      allLanguageSongs.map(
                        (ea) =>
                          ea[Object.keys(ea).join(", ")].albums.length > 0 && (
                            <>
                              <h1>{Object.keys(ea).join(", ")}</h1>
                              <div className="tiltcon">
                                {ea[Object.keys(ea).join(", ")].albums.map(
                                  (each) => (
                                    <Tilt
                                      onClick={() => {
                                        const songsArr =
                                          ea[Object.keys(ea).join(", ")].albums;

                                        if (each.type === "album") {
                                          setAlbumToSearch(each.id);
                                        } else if (each.type === "song") {
                                          playSelectedSong(each.id, songsArr);
                                        }
                                      }}
                                      className="songs"
                                      key={each.id}
                                    >
                                      <img
                                        onClick={() => {
                                          const songsArr =
                                            ea[Object.keys(ea).join(", ")]
                                              .albums;

                                          if (each.type === "album") {
                                            setAlbumToSearch(each.id);
                                          } else if (each.type === "song") {
                                            playSelectedSong(each.id, songsArr);
                                          }
                                        }}
                                        className="songs-logo"
                                        src="/logo.webp"
                                        alt="logo"
                                      />
                                      <img
                                        onClick={() => {
                                          const songsArr =
                                            ea[Object.keys(ea).join(", ")]
                                              .albums;

                                          if (each.type === "album") {
                                            setAlbumToSearch(each.id);
                                          } else if (each.type === "song") {
                                            playSelectedSong(each.id, songsArr);
                                          }
                                        }}
                                        src={
                                          each.image[each.image.length - 1].link
                                        }
                                        alt={each.name}
                                      />
                                      <p
                                        onClick={() => {
                                          const songsArr =
                                            ea[Object.keys(ea).join(", ")]
                                              .albums;

                                          if (each.type === "album") {
                                            setAlbumToSearch(each.id);
                                          } else if (each.type === "song") {
                                            playSelectedSong(each.id, songsArr);
                                          }
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
                                            const songsArr =
                                              ea[Object.keys(ea).join(", ")]
                                                .albums;

                                            if (each.type === "album") {
                                              setAlbumToSearch(each.id);
                                            } else if (each.type === "song") {
                                              playSelectedSong(
                                                each.id,
                                                songsArr
                                              );
                                            }
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

                    {/**Playlists */}
                    <h2
                      id="playlists"
                      className="text-5xl font-sand font-bold text-white ml-2.5 mb-4"
                    >
                      Playlists
                    </h2>
                    {allLanguageSongs.length !== undefined &&
                      allLanguageSongs.map(
                        (ea) =>
                          ea[Object.keys(ea).join(", ")].playlists.length >
                            0 && (
                            <>
                              <h1>{Object.keys(ea).join(", ")}</h1>
                              <div className="tiltcon">
                                {ea[Object.keys(ea).join(", ")].playlists.map(
                                  (each) => (
                                    <Tilt
                                      onClick={() => {
                                        const songsArr =
                                          ea[Object.keys(ea).join(", ")]
                                            .trending.songs;
                                        playSelectedSong(each.id, songsArr);
                                      }}
                                      className="songs"
                                      key={each.id}
                                    >
                                      <img
                                        onClick={() => {
                                          const songsArr =
                                            ea[Object.keys(ea).join(", ")]
                                              .trending.songs;
                                          playSelectedSong(each.id, songsArr);
                                        }}
                                        className="songs-logo"
                                        src="/logo.webp"
                                        alt="logo"
                                      />
                                      <img
                                        onClick={() => {
                                          const songsArr =
                                            ea[Object.keys(ea).join(", ")]
                                              .trending.songs;
                                          playSelectedSong(each.id, songsArr);
                                        }}
                                        src={
                                          each.image[each.image.length - 1].link
                                        }
                                        alt={each.title}
                                      />
                                      <p
                                        onClick={() => {
                                          const songsArr =
                                            ea[Object.keys(ea).join(", ")]
                                              .trending.songs;
                                          playSelectedSong(each.id, songsArr);
                                        }}
                                        style={{ cursor: "pointer" }}
                                      >
                                        {each.title}
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

                    {/**Charts */}
                    <h2
                      id="charts"
                      className="text-5xl font-sand font-bold text-white ml-2.5 mb-4"
                    >
                      Top Charts
                    </h2>
                    {allLanguageSongs.length !== undefined &&
                      allLanguageSongs.map(
                        (ea) =>
                          ea[Object.keys(ea).join(", ")].charts.length > 0 && (
                            <>
                              <h1>{Object.keys(ea).join(", ")}</h1>
                              <div className="tiltcon">
                                {ea[Object.keys(ea).join(", ")].charts.map(
                                  (each) => (
                                    <Tilt
                                      onClick={() => {
                                        const songsArr =
                                          ea[Object.keys(ea).join(", ")]
                                            .trending.songs;
                                        playSelectedSong(each.id, songsArr);
                                      }}
                                      className="songs"
                                      key={each.id}
                                    >
                                      <img
                                        onClick={() => {
                                          const songsArr =
                                            ea[Object.keys(ea).join(", ")]
                                              .trending.songs;
                                          playSelectedSong(each.id, songsArr);
                                        }}
                                        className="songs-logo"
                                        src="/logo.webp"
                                        alt="logo"
                                      />
                                      <img
                                        onClick={() => {
                                          const songsArr =
                                            ea[Object.keys(ea).join(", ")]
                                              .trending.songs;
                                          playSelectedSong(each.id, songsArr);
                                        }}
                                        src={
                                          each.image[each.image.length - 1].link
                                        }
                                        alt={each.title}
                                      />
                                      <p
                                        onClick={() => {
                                          const songsArr =
                                            ea[Object.keys(ea).join(", ")]
                                              .trending.songs;
                                          playSelectedSong(each.id, songsArr);
                                        }}
                                        style={{ cursor: "pointer" }}
                                      >
                                        {each.title}
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
                  </>
                ) : (
                  whatToDisplay === displayingContent.albums && (
                    <Albums
                      obtainedAlbum={obtainedAlbum}
                      setWhatToDisplay={setWhatToDisplay}
                      playSelectedSong={playSelectedSong}
                      setPlaySong={setPlaySong}
                      playSong={playSong}
                    />
                  )
                )}
                <div id={songPlaying.length > 0 ? "player" : "player1"}>
                  {songPlaying.length > 0 && (
                    <>
                      <img
                        src={
                          songPlaying[0].image[songPlaying[0].image.length - 1]
                            .link
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
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};
export default Home;
