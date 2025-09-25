const db = require("../db");
const Status = require("./statusmodel");

exports.borrowBook = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const { user_id, book_id, borrowed_at } = req.body;
    const is_admin= req.user.role === 'admin';
    const final_borrowed_at = is_admin && borrowed_at ? borrowed_at: new Date();

    const bookCopies = await Status.getAvailableCopies(book_id);
    if (bookCopies.copies_available <= 0) {
      await connection.rollback();
      return res.status(400).json({ message: "Book is not available for borrowing." });
    }

    await Status.updateBookCopies(book_id, -1);
    const statusId = await Status.createStatus(user_id, book_id, final_borrowed_at);
    
    await connection.commit();
    res.status(201).json({ message: "Book borrowed successfully.", statusId });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ error: "Failed to borrow book." });
  } finally {
    connection.release();
  }
};

exports.getBorrowedBooks = async (req, res) => {
  try {
    const userId = req.params.id;
    const borrowedBooks = await Status.getBorrowedBooksByUserId(userId);
    res.json(borrowedBooks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch borrowed books." });
  }
};

exports.returnBook = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const statusId = req.params.id; 
    const { returned_at } = req.body;
    const is_admin = req.user.role === 'admin';
    const final_returned_at = is_admin && returned_at ? returned_at : new Date();
    const is_returned = 1; 

    const statusRecord = await Status.getStatusById(statusId);
    if (!statusRecord) {
      await connection.rollback();
      return res.status(404).json({ message: "Borrow record not found." });
    }
    
    await Status.updateStatus(statusId, { returned_at: final_returned_at, is_returned });
    await Status.updateBookCopies(statusRecord.book_id, 1);

    await connection.commit();
    res.json({ message: "Book returned successfully." });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ error: "Failed to return book." });
  } finally {
    connection.release();
  }
};

exports.getAllStatus = async (req, res) => {
  try {
    const status = await Status.getAllStatus();
    res.json(status);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch status." });
  }
};

exports.getStatusById = async (req, res) => {
  try {
    const status = await Status.getStatusById(req.params.id);
    if (!status) return res.status(404).json({ message: "Record not found." });
    res.json(status);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch record." });
  }
};