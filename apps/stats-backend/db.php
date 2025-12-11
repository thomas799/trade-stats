<?php

class Database
{
    private static ?Database $instance = null;
    private ?PDO $connection = null;

    private string $host;
    private string $dbname;
    private string $username;
    private string $password;
    private string $charset = 'utf8mb4';

    private function __construct()
    {
        $this->host = getenv('DB_HOST') ?: 'mysql';
        $this->dbname = getenv('DB_NAME') ?: 'trade_stats_db';
        $this->username = getenv('DB_USER') ?: 'trade_stats_user';
        $this->password = getenv('DB_PASSWORD') ?: 'trade_stats_password';

        $dsn = "mysql:host={$this->host};dbname={$this->dbname};charset={$this->charset}";

        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        try {
            $this->connection = new PDO($dsn, $this->username, $this->password, $options);
        } catch (PDOException $e) {
            throw new PDOException($e->getMessage(), (int)$e->getCode());
        }
    }

    private function __clone() {}

    public function __wakeup()
    {
        throw new Exception("Cannot unserialize singleton");
    }

    public static function getInstance(): Database
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    public function getConnection(): PDO
    {
        return $this->connection;
    }
}
