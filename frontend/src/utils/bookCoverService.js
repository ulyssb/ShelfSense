/**
 * Service for fetching book cover images from Open Library
 */

/**
 * Get book cover image URL from Open Library
 * @param {string} title - Book title
 * @param {string} author - Book author
 * @returns {Promise<string|null>} Cover image URL or null if not found
 */
export async function getBookCover(title, author) {
  try {
    const query = `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}`;
    const res = await fetch(query);
    const data = await res.json();

    if (!data?.docs || data.docs.length === 0) {
      return null;
    }

    // Sort by publication year (most recent first) and get the first result
    const sortedDocs = data.docs
      .filter(doc => doc.cover_i) // Only include docs with cover images
      .sort((a, b) => {
        const yearA = a.first_publish_year || 0;
        const yearB = b.first_publish_year || 0;
        return yearB - yearA; // Most recent first
      });

    const mostRecentDoc = sortedDocs[0];
    const coverId = mostRecentDoc?.cover_i;

    return coverId
      ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
      : null;
  } catch (error) {
    return null;
  }
}

/**
 * Get cover images for multiple books
 * @param {Array} books - Array of book objects with title and author properties
 * @returns {Promise<Array>} Array of books with coverImage property added
 */
export async function getBookCovers(books) {
  try {
    const booksWithCovers = await Promise.all(
      books.map(async (book) => {
        const coverImage = await getBookCover(book.title, book.author);
        return {
          ...book,
          coverImage
        };
      })
    );

    return booksWithCovers;
  } catch (error) {
    // Return books with null coverImage if there's an error
    return books.map(book => ({
      ...book,
      coverImage: null
    }));
  }
}
