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
CREATE TABLE vuoro(
    id INT PRIMARY KEY AUTO_INCREMENT,
    pv DATE NOT NULL,
    vuoro INT NOT NULL,
    aika INT NOT NULL,
    henkilo INT NOT NULL,
    note VARCHAR(255),
    FOREIGN KEY(vuoro) REFERENCES vuorotyyppi(id),
    FOREIGN KEY(henkilo) REFERENCES henkilo(id)
);