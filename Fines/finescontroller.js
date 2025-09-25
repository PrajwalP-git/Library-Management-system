const Fines= require('./finesmodel');
const Status= require('../status/statusmodel');

const THRESHOLD_DAYS= 20;
const PER_DAY_FINE= 10;

exports.calculateFine= async(req, res)=>{
try{
    const{status_id}= req.params;
    const status= await Status.getStatusById(status_id);

    if(!status)return res.status(404).json({error:"Status not found"});
    if(!status.is_returned) return res.status(400). json({error:"Book not returned yet"});

    const borrowedAt= new Date(status.borrowed_at);
    const returnedAt= new Date(status.returned_at);
    const diffTime= returnedAt- borrowedAt;
    const diffdays= Math.floor(diffTime /(1000*60*60*24));
    const overdueDays= diffdays - THRESHOLD_DAYS;

    if(overdueDays <= 0) return res.json({message:"No fine, book returned on time"});
    const amount= overdueDays * PER_DAY_FINE;

    const fine= await Fines.createFine({
        user_id:status.user_id,
        book_id: status.book_id,
        status_id:status.status_id,
        amount
    });

    res.status(201).json({message:"Fine Imposed", fine_id:fine.insertId, amount});
    }
    catch(err){
        console.error(err);
        res.status(500).json({error:"Server error", details:err});
    }
};

exports.getAllFines= async(req, res)=>{
    try{
        const fines= await Fines.getAllFines();
        res.json(fines);
    }
    catch(err){
        console.error("Error in getAllFines:", err);
        res.status(500).json({error:"Server error", details:err});
    }
};

exports.payFine= async(req, res)=>{
    try{
        const { fine_id }= req.params;
        const result= await Fines.payFine(fine_id);
        if(result.affectedRows === 0) return res.status(404).json({error:"Fine not found"});
        res.json({message:"Fine paid successfully"});
    }
    catch(err){
        res.status(500).json({error:"Server error",details:err})
    }
};