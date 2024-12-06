import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [bookName, setBookName] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const apiKey = "4ef708cb9a-addec23969-snuxtd";
  const [rate, setRate] = useState(null);
  const [sum, setSum] = useState("");
  const [res, setRes] = useState(0);

  function validate() {
    if (sum.length <= 0) {
      alert("summa kiriting");
      return false;
    }
    return true;
  }

  useEffect(() => {
    axios
      .get(
        `https://api.fastforex.io/fetch-one?from=USD&to=EUR&api_key=${apiKey}`
      )
      .then((response) => {
        if (response.status === 200) {
          setRate(response.data.result.EUR);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function handleBookSearch(event) {
    event.preventDefault();
    if (bookName) {
      setLoading(true);
      axios
        .get(
          `https://www.googleapis.com/books/v1/volumes?q=${bookName}&startIndex=0&maxResults=10`
        )
        .then((response) => {
          setBooks(response.data.items);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    }
    setBookName("");
  }

  function handleCurrencySearch(event) {
    event.preventDefault();
    const isvalid = validate();
    if (!isvalid) {
      return;
    }
    if (rate && sum) {
      setRes(sum * rate);
    }
    setSum("");
  }

  return (
    <div className="container">
      <div className="App">
        <h1>Istalgan kitobingizni toping</h1>
        <form onSubmit={handleBookSearch}>
          <input
            className="bookname"
            type="text"
            placeholder="Kitob nomini kiriting:"
            value={bookName}
            onChange={(e) => setBookName(e.target.value)}
          />
          <button type="submit">Qidirish</button>
        </form>

        <div className="books">
          {loading ? (
            <p>...</p>
          ) : (
            books.map((book, index) => (
              <div className="book" key={index}>
                <img
                  src={book.volumeInfo.imageLinks?.thumbnail}
                  alt={book.volumeInfo.title}
                  width={100}
                />
                <h3>{book.volumeInfo.title}</h3>
                <p>
                  {book.volumeInfo.authors
                    ? book.volumeInfo.authors.join(", ")
                    : ""}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="cards">
          <h2>Valyutalar kursi</h2>
          <form onSubmit={handleCurrencySearch}>
            <input
              type="number"
              onChange={(e) => setSum(e.target.value)}
              value={sum}
              placeholder="USD pul birligidagi qiymatni kiriting: "
            />
            <button type="submit">Euro ga o'tkazish</button>
          </form>
          <h3>EURO pul birligidagi qiymati: {res ? res.toFixed(2) : ""}(EUR)</h3>
        </div>
      </div>
    </div>
  );
}

export default App;
