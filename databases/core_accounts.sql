-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 25, 2022 at 09:09 PM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "SYSTEM";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `epiz_32665699_core_accounts`
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

INSERT INTO `preferences` (`UID`, `ProfileVisibility`, `ActivityMode`, `Location`) VALUES
(10000000000, 1, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `reservedusernames`
--

CREATE TABLE `reservedusernames` (
  `IPAddress` varchar(15) NOT NULL,
  `Username` varchar(20) NOT NULL,
  `TimeoutTimestamp` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `security`
--

CREATE TABLE `security` (
  `UID` bigint(11) UNSIGNED NOT NULL,
  `SecurityQuestion1` tinyint(1) UNSIGNED NOT NULL,
  `SecurityQuestion2` tinyint(1) UNSIGNED NOT NULL,
  `SecurityQuestion3` tinyint(1) UNSIGNED NOT NULL,
  `SecurityQuestionAns1` tinytext NOT NULL,
  `SecurityQuestionAns2` tinytext NOT NULL,
  `SecurityQuestionAns3` tinytext NOT NULL,
  `Require2FA` tinyint(1) UNSIGNED NOT NULL DEFAULT 0,
  `FailedLoginAttempts` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `LoginCooldownTimeout` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `security`
--

INSERT INTO `security` (`UID`, `SecurityQuestion1`, `SecurityQuestion2`, `SecurityQuestion3`, `SecurityQuestionAns1`, `SecurityQuestionAns2`, `SecurityQuestionAns3`) VALUES
(10000000000, 1, 1, 1, '~answer~', '~answer~', '~answer~');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `SID` varchar(216) NOT NULL,
  `UID` bigint(11) UNSIGNED NOT NULL,
  `StartTimestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `TimeoutTimestamp` timestamp NULL DEFAULT NULL,
  `IPAddress` varchar(15) NOT NULL,
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
  `CustomizationComplete` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `system`
--

INSERT INTO `system` (`UID`) VALUES
(10000000000);

-- --------------------------------------------------------

--
-- Table structure for table `trusteddevices`
--

CREATE TABLE `trusteddevices` (
  `DeviceID` varchar(216) NOT NULL,
  `UID` bigint(11) UNSIGNED NOT NULL,
  `CredentialID` text NOT NULL,
  `PublicKey` text NOT NULL,
  `DeviceName` tinytext NOT NULL,
  `Environment` tinytext NOT NULL
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
  `CreationIPAddress` varchar(15) NOT NULL DEFAULT '0.0.0.0',
  `PasswordHash` varchar(64) NOT NULL,
  `FirstName` varchar(32) NOT NULL,
  `LastName` varchar(32) NOT NULL,
  `ProfilePicutre` varchar(26) NOT NULL DEFAULT 'DEFAULT',
  `Birthdate` date NOT NULL,
  `GenderName` varchar(32) NOT NULL,
  `Pronounce` tinyint(1) UNSIGNED NOT NULL DEFAULT 0,
  `Lang` varchar(24) NOT NULL,
  `UpdateTimestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`UID`, `Username`, `DisplayUsername`, `PasswordHash`, `FirstName`, `LastName`, `Birthdate`, `GenderName`, `Pronounce`, `Lang`) VALUES
(10000000000, 'system', 'SYSTEM', 'aa839b55020c3932f704a15c68740cec4e506f4beb80038e6195fcba74e59d33', 'Ciel', 'System', '2022-11-01', 'Robot', 0, 'en-GB');

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
  ADD CONSTRAINT `preferences_ibfk_1` FOREIGN KEY (`UID`) REFERENCES `users` (`UID`) ON DELETE CASCADE;

--
-- Constraints for table `security`
--
ALTER TABLE `security`
  ADD CONSTRAINT `security_ibfk_1` FOREIGN KEY (`UID`) REFERENCES `users` (`UID`) ON DELETE CASCADE;

--
-- Constraints for table `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`UID`) REFERENCES `users` (`UID`) ON DELETE CASCADE;

--
-- Constraints for table `system`
--
ALTER TABLE `system`
  ADD CONSTRAINT `system_ibfk_1` FOREIGN KEY (`UID`) REFERENCES `users` (`UID`) ON DELETE CASCADE;

--
-- Constraints for table `trusteddevices`
--
ALTER TABLE `trusteddevices`
  ADD CONSTRAINT `trusteddevices_ibfk_1` FOREIGN KEY (`UID`) REFERENCES `users` (`UID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
