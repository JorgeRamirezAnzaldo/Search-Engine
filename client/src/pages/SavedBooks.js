//Import React, useState and useEffect
import React, { useState, useEffect } from 'react';
//Import elements from react-bootstrap
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';
//Import useQuery and useMutation
import { useQuery, useMutation } from '@apollo/client';
//Import QUERY_ME query and REMOVE_BOOK mutation
import { QUERY_ME }  from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';

//Import Auth class
import Auth from '../utils/auth';
//Import function to remove book ids from localStorage
import { removeBookId } from '../utils/localStorage';

//Function for SavedBooks
const SavedBooks = () => {
  //Configure removeBook to use REMOVE_BOOK mutation
  const [removeBook, { error }] = useMutation(REMOVE_BOOK);
  //Use query QUERY_ME
  const {loading, data} = useQuery(QUERY_ME);
  //Set data to userData, if there is no data set an empty object
  const userData = data?.me || {};

  // crear una función que acepte el valor mongo _id del libro como parámetro y elimina el libro de la base de datos
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null; //Validate if the user is logged in and get token

    if (!token) { //If there is no token
      return false; //Return false
    }
    //Remove book
    try {
      const { data } = await removeBook({variables:{ bookId: bookId }}); //Remove book for user
      // tras el éxito, eliminar el identificador del libro de localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // si los datos aún no están aquí, expresarlo
  if (loading) {  
    return <h2>LOADING...</h2>;
  }

  //Return necessary elements, functions and variables
  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {userData.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

//Export SavedBooks
export default SavedBooks;
