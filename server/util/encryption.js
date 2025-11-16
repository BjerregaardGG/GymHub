import bcrypt from 'bcryptjs';

// calls this when a new user signs up 
export async function hashPassword(password, saltRounds) {

    const hashedPassword = await bcrypt.hash(password, saltRounds); 
    return hashedPassword; 
}

// calls when a user logs in 
export async function verifyPassword(password, hashedPassword){

    const isSame = await bcrypt.compare(password, hashedPassword);
    return isSame;
}