//Import React, useState and useEffect
import React, { useState, useEffect } from 'react';
//Import elements from react-bootstrap
import { Jumbotron, Container, Col, Form, Button, Card, CardColumns } from 'react-bootstrap';

//Import useMutation
import { useMutation } from '@apollo/client';
//Import SAVE_BOOK from mutations
import { SAVE_BOOK } from '../utils/mutations';
//Import Auth class
import Auth from '../utils/auth';

//Import searchGoogleBooks function to use Google API
import { searchGoogleBooks } from '../utils/API';
//Import functions to save and get saved book ids
import { saveBookIds, getSavedBookIds } from '../utils/localStorage';

//Function for SearchBooks
const SearchBooks = () => {
  // crear un estado para retener datos de API de Google devueltos
  const [searchedBooks, setSearchedBooks] = useState([]);
  // crear un estado para mantener nuestros datos de campo de búsqueda
  const [searchInput, setSearchInput] = useState('');
  // crear un estado para mantener valores de bookId guardados
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

  //Configure saveBook to use mutation SAVE_BOOK
  const [saveBook, { error }] = useMutation(SAVE_BOOK);

  // configurar el hook useEffect para guardar la lista `savedBookIds` en localStorage al desmontar el componente
  // Obtenga más información aquí: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
  useEffect(() => {
    return () => saveBookIds(savedBookIds);
  });

  // crear un método para buscar libros y establecer el estado al enviar el formulario
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) { //If no data introduced in the input search
      return false; //Return false
    }

    //Search google books
    try {
      const response = await searchGoogleBooks(searchInput); //Search google books using the API and the input data 

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const { items } = await response.json(); //Get all items from the response

      const bookData = items.map((book) => ({ //Create bookData using the items of the response
        bookId: book.id,
        authors: book.volumeInfo.authors || ['No author to display'],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description,
        image: book.volumeInfo.imageLinks?.thumbnail || '',
      }));

      //Change state variables
      setSearchedBooks(bookData); 
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  // crear una función para manejar el guardado de un libro en nuestra base de datos
  const handleSaveBook = async (bookId) => {
    // encontrar el libro en el estado `searchedBooks` según el identificador coincidente
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);

    //Validate if the user is logged in and get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) { //If no token was returned
      return false; //Return false
    }
    //Save book
    try {
      const { data } = await saveBook({ variables: {input : bookToSave} }); //Save book to the user
      // si el libro se guarda correctamente en la cuenta del usuario, guardar el identificador del libro en el estado
      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
    } catch (err) {
      console.error(err);
    }
  };

  //Return function with all elements, functions and variables
  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Search for Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Form.Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a book'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg'>
                  Submit Search
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </Container>
      </Jumbotron>

      <Container>
        <h2>
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : 'Search for a book to begin'}
        </h2>
        <CardColumns>
          {searchedBooks.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? (
                  <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' />
                ) : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  {Auth.loggedIn() && (
                    <Button
                      disabled={savedBookIds?.some((savedBookId) => savedBookId === book.bookId)}
                      className='btn-block btn-info'
                      onClick={() => handleSaveBook(book.bookId)}>
                      {savedBookIds?.some((savedBookId) => savedBookId === book.bookId)
                        ? 'This book has already been saved!'
                        : 'Save this Book!'}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

//Export SearchBooks
export default SearchBooks;
