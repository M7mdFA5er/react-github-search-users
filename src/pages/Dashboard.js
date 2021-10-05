import React from 'react';
import { Info, Repos, User, Search, Navbar } from '../components';
import loadingImage from '../images/preloader.gif';
import { GithubContext, useGlobalContext } from '../context/context';
const Dashboard = () => {
  const { githubUser } = useGlobalContext();
  console.log('githubUser :>> ', githubUser);
  return (
    <main>
      {/* <Navbar></Navbar> */}
      {/* <Search /> */}
      <Info />
      <User />
      {/* <Repos /> */}
    </main>
  );
};

export default Dashboard;
