import { useState, useEffect, createContext} from "react"
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";

import Header from "./components/Header"
import Content from "./components/Content";
import Footer from "./components/Footer"

import './styles/_app.scss';

const yaml = require('js-yaml');

function Blog() {
  return (
    <div>
      <Header />
      <Content />
      <Footer />
    </div>
  );
}

export const BlogConfig = createContext({})

function App() {

  const [config, setConfig] = useState({})

  const fetchBlogConf = () => {
    fetch('/blog.yaml')
    .then(function(response){
      return response.text();
    })
    .then(function(yamlData) {
      setConfig(yaml.load(yamlData))
    });
  }

  useEffect(() => {
    fetchBlogConf()
  }, [])

  return (
    <BlogConfig.Provider value={config}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={<Blog />}
          />
          <Route
            path="posts/*"
            element={<Blog />}
          />
        </Routes>
      </Router>
    </BlogConfig.Provider>
  );
}

export default App;
