-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.1.26-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win32
-- HeidiSQL Version:             9.4.0.5125
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for gobear
CREATE DATABASE IF NOT EXISTS `gobear` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `gobear`;

-- Dumping structure for table gobear.campaigns
CREATE TABLE IF NOT EXISTS `campaigns` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `img_url` tinytext,
  `enabled` tinyint(3) unsigned DEFAULT '1',
  `start_date` timestamp NULL DEFAULT NULL,
  `end_date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table gobear.entries
CREATE TABLE IF NOT EXISTS `entries` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `campaign_id` int(11) unsigned DEFAULT NULL,
  `prize_id` int(11) unsigned DEFAULT NULL,
  `created_date` timestamp NULL DEFAULT NULL,
  `modified_date` timestamp NULL DEFAULT NULL,
  `prize_awarded_timestamp` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table gobear.prizes
CREATE TABLE IF NOT EXISTS `prizes` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `img_url` tinytext,
  `position` tinyint(4) DEFAULT NULL,
  `campaign_id` int(10) unsigned DEFAULT NULL,
  `enabled` tinyint(3) unsigned DEFAULT '1',
  `probability` int(10) unsigned DEFAULT '0',
  `quantity_total` int(10) unsigned DEFAULT '0',
  `quantity_available` int(10) unsigned DEFAULT '0',
  `lottery_start_date` timestamp NULL DEFAULT NULL,
  `lottery_end_date` timestamp NULL DEFAULT NULL,
  `winning_instruction` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
