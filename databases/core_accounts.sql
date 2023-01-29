-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "SYSTEM";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `core_accounts`
--

-- --------------------------------------------------------

--
-- Table structure for table `preferences`
--

CREATE TABLE `preferences` (
  `UID` bigint(11) UNSIGNED NOT NULL,
  `ProfileVisibility` tinyint(1) UNSIGNED NOT NULL,
  `ActivityMode` tinyint(1) UNSIGNED NOT NULL,
  `Location` tinyint(1) UNSIGNED NOT NULL,
  `ColorScheme` tinyint(1) UNSIGNED NOT NULL DEFAULT 0,
  `AccentColor` varchar(23) NOT NULL DEFAULT 'red',
  `UpdateTimestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `preferences`
--

INSERT INTO `preferences`
    (`UID`, `ProfileVisibility`, `ActivityMode`, `Location`)
  VALUES
    (10000000000, 1, 1, 1);
INSERT INTO `preferences`
    (`UID`, `ProfileVisibility`, `ActivityMode`, `Location`, `AccentColor`)
  VALUES
    (10000000001, 3, 3, 2, 'purple');

-- --------------------------------------------------------

--
-- Table structure for table `reservedusernames`
--

CREATE TABLE `reservedusernames` (
  `IPAddress` varchar(39) NOT NULL,
  `Username` varchar(20) NOT NULL,
  `TimeoutTimestamp` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `security`
--

CREATE TABLE `security` (
  `UID` bigint(11) UNSIGNED NOT NULL,
  `PrivateKey` text NULL,
  `PublicKey` text NULL,
  `SecurityQuestion1` tinyint(1) UNSIGNED NOT NULL,
  `SecurityQuestion2` tinyint(1) UNSIGNED NOT NULL,
  `SecurityQuestion3` tinyint(1) UNSIGNED NOT NULL,
  `SecurityQuestionAns1` tinytext NOT NULL,
  `SecurityQuestionAns2` tinytext NOT NULL,
  `SecurityQuestionAns3` tinytext NOT NULL,
  `Require2FA` tinyint(1) UNSIGNED NOT NULL DEFAULT 0,
  `FailedLoginAttempts` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `LoginCooldownTimeout` timestamp NULL DEFAULT NULL,
  `StrictConnectionPolicy` tinyint(1) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `security`
--

INSERT INTO `security`
    (`UID`, `SecurityQuestion1`, `SecurityQuestion2`, `SecurityQuestion3`, `SecurityQuestionAns1`,
    `SecurityQuestionAns2`, `SecurityQuestionAns3`)
  VALUES
    (10000000000, 1, 1, 1, '~answer~', '~answer~', '~answer~');
INSERT INTO `security`
    (`UID`, `SecurityQuestion1`, `SecurityQuestion2`, `SecurityQuestion3`, `SecurityQuestionAns1`,
    `SecurityQuestionAns2`, `SecurityQuestionAns3`,
    `PrivateKey`, `PublicKey`)
  VALUES
    (10000000001, 1, 1, 1, '~answer~', '~answer~', '~answer~',
    '-----BEGIN PRIVATE KEY-----
MIIEugIBADANBgkqhkiG9w0BAQEFAASCBKQwggSgAgEAAoIBAQDAox2ms/jxWpdH
UYUK4wKsUEx3g+BjMKmGbhB+vkm/07P0EFcEUZGNDDPVC1tRmRZlV6EZbM4J6IDx
hyuVXdX0W/vKcWyURwkH1Yx8RXXz76N69LJHn1DenQZgxHh91grHF0XxJFAM72xs
W6DhMB1NQFnfdZ5sTyAgjl2yXDP0pRlOTsFK5autOox+BzpEJcSFaV5HeeFhaJ2+
AaJl2ztmM52xy0Poc7qC/J9lL//9q7ZVTgBr+EznCt6FiV/8eqBrifwkXxgGP+ji
23zdyP0CNCT7MBwmtK8R47OYUMjQzBy6J5FWyvFBIiCw0OvmIfNJyXeNewBFW682
PeQjKkXPAgMBAAECgf96p2E5w12+TvADeOQ9Ck2paXdGobE9dr552ZqnGIHcoe7y
d3TwSv9hz2MxQwnh6pdX73OjvKNzq5ZuMqKNeDHCZM7tF0sLHi+hzValyZRQvURa
BXN+JvJWy6RD+NS/SomSOj9OStCta8SdObo1p20Awvh2T22PiNHr6Lm/1vU9zsSL
o/LuNbm5HlKuihdP7DJP1G/utoO8Qcb4/8Cqy5pnDegBVooQ1IFG2Ak9i1VxznKp
gUkD8mNDLz2ysWFAqUBxp9Uyq9W8atXjWoFyhOxqLTPfCLolX0GfYbBt1xCWApoZ
MyF6waki8+k3q/AHE1OQDMwH/6zBrYsAXetnR4ECgYEA+dqqj7Ku/mcO6czymiu3
W7Nn3uXORA6nIj+sEKWF91z4jad5+Rb/0j9MmrwaKQuWtFrUhiOK3IOLZqTDPJ/+
I5n9WJ9XWyzZ6xwts583A0oka743JCBAdPn0yd6tbndRuNPujeF9nPj09QUcls49
e7ORtZJcp+9zIyrEAmsfpo8CgYEAxWAnV/YygWdlrG3DUDr2P54i3477ArR9JMCm
GVfQ6jQscVIt4ocOft6f0kU6oZB81URdSllW0W8p3iX7ah8rmOxk8LTs/JouH9k6
hHPuDj1mtHOR8XXOr+Ssdc05Wa4rkUZWfncMt2UNr1Ros8x8QS+Kbp00y17HGFPc
81sRDMECgYBRN0IP+b4mVeukFgmaEbHFbhjKfJrCxpyPZnEQ7C0SzjbBHPpp/I7l
kcvd1F0QkILJV2kTvUPrEBtlHxOThlI+0lRm1Uy5B2hCo2M7qvpf6F7UYv1bkdxB
6eonIGnxqXl4AfPeTLjfKJG/f4zefGXB6wnnIo9Zy1z6xnD2dEnSgwKBgE30/XUr
o6UizrC9JcChmTNlZUbBdXkLCsaiZLhry/NFKiyUFdV8HIiVq7BkcZTwua2Oc/5y
rOzJqFK608OFjjW3YOMFwvi+eOtRZGB+XY84R0GMyB8DteAZRNi+dyFpvoGBs5X9
tYMWIcKXZ0dkw8sHWPj5lKmixKZiMUnZNTHBAoGAFoGF3PleBr9SttL/Fxvzqq5a
62e1bqU/DV7B62hMc7g7KUz8xm08ilKFvGCfP8/LAMM4hpLx1gS9JnKrUr2IkVl+
AJBdbW1UCnT6HrYk4XnN5NblygE7fZZ0BU/IkxQfxVJkHetRhTT8gtnyqWzMsDaR
gBEZX9YU6bwF3QS4T3o=
-----END PRIVATE KEY-----
',
'-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwKMdprP48VqXR1GFCuMC
rFBMd4PgYzCphm4Qfr5Jv9Oz9BBXBFGRjQwz1QtbUZkWZVehGWzOCeiA8YcrlV3V
9Fv7ynFslEcJB9WMfEV18++jevSyR59Q3p0GYMR4fdYKxxdF8SRQDO9sbFug4TAd
TUBZ33WebE8gII5dslwz9KUZTk7BSuWrrTqMfgc6RCXEhWleR3nhYWidvgGiZds7
ZjOdsctD6HO6gvyfZS///au2VU4Aa/hM5wrehYlf/Hqga4n8JF8YBj/o4tt83cj9
AjQk+zAcJrSvEeOzmFDI0MwcuieRVsrxQSIgsNDr5iHzScl3jXsARVuvNj3kIypF
zwIDAQAB
-----END PUBLIC KEY-----
');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `SID` varchar(216) NOT NULL,
  `UID` bigint(11) UNSIGNED NOT NULL,
  `LocalID` tinyint(1) UNSIGNED NOT NULL,
  `StartTimestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `TimeoutTimestamp` timestamp NULL DEFAULT NULL,
  `IPAddress` varchar(39) NOT NULL,
  `UserAgent` text NOT NULL,
  `Country` tinytext NOT NULL,
  `Region` tinytext NOT NULL,
  `City` tinytext NOT NULL,
  `TimezoneOffset` smallint(6) NOT NULL,
  `LocationCoordinates` tinytext NOT NULL,
  `UpdateTimestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `system`
--

CREATE TABLE `system` (
  `UID` bigint(11) UNSIGNED NOT NULL,
  `CustomizationComplete` tinyint(1) NOT NULL DEFAULT 0,
  `LastPasswordUpdate` timestamp NOT NULL DEFAULT current_timestamp(),
  `UpdateTimestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `system`
--

INSERT INTO `system` (`UID`) VALUES (10000000000);
INSERT INTO `system` (`UID`) VALUES (10000000001);

-- --------------------------------------------------------

--
-- Table structure for table `trusteddevices`
--

CREATE TABLE `trusteddevices` (
  `DeviceID` varchar(216) NOT NULL,
  `UID` bigint(11) UNSIGNED NOT NULL,
  `LocalID` tinyint UNSIGNED NOT NULL,
  `CredentialID` text NOT NULL,
  `PublicKey` text NOT NULL,
  `DeviceName` tinytext NOT NULL,
  `Environment` tinytext NOT NULL,
  `ValidRoot` tinyint(1) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `UID` bigint(11) UNSIGNED NOT NULL,
  `Username` varchar(20) NOT NULL,
  `DisplayUsername` varchar(20) NOT NULL,
  `CreationDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `CreationIPAddress` varchar(39) NOT NULL DEFAULT 'UNKNOWN',
  `PasswordHash` varchar(64) NULL DEFAULT NULL,
  `FirstName` varchar(32) NOT NULL,
  `LastName` varchar(32) NOT NULL,
  `ProfilePicutre` varchar(26) NOT NULL DEFAULT 'DEFAULT',
  `Birthdate` date NOT NULL,
  `GenderName` varchar(32) NOT NULL,
  `Pronounce` tinyint(1) UNSIGNED NOT NULL DEFAULT 0,
  `Lang` varchar(24) NOT NULL DEFAULT 'en-GB',
  `UpdateTimestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users`
    (`UID`, `Username`, `DisplayUsername`, `PasswordHash`, `FirstName`, `LastName`, `Birthdate`,
    `GenderName`, `Pronounce`)
  VALUES
    (10000000000, 'system', 'SYSTEM',
    NULL, 'Ciel', 'System',
    '2022-11-01', 'Robot', 0);
-- tester, password12345
INSERT INTO `users`
    (`UID`, `Username`, `DisplayUsername`, `PasswordHash`, `FirstName`, `LastName`, `Birthdate`,
    `GenderName`, `Pronounce`)
  VALUES
    (10000000001, 'tester', 'TESTER',
    '9cb8e7c115cdeadef9787792e455ec336cc67b41572429c351a12995c1f59eca', 'Test', 'User',
    '2022-11-01', 'Unknown', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `preferences`
--
ALTER TABLE `preferences`
  ADD PRIMARY KEY (`UID`);

--
-- Indexes for table `reservedusernames`
--
ALTER TABLE `reservedusernames`
  ADD PRIMARY KEY (`Username`),
  ADD KEY `IPADDRESS` (`IPAddress`);

--
-- Indexes for table `security`
--
ALTER TABLE `security`
  ADD PRIMARY KEY (`UID`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`SID`),
  ADD KEY `UID` (`UID`) USING BTREE;

--
-- Indexes for table `system`
--
ALTER TABLE `system`
  ADD PRIMARY KEY (`UID`);

--
-- Indexes for table `trusteddevices`
--
ALTER TABLE `trusteddevices`
  ADD PRIMARY KEY (`DeviceID`),
  ADD KEY `USER_ID` (`UID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`UID`),
  ADD UNIQUE KEY `USERNAME` (`Username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
-- (UID 10000000000-10000009999 reserved for system accounts)
--
ALTER TABLE `users`
  MODIFY `UID` bigint(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10000010000;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `preferences`
--
ALTER TABLE `preferences`
  ADD CONSTRAINT `preferences_ibfk_1` FOREIGN KEY (`UID`) REFERENCES `users` (`UID`)
    ON DELETE CASCADE;

--
-- Constraints for table `security`
--
ALTER TABLE `security`
  ADD CONSTRAINT `security_ibfk_1` FOREIGN KEY (`UID`) REFERENCES `users` (`UID`)
    ON DELETE CASCADE;

--
-- Constraints for table `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`UID`) REFERENCES `users` (`UID`)
    ON DELETE CASCADE;

--
-- Constraints for table `system`
--
ALTER TABLE `system`
  ADD CONSTRAINT `system_ibfk_1` FOREIGN KEY (`UID`) REFERENCES `users` (`UID`)
    ON DELETE CASCADE;

--
-- Constraints for table `trusteddevices`
--
ALTER TABLE `trusteddevices`
  ADD CONSTRAINT `trusteddevices_ibfk_1` FOREIGN KEY (`UID`) REFERENCES `users` (`UID`)
    ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
