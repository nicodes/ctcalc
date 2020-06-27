CREATE SCHEMA chloramine;
CREATE TABLE chloramine.giardia (
    temperature smallint NOT NULL,
    log_inactivation numeric(2,1) NOT NULL,
    inactivation smallint NOT NULL,
    PRIMARY KEY(temperature, log_inactivation)
);
CREATE TABLE chloramine.virus (
    temperature smallint NOT NULL,
    log_inactivation smallint NOT NULL,
    inactivation smallint NOT NULL,
    PRIMARY KEY(temperature, log_inactivation)
);

CREATE SCHEMA chlorine_dioxide;
CREATE TABLE chlorine_dioxide.giardia (
    temperature smallint NOT NULL,
    log_inactivation numeric(2,1) NOT NULL,
    inactivation numeric(3,1) NOT NULL,
    PRIMARY KEY(temperature, log_inactivation)
);
CREATE TABLE chlorine_dioxide.virus (
    temperature smallint NOT NULL,
    log_inactivation smallint NOT NULL,
    inactivation numeric(3,1) NOT NULL,
    PRIMARY KEY(temperature, log_inactivation)
);

CREATE SCHEMA free_chlorine;
CREATE TABLE free_chlorine.giardia (
    temperature numeric(3,1) NOT NULL,
    log_inactivation numeric(2,1) NOT NULL,
    ph numeric(2,1) NOT NULL,
    concentration numeric(2,1) NOT NULL,
    inactivation smallint NOT NULL,
    PRIMARY KEY(temperature, log_inactivation, ph, concentration)
);
CREATE TABLE free_chlorine.virus (
    temperature smallint NOT NULL,
    log_inactivation smallint NOT NULL,
    inactivation numeric(3,1) NOT NULL,
    PRIMARY KEY(temperature, log_inactivation)
);

CREATE SCHEMA ozone;
CREATE TABLE ozone.giardia (
    temperature smallint NOT NULL,
    log_inactivation numeric(2,1) NOT NULL,
    inactivation numeric(3,2) NOT NULL,
    PRIMARY KEY(temperature, log_inactivation)
);
CREATE TABLE ozone.virus (
    temperature smallint NOT NULL,
    log_inactivation smallint NOT NULL,
    inactivation numeric(3,2) NOT NULL,
    PRIMARY KEY(temperature, log_inactivation)
);
