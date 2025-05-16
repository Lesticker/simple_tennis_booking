const bcrypt = require('bcryptjs');

// Replace 'your-password' with the password you want to use
const password = 'your-password';

bcrypt.hash(password, 12).then(hash => {
  console.log('Your hashed password:');
  console.log(hash);
}); 