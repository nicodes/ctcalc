const queryDb = async (pool, sql) => {
    try {
        const dbRes = await pool.query(sql);
        return dbRes
    } catch (err) {
        console.log(err)
    }
}

const generateSql = (
    disinfectant,
    pathogen,
    temperature,
    inactivationLog,
    ph,
    concentration
) => `SELECT inactivation FROM ${disinfectant}.${pathogen} WHERE temperature=${temperature} AND inactivation_log=${inactivationLog}${ph && concentration ? ` AND ph=${ph} AND concentration=${concentration}` : ''};`

module.exports = {
    queryDb,
    generateSql
}
