import { useEffect, useState, useRef, useCallback } from "react";
import "../../index.css";
import { v4 as uuidV4 } from "uuid";

/**Icons */
import { FaPause, FaPlay, FaHeart, FaRegHeart } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { InfinitySpin } from "react-loader-spinner";

const displayingContent = {
  home: "home",
  albums: "albums",
  playlists: "playlists",
  charts: "charts",
};

const Albums = ({
  obtainedAlbum,
  playSelectedSong,
  setWhatToDisplay,
  setPlaySong,
  playSong,
  getArtist,
}) => {
  const [fav, setFav] = useState(false);

  const element = useRef();

  useEffect(() => {
    const audiotag = document.querySelector(".album-header");
    audiotag.scrollIntoView({ behavior: "smooth" });
  }, []);
  useEffect(() => {
    if (obtainedAlbum.songCount === "0") {
      setWhatToDisplay(displayingContent.home);
    }
  });

  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting) {
      if (obtainedAlbum.type === "artist") {
        document.getElementById("getartist").click();
      }
    }
  }, []);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (element.current) observer.observe(element.current);
  }, [handleObserver]);

  return (
    obtainedAlbum && (
      <>
        <div className="album-header">
          <h1
            onClick={() => {
              setWhatToDisplay(displayingContent.home);
            }}
            className="top-[10%] font-extrabold right-10 cursor-pointer fixed z-20 hover:scale-125 transition-all p-[1%] rounded-[100%]  max-[600px]:right-[90%] max-[600px]:top-[5%]"
            style={{
              fontSize: "clamp(1.2rem,2.2vw, 2rem)",
              backdropFilter: "blur(16px) saturate(180%)",
              WebkitBackdropFilter: "blur(16px) saturate(180%)",
              backgroundColor: "rgba(17, 25, 40, 0.75)",
              border: "1px solid white",
              overflow: "hidden",
            }}
          >
            <IoIosArrowBack className="ml-[-5%]" />
          </h1>
          <div id="allbum-image-con">
            <img
              src={
                obtainedAlbum.image[obtainedAlbum.image.length - 1].link ===
                undefined
                  ? obtainedAlbum.image[obtainedAlbum.image.length - 1].url
                  : obtainedAlbum.image[obtainedAlbum.image.length - 1].link
              }
              alt={obtainedAlbum.name}
            />
          </div>

          <div className="album-details">
            <h1 className="max-w-[100%] max-h-[16%] text-ellipsis overflow-hidden">
              {obtainedAlbum.name || obtainedAlbum.title}
            </h1>
            {obtainedAlbum.releaseDate === undefined ? (
              <>
                <h4>
                  Description &nbsp;:&nbsp; {obtainedAlbum.description}
                  &nbsp;&nbsp;
                </h4>
                <h4>
                  No of Songs &nbsp;: &nbsp;
                  {obtainedAlbum.songCount || obtainedAlbum.total}
                </h4>
              </>
            ) : (
              <>
                <h4>
                  Release Data &nbsp;:&nbsp; {obtainedAlbum.releaseDate}
                  &nbsp;&nbsp;
                </h4>
                <h4>
                  No of Songs &nbsp;: &nbsp;
                  {obtainedAlbum.songCount || obtainedAlbum.total}
                </h4>
              </>
            )}
            {obtainedAlbum.primaryArtists !== undefined && (
              <h4>
                Primary Artist &nbsp;: &nbsp; {obtainedAlbum.primaryArtists}
              </h4>
            )}
            <div>
              {playSong ? (
                <button
                  onClick={() => {
                    const audiotag = document.getElementById("audiotag");
                    audiotag.pause();
                    setPlaySong(false);
                  }}
                  type="button"
                >
                  <FaPause />
                </button>
              ) : (
                <button
                  onClick={() => {
                    const audiotag = document.getElementById("audiotag");
                    audiotag.play();
                    setPlaySong(true);
                  }}
                  type="button"
                >
                  <FaPlay className="ml-[12%]" />
                </button>
              )}
              {fav ? (
                <button
                  onClick={() => {
                    setFav(!fav);
                  }}
                  type="button"
                >
                  <FaHeart />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setFav(!fav);
                  }}
                  type="button"
                >
                  <FaRegHeart />
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="album-songs">
          {obtainedAlbum.songs.map((each) => (
            <div>
              <img
                onClick={() => {
                  playSelectedSong(each.id, obtainedAlbum.songs);
                }}
                src={
                  each.image[each.image.length - 1].link === undefined
                    ? each.image[each.image.length - 1].url
                    : each.image[each.image.length - 1].link
                }
                alt={each.name}
              />

              <h3
                onClick={() => {
                  playSelectedSong(each.id, obtainedAlbum.songs);
                }}
              >
                {each.name}
              </h3>
              {
                <p
                  onClick={() => {
                    playSelectedSong(each.id, obtainedAlbum.songs);
                  }}
                >
                  {each.primaryArtists === undefined
                    ? each.artists.primary.map((e) => e.name)[0]
                    : each.primaryArtists}
                </p>
              }
              {fav ? (
                <button
                  onClick={() => {
                    setFav(!fav);
                  }}
                  type="button"
                >
                  <FaHeart />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setFav(!fav);
                  }}
                  type="button"
                >
                  <FaRegHeart />
                </button>
              )}
              {String(each.duration).length > 2 ? (
                <p
                  onClick={() => {
                    playSelectedSong(each.id, obtainedAlbum.songs);
                  }}
                >
                  {String(each.duration)[0]}&nbsp;:&nbsp;
                  {String(each.duration).slice(1)}
                </p>
              ) : (
                <p
                  onClick={() => {
                    playSelectedSong(each.id, obtainedAlbum.songs);
                  }}
                >
                  {0}&nbsp;:&nbsp;{String(each.duration)}
                </p>
              )}
            </div>
          ))}
        </div>
        <div ref={element}></div>
        <button id="getartist" onClick={getArtist} type="button"></button>
      </>
    )
  );
};
export default Albums;
