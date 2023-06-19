const conn = require('./connection');

const findAll = () => conn.execute('SELECT * FROM talker_manager_db.talkers');

const findById = (id) => conn.execute(
  `SELECT * FROM talker_manager_db.talkers
  WHERE id = ?`, [id],
);

const insert = () => {

};

const update = () => {

};

const remove = (id) => conn.execute(
  `DELETE FROM talker_manager_db.talkers
  WHERE id = ?`, [id],
);

module.exports = {
  findAll,
  findById,
  insert,
  update,
  remove,
};
