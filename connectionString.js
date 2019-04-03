// NB: Driver must exist in ODBC manager, otherwise: `Data source name not found and no default driver specified`
const connectionString = "server=bir408;Database=BossID;Trusted_Connection=Yes;Driver={ODBC Driver 11 for SQL Server}";
 
module.exports = {connectionString};
