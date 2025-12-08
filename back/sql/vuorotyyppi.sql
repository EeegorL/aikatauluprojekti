+-------+--------------+------+-----+---------+----------------+
| Field | Type         | Null | Key | Default | Extra          |
+-------+--------------+------+-----+---------+----------------+
| id    | int(11)      | NO   | PRI | NULL    | auto_increment |
| nimi  | varchar(255) | NO   |     | NULL    |                |
+-------+--------------+------+-----+---------+----------------+

CREATE TABLE vuorotyyppi(
    id INT PRIMARY KEY AUTO_INCREMENT,
    nimi VARCHAR(255) NOT NULL
);