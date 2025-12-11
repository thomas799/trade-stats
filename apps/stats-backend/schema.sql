CREATE TABLE IF NOT EXISTS `trade_stats` (
    `id` INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `mean` DECIMAL(20, 8) NOT NULL,
    `std_dev` DECIMAL(20, 8) NOT NULL,
    `mode` DECIMAL(20, 8) NOT NULL,
    `min_value` DECIMAL(20, 8) NOT NULL,
    `max_value` DECIMAL(20, 8) NOT NULL,
    `lost_quotes` INT(11) UNSIGNED NOT NULL DEFAULT 0,
    `calc_time` DECIMAL(10, 4) NOT NULL COMMENT 'Calculation time in seconds',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_created_at` (`created_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
