import axios from "axios";

export const fetchPosts = (subreddit) => {
  return axios.get(`https://www.reddit.com/r/${subreddit}/random.json`);
};