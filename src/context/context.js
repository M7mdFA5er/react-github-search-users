import React, { useState, useEffect, createContext, useContext } from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';

const rootUrl = 'https://api.github.com';

const GithubContext = createContext();

// Provider , Comsumer

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser);
  const [repos, setRepos] = useState(mockRepos);
  const [followers, setFollowers] = useState(mockFollowers);

  //request loading
  const [requests, setRequests] = useState(0);
  const [loading, setLoading] = useState(false);
  //error
  const [error, setError] = useState({ show: false, msg: '' });

  //check rate
  const checkRequests = () => {
    axios(`${rootUrl}/rate_limit`)
      .then(({ data }) => {
        // console.log(`data`, data)
        let { rate: { remaining } } = data;
        setRequests(remaining);
        if (remaining === 0) {
          // throw an error
          toggleError(true, 'sorry , you haver exceeded your requests rate limit')
        }
      })
      .catch((err) => console.log('err :>> ', err));
  }

  const searchGithubUser = async (user) => {
    toggleError();
    setLoading(true)
    const response = await axios(`${rootUrl}/users/${user}`)
      .catch(err => console.log('err :>> ', err));
    if (response) {
      setGithubUser(response.data);
      //More Logic
      const { login, followers_url } = response.data;

      await Promise.allSettled([
        axios(`${rootUrl}/users/${login}/repos?per_page=100`),
        axios(`${followers_url}?per_page=100`)
      ])
        .then((results) => {
          const [repos, followers] = results;
          const status = 'fulfilled';
          if (repos.status === status) {
            setRepos(repos.value.data);
          }
          if (followers.status === status) {
            setFollowers(followers.value.data);
          }
        })
    } else {
      toggleError(true, 'there is no user with that username')
    }
    checkRequests();
    setLoading(false);
  }

  const toggleError = (show = false, msg = '') => {
    setError({ show, msg })
  }

  useEffect(checkRequests, []);

  return (
    <GithubContext.Provider value={{ githubUser, repos, followers, requests, error, loading, searchGithubUser }}>
      {children}
    </GithubContext.Provider>
  );
};


//Custom hook
export const useGlobalContext = () => {
  return useContext(GithubContext);
}

export { GithubProvider, GithubContext }
