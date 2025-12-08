+---------+--------------+------+-----+---------+----------------+
| Field   | Type         | Null | Key | Default | Extra          |
+---------+--------------+------+-----+---------+----------------+
| id      | int(11)      | NO   | PRI | NULL    | auto_increment |
| nimi    | varchar(255) | NO   |     | NULL    |                |
| lyhenne | varchar(255) | NO   | UNI | NULL    |                |
+---------+--------------+------+-----+---------+----------------+

CREATE TABLE henkilo(
    id INT PRIMARY KEY AUTO_INCREMENT,
    nimi VARCHAR(255) NOT NULL,
    lyhenne VARCHAR(255) NOT NULL
);