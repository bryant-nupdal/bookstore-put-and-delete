$(document).ready(function(){
  console.log('jQuery sourced.');
  refreshBooks();
  addClickHandlers();
});

function addClickHandlers() {
  $('#submitBtn').on('click', handleSubmit);

  // TODO - Add code for edit & delete buttons
  $('#bookShelf').on('click', '.delete-button', deleteBooks);
  $('#bookShelf').on('click', '.isRead-button', isRead);
}

function handleSubmit() {
  console.log('Submit button clicked.');
  let book = {};
  book.author = $('#author').val();
  book.title = $('#title').val();
  addBook(book);
}

// adds a book to the database
function addBook(bookToAdd) {
  $.ajax({
    type: 'POST',
    url: '/books',
    data: bookToAdd,
    }).then(function(response) {
      console.log('Response from server.', response);
      refreshBooks();
    }).catch(function(error) {
      console.log('Error in POST', error)
      alert('Unable to add book at this time. Please try again later.');
    });
}

function deleteBooks(event){
  console.log('made it to the delete function');
  const button = $(event.target);
  const bookid = button.data('bookid');
  console.log(bookid);
  $.ajax({
    method: 'DELETE',
    url: `/books/${bookid}`
  }).then((response) => {
    refreshBooks();
  }).catch((error) => {
    console.log('Error deleting book: ',error);
  })
}

function isRead (event){
  console.log('made it to is read function');
  const button = $(event.target);
  bookid = button.data('readid');
  let read = button.data('isread');
  console.log(`${read}`);


  $.ajax({
    method: 'PUT', 
    url: `/books/read/${bookid}`,
    data: {
      isRead: `${read}`
    }
  }).then (() => {
    refreshBooks();
  }).catch(error => {
    console.log('error updating', error);
  })
}

// refreshBooks will get all books from the server and render to page
function refreshBooks() {
  $.ajax({
    type: 'GET',
    url: '/books'
  }).then(function(response) {
    console.log(response);
    renderBooks(response);
  }).catch(function(error){
    console.log('error in GET', error);
  });
}


// Displays an array of books to the DOM
function renderBooks(books) {
  $('#bookShelf').empty();

  for(let i = 0; i < books.length; i += 1) {
    let book = books[i];
    // For each book, append a new row to our table
    $('#bookShelf').append(`
      <tr>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isRead}</td>
        <td><button class="isRead-button" data-readid='${book.id}' data-isRead='${book.isRead}'>Read</button></td>
        <td><button class="delete-button" data-bookid='${book.id}'>Delete</button></td>
      </tr>
    `);
  }
}