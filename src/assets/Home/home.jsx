import { useEffect, useState, useRef, lazy, Suspense } from "react";
import "../../index.css";

import setRecentlyplayed from "../otherapis.js";

/**Component Imports */
const Albums = lazy(() => import("./Albums"));

/**Dependencies*/
import axios from "axios";
import Tilt from "react-parallax-tilt";
import { MagnifyingGlass } from "react-loader-spinner";

/**Icons */
import { FaPause, FaPlay } from "react-icons/fa";
import { FaShuffle } from "react-icons/fa6";
import { TiArrowLoop } from "react-icons/ti";
import { HiSpeakerWave, HiMiniSpeakerXMark } from "react-icons/hi2";
import { IoPlayBack, IoPlayForward } from "react-icons/io5";
import { IoIosMic, IoIosMicOff } from "react-icons/io";
import { MdHomeFilled } from "react-icons/md";
import { TiHeartFullOutline } from "react-icons/ti";
import { BiSolidPlaylist } from "react-icons/bi";
import { RxCountdownTimer } from "react-icons/rx";
import { FaLanguage } from "react-icons/fa6";

/**Tilt */
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { RxCross2 } from "react-icons/rx";
import Cookies from "js-cookie";

const displayingContent = {
  home: "home",
  albums: "albums",
  playlists: "playlists",
  charts: "charts",
};

