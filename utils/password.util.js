const bcrypt = require('bcryptjs');

async function hashPassword(plainTextPass) {
    const hash = bcrypt.hash(plainTextPass, 10);
}

async function checkPassword(plainTextPass, hash) {
    const res = await bcrypt.compare(plainTextPass, hash);
    return res;
}