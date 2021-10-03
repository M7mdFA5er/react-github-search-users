import React, { useState, useEffect, createContext, useContext } from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';

const rootUrl = 'https://api.github.com';

const GithubContext = createContext();

// Provider , Comsumer

const GithubProvider = ({ children }) => {
  return (
    <GithubContext.Provider value={{ value: 'hi' }}>
      {children}
    </GithubContext.Provider>
  );
};


//Custom hook
export const useGlobalContext = () => {
  return useContext(GithubContext);
}

export { GithubProvider, GithubContext }
