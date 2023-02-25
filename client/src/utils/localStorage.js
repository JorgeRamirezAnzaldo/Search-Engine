//Export function that gets the book ids stored in localStorage
export const getSavedBookIds = () => {
  const savedBookIds = localStorage.getItem('saved_books') //Get the book ids from item saved_books
    ? JSON.parse(localStorage.getItem('saved_books')) //Parse data 
    : [];

  return savedBookIds; //Return book ids
};

//Export function that saves the book ids to localStorage
export const saveBookIds = (bookIdArr) => {
  if (bookIdArr.length) { //If there are book ids to save
    localStorage.setItem('saved_books', JSON.stringify(bookIdArr)); //Set item saved_books in localStorage and send the book ids array
  } else {
    localStorage.removeItem('saved_books'); //Remove saved_books from localStorage
  }
};

//Export function that removes a book id from localStorage
export const removeBookId = (bookId) => {
  const savedBookIds = localStorage.getItem('saved_books') //Get saved_books item from localStorage
    ? JSON.parse(localStorage.getItem('saved_books')) //Parse data
    : null;

  if (!savedBookIds) { //If there aren't any saved book ids
    return false; //Return false
  }

  const updatedSavedBookIds = savedBookIds?.filter((savedBookId) => savedBookId !== bookId); //Filter to remove the necessary book id from the book ids array
  localStorage.setItem('saved_books', JSON.stringify(updatedSavedBookIds)); //Set the saved_books item with the new book ids array

  return true; //Return true
};
