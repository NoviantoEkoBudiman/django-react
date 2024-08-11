import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [books, setBooks] = useState([])
  const [title, setTitle] = useState("")
  const [releaseYear, setReleaseYear] = useState(0)

  const [newTitle, setNewTitle] = useState("")
  const [newReleaseYear, setNewReleaseYear] = useState(0)

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async() => {
    try{
      const response = await fetch("http://127.0.0.1:8000/api/books/")
      const datas = await response.json()
      setBooks(datas)
    }catch(error){
      console.log(error)
    }
  }

  const addBook = async() => {
    const bookData = {
      title: title,
      release_year : releaseYear
    }
    try{
      const response = await fetch("http://127.0.0.1:8000/api/books/create",{
        method: "POST",
        headers: {
          "Content-Type" : "application/json"
        },
        body: JSON.stringify(bookData)
      })
      const data = await response.json()
      setBooks((prev) => [...prev, data])
      console.log(data)
    }catch(error){
      console.log(error)
    }
  }

  const updateData = async(id) => {
    console.log(newReleaseYear)
    const bookData = {
      title: newTitle,
      release_year: newReleaseYear
    }
    try{
      const response = await fetch(`http://127.0.0.1:8000/api/books/${id}`,{
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData)
      })

      const data = await response.json()
      setBooks((prev) =>
        prev.map((book) => {
          if(book.id === id){
            return data
          }else{
            return book
          }
        }
      ))
    }catch(error){
      console.log(error)
    }
  }

  const deleteData = async(id) =>{
    try{
      const response = await fetch(`http://127.0.0.1:8000/api/books/${id}`,{
        method: "DELETE"
      })
      setBooks((prev) => prev.filter((book) => book.id !== id))
    }catch(error){
      console.log(error)
    }
  }

  return (
    <div className='container'>
      <h1 className='text-3xl/tight'>Book Website</h1>
      <div className="box m-2">
        <input type="text" placeholder='Title' name="title" className='border rounded-lg p-2' onChange={(e) => setTitle(e.target.value)}/>
      </div>
      <div className="box m-2">
        <input type="number" placeholder='Release year' name="release_year" className='border p-2' onChange={(e) => setReleaseYear(e.target.value)}/>
      </div>
      <div className="box">
        <button className="bg-sky-400 p-2 rounded-lg hover:bg-sky-500 transition-all" onClick={addBook}>Save</button>
      </div>
      <br />
      <table class="border-collapse border border-slate-400 table-auto">
        <thead>
          <tr>
            <th>Title</th>
            <th>Release year</th>
            <th>Data</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr>
              <td className="border border-slate-300">{book.title}</td>
              <td className="border border-slate-300">{book.release_year}</td>
              <td className="border border-slate-300">
                <input type="text" className="border" onChange={ (e) => setNewTitle(e.target.value) } />
                <input type="text" className="border" onChange={ (e) => setNewReleaseYear(e.target.value) } />
              </td>
              <td>
                <button onClick={() => updateData(book.id) } className='bg-yellow-300 rounded-lg p-1'>Update</button>
                <button onClick={() => deleteData(book.id) } className='bg-red-500 rounded-lg p-1'>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App
