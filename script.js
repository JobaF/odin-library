let myLibrary = []

function Book(title, author, category, publishDate, pageCount, imageLink) {
  this.title = title
  this.author = author
  this.category = category
  this.publishDate = publishDate
  this.pageCount = pageCount
  this.imageLink = imageLink
}

const addBookToLibrary = async () => {
  const inputField = document.querySelector('.inputField')
  const valueInputField = inputField.value
  inputField.value = ''

  let bookData = await fetchBooks(valueInputField)
  bookData = bookData
    .filter((book) => book.volumeInfo.categories)
    .filter((book) => book.volumeInfo.imageLinks)

  addBookFromApiData(bookData[0])
  console.log(myLibrary)
  resetBooksAndRerender()
}

const resetBooksAndRerender = () => {
  const container = document.querySelector('.container')
  container.innerHTML = ''
  createHTMLElements()
}

const fetchBooks = async (keyword) => {
  const result = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${keyword}`,
  )
  const json = await result.json()

  return json.items
}

const addBookFromApiData = (book) => {
  const {
    authors,
    categories,
    pageCount,
    imageLinks,
    publishedDate,
    title,
  } = book.volumeInfo

  if (categories == null || imageLinks == null) return

  myLibrary.push(
    new Book(
      title,
      authors[0],
      categories[0],
      publishedDate,
      pageCount,
      imageLinks['thumbnail'],
    ),
  )
}

const createBooksFromApiData = (apiData) => {
  apiData
    .map((fullInformation) => fullInformation.volumeInfo)
    .forEach((book) => {
      const {
        authors,
        categories,
        pageCount,
        imageLinks,
        publishedDate,
        title,
      } = book

      if (categories == null || imageLinks == null) return

      myLibrary.push(
        new Book(
          title,
          authors[0],
          categories[0],
          publishedDate,
          pageCount,
          imageLinks['thumbnail'],
        ),
      )
    })
}

const createHTMLElements = () => {
  const container = document.querySelector('.container')

  myLibrary.forEach((book) => {
    const newDiv = document.createElement('div')
    newDiv.classList.add('book')
    Object.entries(book).forEach(([key, value]) => {
      if (key === 'imageLink') {
        const image = document.createElement('img')
        image.src = value
        newDiv.append(image)
      } else {
        const paragraph = document.createElement('p')
        paragraph.classList.add(key)
        paragraph.textContent = `${
          key.charAt(0).toUpperCase() + key.slice(1)
        }: ${value}`
        newDiv.append(paragraph)
      }
    })

    const deleteButton = document.createElement('button')
    deleteButton.textContent = 'X'
    deleteButton.addEventListener('mousedown', () => {
      handleDelete(book.title)
    })
    newDiv.append(deleteButton)
    container.append(newDiv)
  })
}

const main = async () => {
  const data = await fetchBooks('sherlock')
  createBooksFromApiData(data)
  createHTMLElements()
}

const handleDelete = (title) => {
  myLibrary = myLibrary.filter((book) => book.title !== title)
  resetBooksAndRerender()
}

main()
