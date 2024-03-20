import { useEffect, useState } from "react";
import "../../index.css";

/**Icons */
import { FaPause, FaPlay, FaHeart, FaRegHeart } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";

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
}) => {
  const [fav, setFav] = useState(false);

  useEffect(() => {
    const audiotag = document.querySelector(".album-header");
    audiotag.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    obtainedAlbum && (
      <>
        <div className="album-header">
          <h1
            onClick={() => {
              setWhatToDisplay(displayingContent.home);
            }}
            className="top-[10%] font-extrabold right-10 cursor-pointer fixed z-20 hover:scale-125 transition-all p-[1%] rounded-[100%] "
            style={{
              fontSize: "clamp(.7rem,2.2vw, 2rem)",
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
              src={obtainedAlbum.image[obtainedAlbum.image.length - 1].link}
              alt={obtainedAlbum.name}
            />
          </div>

          <div className="album-details">
            <h1>{obtainedAlbum.name}</h1>
            <h4>
              Release Data &nbsp;:&nbsp; {obtainedAlbum.releaseDate}
              &nbsp;&nbsp; No of Songs &nbsp;: &nbsp;
              {obtainedAlbum.songCount}
            </h4>
            <h4>
              Primary Artist &nbsp;: &nbsp; {obtainedAlbum.primaryArtists}
            </h4>
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
            <div key={each.id}>
              <img
                onClick={() => {
                  playSelectedSong(each.id, obtainedAlbum.songs);
                }}
                src={each.image[each.image.length - 1].link}
                alt={each.name}
              />

              <h3
                onClick={() => {
                  playSelectedSong(each.id, obtainedAlbum.songs);
                }}
              >
                {each.name}
              </h3>
              <p
                onClick={() => {
                  playSelectedSong(each.id, obtainedAlbum.songs);
                }}
              >
                {each.primaryArtists}
              </p>
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
              {each.duration.length > 2 ? (
                <p
                  onClick={() => {
                    playSelectedSong(each.id, obtainedAlbum.songs);
                  }}
                >
                  {each.duration[0]}&nbsp;:&nbsp;{each.duration.slice(1)}
                </p>
              ) : (
                <p
                  onClick={() => {
                    playSelectedSong(each.id, obtainedAlbum.songs);
                  }}
                >
                  {0}&nbsp;:&nbsp;{each.duration}
                </p>
              )}
            </div>
          ))}
        </div>
      </>
    )
  );
};
export default Albums;
