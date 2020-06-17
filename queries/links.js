const { db } = require('../database/config');

function readListQuery(limit, offset) {
  return db('links')
    .select()
    .limit(limit)
    .offset(offset);
}
function readSingleQuery(id) {
  return db('links')
    .select()
    .where('id', id)
    .limit(1);
}

module.exports = {
  readListQuery,
  readList: (req) => {
    const limit = req.query.limit || 10;
    const offset = req.query.offset || 0;
    return readListQuery(limit, offset);
  },
  readSingleQuery,
  readSingle: (req) => {
    const id = req.params.link_id || 0;
    return readSingleQuery(id);
  },
  create: (req) => {
    const { body } = req;
    return db('links').insert({
      title: body.title,
      desc: body.desc,
      thumbnail: body.thumbnail,
      url: body.url,
      publisher_id: body.publisher_id,
      post_date: body.post_date,
      created_at: db.fn.now(),
    });
  },
  update: () => {},
  del: () => {},
};
