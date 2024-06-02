async function getUser(email){
    return (await myQuery('SELECT * FROM users WHERE email = ?', [email]))[0];
}
//Returns true if user is succesfully created, false otherwise
async function createUser(name, email, password){
    if (await getUser(email)) //User exists -> nothing gets created
        return false

    const hashed_pass = await bcrypt.hash(password, 10);
    myQuery("INSERT INTO users(user_id, username, email, password) VALUES(?, ?, ?, ?)",
                [await getMaxUserId() + 1, name, email, hashed_pass]);
    return true;
}

async function getMaxUserId(){
    const max_id = (await myQuery("SELECT MAX(user_id) AS max_id FROM users"))[0];
    console.log('max_id: ', max_id)

    if (max_id)
        return max_id.max_id;
    return 0;
}