const Home = () => {
  /**Speech Recognization */

  const [listening, setListening] = useState(false);
  let recognition = null;

  const startRecognition = () => {
    if (searchBar.animation === "searchresults2") {
      setSearchBar({ ...searchBar, search: "" });
    }

    // const supportedLanguages = JSON.parse(localStorage.getItem("selectedlang"))
    //   .map((language) => {
    //     switch (language) {
    //       case "english":
    //         return "en-US";
    //       case "telugu":
    //         return "te-IN";
    //       case "hindi":
    //         return "hi-IN";
    //       case "punjabi":
    //         return "pa-IN"; // or any other variant you want to support
    //       case "tamil":
    //         return "ta-IN"; // or any other variant you want to support
    //       case "marathi":
    //         return "mr-IN"; // or any other variant you want to support
    //       case "gujarati":
    //         return "gu-IN"; // or any other variant you want to support
    //       case "bengali":
    //         return "bn-IN"; // or any other variant you want to support
    //       case "kannada":
    //         return "kn-IN"; // or any other variant you want to support
    //       case "bhojpuri":
    //         return "bh-IN"; // or any other variant you want to support
    //       case "malayalam":
    //         return "ml-IN"; // or any other variant you want to support
    //       case "urdu":
    //         return "ur-IN"; // or any other variant you want to support
    //       case "haryanvi":
    //         return "ha-IN"; // or any other variant you want to support
    //       case "rajasthani":
    //         return "ra-IN"; // or any other variant you want to support
    //       case "odia":
    //         return "or-IN"; // or any other variant you want to support
    //       case "assamese":
    //         return "as-IN"; // or any other variant you want to support
    //       default:
    //         return null;
    //     }
    //   })
    //   .filter((lang) => lang !== null);

    recognition = new window.webkitSpeechRecognition(); // Create SpeechRecognition instance
    recognition.lang = "en-US"; // Set language
    recognition.onstart = () => setListening(true); // Set listening state to true when recognition starts
    recognition.onend = () => setListening(false); // Set listening state to false when recognition ends
    recognition.onresult = (event) => {
      const currentTranscript = event.results[0][0].transcript;
      if (searchBar.animation !== "searchresults2") {
        setSearchBar({ ...searchBar, animation: "searchresults1" });
      }

      setTimeout(() => {
        setSearchBar({
          animation: "searchresults2",
          search: currentTranscript,
        });
      }, 1000);
    };
    recognition.start(); // Start recognition
  };

  const stopRecognition = () => {
    if (recognition) {
      recognition.stop(); // Stop recognition if it's in progress
      setListening(false);
    }
  };

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

  const [playlisttoSearch, setPlaylistToSearch] = useState("");
  const [artisttoSearch, setArtistToSearch] = useState({ id: "", details: "" });

  const [whatToDisplay, setWhatToDisplay] = useState(displayingContent.home);
  const [load, setLoad] = useState(false);

  const audioref = useRef();
  const [playerShifting, setPlayerShifting] = useState({
    duration: 0,
    currentTime: 0,
  });
  const [selectedComponent, setSelectedComponent] = useState("home");

  const [noresults, setNoResults] = useState(false);
  const [page, setPage] = useState(1);

  /**Observer Animation */

  useEffect(() => {
    if (obtainedAlbum !== null) {
      if (obtainedAlbum.songCount === "0") {
        setObtaindAlbum(null);
        toast("No Songs Available");
      }
    }
    const tiltCards = document.querySelectorAll(".tiltcon");

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in");
        }
      });
    });

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
    }
    // else if (
    //   searchBar.animation === "searchresults2" &&
    //   searchBar.search === ""
    // ) {
    //   document.getElementById("search").blur();
    //   setSearchBar({ ...searchBar, animation: "searchresults3" });
    //   setTimeout(() => {
    //     setSearchBar({ ...searchBar, animation: "" });
    //   }, 1000);
    // }
  }, [searchBar.search]);

  useEffect(() => {
    if (searchBar.search !== "") {
      searchFunction();
      setNoResults(true);
      setTimeout(() => {
        setNoResults(false);
      }, 1000);
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
  useEffect(() => {
    if (artisttoSearch !== "") {
      getArtist();
    }
  }, [artisttoSearch]);

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
      console.log(allLanguageSongs);

      setAllLanguageSongs(allLanguageSongs);
    } catch (error) {
      setLoad(true);
      console.error("Error TrendingNow", error);
    }
  };

  useEffect(() => {
    if (playlisttoSearch !== "") {
      getPlaylist();
    }
  }, [playlisttoSearch]);

  /**player currentTime and duration updater useEffect */
  useEffect(() => {
    const audio = audioref.current;
    const handleTimeUpdate = () => {
      setPlayerShifting({
        duration: audio.duration,
        currentTime: audio.currentTime,
      });
    };
    const handleSeeking = () => {
      // Update currentTime during seeking
      setPlayerShifting({ ...playerShifting, currentTime: audio.currentTime });
    };
    const handleSeeked = () => {
      // Handle seeked event (update currentTime after seeking)
      setPlayerShifting({ ...playerShifting, currentTime: audio.currentTime });
    };
    if (audio) {
      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("seeking", handleSeeking);
      audio.addEventListener("seeked", handleSeeked);
      return () => {
        // Cleanup: Remove event listeners when the component unmounts
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("seeking", handleSeeking);
        audio.removeEventListener("seeked", handleSeeked);
      };
    }
  }, [audioref, playerShifting.duration, playerShifting.currentTime]);

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
        playSelectedSong(res.data.data.songs[0].id, res.data.data.songs);
      }
    } catch (error) {
      setLoad(true);
      console.error(`Error to Fetch Album`, error);
    }
  };

  const getPlaylist = async () => {
    setLoad(false);
    try {
      const url = `${
        import.meta.env.VITE_UPDATE_URL
      }/playlists?id=${playlisttoSearch}`;

      const res = await axios.get(url);
      if (res.status === 200) {
        setObtaindAlbum(res.data.data);
        setWhatToDisplay(displayingContent.albums);
        playSelectedSong(res.data.data.songs[0].id, res.data.data.songs);
      }
    } catch (error) {
      setLoad(true);
      console.error(`Error to Fetch Album`, error);
    }
  };

  const getArtist = async () => {
    setLoad(false);
    try {
      const url = `${import.meta.env.VITE_UPDATE_URL}/artists/${
        artisttoSearch.id
      }/songs?page=${page}`;

      const res = await axios.get(url);
      if (res.status === 200) {
        if (obtainedAlbum === null) {
          console.log("hi");
          setObtaindAlbum({ ...artisttoSearch.details, ...res.data.data });
          setWhatToDisplay(displayingContent.albums);
          playSelectedSong(res.data.data.songs[0].id, res.data.data.songs);
        } else if (
          obtainedAlbum !== null &&
          obtainedAlbum.type === "artist" &&
          artisttoSearch.details.id === obtainedAlbum.id
        ) {
          console.log("hi2");
          setPage(page + 1);
          setTimeout(() => {
            setObtaindAlbum({
              ...obtainedAlbum,
              songs: [...obtainedAlbum.songs, ...res.data.data.songs],
            });
            setLoad(true);
          }, 1000);
        } else {
          console.log("hi3");
          setObtaindAlbum({ ...artisttoSearch.details, ...res.data.data });
          setWhatToDisplay(displayingContent.albums);
          playSelectedSong(res.data.data.songs[0].id, res.data.data.songs);
        }
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
        if (
          Cookies.get("userIdgroove") !== undefined &&
          Cookies.get("username") !== undefined &&
          Cookies.get("usertokengroove") !== undefined
        ) {
          setRecentlyplayed(res.data.data);
        }
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
      setSelectedSong([]);
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

      const url = `${import.meta.env.VITE_UPDATE_URL}/search?query=${
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

    useEffect(() => {
      if (allLanguages.length === 0) {
        localStorage.setItem("selectedlang", JSON.stringify(selectedHere));
        window.location.reload();
      }
    }, [allLanguages]);

    return (
      <>
        <div className="selectedBackGround">
          <h1 className="text-white font-semibold text-3xl  ml-[20%] mt-[3%] max-[1024px]:ml-[5%] max-[1024px]:mt-[10%] max-[1024px]:ml-[5%] max-[1024px]:mt-[30%]">
            Select Languages
          </h1>
          <div className="selectedSongCon max-[600px]:mt-[5%] max-[600px]:ml-[-1%] max-[600px]:w-[90%] max-[600px]:max-h-[60%] max-[600px]:min-h-[60%] max-[600px]:flex max-[600px]:justify-around max-[600px]:items-center max-[1024px]:mt-[2%] max-[1024px]:ml-[-1%] max-[1024px]:w-[90%] max-[1024px]:max-h-[60%] max-[1024px]:min-h-[60%] max-[1024px]:flex max-[1024px]:justify-around max-[1024px]:items-center">
            {allLanguages.map((each) => (
              <div
                onClick={() => {
                  handleSelectHere(each.language);
                }}
                key={each.backgroundColor}
                style={{ backgroundColor: `${each.backgroundColor}` }}
                className="text-center p-[2%] h-[24%] w-[15%] m-[5%] rounded-lg cursor-pointer active:scale-75 transition-all duration-300 max-[600px]:w-[45%] max-[600px]:p-5 max-[600px]:m-2 max-[600px]:h-[18%!important] max-[900px]:h-[18%!important] max-[1024px]:h-[18%!important] max-[1024px]:flex max-[1024px]:flex-col max-[1024px]:justify-center max-[1024px]:items-center max-[900px]:w-[20%]"
              >
                <p
                  className="capitalize  font-[500]"
                  style={{ fontSize: "clamp(.9rem,1.3vw,2rem)" }}
                >
                  {each.language}
                </p>
                <h1 style={{ fontSize: "clamp(.9rem,1.3vw,2rem)" }}>
                  {each.letter}
                </h1>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              localStorage.setItem(
                "selectedlang",
                JSON.stringify(selectedHere)
              );
              window.location.reload();
            }}
            type="button"
            style={
              selectedHere.length > 0
                ? { fontSize: "clamp(.9rem,1.3vw,1rem)", alignSelf: "end" }
                : { visibility: "hidden" }
            }
            className="text-black mt-[2%] mb-[2%] font-semibold text-md  bottom-8 bg-white px-5 py-2 rounded-lg mr-[10%]  active:scale-90 transition-all duration-300  max-[600px]:mt-[5%]"
          >
            Submit
          </button>
        </div>
      </>
    );
  };

  const handleSeekBarChange = (e) => {
    const audio = audioref.current;
    const seekTime = (e.target.value / 100) * audio.duration;
    audio.currentTime = seekTime;
  };

  function moveCarousel(direction, container) {
    const carousel = document.getElementById(container);
    const deviceWidth = window.innerWidth; // Get the width of the device viewport

    if (direction === "left") {
      carousel.scrollBy({
        left: -deviceWidth,
        behavior: "smooth",
      });
    } else if (direction === "right") {
      carousel.scrollBy({
        left: deviceWidth,
        behavior: "smooth",
      });
    }
  }

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{ color: "#9794ff", textAlign: "center" }}
      />
      <audio ref={audioref} id="audiotag" type="audio/mp3" />
      <div className="home-con">
        <div className="home-sidebar max-[600px]:hidden max-[1024px]:hidden">
          <div>
            <div className="logoimage-con">
              <img src="/logo.webp" alt="logo" />
            </div>
          </div>
          <button
            style={{ fontSize: "clamp(.8rem,1.5vw,1.3rem)" }}
            className="w-full ml-[3%] font-sand font-light text-white  mt-5 cursor-pointer text-start hover:text-[#9794ff] hover:animate-pulse"
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
            style={{ fontSize: "clamp(.8rem,1.5vw,1.3rem)" }}
            className="w-full ml-[3%] font-sand font-light text-white  mt-5 cursor-pointer text-start hover:text-[#9794ff] hover:animate-pulse"
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
            style={{ fontSize: "clamp(.8rem,1.5vw,1.3rem)" }}
            className="w-full ml-[3%] font-sand font-light text-white  mt-5 cursor-pointer text-start hover:text-[#9794ff] hover:animate-pulse"
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
            style={{ fontSize: "clamp(.8rem,1.5vw,1.3rem)" }}
            className="w-full ml-[3%] font-sand font-light text-white  mt-5 cursor-pointer text-start hover:text-[#9794ff] hover:animate-pulse"
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
            style={{ fontSize: "clamp(.8rem,1.5vw,1.3rem)" }}
            className="w-full ml-[3%] font-sand font-light text-white  mt-5 cursor-pointer text-start hover:text-[#9794ff] hover:animate-pulse"
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
          <div className="home-page max-[600px]:min-w-full max-[1024px]:min-w-full">
            {allLanguageSongs.length === 0 ? (
              <div className="h-[20vh] w-[10vw] absolute left-[50%] top-[40%] z-50 max-[1024px]:left-[40%] max-[1024px]:h-[25vh] max-[1024px]:w-[25vw]">
                <img
                  className="block max-w-[100%] animate-ping absolute"
                  src="/logo.webp"
                />
                <img className="block max-w-[100%]" src="/logo.webp" />
              </div>
            ) : (
              <>
                <div
                  className={
                    !load
                      ? "fixed h-[100vh!important] bg-[#111928BF] w-full top-0 left-0 z-10 backdrop-blur-sm saturate-180 z-50"
                      : "hidden1"
                  }
                >
                  <div className="h-[20vh] w-[10vw] absolute left-[50%] top-[40%] z-50 max-[1024px]:left-[40%] max-[1024px]:h-[25vh] max-[1024px]:w-[25vw]">
                    <img
                      className="block max-w-[100%] animate-ping absolute"
                      src="/logo.webp"
                    />
                    <img className="block max-w-[100%]" src="/logo.webp" />
                  </div>
                </div>
                {whatToDisplay === displayingContent.home && (
                  <div id="nav-bar">
                    <div className="searchbox">
                      <input
                        id="search"
                        className="searchbar"
                        type="search"
                        value={searchBar.search}
                        placeholder={listening ? "listening . . ." : "Search"}
                        onChange={(e) => {
                          setSearchBar({
                            ...searchBar,
                            search: e.target.value,
                          });
                        }}
                        onFocus={() => {
                          setWhatToDisplay(displayingContent.home);
                          if (searchBar.animation !== "searchresults2") {
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
                          }
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
                      {listening ? (
                        <IoIosMicOff
                          onClick={stopRecognition}
                          className="text-2xl mic-color absolute bottom-2 left-1 cursor-pointer max-[600px]:bottom-2.4"
                        />
                      ) : (
                        <IoIosMic
                          onClick={startRecognition}
                          className="text-2xl mic-color absolute bottom-2 left-1 cursor-pointer max-[600px]:bottom-2.4"
                        />
                      )}
                      {searchBar.search !== "" && (
                        <RxCross2
                          className="cross cursor-pointer text-white mt-[-0.3%]"
                          onClick={() => {
                            setSearchBar({ ...searchBar, search: "" });
                          }}
                        />
                      )}
                    </div>
                    <FaLanguage
                      onClick={() => {
                        localStorage.removeItem("selectedlang");
                        window.location.reload();
                      }}
                      className="languages"
                    />
                    <span className="languages2">Select Languages</span>
                    <div className={searchBar.animation}>
                      {searchBar.animation === "searchresults2" && (
                        <section className="fixed z-30 top-[10%] right-[5%] cursor-pointer z-10 active:scale-90 hover:scale-125 transition-all max-[600px]:top-[3%] max-[1024px]:top-[3%]">
                          <RxCross2
                            className="text-white"
                            onClick={() => {
                              setSearchBar({
                                animation: "searchresults3",
                                search: "",
                              });
                              setTimeout(() => {
                                setSearchBar({ search: "", animation: "" });
                              }, 1000);
                            }}
                          />
                        </section>
                      )}
                      {searchResults.length <= 0 &&
                        searchBar.search !== "" &&
                        searchBar.animation === "searchresults2" &&
                        (noresults ? (
                          <h1
                            className="text-white absolute top-[50%] left-[50%]"
                            style={{
                              fontSize: "clamp(1rem,3.2vw,3rem)",
                              transform: "translate(-50%,-50%)",
                            }}
                          >
                            <MagnifyingGlass
                              visible={true}
                              height="80"
                              width="80"
                              glassColor="#ffffff"
                              color="#9794ff"
                            />
                          </h1>
                        ) : (
                          <h1
                            className="text-white absolute top-[50%] left-[50%]"
                            style={{
                              fontSize: "clamp(1rem,3.2vw,3rem)",
                              transform: "translate(-50%,-50%)",
                            }}
                          >
                            No Results Found
                          </h1>
                        ))}
                      {searchBar.animation === "searchresults2" &&
                      searchBar.search === "" ? (
                        <>
                          <div className="search-re max-[600px]:w-[100%!important]">
                            <h5 className="search-re">Trending Songs</h5>
                            <div>
                              {allLanguageSongs.length !== undefined &&
                                allLanguageSongs.map(
                                  (ea) =>
                                    ea[Object.keys(ea).join(", ")].trending
                                      .songs.length > 0 && (
                                      <>
                                        <div>
                                          {ea[
                                            Object.keys(ea).join(", ")
                                          ].trending.songs.map((each) => (
                                            <div
                                              onClick={() => {
                                                setObtaindAlbum(null);
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
                                              <div className="w-[25%] mr-5">
                                                {
                                                  <Suspense
                                                    fallback={
                                                      <img
                                                        src="/logo.webp"
                                                        className="skeleton"
                                                      />
                                                    }
                                                  >
                                                    <img
                                                      className="max-w-[100%]  block"
                                                      onClick={() => {
                                                        setObtaindAlbum(null);
                                                        setSearchBar({
                                                          ...searchBar,
                                                          animation:
                                                            "searchresults3",
                                                        });
                                                        setTimeout(() => {
                                                          setSearchBar({
                                                            ...searchBar,
                                                            animation: "",
                                                          });
                                                        }, 1000);
                                                        const songsArr =
                                                          ea[
                                                            Object.keys(
                                                              ea
                                                            ).join(", ")
                                                          ].trending.songs;
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
                                                  </Suspense>
                                                }
                                                <img
                                                  onClick={() => {
                                                    setObtaindAlbum(null);
                                                    setSearchBar({
                                                      ...searchBar,
                                                      animation:
                                                        "searchresults3",
                                                    });
                                                    setTimeout(() => {
                                                      setSearchBar({
                                                        ...searchBar,
                                                        animation: "",
                                                      });
                                                    }, 1000);
                                                    const songsArr =
                                                      ea[
                                                        Object.keys(ea).join(
                                                          ", "
                                                        )
                                                      ].trending.songs;
                                                    playSelectedSong(
                                                      each.id,
                                                      songsArr
                                                    );
                                                  }}
                                                  id="songs-logo-search"
                                                  src="/logo.webp"
                                                  alt="logo"
                                                />
                                              </div>

                                              {
                                                <Suspense
                                                  fallback={
                                                    <p className="skeleton2 w-full"></p>
                                                  }
                                                >
                                                  <p
                                                    onClick={() => {
                                                      setObtaindAlbum(null);
                                                      setSearchBar({
                                                        ...searchBar,
                                                        animation:
                                                          "searchresults3",
                                                      });
                                                      setTimeout(() => {
                                                        setSearchBar({
                                                          ...searchBar,
                                                          animation: "",
                                                        });
                                                      }, 1000);

                                                      const songsArr =
                                                        ea[
                                                          Object.keys(ea).join(
                                                            ", "
                                                          )
                                                        ].trending.songs;
                                                      playSelectedSong(
                                                        each.id,
                                                        songsArr
                                                      );
                                                    }}
                                                    style={{
                                                      cursor: "pointer",
                                                    }}
                                                  >
                                                    {each.name}
                                                  </p>
                                                </Suspense>
                                              }
                                            </div>
                                          ))}
                                        </div>
                                      </>
                                    )
                                )}
                            </div>
                          </div>
                          <div className=" max-[600px]:w-[100%!important]">
                            <h5>Trending Albums</h5>
                            <div>
                              {allLanguageSongs.length !== undefined &&
                                allLanguageSongs.map(
                                  (ea) =>
                                    ea[Object.keys(ea).join(", ")].trending
                                      .albums.length > 0 && (
                                      <>
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
                                              <div className="w-[25%] mr-5">
                                                {
                                                  <Suspense
                                                    fallback={
                                                      <img
                                                        src="/logo.webp"
                                                        className="skeleton"
                                                      />
                                                    }
                                                  >
                                                    <img
                                                      className="max-w-[100%]  block"
                                                      onClick={() => {
                                                        setSearchBar({
                                                          ...searchBar,
                                                          animation:
                                                            "searchresults3",
                                                        });
                                                        setTimeout(() => {
                                                          setSearchBar({
                                                            ...searchBar,
                                                            animation: "",
                                                          });
                                                        }, 1000);

                                                        setAlbumToSearch(
                                                          each.id
                                                        );
                                                      }}
                                                      src={
                                                        each.image[
                                                          each.image.length - 1
                                                        ].link
                                                      }
                                                      alt={each.name}
                                                    />
                                                  </Suspense>
                                                }
                                                <img
                                                  onClick={() => {
                                                    setSearchBar({
                                                      ...searchBar,
                                                      animation:
                                                        "searchresults3",
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
                                              </div>
                                              {
                                                <Suspense
                                                  fallback={
                                                    <p className="skeleton2 w-full"></p>
                                                  }
                                                >
                                                  <p
                                                    onClick={() => {
                                                      setSearchBar({
                                                        ...searchBar,
                                                        animation:
                                                          "searchresults3",
                                                      });
                                                      setTimeout(() => {
                                                        setSearchBar({
                                                          ...searchBar,
                                                          animation: "",
                                                        });
                                                      }, 1000);
                                                      setAlbumToSearch(each.id);
                                                    }}
                                                    style={{
                                                      cursor: "pointer",
                                                    }}
                                                  >
                                                    {each.name}
                                                  </p>
                                                </Suspense>
                                              }
                                            </div>
                                          ))}
                                        </div>
                                      </>
                                    )
                                )}
                            </div>
                          </div>
                          <div className=" max-[600px]:w-[100%!important]">
                            <h5>Other Albums</h5>
                            <div>
                              {allLanguageSongs.length !== undefined &&
                                allLanguageSongs.map(
                                  (ea) =>
                                    ea[Object.keys(ea).join(", ")].albums
                                      .length > 0 && (
                                      <>
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
                                                } else if (
                                                  each.type === "song"
                                                ) {
                                                  playSelectedSong(
                                                    each.id,
                                                    songsArr
                                                  );
                                                }
                                              }}
                                              className="songs-search"
                                              key={each.id}
                                            >
                                              <div className="w-[25%] mr-5">
                                                {
                                                  <Suspense
                                                    fallback={
                                                      <img
                                                        src="/logo.webp"
                                                        className="skeleton"
                                                      />
                                                    }
                                                  >
                                                    <img
                                                      className="max-w-[100%]  block"
                                                      onClick={() => {
                                                        setSearchBar({
                                                          ...searchBar,
                                                          animation:
                                                            "searchresults3",
                                                        });
                                                        setTimeout(() => {
                                                          setSearchBar({
                                                            ...searchBar,
                                                            animation: "",
                                                          });
                                                        }, 1000);
                                                        const songsArr =
                                                          ea[
                                                            Object.keys(
                                                              ea
                                                            ).join(", ")
                                                          ].albums;

                                                        if (
                                                          each.type === "album"
                                                        ) {
                                                          setAlbumToSearch(
                                                            each.id
                                                          );
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
                                                  </Suspense>
                                                }
                                                <img
                                                  onClick={() => {
                                                    setSearchBar({
                                                      ...searchBar,
                                                      animation:
                                                        "searchresults3",
                                                    });
                                                    setTimeout(() => {
                                                      setSearchBar({
                                                        ...searchBar,
                                                        animation: "",
                                                      });
                                                    }, 1000);
                                                    const songsArr =
                                                      ea[
                                                        Object.keys(ea).join(
                                                          ", "
                                                        )
                                                      ].albums;

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
                                              </div>
                                              {
                                                <Suspense
                                                  fallback={
                                                    <p className="skeleton2 w-full"></p>
                                                  }
                                                >
                                                  <p
                                                    onClick={() => {
                                                      setSearchBar({
                                                        ...searchBar,
                                                        animation:
                                                          "searchresults3",
                                                      });
                                                      setTimeout(() => {
                                                        setSearchBar({
                                                          ...searchBar,
                                                          animation: "",
                                                        });
                                                      }, 1000);
                                                      const songsArr =
                                                        ea[
                                                          Object.keys(ea).join(
                                                            ", "
                                                          )
                                                        ].albums;

                                                      if (
                                                        each.type === "album"
                                                      ) {
                                                        setAlbumToSearch(
                                                          each.id
                                                        );
                                                      } else if (
                                                        each.type === "song"
                                                      ) {
                                                        playSelectedSong(
                                                          each.id,
                                                          songsArr
                                                        );
                                                      }
                                                    }}
                                                    style={{
                                                      cursor: "pointer",
                                                    }}
                                                  >
                                                    {each.name}
                                                  </p>
                                                </Suspense>
                                              }
                                            </div>
                                          ))}
                                        </div>
                                      </>
                                    )
                                )}
                            </div>
                          </div>
                          <div className=" max-[600px]:w-[100%!important]">
                            <h5>Playlists</h5>
                            <div>
                              {allLanguageSongs.length !== undefined &&
                                allLanguageSongs.map(
                                  (ea) =>
                                    ea[Object.keys(ea).join(", ")].playlists
                                      .length > 0 && (
                                      <>
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
                                                const songsArr =
                                                  ea[Object.keys(ea).join(", ")]
                                                    .trending.albums;
                                                if (each.type === "playlist") {
                                                  setPlaylistToSearch(each.id);
                                                } else if (
                                                  each.type === "song"
                                                ) {
                                                  playSelectedSong(
                                                    each.id,
                                                    songsArr
                                                  );
                                                }
                                              }}
                                              className="songs-search"
                                              key={each.id}
                                            >
                                              <div className="w-[25%] mr-5">
                                                {
                                                  <Suspense
                                                    fallback={
                                                      <img
                                                        src="/logo.webp"
                                                        className="skeleton"
                                                      />
                                                    }
                                                  >
                                                    <img
                                                      className="max-w-[100%]  block"
                                                      onClick={() => {
                                                        setSearchBar({
                                                          ...searchBar,
                                                          animation:
                                                            "searchresults3",
                                                        });
                                                        setTimeout(() => {
                                                          setSearchBar({
                                                            ...searchBar,
                                                            animation: "",
                                                          });
                                                        }, 1000);
                                                        const songsArr =
                                                          ea[
                                                            Object.keys(
                                                              ea
                                                            ).join(", ")
                                                          ].trending.songs;
                                                        if (
                                                          each.type ===
                                                          "playlist"
                                                        ) {
                                                          setPlaylistToSearch(
                                                            each.id
                                                          );
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
                                                      alt={each.titile}
                                                    />
                                                  </Suspense>
                                                }
                                                <img
                                                  onClick={() => {
                                                    setSearchBar({
                                                      ...searchBar,
                                                      animation:
                                                        "searchresults3",
                                                    });
                                                    setTimeout(() => {
                                                      setSearchBar({
                                                        ...searchBar,
                                                        animation: "",
                                                      });
                                                    }, 1000);
                                                    const songsArr =
                                                      ea[
                                                        Object.keys(ea).join(
                                                          ", "
                                                        )
                                                      ].trending.songs;
                                                    if (
                                                      each.type === "playlist"
                                                    ) {
                                                      setPlaylistToSearch(
                                                        each.id
                                                      );
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
                                              </div>
                                              {
                                                <Suspense
                                                  fallback={
                                                    <p className="skeleton2 w-full"></p>
                                                  }
                                                >
                                                  <p
                                                    onClick={() => {
                                                      setSearchBar({
                                                        ...searchBar,
                                                        animation:
                                                          "searchresults3",
                                                      });
                                                      setTimeout(() => {
                                                        setSearchBar({
                                                          ...searchBar,
                                                          animation: "",
                                                        });
                                                      }, 1000);
                                                      const songsArr =
                                                        ea[
                                                          Object.keys(ea).join(
                                                            ", "
                                                          )
                                                        ].trending.songs;
                                                      if (
                                                        each.type === "playlist"
                                                      ) {
                                                        setPlaylistToSearch(
                                                          each.id
                                                        );
                                                      } else if (
                                                        each.type === "song"
                                                      ) {
                                                        playSelectedSong(
                                                          each.id,
                                                          songsArr
                                                        );
                                                      }
                                                    }}
                                                    style={{
                                                      cursor: "pointer",
                                                    }}
                                                  >
                                                    {each.title}
                                                  </p>
                                                </Suspense>
                                              }
                                            </div>
                                          ))}
                                        </div>
                                      </>
                                    )
                                )}
                            </div>
                          </div>
                          <div className=" max-[600px]:w-[100%!important]">
                            <h5>Top Charts</h5>
                            <div>
                              {allLanguageSongs.length !== undefined &&
                                allLanguageSongs.map(
                                  (ea) =>
                                    ea[Object.keys(ea).join(", ")].charts
                                      .length > 0 && (
                                      <>
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
                                                const songsArr =
                                                  ea[Object.keys(ea).join(", ")]
                                                    .trending.albums;
                                                if (each.type === "playlist") {
                                                  setPlaylistToSearch(each.id);
                                                } else if (
                                                  each.type === "song"
                                                ) {
                                                  playSelectedSong(
                                                    each.id,
                                                    songsArr
                                                  );
                                                }
                                              }}
                                              className="songs-search"
                                              key={each.id}
                                            >
                                              <div className="w-[25%] mr-5">
                                                {
                                                  <Suspense
                                                    fallback={
                                                      <img
                                                        src="/logo.webp"
                                                        className="skeleton"
                                                      />
                                                    }
                                                  >
                                                    <img
                                                      className="max-w-[100%]  block"
                                                      onClick={() => {
                                                        setSearchBar({
                                                          ...searchBar,
                                                          animation:
                                                            "searchresults3",
                                                        });
                                                        setTimeout(() => {
                                                          setSearchBar({
                                                            ...searchBar,
                                                            animation: "",
                                                          });
                                                        }, 1000);
                                                        const songsArr =
                                                          ea[
                                                            Object.keys(
                                                              ea
                                                            ).join(", ")
                                                          ].trending.songs;
                                                        if (
                                                          each.type ===
                                                          "playlist"
                                                        ) {
                                                          setPlaylistToSearch(
                                                            each.id
                                                          );
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
                                                      alt={each.titile}
                                                    />
                                                  </Suspense>
                                                }
                                                <img
                                                  onClick={() => {
                                                    setSearchBar({
                                                      ...searchBar,
                                                      animation:
                                                        "searchresults3",
                                                    });
                                                    setTimeout(() => {
                                                      setSearchBar({
                                                        ...searchBar,
                                                        animation: "",
                                                      });
                                                    }, 1000);
                                                    const songsArr =
                                                      ea[
                                                        Object.keys(ea).join(
                                                          ", "
                                                        )
                                                      ].trending.songs;
                                                    if (
                                                      each.type === "playlist"
                                                    ) {
                                                      setPlaylistToSearch(
                                                        each.id
                                                      );
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
                                              </div>
                                              {
                                                <Suspense
                                                  fallback={
                                                    <p className="skeleton2"></p>
                                                  }
                                                >
                                                  <p
                                                    onClick={() => {
                                                      setSearchBar({
                                                        ...searchBar,
                                                        animation:
                                                          "searchresults3",
                                                      });
                                                      setTimeout(() => {
                                                        setSearchBar({
                                                          ...searchBar,
                                                          animation: "",
                                                        });
                                                      }, 1000);
                                                      const songsArr =
                                                        ea[
                                                          Object.keys(ea).join(
                                                            ", "
                                                          )
                                                        ].trending.songs;
                                                      if (
                                                        each.type === "playlist"
                                                      ) {
                                                        setPlaylistToSearch(
                                                          each.id
                                                        );
                                                      } else if (
                                                        each.type === "song"
                                                      ) {
                                                        playSelectedSong(
                                                          each.id,
                                                          songsArr
                                                        );
                                                      }
                                                    }}
                                                    style={{
                                                      cursor: "pointer",
                                                    }}
                                                  >
                                                    {each.title}
                                                  </p>
                                                </Suspense>
                                              }
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
                              <div className=" max-[600px]:w-[100%!important]">
                                <h5>Songs</h5>
                                <div>
                                  {searchResults.length !== undefined && (
                                    <div>
                                      {searchResults[0].songs.map((each) => (
                                        <div
                                          onClick={() => {
                                            setObtaindAlbum(null);
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
                                          <div className="w-[25%] mr-5">
                                            {
                                              <Suspense
                                                fallback={
                                                  <img
                                                    src="/logo.webp"
                                                    className="skeleton"
                                                  />
                                                }
                                              >
                                                <img
                                                  className="max-w-[100%]  block"
                                                  onClick={() => {
                                                    setObtaindAlbum(null);
                                                    setSearchBar({
                                                      search: "",
                                                      animation:
                                                        "searchresults3",
                                                    });
                                                    setTimeout(() => {
                                                      setSearchBar({
                                                        search: "",
                                                        animation: "",
                                                      });
                                                    }, 1000);
                                                    const songsArr =
                                                      searchResults[0].songs;
                                                    playSelectedSong(
                                                      each.id,
                                                      songsArr
                                                    );
                                                  }}
                                                  src={
                                                    each.image[
                                                      each.image.length - 1
                                                    ].url
                                                  }
                                                  alt={each.title}
                                                />
                                              </Suspense>
                                            }
                                            <img
                                              onClick={() => {
                                                setObtaindAlbum(null);
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
                                                playSelectedSong(
                                                  each.id,
                                                  songsArr
                                                );
                                              }}
                                              id="songs-logo-search"
                                              src="/logo.webp"
                                              alt="logo"
                                            />
                                          </div>
                                          {
                                            <Suspense
                                              fallback={
                                                <p className="skeleton2 w-full"></p>
                                              }
                                            >
                                              <p
                                                onClick={() => {
                                                  setObtaindAlbum(null);
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
                                                  playSelectedSong(
                                                    each.id,
                                                    songsArr
                                                  );
                                                }}
                                                style={{ cursor: "pointer" }}
                                              >
                                                {each.title}
                                              </p>
                                            </Suspense>
                                          }
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            {searchResults[1].albums.length > 0 && (
                              <div className=" max-[600px]:w-[100%!important]">
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
                                          <div className="w-[25%] mr-5">
                                            {
                                              <Suspense
                                                fallback={
                                                  <img
                                                    src="/logo.webp"
                                                    className="skeleton"
                                                  />
                                                }
                                              >
                                                <img
                                                  className="max-w-[100%]  block"
                                                  onClick={() => {
                                                    setSearchBar({
                                                      search: "",
                                                      animation:
                                                        "searchresults3",
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
                                                    each.image[
                                                      each.image.length - 1
                                                    ].url
                                                  }
                                                  alt={each.title}
                                                />
                                              </Suspense>
                                            }

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
                                          </div>
                                          {
                                            <Suspense
                                              fallback={
                                                <p className="skeleton2 w-full"></p>
                                              }
                                            >
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
                                            </Suspense>
                                          }
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            {searchResults[2].playlists.length > 0 && (
                              <div className=" max-[600px]:w-[100%!important]">
                                <h5>Playlists</h5>
                                <div>
                                  {searchResults.length !== undefined && (
                                    <div>
                                      {searchResults[2].playlists.map(
                                        (each) => (
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

                                              if (each.type === "playlist") {
                                                setPlaylistToSearch(each.id);
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
                                            <div className="w-[25%] mr-5">
                                              {
                                                <Suspense
                                                  fallback={
                                                    <img
                                                      src="/logo.webp"
                                                      className="skeleton"
                                                    />
                                                  }
                                                >
                                                  <img
                                                    className="max-w-[100%]  block"
                                                    onClick={() => {
                                                      setSearchBar({
                                                        search: "",
                                                        animation:
                                                          "searchresults3",
                                                      });
                                                      setTimeout(() => {
                                                        setSearchBar({
                                                          search: "",
                                                          animation: "",
                                                        });
                                                      }, 1000);
                                                      const songsArr =
                                                        searchResults[0].songs;
                                                      if (
                                                        each.type === "playlist"
                                                      ) {
                                                        setPlaylistToSearch(
                                                          each.id
                                                        );
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
                                                      ].url
                                                    }
                                                    alt={each.title}
                                                  />
                                                </Suspense>
                                              }
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
                                                  if (
                                                    each.type === "playlist"
                                                  ) {
                                                    setPlaylistToSearch(
                                                      each.id
                                                    );
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
                                            </div>
                                            {
                                              <Suspense
                                                fallback={
                                                  <p className="skeleton2 w-full"></p>
                                                }
                                              >
                                                <p
                                                  onClick={() => {
                                                    setSearchBar({
                                                      search: "",
                                                      animation:
                                                        "searchresults3",
                                                    });
                                                    setTimeout(() => {
                                                      setSearchBar({
                                                        search: "",
                                                        animation: "",
                                                      });
                                                    }, 1000);

                                                    const songsArr =
                                                      searchResults[0].songs;
                                                    if (
                                                      each.type === "playlist"
                                                    ) {
                                                      setPlaylistToSearch(
                                                        each.id
                                                      );
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
                                                  {each.title}
                                                </p>
                                              </Suspense>
                                            }
                                          </div>
                                        )
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            {searchResults[3].topQuery.length > 0 && (
                              <div className=" max-[600px]:w-[100%!important]">
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

                                            if (each.type === "playlist") {
                                              setPlaylistToSearch(each.id);
                                            } else if (each.type === "song") {
                                              playSelectedSong(
                                                each.id,
                                                songsArr
                                              );
                                            } else if (each.type === "artist") {
                                              setPage(1);
                                              setObtaindAlbum(null);
                                              setArtistToSearch({
                                                id: each.id,
                                                details: each,
                                              });
                                            }
                                          }}
                                          className="songs-search"
                                          key={each.id}
                                        >
                                          <div className="w-[25%] mr-5">
                                            {
                                              <Suspense
                                                fallback={
                                                  <img
                                                    src="/logo.webp"
                                                    className="skeleton"
                                                  />
                                                }
                                              >
                                                <img
                                                  className="max-w-[100%]  block"
                                                  onClick={() => {
                                                    setSearchBar({
                                                      search: "",
                                                      animation:
                                                        "searchresults3",
                                                    });
                                                    setTimeout(() => {
                                                      setSearchBar({
                                                        search: "",
                                                        animation: "",
                                                      });
                                                    }, 1000);
                                                    const songsArr =
                                                      searchResults[0].songs;
                                                    if (
                                                      each.type === "playlist"
                                                    ) {
                                                      setPlaylistToSearch(
                                                        each.id
                                                      );
                                                    } else if (
                                                      each.type === "song"
                                                    ) {
                                                      playSelectedSong(
                                                        each.id,
                                                        songsArr
                                                      );
                                                    } else if (
                                                      each.type === "artist"
                                                    ) {
                                                      setPage(1);
                                                      setObtaindAlbum(null);
                                                      setArtistToSearch({
                                                        id: each.id,
                                                        details: each,
                                                      });
                                                    }
                                                  }}
                                                  src={
                                                    each.image[
                                                      each.image.length - 1
                                                    ].url
                                                  }
                                                  alt={each.title}
                                                />
                                              </Suspense>
                                            }
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
                                                if (each.type === "playlist") {
                                                  setPlaylistToSearch(each.id);
                                                } else if (
                                                  each.type === "song"
                                                ) {
                                                  playSelectedSong(
                                                    each.id,
                                                    songsArr
                                                  );
                                                } else if (
                                                  each.type === "artist"
                                                ) {
                                                  setPage(1);
                                                  setObtaindAlbum(null);
                                                  setArtistToSearch({
                                                    id: each.id,
                                                    details: each,
                                                  });
                                                }
                                              }}
                                              id="songs-logo-search"
                                              src="/logo.webp"
                                              alt="logo"
                                            />
                                          </div>
                                          {
                                            <Suspense
                                              fallback={
                                                <p className="skeleton2 w-full"></p>
                                              }
                                            >
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
                                                  if (
                                                    each.type === "playlist"
                                                  ) {
                                                    setPlaylistToSearch(
                                                      each.id
                                                    );
                                                  } else if (
                                                    each.type === "song"
                                                  ) {
                                                    playSelectedSong(
                                                      each.id,
                                                      songsArr
                                                    );
                                                  } else if (
                                                    each.type === "artist"
                                                  ) {
                                                    setPage(1);
                                                    setObtaindAlbum(null);
                                                    setArtistToSearch({
                                                      id: each.id,
                                                      details: each,
                                                    });
                                                  }
                                                }}
                                                style={{ cursor: "pointer" }}
                                              >
                                                {each.title}
                                              </p>
                                            </Suspense>
                                          }
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            {searchResults[4].artists.length > 0 && (
                              <div className=" max-[600px]:w-[100%!important]">
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

                                            if (each.type === "song") {
                                              playSelectedSong(
                                                each.id,
                                                songsArr
                                              );
                                            } else if (each.type === "artist") {
                                              setPage(1);
                                              setObtaindAlbum(null);
                                              setArtistToSearch({
                                                id: each.id,
                                                details: each,
                                              });
                                            }
                                          }}
                                          className="songs-search"
                                          key={each.id}
                                        >
                                          <div className="w-[25%] mr-5">
                                            {
                                              <Suspense
                                                fallback={
                                                  <img
                                                    src="/logo.webp"
                                                    className="skeleton"
                                                  />
                                                }
                                              >
                                                <img
                                                  className="max-w-[100%]  block"
                                                  onClick={() => {
                                                    setSearchBar({
                                                      search: "",
                                                      animation:
                                                        "searchresults3",
                                                    });
                                                    setTimeout(() => {
                                                      setSearchBar({
                                                        search: "",
                                                        animation: "",
                                                      });
                                                    }, 1000);
                                                    const songsArr =
                                                      searchResults[0].songs;
                                                    if (each.type === "song") {
                                                      playSelectedSong(
                                                        each.id,
                                                        songsArr
                                                      );
                                                    } else if (
                                                      each.type === "artist"
                                                    ) {
                                                      setPage(1);
                                                      setObtaindAlbum(null);
                                                      setArtistToSearch({
                                                        id: each.id,
                                                        details: each,
                                                      });
                                                    }
                                                  }}
                                                  src={
                                                    each.image[
                                                      each.image.length - 1
                                                    ].url
                                                  }
                                                  alt={each.title}
                                                />
                                              </Suspense>
                                            }
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
                                                if (each.type === "song") {
                                                  playSelectedSong(
                                                    each.id,
                                                    songsArr
                                                  );
                                                } else if (
                                                  each.type === "artist"
                                                ) {
                                                  setPage(1);
                                                  setObtaindAlbum(null);
                                                  setArtistToSearch({
                                                    id: each.id,
                                                    details: each,
                                                  });
                                                }
                                              }}
                                              id="songs-logo-search"
                                              src="/logo.webp"
                                              alt="logo"
                                            />
                                          </div>
                                          {
                                            <Suspense
                                              fallback={
                                                <p className="skeleton2 w-full"></p>
                                              }
                                            >
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
                                                  if (each.type === "song") {
                                                    playSelectedSong(
                                                      each.id,
                                                      songsArr
                                                    );
                                                  } else if (
                                                    each.type === "artist"
                                                  ) {
                                                    setPage(1);
                                                    setObtaindAlbum(null);
                                                    setArtistToSearch({
                                                      id: each.id,
                                                      details: each,
                                                    });
                                                  }
                                                }}
                                                style={{ cursor: "pointer" }}
                                              >
                                                {each.title}
                                              </p>
                                            </Suspense>
                                          }
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
                )}

                {whatToDisplay === displayingContent.home ? (
                  <>
                    {obtainedAlbum !== null && selectedComponent === "home" && (
                      <img
                        onClick={() => {
                          setWhatToDisplay(
                            whatToDisplay === displayingContent.albums
                              ? displayingContent.home
                              : displayingContent.albums
                          );
                        }}
                        className="fixed top-10 z-10 h-16 w-16 animate-bounce rounded-full  right-5 object-fill cursor-pointer max-[600px]:hidden"
                        src={
                          obtainedAlbum.image[obtainedAlbum.image.length - 1]
                            .link === undefined
                            ? obtainedAlbum.image[
                                obtainedAlbum.image.length - 1
                              ].url
                            : obtainedAlbum.image[
                                obtainedAlbum.image.length - 1
                              ].link
                        }
                        alt={obtainedAlbum.id}
                      />
                    )}
                    {/**Trending songs */}
                    <h2
                      style={{ fontSize: "clamp(1.3rem,2.8vw,2.5rem)" }}
                      className="font-sand font-light text-white ml-4 mb-4 tracking-wide max-[600px]:mt-[5%] max-[600px]:mb-[5%]"
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
                              <h1 className="max-[600px]:mt-[3.5%] max-[600px]:mb-[3.5%]">
                                {Object.keys(ea).join(", ")}{" "}
                                <button
                                  onClick={() => {
                                    moveCarousel(
                                      "left",
                                      `trendingsongs${Object.keys(ea).join(
                                        ", "
                                      )}`
                                    );
                                  }}
                                  type="button"
                                  className="max-[600px]:hidden text-white text-sm ml-[1%] mr-[.5%] px-[.6%] rounded-3xl bg-[#ffffff20]"
                                >
                                  ❮
                                </button>
                                <button
                                  onClick={() => {
                                    moveCarousel(
                                      "right",
                                      `trendingsongs${Object.keys(ea).join(
                                        ", "
                                      )}`
                                    );
                                  }}
                                  type="button"
                                  className="max-[600px]:hidden text-white text-sm ml-[.5%] px-[.6%] rounded-3xl bg-[#ffffff20]"
                                >
                                  ❯
                                </button>
                              </h1>
                              <div
                                id={`trendingsongs${Object.keys(ea).join(
                                  ", "
                                )}`}
                                className="tiltcon"
                              >
                                {ea[
                                  Object.keys(ea).join(", ")
                                ].trending.songs.map((each) => (
                                  <Tilt
                                    onClick={() => {
                                      setObtaindAlbum(null);
                                      const songsArr =
                                        ea[Object.keys(ea).join(", ")].trending
                                          .songs;
                                      playSelectedSong(each.id, songsArr);
                                    }}
                                    className="songs"
                                    key={each.id}
                                  >
                                    <div className="songs-logo-con">
                                      <img
                                        onClick={() => {
                                          setObtaindAlbum(null);
                                          const songsArr =
                                            ea[Object.keys(ea).join(", ")]
                                              .trending.songs;
                                          playSelectedSong(each.id, songsArr);
                                        }}
                                        className="songs-logo"
                                        src="/logo.webp"
                                        alt="logo"
                                      />
                                    </div>

                                    <div className="song-inside-con">
                                      {
                                        <Suspense
                                          fallback={
                                            <img
                                              src="/logo.webp"
                                              className="skeleton"
                                            />
                                          }
                                        >
                                          <img
                                            onClick={() => {
                                              setObtaindAlbum(null);
                                              const songsArr =
                                                ea[Object.keys(ea).join(", ")]
                                                  .trending.songs;
                                              playSelectedSong(
                                                each.id,
                                                songsArr
                                              );
                                            }}
                                            src={
                                              each.image[each.image.length - 1]
                                                .link
                                            }
                                            alt={each.name}
                                          />
                                        </Suspense>
                                      }
                                    </div>

                                    {
                                      <Suspense
                                        fallback={<p className="skeleton2"></p>}
                                      >
                                        <p
                                          onClick={() => {
                                            setObtaindAlbum(null);
                                            const songsArr =
                                              ea[Object.keys(ea).join(", ")]
                                                .trending.songs;
                                            playSelectedSong(each.id, songsArr);
                                          }}
                                          style={{ cursor: "pointer" }}
                                        >
                                          {each.name}
                                        </p>
                                      </Suspense>
                                    }

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
                                          setObtaindAlbum(null);
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
                      style={{ fontSize: "clamp(1.3rem,2.8vw,2.5rem)" }}
                      className=" font-sand font-light  text-white ml-4 mb-4 tracking-wide max-[600px]:mt-[5%] max[600px]:mb-[5%]"
                    >
                      Trending Albums
                    </h2>
                    {allLanguageSongs.length !== undefined &&
                      allLanguageSongs.map(
                        (ea) =>
                          ea[Object.keys(ea).join(", ")].trending.albums
                            .length > 0 && (
                            <>
                              <h1 className="max-[600px]:mt-[3.5%] max-[600px]:mb-[3.5%]">
                                {Object.keys(ea).join(", ")}{" "}
                                <button
                                  onClick={() => {
                                    moveCarousel(
                                      "left",
                                      `trendingalbums${Object.keys(ea).join(
                                        ", "
                                      )}`
                                    );
                                  }}
                                  type="button"
                                  className="max-[600px]:hidden text-white text-sm ml-[1%] mr-[.5%] px-[.6%] rounded-3xl bg-[#ffffff20]"
                                >
                                  ❮
                                </button>
                                <button
                                  onClick={() => {
                                    moveCarousel(
                                      "right",
                                      `trendingalbums${Object.keys(ea).join(
                                        ", "
                                      )}`
                                    );
                                  }}
                                  type="button"
                                  className="max-[600px]:hidden text-white text-sm ml-[.5%] px-[.6%] rounded-3xl bg-[#ffffff20]"
                                >
                                  ❯
                                </button>
                              </h1>
                              <div
                                id={`trendingalbums${Object.keys(ea).join(
                                  ", "
                                )}`}
                                className="tiltcon"
                              >
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
                                    <div className="songs-logo-con">
                                      <img
                                        onClick={() => {
                                          setAlbumToSearch(each.id);
                                        }}
                                        className="songs-logo"
                                        src="/logo.webp"
                                        alt="logo"
                                      />
                                    </div>
                                    <div className="song-inside-con">
                                      {
                                        <Suspense
                                          fallback={
                                            <img
                                              src="/logo.webp"
                                              className="skeleton"
                                            />
                                          }
                                        >
                                          <img
                                            onClick={() => {
                                              setAlbumToSearch(each.id);
                                            }}
                                            src={
                                              each.image[each.image.length - 1]
                                                .link
                                            }
                                            alt={each.name}
                                          />
                                        </Suspense>
                                      }
                                    </div>
                                    {
                                      <Suspense
                                        fallback={<p className="skeleton2"></p>}
                                      >
                                        <p
                                          onClick={() => {
                                            setAlbumToSearch(each.id);
                                          }}
                                          style={{ cursor: "pointer" }}
                                        >
                                          {each.name}
                                        </p>
                                      </Suspense>
                                    }

                                    {songPlaying.length > 0 ? (
                                      <>
                                        {songPlaying[0].album === undefined
                                          ? songPlaying[0].id
                                          : songPlaying[0].album.id !==
                                              each.id && (
                                              <button
                                                className="songs-button"
                                                type="button"
                                              >
                                                <FaPlay />
                                              </button>
                                            )}

                                        {songPlaying[0].album === undefined ? (
                                          songPlaying[0].id
                                        ) : songPlaying[0].album.id ===
                                            each.id && playSong === true ? (
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
                              {ea[
                                Object.keys(ea).join(", ")
                              ].trending.albums.flatMap((e) =>
                                e.artists.map((each) => each)
                              ).length > 0 && (
                                <h1 className="max-[600px]:mt-[3.5%] max-[600px]:mb-[3.5%]">
                                  {Object.keys(ea).join(", ")}&nbsp;{"Artists"}
                                  <button
                                    onClick={() => {
                                      moveCarousel(
                                        "left",
                                        `trendingartists${Object.keys(ea).join(
                                          ", "
                                        )}`
                                      );
                                    }}
                                    type="button"
                                    className="max-[600px]:hidden text-white text-sm ml-[1%] mr-[.5%] px-[.6%] rounded-3xl bg-[#ffffff20]"
                                  >
                                    ❮
                                  </button>
                                  <button
                                    onClick={() => {
                                      moveCarousel(
                                        "right",
                                        `trendingartists${Object.keys(ea).join(
                                          ", "
                                        )}`
                                      );
                                    }}
                                    type="button"
                                    className="max-[600px]:hidden text-white text-sm ml-[.5%] px-[.6%] rounded-3xl bg-[#ffffff20]"
                                  >
                                    ❯
                                  </button>
                                </h1>
                              )}
                              <div
                                id={`trendingartists${Object.keys(ea).join(
                                  ", "
                                )}`}
                                className="tiltcon"
                              >
                                {ea[
                                  Object.keys(ea).join(", ")
                                ].trending.albums.map((e) =>
                                  e.artists.map(
                                    (each) =>
                                      each.image[each.image.length - 1]
                                        ?.link !== undefined && (
                                        <Tilt
                                          onClick={() => {
                                            setPage(1);
                                            setObtaindAlbum(null);
                                            setArtistToSearch({
                                              id: each.id,
                                              details: each,
                                            });
                                          }}
                                          className="songs2"
                                          key={each.id}
                                        >
                                          <div className="song-inside-con">
                                            {
                                              <Suspense
                                                fallback={
                                                  <img
                                                    src="/logo.webp"
                                                    className="skeleton"
                                                  />
                                                }
                                              >
                                                <img
                                                  className="min-w-full rounded-[100%!important]"
                                                  onClick={() => {
                                                    setPage(1);
                                                    setObtaindAlbum(null);
                                                    setArtistToSearch({
                                                      id: each.id,
                                                      details: each,
                                                    });
                                                  }}
                                                  src={
                                                    each.image[
                                                      each.image.length - 1
                                                    ].link
                                                  }
                                                  alt={each.name}
                                                />
                                              </Suspense>
                                            }
                                          </div>
                                          {
                                            <Suspense
                                              fallback={
                                                <p className="skeleton2"></p>
                                              }
                                            >
                                              <p
                                                onClick={() => {
                                                  setPage(1);
                                                  setObtaindAlbum(null);
                                                  setArtistToSearch({
                                                    id: each.id,
                                                    details: each,
                                                  });
                                                }}
                                                style={{ cursor: "pointer" }}
                                              >
                                                {each.name}
                                              </p>
                                            </Suspense>
                                          }
                                        </Tilt>
                                      )
                                  )
                                )}
                              </div>
                            </>
                          )
                      )}

                    {/**Other Albums */}

                    <h2
                      id="otheralbums"
                      style={{ fontSize: "clamp(1.3rem,2.8vw,2.5rem)" }}
                      className=" font-sand font-light text-white ml-4 mb-4 tracking-wide max-[600px]:mt-[5%] max[600px]:mb-[5%]"
                    >
                      Other Albums
                    </h2>
                    {allLanguageSongs.length !== undefined &&
                      allLanguageSongs.map(
                        (ea) =>
                          ea[Object.keys(ea).join(", ")].albums.length > 0 && (
                            <>
                              <h1 className="max-[600px]:mt-[3.5%] max-[600px]:mb-[3.5%]">
                                {Object.keys(ea).join(", ")}{" "}
                                <button
                                  onClick={() => {
                                    moveCarousel(
                                      "left",
                                      `otheralbums${Object.keys(ea).join(", ")}`
                                    );
                                  }}
                                  type="button"
                                  className="max-[600px]:hidden text-white text-sm ml-[1%] mr-[.5%] px-[.6%] rounded-3xl bg-[#ffffff20]"
                                >
                                  ❮
                                </button>
                                <button
                                  onClick={() => {
                                    moveCarousel(
                                      "right",
                                      `otheralbums${Object.keys(ea).join(", ")}`
                                    );
                                  }}
                                  type="button"
                                  className="max-[600px]:hidden text-white text-sm ml-[.5%] px-[.6%] rounded-3xl bg-[#ffffff20]"
                                >
                                  ❯
                                </button>
                              </h1>
                              <div
                                id={`otheralbums${Object.keys(ea).join(", ")}`}
                                className="tiltcon"
                              >
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
                                      <div className="songs-logo-con">
                                        <img
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
                                          className="songs-logo"
                                          src="/logo.webp"
                                          alt="logo"
                                        />
                                      </div>
                                      <div className="song-inside-con">
                                        {
                                          <Suspense
                                            fallback={
                                              <img
                                                src="/logo.webp"
                                                className="skeleton"
                                              />
                                            }
                                          >
                                            <img
                                              onClick={() => {
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
                                          </Suspense>
                                        }
                                      </div>
                                      {
                                        <Suspense
                                          fallback={
                                            <p className="skeleton2"></p>
                                          }
                                        >
                                          <p
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
                                            style={{ cursor: "pointer" }}
                                          >
                                            {each.name}
                                          </p>
                                        </Suspense>
                                      }

                                      {songPlaying.length > 0 ? (
                                        <>
                                          {songPlaying[0].album === undefined
                                            ? songPlaying[0].id
                                            : songPlaying[0].album.id !==
                                                each.id && (
                                                <button
                                                  className="songs-button"
                                                  type="button"
                                                >
                                                  <FaPlay />
                                                </button>
                                              )}

                                          {songPlaying[0].album ===
                                          undefined ? (
                                            songPlaying[0].id
                                          ) : songPlaying[0].album.id ===
                                              each.id && playSong === true ? (
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
                              {ea[Object.keys(ea).join(", ")].albums.flatMap(
                                (e) => e.primaryArtists.map((each) => each)
                              ).length > 0 && (
                                <h1 className="max-[600px]:mt-[3.5%] max-[600px]:mb-[3.5%]">
                                  {Object.keys(ea).join(", ")}&nbsp;{"Artists"}
                                  <button
                                    onClick={() => {
                                      moveCarousel(
                                        "left",
                                        `otherartists${Object.keys(ea).join(
                                          ", "
                                        )}`
                                      );
                                    }}
                                    type="button"
                                    className="max-[600px]:hidden text-white text-sm ml-[1%] mr-[.5%] px-[.6%] rounded-3xl bg-[#ffffff20]"
                                  >
                                    ❮
                                  </button>
                                  <button
                                    onClick={() => {
                                      moveCarousel(
                                        "right",
                                        `otherartists${Object.keys(ea).join(
                                          ", "
                                        )}`
                                      );
                                    }}
                                    type="button"
                                    className="max-[600px]:hidden text-white text-sm ml-[.5%] px-[.6%] rounded-3xl bg-[#ffffff20]"
                                  >
                                    ❯
                                  </button>
                                </h1>
                              )}

                              <div
                                id={`otherartists${Object.keys(ea).join(", ")}`}
                                className="tiltcon"
                              >
                                {ea[Object.keys(ea).join(", ")].albums.map(
                                  (e) =>
                                    e.primaryArtists.map(
                                      (each) =>
                                        each.image[each.image.length - 1]
                                          ?.link !== undefined && (
                                          <Tilt
                                            onClick={() => {
                                              setPage(1);
                                              setObtaindAlbum(null);
                                              setArtistToSearch({
                                                id: each.id,
                                                details: each,
                                              });
                                            }}
                                            className="songs2"
                                            key={each.id}
                                          >
                                            <div className="song-inside-con">
                                              {
                                                <Suspense
                                                  fallback={
                                                    <img
                                                      src="/logo.webp"
                                                      className="skeleton"
                                                    />
                                                  }
                                                >
                                                  <img
                                                    className="min-w-full rounded-[100%!important]"
                                                    onClick={() => {
                                                      setPage(1);
                                                      setObtaindAlbum(null);
                                                      setArtistToSearch({
                                                        id: each.id,
                                                        details: each,
                                                      });
                                                    }}
                                                    src={
                                                      each.image[
                                                        each.image.length - 1
                                                      ].link
                                                    }
                                                    alt={each.name}
                                                  />
                                                </Suspense>
                                              }
                                            </div>
                                            {
                                              <Suspense
                                                fallback={
                                                  <p className="skeleton2"></p>
                                                }
                                              >
                                                <p
                                                  onClick={() => {
                                                    setPage(1);
                                                    setObtaindAlbum(null);
                                                    setArtistToSearch({
                                                      id: each.id,
                                                      details: each,
                                                    });
                                                  }}
                                                  style={{ cursor: "pointer" }}
                                                >
                                                  {each.name}
                                                </p>
                                              </Suspense>
                                            }
                                          </Tilt>
                                        )
                                    )
                                )}
                              </div>
                            </>
                          )
                      )}

                    {/**Playlists */}
                    <h2
                      id="playlists"
                      style={{ fontSize: "clamp(1.3rem,2.8vw,2.5rem)" }}
                      className=" font-sand font-light text-white ml-4 mb-4 tracking-wide max-[600px]:mt-[5%] max[600px]:mb-[5%]"
                    >
                      Playlists
                    </h2>
                    {allLanguageSongs.length !== undefined &&
                      allLanguageSongs.map(
                        (ea) =>
                          ea[Object.keys(ea).join(", ")].playlists.length >
                            0 && (
                            <>
                              <h1 className="max-[600px]:mt-[3.5%] max-[600px]:mb-[3.5%]">
                                {Object.keys(ea).join(", ")}{" "}
                                <button
                                  onClick={() => {
                                    moveCarousel(
                                      "left",
                                      `playlists${Object.keys(ea).join(", ")}`
                                    );
                                  }}
                                  type="button"
                                  className="max-[600px]:hidden text-white text-sm ml-[1%] mr-[.5%] px-[.6%] rounded-3xl bg-[#ffffff20]"
                                >
                                  ❮
                                </button>
                                <button
                                  onClick={() => {
                                    moveCarousel(
                                      "right",
                                      `playlists${Object.keys(ea).join(", ")}`
                                    );
                                  }}
                                  type="button"
                                  className="max-[600px]:hidden text-white text-sm ml-[.5%] px-[.6%] rounded-3xl bg-[#ffffff20]"
                                >
                                  ❯
                                </button>
                              </h1>
                              <div
                                id={`playlists${Object.keys(ea).join(", ")}`}
                                className="tiltcon"
                              >
                                {ea[Object.keys(ea).join(", ")].playlists.map(
                                  (each) => (
                                    <Tilt
                                      onClick={() => {
                                        const songsArr =
                                          ea[Object.keys(ea).join(", ")]
                                            .trending.songs;

                                        if (each.type === "playlist") {
                                          setPlaylistToSearch(each.id);
                                        } else if (each.type === "song") {
                                          playSelectedSong(each.id, songsArr);
                                        }
                                      }}
                                      className="songs"
                                      key={each.id}
                                    >
                                      <div className="songs-logo-con">
                                        <img
                                          onClick={() => {
                                            const songsArr =
                                              ea[Object.keys(ea).join(", ")]
                                                .trending.songs;
                                            if (each.type === "playlist") {
                                              setPlaylistToSearch(each.id);
                                            } else if (each.type === "song") {
                                              playSelectedSong(
                                                each.id,
                                                songsArr
                                              );
                                            }
                                          }}
                                          className="songs-logo"
                                          src="/logo.webp"
                                          alt="logo"
                                        />
                                      </div>
                                      <div className="song-inside-con">
                                        {
                                          <Suspense
                                            fallback={
                                              <img
                                                src="/logo.webp"
                                                className="skeleton"
                                              />
                                            }
                                          >
                                            <img
                                              onClick={() => {
                                                const songsArr =
                                                  ea[Object.keys(ea).join(", ")]
                                                    .trending.songs;
                                                if (each.type === "playlist") {
                                                  setPlaylistToSearch(each.id);
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
                                              alt={each.title}
                                            />
                                          </Suspense>
                                        }
                                      </div>
                                      {
                                        <Suspense
                                          fallback={
                                            <p className="skeleton2"></p>
                                          }
                                        >
                                          <p
                                            onClick={() => {
                                              const songsArr =
                                                ea[Object.keys(ea).join(", ")]
                                                  .trending.songs;
                                              if (each.type === "playlist") {
                                                setPlaylistToSearch(each.id);
                                              } else if (each.type === "song") {
                                                playSelectedSong(
                                                  each.id,
                                                  songsArr
                                                );
                                              }
                                            }}
                                            style={{ cursor: "pointer" }}
                                          >
                                            {each.title}
                                          </p>
                                        </Suspense>
                                      }

                                      {songPlaying.length > 0 ? (
                                        <>
                                          {playlisttoSearch !== each.id && (
                                            <button
                                              className="songs-button"
                                              type="button"
                                            >
                                              <FaPlay />
                                            </button>
                                          )}

                                          {playlisttoSearch === each.id &&
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
                      style={{ fontSize: "clamp(1.3rem,2.8vw,2.5rem)" }}
                      className="font-sand font-light text-white ml-4 mb-4 tracking-wide max-[600px]:mt-[5%] max[600px]:mb-[5%]"
                    >
                      Top Charts
                    </h2>
                    {allLanguageSongs.length !== undefined &&
                      allLanguageSongs.map(
                        (ea) =>
                          ea[Object.keys(ea).join(", ")].charts.length > 0 && (
                            <>
                              <h1 className="max-[600px]:mt-[3.5%] max-[600px]:mb-[3.5%]">
                                {Object.keys(ea).join(", ")}{" "}
                                <button
                                  onClick={() => {
                                    moveCarousel(
                                      "left",
                                      `topcharts${Object.keys(ea).join(", ")}`
                                    );
                                  }}
                                  type="button"
                                  className="max-[600px]:hidden text-white text-sm ml-[1%] mr-[.5%] px-[.6%] rounded-3xl bg-[#ffffff20]"
                                >
                                  ❮
                                </button>
                                <button
                                  onClick={() => {
                                    moveCarousel(
                                      "right",
                                      `topcharts${Object.keys(ea).join(", ")}`
                                    );
                                  }}
                                  type="button"
                                  className="max-[600px]:hidden text-white text-sm ml-[.5%] px-[.6%] rounded-3xl bg-[#ffffff20]"
                                >
                                  ❯
                                </button>
                              </h1>
                              <div
                                id={`topcharts${Object.keys(ea).join(", ")}`}
                                className="tiltcon"
                              >
                                {ea[Object.keys(ea).join(", ")].charts.map(
                                  (each) => (
                                    <Tilt
                                      onClick={() => {
                                        const songsArr =
                                          ea[Object.keys(ea).join(", ")]
                                            .trending.songs;
                                        if (each.type === "playlist") {
                                          setPlaylistToSearch(each.id);
                                        } else if (each.type === "song") {
                                          playSelectedSong(each.id, songsArr);
                                        }
                                      }}
                                      className="songs"
                                      key={each.id}
                                    >
                                      <div className="songs-logo-con">
                                        <img
                                          onClick={() => {
                                            const songsArr =
                                              ea[Object.keys(ea).join(", ")]
                                                .trending.songs;
                                            if (each.type === "playlist") {
                                              setPlaylistToSearch(each.id);
                                            } else if (each.type === "song") {
                                              playSelectedSong(
                                                each.id,
                                                songsArr
                                              );
                                            }
                                          }}
                                          className="songs-logo"
                                          src="/logo.webp"
                                          alt="logo"
                                        />
                                      </div>
                                      <div className="song-inside-con">
                                        {
                                          <Suspense
                                            fallback={
                                              <img
                                                src="/logo.webp"
                                                className="skeleton"
                                              />
                                            }
                                          >
                                            <img
                                              onClick={() => {
                                                const songsArr =
                                                  ea[Object.keys(ea).join(", ")]
                                                    .trending.songs;
                                                if (each.type === "playlist") {
                                                  setPlaylistToSearch(each.id);
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
                                              alt={each.title}
                                            />
                                          </Suspense>
                                        }
                                      </div>
                                      {
                                        <Suspense
                                          fallback={
                                            <p className="skeleton2"></p>
                                          }
                                        >
                                          <p
                                            onClick={() => {
                                              const songsArr =
                                                ea[Object.keys(ea).join(", ")]
                                                  .trending.songs;
                                              if (each.type === "playlist") {
                                                setPlaylistToSearch(each.id);
                                              } else if (each.type === "song") {
                                                playSelectedSong(
                                                  each.id,
                                                  songsArr
                                                );
                                              }
                                            }}
                                            style={{ cursor: "pointer" }}
                                          >
                                            {each.title}
                                          </p>
                                        </Suspense>
                                      }

                                      {songPlaying.length > 0 ? (
                                        <>
                                          {playlisttoSearch !== each.id && (
                                            <button
                                              className="songs-button"
                                              type="button"
                                            >
                                              <FaPlay />
                                            </button>
                                          )}

                                          {playlisttoSearch === each.id &&
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
                      setObtaindAlbum={setObtaindAlbum}
                      getArtist={getArtist}
                    />
                  )
                )}
                <div id={songPlaying.length > 0 ? "player" : "player1"}>
                  <span
                    style={{
                      left: `${
                        ((playerShifting.currentTime /
                          playerShifting.duration) *
                          100 || 0) - 6
                      }%`,
                    }}
                    id="timerhover"
                  >
                    {Math.floor(audioref.current.currentTime / 60)} :{" "}
                    {Math.floor(audioref.current.currentTime % 60) < 10 && 0}
                    {Math.floor(audioref.current.currentTime % 60)}
                  </span>
                  <section
                    style={{
                      width: `${
                        (playerShifting.currentTime / playerShifting.duration) *
                          100 || 0
                      }%`,
                    }}
                    className="absolute border-2 border-solid border-[#9794ff]  top-0 max-[600px]:top-[95%]"
                  ></section>
                  <input
                    id="dragger"
                    type="range"
                    value={
                      (playerShifting.currentTime / playerShifting.duration) *
                        100 || 0
                    }
                    onChange={handleSeekBarChange}
                    onMouseEnter={() => {
                      document.getElementById("timerhover").style.visibility =
                        "visible";
                    }}
                    onMouseLeave={() => {
                      document.getElementById("timerhover").style.visibility =
                        "hidden";
                    }}
                  />
                  {songPlaying.length > 0 && (
                    <>
                      <div className="playerimage">
                        <img
                          src={
                            songPlaying[0].image[
                              songPlaying[0].image.length - 1
                            ].link
                          }
                          alt={songPlaying[0].name}
                        />
                      </div>
                      <div className="max-[600px]:w-[45%] max-[745px]:w-[25%]">
                        <marquee>{songPlaying[0].name}</marquee>
                        <p>{songPlaying[0].primaryArtists}</p>
                      </div>

                      <div className="player-box ml-[-2%!important] max-[600px]:w-[20%]">
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
                            <FaShuffle className="text-white max-[600px]:hidden" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            changeSongs("prev");
                          }}
                          className="active:text-white max-[600px]:hidden"
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
                          className="active:text-white max-[600px]:hidden"
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
                            <TiArrowLoop className="text-4xl " />
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setLoop(true);
                            }}
                            type="button"
                          >
                            <TiArrowLoop className="text-4xl text-white max-[600px]:hidden" />
                          </button>
                        )}
                      </div>
                      <div className="volume-box max-[600px]:hidden">
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
                          className="max-[600px]:hidden"
                        />
                        <h5
                          style={{ paddingLeft: `${volume * 60}%` }}
                          className="range-value"
                        >
                          {volume * 100}%
                        </h5>
                      </div>
                      <span className="timertime max-[600px]:hidden max-[747px]:hidden">
                        {Math.floor(audioref.current.currentTime / 60)} :{" "}
                        {Math.floor(audioref.current.currentTime % 60) < 10 &&
                          0}
                        {Math.floor(audioref.current.currentTime % 60)} /{" "}
                        {Math.floor(audioref.current.duration / 60)} :{" "}
                        {Math.floor(audioref.current.duration % 60) < 10 && 0}
                        {Math.floor(audioref.current.duration % 60)}
                      </span>
                    </>
                  )}
                </div>
                <div className="drawer">
                  <div
                    style={
                      selectedComponent === "home"
                        ? { left: "8.25%" }
                        : selectedComponent === "playlist"
                        ? { left: "32%" }
                        : selectedComponent === "fav"
                        ? { left: "56.2%" }
                        : { left: "79.8%" }
                    }
                    className="selectedcomponent mt-[4.5%] mb-[2%]"
                  ></div>

                  {obtainedAlbum !== null &&
                  selectedComponent === "home" &&
                  whatToDisplay === displayingContent.home ? (
                    <img
                      onClick={() => {
                        setWhatToDisplay(
                          whatToDisplay === displayingContent.albums
                            ? displayingContent.home
                            : displayingContent.albums
                        );
                      }}
                      className="h-8 w-8 mb-[2.3%]  mt-[5%] z-20 rounded-full "
                      src={
                        obtainedAlbum.image[obtainedAlbum.image.length - 1]
                          .link === undefined
                          ? obtainedAlbum.image[obtainedAlbum.image.length - 1]
                              .url
                          : obtainedAlbum.image[obtainedAlbum.image.length - 1]
                              .link
                      }
                      alt={obtainedAlbum.id}
                    />
                  ) : (
                    <MdHomeFilled
                      onClick={() => {
                        setWhatToDisplay(displayingContent.home);
                        setSelectedComponent("home");
                      }}
                      fontSize={"1.9rem"}
                      color="#9794ff"
                      className="mb-[2.7%] mt-[5%] ml-[.5%]"
                    />
                  )}
                  <BiSolidPlaylist
                    onClick={() => {
                      setSelectedComponent("playlist");
                    }}
                    fontSize={"1.75rem"}
                    color="#9794ff"
                    className="mt-[5%] mb-[2%]"
                  />
                  <TiHeartFullOutline
                    onClick={() => {
                      setSelectedComponent("fav");
                    }}
                    fontSize={"1.9rem"}
                    color="#9794ff"
                    className="mb-[1%] mt-[5%]"
                  />
                  <RxCountdownTimer
                    onClick={() => {
                      setSelectedComponent("recent");
                    }}
                    fontSize={"1.6rem"}
                    color="#9794ff"
                    className="mt-[5%] mb-[2%]"
                  />
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
