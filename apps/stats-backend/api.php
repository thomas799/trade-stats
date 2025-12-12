<?php

require_once __DIR__ . '/db.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    $db = Database::getInstance();
    $pdo = $db->getConnection();

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        handlePost($pdo);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
        handleGet($pdo);
    } else {
        sendError('Method not allowed', 405);
    }
} catch (PDOException $e) {
    sendError('Database error: ' . $e->getMessage(), 500);
} catch (Exception $e) {
    sendError('Server error: ' . $e->getMessage(), 500);
}

function handlePost(PDO $pdo): void
{
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        sendError('Invalid JSON format', 400);
    }

    $requiredFields = ['mean', 'std_dev', 'mode', 'min_value', 'max_value', 'lost_quotes', 'calc_time'];
    $missingFields = [];

    foreach ($requiredFields as $field) {
        if (!isset($data[$field])) {
            $missingFields[] = $field;
        }
    }

    if (!empty($missingFields)) {
        sendError('Missing required fields: ' . implode(', ', $missingFields), 400);
    }

    foreach (['mean', 'std_dev', 'mode', 'min_value', 'max_value', 'calc_time'] as $field) {
        if (!is_numeric($data[$field])) {
            sendError("Field '{$field}' must be numeric", 400);
        }
    }

    if (!is_int($data['lost_quotes']) && !ctype_digit((string)$data['lost_quotes'])) {
        sendError('Field lost_quotes must be an integer', 400);
    }

    try {
        $stmt = $pdo->prepare(
            'INSERT INTO trade_stats (mean, std_dev, mode, min_value, max_value, lost_quotes, calc_time)
             VALUES (:mean, :std_dev, :mode, :min_value, :max_value, :lost_quotes, :calc_time)'
        );

        $stmt->execute([
            ':mean' => $data['mean'],
            ':std_dev' => $data['std_dev'],
            ':mode' => $data['mode'],
            ':min_value' => $data['min_value'],
            ':max_value' => $data['max_value'],
            ':lost_quotes' => $data['lost_quotes'],
            ':calc_time' => $data['calc_time']
        ]);

        sendResponse(['status' => 'success', 'id' => $pdo->lastInsertId()], 201);
    } catch (PDOException $e) {
        sendError('Failed to save data: ' . $e->getMessage(), 500);
    }
}

function handleGet(PDO $pdo): void
{
    try {
        $stmt = $pdo->prepare(
            'SELECT id, mean, std_dev, mode, min_value, max_value, lost_quotes, calc_time, created_at
             FROM trade_stats
             ORDER BY created_at DESC'
        );

        $stmt->execute();
        $results = $stmt->fetchAll();

        foreach ($results as &$row) {
            $row['id'] = (int)$row['id'];
            $row['mean'] = (float)$row['mean'];
            $row['std_dev'] = (float)$row['std_dev'];
            $row['mode'] = (float)$row['mode'];
            $row['min_value'] = (float)$row['min_value'];
            $row['max_value'] = (float)$row['max_value'];
            $row['lost_quotes'] = (int)$row['lost_quotes'];
            $row['calc_time'] = (float)$row['calc_time'];
        }

        sendResponse(['status' => 'success', 'data' => $results]);
    } catch (PDOException $e) {
        sendError('Failed to retrieve data: ' . $e->getMessage(), 500);
    }
}

function sendResponse(array $data, int $statusCode = 200): void
{
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

function sendError(string $message, int $statusCode = 400): void
{
    http_response_code($statusCode);
    echo json_encode(['status' => 'error', 'message' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}
