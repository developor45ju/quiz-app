<?php
namespace App\Config;

class DbConfig
{
    private $host = 'localhost';
    private $username = 'root';
    private $password = '';
    private $database = 'quizapp';
    private $pdo;
    public function __construct()
    {
        try {
            $this->pdo = new \PDO("mysql:host={$this->host};dbname={$this->database}", $this->username, $this->password);
            $this->pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
            $this->pdo->exec("SET NAMES 'utf8mb4'");
        } catch (\PDOException $e) {
            echo "Connection failed: " . $e->getMessage();
            exit;
        }
    }
    public function getPdo()
    {
        return $this->pdo;
    }
    public function getHost()
    {
        return $this->host;
    }
    public function getUsername()
    {
        return $this->username;
    }
    public function getPassword()
    {
        return $this->password;
    }
}