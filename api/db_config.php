<?php
namespace App\Config;

require_once __DIR__ . '/dotenv/Dotenv.php';
use App\Dotenv\Dotenv;

(new Dotenv(__DIR__ . '/.env'))->load();

class DbConfig
{
    private $database_dsn;
    private $database_username;
    private $database_password;
    private $pdo;
    public function __construct()
    {
        $this->database_dsn = getenv('DATABASE_DSN');
        $this->database_username = getenv('DATABASE_USERNAME');
        $this->database_password = getenv('DATABASE_PASSWORD');
        try {
            $this->pdo = new \PDO($this->database_dsn, $this->database_username, $this->database_password);
            $this->pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        } catch (\PDOException $e) {
            echo "Connection failed: " . $e->getMessage();
            exit;
        }
    }
    public function getPdo()
    {
        return $this->pdo;
    }
    public function getDsn()
    {
        return $this->database_dsn;
    }
    public function getUsername()
    {
        return $this->database_username;
    }
    public function getPassword()
    {
        return $this->database_password;
    }
}