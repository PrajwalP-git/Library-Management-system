const db= require('../db');

async function createFine({user_id, book_id, status_id, amount}){
    const [result]= await db.query(
            `INSERT INTO fines(user_id, book_id, status_id, amount) VALUES(?, ?, ?, ?)`,
            [user_id, book_id, status_id, amount] 
    );
    return result;
}

async function getAllFines(){
    const[result]= await db.query("SELECT * FROM fines");
    return result;
}

async function payFine(fine_id) {
    const[result]= await db.query("UPDATE fines SET paid= 1 WHERE fine_id= ?", [fine_id]);
    return result;
}

module.exports={
    createFine,
    getAllFines,
    payFine
};