import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import MovieItem from "./MovieItem.jsx";
import Pagination from "./Pagination.jsx";
import { Col, Row, Spinner } from "react-bootstrap";
import "./css/movie.css";

export default function Movie() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPrev, setShowPrev] = useState(false);
  const [showNext, setShowNext] = useState(true);

  const [error, setError] = useState(false);
  const movieSearchInput = useRef();

  const [currentPageUrl, setCurrentPageUrl] = useState(
    //first page
    "https://api.themoviedb.org/3/movie/popular?api_key=630dccfdf3364cb0f343c0132432ed6b&language=en-US&page=1"
  );

  useEffect(() => {

    let one = currentPageUrl;
let two = changePageNum(currentPageUrl, true, null, true);
// let three = "https://api.storyblok.com/v1/cdn/stories/vue?version=published&token=wANpEQEsMYGOwLxwXQ76Ggtt";

const requestOne = axios.get(one);
const requestTwo = axios.get(two);
// const requestThree = axios.get(three);

axios.all([requestOne, requestTwo]).then(axios.spread((...responses) => {
  const responseOne = responses[0]
  const responseTwo = responses[1]
  // if (responseOne.data.results.length !== 0) {
  //   setMovies(responseOne.data.results);
  //   setError(false);
  //   setShowNext(true);
  // } else {
  //   setError(true);
  //   setShowNext(false);
  //   setShowPrev(false);
  //   setMovies(responseOne.data.results);
  // }
  // if (responseTwo.data.results.length === 0) {
  //   setShowNext(false);
  // } else {
  //   setShowNext(true);
  // }
  console.log(responseOne)
  console.log(responseTwo)
  
  // const responesThree = responses[2]
  // use/access the results 
})).catch(errors => {
  // react on errors.
})

    axios.get(currentPageUrl).then(response => {
  console.log(response)
  if (response.data.results.length !== 0) {
        setMovies(response.data.results);
        setError(false);
        setShowNext(true);
      } else {
        setError(true);
        setShowNext(false);
        setShowPrev(false);
        setMovies(response.data.results);
      }
      setLoading(false);
    });

    //fetch to check next page available
    axios
      .get(changePageNum(currentPageUrl, true, null, true))
      .then(response => {
        if (response.data.results.length === 0) {
          setShowNext(false);
        } else {
          setShowNext(true);
        }
      });
  }, [currentPageUrl]);

  //loading screen
  if (loading)
    return (
      <div className="loadingScreen">
        <Spinner size="lg" className="" animation="border" />
        <p>Loading...</p>
      </div>
    );
  return (
    <section className="movieCon">
      <div className="mainTitle">Movies</div>
      <Pagination
        inputShow={true}
        showPrev={showPrev}
        showNext={showNext}
        changePageNum={changePageNum}
        currentPageUrl={currentPageUrl}
        movieSearchInput={movieSearchInput}
        handleKeyPress={handleKeyPress}
        handleSearchInput={handleSearchInput}
        error={error}
      ></Pagination>

      {error && <p className="inputError">"No Result"</p>}

      <Row className="movieList mt-3">
        {movies.map(movie => (
          <Col key={movie.id} md={6} lg={6} xl={4}>
            <MovieItem movie={movie} />
          </Col>
        ))}
      </Row>
      <Pagination
        inputShow={false}
        showPrev={showPrev}
        showNext={showNext}
        changePageNum={changePageNum}
        currentPageUrl={currentPageUrl}
      ></Pagination>
    </section>
  );

  function changePageNum(url, add, num, check) {
    if (!url.includes("&page=")) url = url.concat("&page=1"); // adding &page= for search input
    const baseUrl = url.slice(0, url.indexOf("&page=") + 6);
    let id = num || Number(url.substring(url.indexOf("&page=") + 6));
    add ? id++ : id--;
    if (check) return baseUrl + id;
    id > 1 ? setShowPrev(true) : setShowPrev(false); // show prev btn
    setCurrentPageUrl(baseUrl + id);
  }

  function handleSearchInput(e) {
    console.log(e);

    const name = movieSearchInput.current.value;
    const searchUrl =
      "https://api.themoviedb.org/3/search/movie?api_key=630dccfdf3364cb0f343c0132432ed6b&language=en-US&query=";
    if (name === "") return;
    setCurrentPageUrl(searchUrl + name);
    movieSearchInput.current.value = null;
    setShowPrev(false);
  }
  // press Enter listener
  function handleKeyPress(target) {
    if (target.charCode === 13) {
      handleSearchInput();
    }
  }
}