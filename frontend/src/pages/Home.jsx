import { useEffect, useState } from 'react';
import { useAccount, useContractRead } from "wagmi";
import { useLocation, NavLink } from 'react-router-dom';

import BookList from '../components/partials/BookList';

import contractJson from "../abi/BookLibrary.json";
import { contractAddress } from '../utils';

function Home() {
  const { isConnected } = useAccount();

  const location = useLocation();
  const [ shouldReloadCurrent, setShouldReloadCurrent ] = useState(location.state);

  const [ isLoaded, setIsLoaded ] = useState(false);
  const [ isFailure, setIsFailure ] = useState("");

  const { data: bookIds, isLoading } = useContractRead({
    address: contractAddress,
    abi: contractJson.abi,
    functionName: 'getBooksList',
    enabled: isConnected,
    args: [],
    watch: true,
    onError(error) {
      setIsFailure(error.message);
    },
  });

  useEffect(() => {
    setIsLoaded(!!bookIds);

    if (!!shouldReloadCurrent) {
      setShouldReloadCurrent(false);
    }
  }, [bookIds, shouldReloadCurrent, setShouldReloadCurrent]);

  return (
    <div className="container my-6">
      <h1>Book Library</h1>

      <div className="mt-3">
        {!isConnected ? (
          <span>You have to log in first!</span>
        ) : (
          <div className="my-4">
            <NavLink to="/add" className="btn btn-primary">
              Add book
            </NavLink>

            {isLoading && ( <div className="mt-2">Loading...</div> )}

            {isLoaded ? (
              <BookList bookIds={ bookIds }></BookList>
            ) : (
              <div className="mt-6">No books available.</div>
            )}
          </div>
        )}
      </div>

      <div className="mt-8">
        <NavLink to="/styleguide" className="btn btn-primary">
          See styleguide
        </NavLink>
      </div>

      {!!isFailure && (
        <div className="mt-6">
          <p className="text-danger">{ isFailure }</p>
        </div>
      )}
    </div>
  );
}

export default Home;
