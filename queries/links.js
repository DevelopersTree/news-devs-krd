const { db } = require('../database/config');

function readListQuery(limit, offset) {
  return db('links')
    .select('links.*', 'publisher.name as publisher_name', 'publisher.name as publisher_name')
    .leftJoin('publisher', 'publisher.id', 'publisher_id')
    .where('publisher.blocked', 0)
    .limit(limit)
    .offset(offset);
}
function readSingleQuery(id) {
  return db('links')
    .select('links.*', 'publisher.name as publisher_name')
    .leftJoin('publisher', 'publisher.id', 'publisher_id')
    .where('publisher.blocked', 0)
    .andWhere('id', id)
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
  update: (req) => {
    const { body } = req;
    return db('links').update({
      title: body.title,
      desc: body.desc,
      thumbnail: body.thumbnail,
      url: body.url,
      post_date: body.post_date,
    }).where('id', req.params.link_id);
  },
  del: (id) => db('links').del().where('id', id),

  upvote: (publisherId, linkId) => {
    return db('link_votes').insert({
      publisher_id: publisherId,
      link_id: linkId,
      created_at: db.fn.now(),
    }).then(() => {
      return db.raw('UPDATE links SET up_votes = up_votes+1 WHERE id=?', [linkId]).then(() => {
        return {
          publisher_id: publisherId,
          link_id: linkId,
          msg: 'link is voted',
        };
      });
    });
  }
  ,
};
