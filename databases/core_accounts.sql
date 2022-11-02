-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 02, 2022 at 09:15 AM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


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
  `ProfileVisibility` tinyint(1) NOT NULL,
  `ActivityMode` tinyint(1) NOT NULL,
  `LocationType` tinyint(1) NOT NULL,
  `ColorScheme` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `preferences`
--

INSERT INTO `preferences` (`UID`, `ProfileVisibility`, `ActivityMode`, `LocationType`, `ColorScheme`) VALUES
(10000000000, 1, 1, 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `reservedusernames`
--

CREATE TABLE `reservedusernames` (
  `IPAddress` varchar(15) NOT NULL,
  `Username` varchar(20) NOT NULL,
  `TimeoutTimestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `security`
--

CREATE TABLE `security` (
  `UID` bigint(11) UNSIGNED NOT NULL,
  `SecurityQuestion1` tinyint(1) NOT NULL,
  `SecurityQuestion2` tinyint(1) NOT NULL,
  `SecurityQuestion3` tinyint(1) NOT NULL,
  `SecurityQuestionAns1` tinytext NOT NULL,
  `SecurityQuestionAns2` tinytext NOT NULL,
  `SecurityQuestionAns3` tinytext NOT NULL
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
  `SID` bigint(16) UNSIGNED NOT NULL,
  `UID` bigint(11) UNSIGNED NOT NULL,
  `TimeoutTimestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UserAgent` text NOT NULL,
  `Country` tinytext NOT NULL,
  `Region` tinytext NOT NULL,
  `City` tinytext NOT NULL,
  `Timezone` tinytext NOT NULL,
  `LocationCoordinates` tinytext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `trusteddevices`
--

CREATE TABLE `trusteddevices` (
  `DeviceID` bigint(16) UNSIGNED NOT NULL,
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
  `CreationIPAddress` varchar(15) NOT NULL,
  `PasswordHash` varchar(32) NOT NULL,
  `FirstName` varchar(32) NOT NULL,
  `LastName` varchar(32) NOT NULL,
  `ProfilePicutre` varchar(26) NOT NULL DEFAULT 'DEFAULT',
  `Birthdate` date NOT NULL,
  `GenderName` varchar(32) NOT NULL,
  `Pronounce` tinyint(1) NOT NULL DEFAULT 0,
  `Lang` varchar(24) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`UID`, `Username`, `DisplayUsername`, `CreationDate`, `CreationIPAddress`, `PasswordHash`, `FirstName`, `LastName`, `ProfilePicutre`, `Birthdate`, `GenderName`, `Pronounce`, `Lang`) VALUES
(10000000000, 'system', 'system', '2022-10-31 22:00:00', '0.0.0.0', 'f2a2dfcf765ae8df97f50f5f5feed926', 'Ciel', 'System', 'DEFAULT', '2022-11-01', 'Robot', 0, 'en-GB');

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
  ADD UNIQUE KEY `UID` (`UID`);

--
-- Indexes for table `trusteddevices`
--
ALTER TABLE `trusteddevices`
  ADD PRIMARY KEY (`DeviceID`),
  ADD UNIQUE KEY `UID` (`UID`);

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
-- AUTO_INCREMENT for table `sessions`
--
ALTER TABLE `sessions`
  MODIFY `SID` bigint(16) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `trusteddevices`
--
ALTER TABLE `trusteddevices`
  MODIFY `DeviceID` bigint(16) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `UID` bigint(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10000000001;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
