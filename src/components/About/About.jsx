import React, { useRef, useEffect } from "react";
import "./css/about.css";
import { Button, InputGroup, FormControl } from "react-bootstrap";
import fire from "../../config/Fire";
import { FaHeart } from "react-icons/fa";
import axios from "axios";

import { useStore } from "../Firebase/FirebaseStore.jsx";

export default function About() {
  const { state, dispatch } = useStore();
  const dataInput = useRef();
  const webInput = useRef();

  useEffect(() => {
    const db = fire.database();
    const dbRef = db.ref().child("data");

    dbRef.on("value", snapshot => {
      //do sth
      dispatch({ type: "ADD_DB", payload: snapshot.val() });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="aboutCon">
      <div className="mainTitle">About</div>
      <p>This is a ReactJS Application with Authentication from Firebase.</p>
      <p>Feel free to visit my personal Website.</p>
      <a
        href="https://www.ifranklam.com"
        rel="noopener noreferrer"
        target="_blank"
      >
        <p>ifranklam.com </p>
      </a>

      <p className="madeWith">
        Made with <FaHeart className="" /> in Orlando, Florida
      </p>
      <p> Test Section</p>
      <h4 className="text-center">AuthUser</h4>

      <p>{state.authUser.displayName ?? "No username"}</p>
      <p>{state.authUser.email ?? "login"}</p>

      <h4 className="text-center"> Counter/test</h4>
      <div>{state.counter}</div>
      <button onClick={() => dispatch({ type: "ADD1" })}>Add</button>
      <button onClick={() => dispatch({ type: "MINUS1" })}>Subtract</button>
      <button onClick={() => dispatch({ type: "CHECK_STATE" })}>
        log state
      </button>

      <h4 className="text-center"> Quick Snap Container</h4>
      <InputGroup>
        <FormControl
          type="text"
          ref={dataInput}
          placeholder={"Data"}
          aria-label="Search"
          aria-describedby="basic-addon2"
          onKeyPress={handleKeyPress}
        />
        <InputGroup.Append>
          <Button variant="info" onClick={handleSearchInput}>
            Search
          </Button>
        </InputGroup.Append>
      </InputGroup>

      <p>{state.db.data}</p>

      <InputGroup>
        <FormControl
          type="text"
          ref={webInput}
          placeholder={"webTest"}
          aria-label="Search"
          aria-describedby="basic-addon2"
        />
        <InputGroup.Append></InputGroup.Append>
      </InputGroup>
      <Button variant="info" onClick={Get}>
        Get
      </Button>
      <Button variant="info" onClick={Post}>
        Post
      </Button>
    </div>
  );

  function handleSearchInput(e) {
    const name = dataInput.current.value;
    console.log("name", name);
    fire
      .database()
      .ref("data")
      .set({
        data: name
      });
    if (name === "") return;
    dispatch({
      type: "ADD_DB",
      payload: {
        data: name
      }
    });
  }
  function handleKeyPress(target) {
    if (target.charCode === 13) {
      handleSearchInput();
    }
  }

  function Get() {
    console.log("Get");

    axios.get("http://localhost:4000/creators").then(response => {
      console.log(response.data);
    });
  }

  function Post() {
    console.log("Post");
    const input = webInput.current.value;

    axios
      .post("http://localhost:4000/creators", {
        firstName: "Fred",
        lastName: "Flintstone",
        input: input
      })
      
  }
}
