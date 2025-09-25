const bcrypt = require('bcryptjs');

const newPassword = 'Prajw@123456'; 

bcrypt.hash(newPassword, 10, (err, hash) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(hash);
});