-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 24, 2026 at 04:48 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gestion_consignation`
--

-- --------------------------------------------------------

--
-- Table structure for table `agent`
--

CREATE TABLE `agent` (
  `IDAgent` int(11) NOT NULL,
  `Matricule` varchar(255) DEFAULT NULL,
  `Nom` varchar(255) DEFAULT NULL,
  `Prenom` varchar(255) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `Mot_de_passe` varchar(255) DEFAULT NULL,
  `Num_telephone` varchar(255) DEFAULT NULL,
  `Adresse` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `depotbagage`
--

CREATE TABLE `depotbagage` (
  `IDDepotBagage` int(11) NOT NULL,
  `MotifDepot` varchar(255) DEFAULT NULL,
  `TypeDepot` varchar(255) DEFAULT NULL,
  `Format` varchar(255) DEFAULT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `Emplacement` varchar(255) DEFAULT NULL,
  `Date_depot` date DEFAULT NULL,
  `Date_prevue_ramassage` date DEFAULT NULL,
  `Date_ramassage` date DEFAULT NULL,
  `Nbr_bagage` int(11) DEFAULT NULL,
  `Prix_unitaire` decimal(10,3) DEFAULT NULL,
  `Device` varchar(10) DEFAULT NULL,
  `Taux_conversion` decimal(10,3) DEFAULT NULL,
  `IDAgent` int(11) DEFAULT NULL,
  `IDPassager` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `passager`
--

CREATE TABLE `passager` (
  `IDPassager` int(11) NOT NULL,
  `Nom` varchar(255) DEFAULT NULL,
  `Prenom` varchar(255) DEFAULT NULL,
  `Num_piece_identite` varchar(255) DEFAULT NULL,
  `Num_telephone` varchar(255) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `Adresse` varchar(255) DEFAULT NULL,
  `IDAgent` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `recu`
--

CREATE TABLE `recu` (
  `IDRecu` int(11) NOT NULL,
  `Date_genere` date DEFAULT NULL,
  `Prix_total` decimal(10,3) DEFAULT NULL,
  `IDAgent` int(11) DEFAULT NULL,
  `IDDepotBagage` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `agent`
--
ALTER TABLE `agent`
  ADD PRIMARY KEY (`IDAgent`);

--
-- Indexes for table `depotbagage`
--
ALTER TABLE `depotbagage`
  ADD PRIMARY KEY (`IDDepotBagage`),
  ADD KEY `IDAgent` (`IDAgent`),
  ADD KEY `IDPassager` (`IDPassager`);

--
-- Indexes for table `passager`
--
ALTER TABLE `passager`
  ADD PRIMARY KEY (`IDPassager`),
  ADD KEY `IDAgent` (`IDAgent`);

--
-- Indexes for table `recu`
--
ALTER TABLE `recu`
  ADD PRIMARY KEY (`IDRecu`),
  ADD KEY `IDAgent` (`IDAgent`),
  ADD KEY `IDDepotBagage` (`IDDepotBagage`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `agent`
--
ALTER TABLE `agent`
  MODIFY `IDAgent` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `depotbagage`
--
ALTER TABLE `depotbagage`
  MODIFY `IDDepotBagage` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `passager`
--
ALTER TABLE `passager`
  MODIFY `IDPassager` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `recu`
--
ALTER TABLE `recu`
  MODIFY `IDRecu` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `depotbagage`
--
ALTER TABLE `depotbagage`
  ADD CONSTRAINT `depotbagage_ibfk_1` FOREIGN KEY (`IDAgent`) REFERENCES `agent` (`IDAgent`),
  ADD CONSTRAINT `depotbagage_ibfk_2` FOREIGN KEY (`IDPassager`) REFERENCES `passager` (`IDPassager`);

--
-- Constraints for table `passager`
--
ALTER TABLE `passager`
  ADD CONSTRAINT `passager_ibfk_1` FOREIGN KEY (`IDAgent`) REFERENCES `agent` (`IDAgent`);

--
-- Constraints for table `recu`
--
ALTER TABLE `recu`
  ADD CONSTRAINT `recu_ibfk_1` FOREIGN KEY (`IDAgent`) REFERENCES `agent` (`IDAgent`),
  ADD CONSTRAINT `recu_ibfk_2` FOREIGN KEY (`IDDepotBagage`) REFERENCES `depotbagage` (`IDDepotBagage`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
