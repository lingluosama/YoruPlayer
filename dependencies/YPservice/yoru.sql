create table albums
(
    id          bigint auto_increment
        primary key,
    title       text null,
    cover       text null,
    description text null,
    author      text null
);

create table authors
(
    id     bigint auto_increment
        primary key,
    name   text null,
    avatar text null
);

create table `sang-tags`
(
    id  bigint      not null
        primary key,
    tag varchar(30) not null,
    sid bigint      not null
);

create table `sanglist-tags`
(
    id  bigint auto_increment
        primary key,
    lid bigint null,
    tag text   null
);

create table singles
(
    id       bigint auto_increment
        primary key,
    title    text       null,
    cover    text       null,
    resource text       not null,
    author   text       null,
    length   text       null,
    album_id mediumtext null,
    duration text       null
);

create table tags
(
    id   bigint      not null
        primary key,
    name varchar(30) not null,
    constraint tags_pk
        unique (name)
);

create table users
(
    id        bigint auto_increment
        primary key,
    name      text                 null,
    password  varbinary(256)       null,
    avatar    text                 null,
    signature text                 null,
    email     text                 null,
    authority tinyint(1) default 0 null,
    salt      varbinary(64)        null
);

create table `sang-list`
(
    id          bigint not null
        primary key,
    cover       text   null,
    creater     bigint not null,
    title       text   null,
    description text   null,
    constraint `sang-list_users_id_fk`
        foreign key (creater) references users (id)
);

create table `sang-tolist`
(
    lid bigint not null,
    sid bigint not null,
    primary key (lid, sid),
    constraint `sang-tolist_sang-list_id_fk`
        foreign key (lid) references `sang-list` (id),
    constraint `sang-tolist_singles_id_fk`
        foreign key (sid) references singles (id)
);

