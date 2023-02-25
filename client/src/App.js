//Import react
import React from 'react';
//Import necessary objects/classes from @apollo/client
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
//Import context
import { setContext } from '@apollo/client/link/context';
//Import BrowserRoutes, Routes and Route 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//Import pages and necessary components
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';

//Build main GraphQL API endpoint
const httpLink = createHttpLink({
  uri: '/graphql',
});

//Build request middleware that will attach JWT token to each request as authorization header
const authLink = setContext((_, { headers }) => {
  //Obtain authentication token from localStorage if it exists
  const token = localStorage.getItem('id_token');
  //Return context headers so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

//Create new ApolloClient
const client = new ApolloClient({
  //Configure client to execute authLink middleware before performing a request to the GraphQL API
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

//Define function to return App with navigation bar and the proper Router to go the necessary Pages
function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <>
          <Navbar />
          <Routes>
            <Route path='/' element={<SearchBooks></SearchBooks>} />
            <Route path='/saved' element={<SavedBooks></SavedBooks>} />
            <Route path ='*' element={<h1 className='display-2'>Wrong page!</h1>} />
          </Routes>
        </>
      </Router>
    </ApolloProvider>
  );
}

//Export App
export default App;
