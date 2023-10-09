/***
 *      _____       _       _ _  __       
 *     |_   _|     | |     | (_)/ _|      
 *       | |  _ __ | |_ ___| |_| |_ _   _ 
 *       | | | '_ \| __/ _ \ | |  _| | | |
 *      _| |_| | | | ||  __/ | | | | |_| |
 *     |_____|_| |_|\__\___|_|_|_|  \__, |
 *                                   __/ |
 *                                  |___/ 
 *										
 *										
 *		Author: Motify <coder@outlook.ie> (https://github.com/mtfy)
 *		Copyright © Motify, 2023.
 *		
 */


SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;


CREATE TABLE `db` (
  `id` int(11) NOT NULL,
  `breach` varchar(255) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `hash` varchar(500) DEFAULT NULL,
  `salt` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `dob` varchar(255) DEFAULT NULL,
  `regip` varchar(255) DEFAULT NULL,
  `lastip` varchar(255) DEFAULT NULL,
  `hwid` varchar(1024) DEFAULT NULL,
  `scraped_data` text CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `lookup_usage_logs` (
  `id` int(11) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `q_date` double UNSIGNED NOT NULL,
  `search` varchar(128) NOT NULL,
  `type` tinyint(2) UNSIGNED NOT NULL DEFAULT 0,
  `channel_id` bigint(20) UNSIGNED NOT NULL,
  `guild_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `username` varchar(32) NOT NULL,
  `discriminator` smallint(4) UNSIGNED ZEROFILL NOT NULL DEFAULT 0000,
  `avatar` varchar(32) CHARACTER SET latin1 COLLATE latin1_general_cs DEFAULT NULL,
  `banner` varchar(32) CHARACTER SET latin1 COLLATE latin1_general_cs DEFAULT NULL,
  `bot` tinyint(1) UNSIGNED NOT NULL DEFAULT 0,
  `system` tinyint(1) UNSIGNED NOT NULL DEFAULT 0,
  `intelify_beta` tinyint(1) UNSIGNED NOT NULL DEFAULT 0,
  `roles` text NOT NULL DEFAULT '{}',
  `first_seen` double UNSIGNED NOT NULL,
  `last_update` double UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `users_throttle` (
  `id` int(11) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `command_id` tinyint(2) UNSIGNED NOT NULL DEFAULT 0,
  `guild_id` bigint(20) UNSIGNED NOT NULL,
  `date` double UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


ALTER TABLE `db`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lookup_username_idx` (`username`(25)),
  ADD KEY `lookup_email_idx` (`email`(50));

ALTER TABLE `lookup_usage_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`) USING HASH,
  ADD KEY `idx_search_keyword` (`search`(32));

ALTER TABLE `users`
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `idx_user_id` (`id`) USING HASH,
  ADD KEY `idx_user_name` (`username`) USING BTREE;

ALTER TABLE `users_throttle`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`) USING HASH;


ALTER TABLE `db`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `lookup_usage_logs`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `users_throttle`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;