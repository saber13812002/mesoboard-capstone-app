create table users(
  user_id serial not null primary key, 
  code integer not null, 
  first_name varchar(20),
  last_name varchar(30), 
  phone varchar(14),
  email varchar(30) unique, 
  password varchar(130), 
  restaurant varchar(40),
  user_type varchar(10)
);

insert into users(code, first_name, last_name, phone, email, password, restaurant, user_type)
values(1234, 'first', 'last', '7874307478', 'test@gmail.com', 'password', 'hatillo', 'manager');