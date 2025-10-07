import { useState, useEffect } from 'react'

export function useReadingList() {
  const [readingList, setReadingList] = useState([])
  const [addedBooks, setAddedBooks] = useState(new Set())

  // Load reading list from localStorage on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("readingList") || "[]")
    setReadingList(saved)
    // Create a set of book titles for quick lookup
    const titles = new Set(saved.map(book => book.title))
    setAddedBooks(titles)
  }, [])

  const addToReadingList = (book) => {
    const exists = readingList.find(b => b.title === book.title)
    if (!exists) {
      const newList = [...readingList, book]
      setReadingList(newList)
      setAddedBooks(prev => new Set([...prev, book.title]))
      localStorage.setItem("readingList", JSON.stringify(newList))
      return { success: true, message: "Successfully added!" }
    } else {
      return { success: false, message: "Book already in reading list :(" }
    }
  }

  const removeFromReadingList = (bookTitle) => {
    const newList = readingList.filter(book => book.title !== bookTitle)
    setReadingList(newList)
    setAddedBooks(prev => {
      const newSet = new Set(prev)
      newSet.delete(bookTitle)
      return newSet
    })
    localStorage.setItem("readingList", JSON.stringify(newList))
  }

  const clearReadingList = () => {
    setReadingList([])
    setAddedBooks(new Set())
    localStorage.setItem("readingList", JSON.stringify([]))
  }

  const isBookAdded = (bookTitle) => {
    return addedBooks.has(bookTitle)
  }

  return {
    readingList,
    addToReadingList,
    removeFromReadingList,
    clearReadingList,
    isBookAdded
  }
}
