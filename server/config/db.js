const {Pool} =  require('pg') ;
const DataBasePool = new Pool({
    connectionString: process.env.DATABASE_URL
});
let TestConnection = async () => {
    try {
        const result = await DataBasePool.query('SELECT NOW()');
        console.log('Database connection successful!');
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
};
TestConnection();
module.exports = DataBasePool;