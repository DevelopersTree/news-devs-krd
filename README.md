# news-devs-krd
news system for devs.krd

initial db
--------
links 
    id
    title
    desc
    thumbnail(text)
    url (text)
    publisher_id
    create_date
    post_date
    up_votes (int)

link_votes
    id 
    publisher_id
    link_id
    created_at

blacklist
    id
    link
    
publisher
    id 
    username
    password
    uid (firebase)
    email
    blocked
    

