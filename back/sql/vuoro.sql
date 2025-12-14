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