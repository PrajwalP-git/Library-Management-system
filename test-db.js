require("dotenv").config();
const db= require("./db");

(async()=>{
    try{
        const [rows]= await db.query("SELECT 1+1 AS result");
        console.log("DB connection working ✔️ Result:", rows[0].result);
    }
    catch(err){
        console.error("DB test failed❌:", err.message);
    }
    finally{
        process.exit();
    }
})();