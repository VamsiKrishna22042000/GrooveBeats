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
    if (playSong === false) {
      playSelectedSong(obtainedAlbum.songs[0].id, obtainedAlbum.songs);
    }
  }, []);

  return (
    obtainedAlbum && (
      <>
        <div className="album-header">
          <h1
            onClick={() => {
              setWhatToDisplay(displayingContent.home);
            }}
            className="text-3xl absolute top-[20%] font-extrabold right-10 cursor-pointer"
          >
            <IoIosArrowBack />
          </h1>
          <img
            src={obtainedAlbum.image[obtainedAlbum.image.length - 1].link}
            alt={obtainedAlbum.name}
          />
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
              <p
                onClick={() => {
                  playSelectedSong(each.id, obtainedAlbum.songs);
                }}
              >
                {each.duration[0]}&nbsp;:&nbsp;{each.duration.slice(1)}
              </p>
            </div>
          ))}
        </div>
      </>
    )
  );
};
export default Albums;
