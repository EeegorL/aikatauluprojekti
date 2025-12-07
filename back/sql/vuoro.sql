+---------+--------------+------+-----+---------+----------------+
| Field   | Type         | Null | Key | Default | Extra          |
+---------+--------------+------+-----+---------+----------------+
| id      | int(11)      | NO   | PRI | NULL    | auto_increment |
| pv      | date         | NO   |     | NULL    |                |
| vuoro   | int(11)      | NO   | MUL | NULL    |                |
| henkilo | int(11)      | NO   | MUL | NULL    |                |
| note    | varchar(255) | YES  |     | NULL    |                |
| aika    | int(11)      | NO   |     | NULL    |                |
+---------+--------------+------+-----+---------+----------------+
TODO Create lause