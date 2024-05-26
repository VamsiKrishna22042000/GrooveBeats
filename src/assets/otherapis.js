import axios from "axios";
import Cookies from "js-cookie";

const setRecentlyPlayed = async (song) => {
  console.log(song);
  // try {
  //   const userId = Cookies.get("userIdgroove");
  //   const response = await axios.post(
  //     `${import.meta.env.VITE_BACKEND_URL}/recentlyPlayed/${userId}/add`,
  //     song
  //   );
  //   console.log('Response:', response.data);
  // } catch (error) {
  //   console.error('Error setting recently played song:', error);
  // }
  const body = {
    songId: song[0]?.id,
    name: song[0]?.name,
    imageUrl: song[0]?.image[parseInt(song[0]?.image.length) - 1].link,
    songUrl:
      song[0]?.downloadUrl[parseInt(song[0]?.downloadUrl.length) - 1].link,
  };
  console.log(body);
};

export default setRecentlyPlayed;
