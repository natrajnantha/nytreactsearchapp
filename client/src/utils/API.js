import axios from "axios";

export default {
  getArticles: function() {
    console.log("GET THE ARTICLES");
    return axios.get("/api/articles");
  },
  deleteArticle: function(id) {
    return axios.delete("/api/articles/" + id);
  },
  saveArticle: function(articleData) {
    console.log("IN SAVE ARTICLE");
    console.log(articleData);
    return axios.post("/api/articles", articleData);
  },
  queryNYT: function(queryUrl) {
    return axios.get(queryUrl);
  }
};
