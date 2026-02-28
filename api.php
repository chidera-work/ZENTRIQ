
<?php
require_once 'db.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

if ($method === 'OPTIONS') exit;

switch ($action) {
    case 'get_all':
        $stmt = $pdo->query("SELECT * FROM shipments ORDER BY createdAt DESC");
        $shipments = $stmt->fetchAll();
        foreach($shipments as &$s) {
            $updStmt = $pdo->prepare("SELECT * FROM shipment_updates WHERE shipment_id = ? ORDER BY id DESC");
            $updStmt->execute([$s['id']]);
            $s['updates'] = $updStmt->fetchAll();
        }
        echo json_encode($shipments);
        break;

    case 'get_one':
        $tracking = $_GET['tracking'] ?? '';
        $stmt = $pdo->prepare("SELECT * FROM shipments WHERE trackingNumber = ?");
        $stmt->execute([$tracking]);
        $s = $stmt->fetch();
        if ($s) {
            $updStmt = $pdo->prepare("SELECT * FROM shipment_updates WHERE shipment_id = ? ORDER BY id DESC");
            $updStmt->execute([$s['id']]);
            $s['updates'] = $updStmt->fetchAll();
            echo json_encode($s);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Shipment not found']);
        }
        break;

    case 'save':
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data) exit;

        if (isset($data['id']) && is_numeric($data['id'])) {
            // Update
            $stmt = $pdo->prepare("UPDATE shipments SET senderName=?, senderPhone=?, receiverName=?, receiverPhone=?, origin=?, destination=?, currentLocation=?, weight=?, dimensions=?, serviceType=?, status=?, progress=?, estimatedDelivery=? WHERE id=?");
            $stmt->execute([
                $data['senderName'], $data['senderPhone'], $data['receiverName'], $data['receiverPhone'], $data['origin'], $data['destination'], 
                $data['currentLocation'], $data['weight'], $data['dimensions'], $data['serviceType'], 
                $data['status'], $data['progress'], $data['estimatedDelivery'], $data['id']
            ]);
            $shipmentId = $data['id'];
        } else {
            // Create
            $stmt = $pdo->prepare("INSERT INTO shipments (trackingNumber, senderName, senderPhone, receiverName, receiverPhone, origin, destination, currentLocation, weight, dimensions, serviceType, status, progress, estimatedDelivery) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $data['trackingNumber'], $data['senderName'], $data['senderPhone'], $data['receiverName'], $data['receiverPhone'], $data['origin'], $data['destination'], 
                $data['origin'], $data['weight'], $data['dimensions'], $data['serviceType'], 
                'Pending', 0, $data['estimatedDelivery']
            ]);
            $shipmentId = $pdo->lastInsertId();
        }

        // Sync Updates
        $pdo->prepare("DELETE FROM shipment_updates WHERE shipment_id = ?")->execute([$shipmentId]);
        foreach ($data['updates'] as $upd) {
            $updStmt = $pdo->prepare("INSERT INTO shipment_updates (shipment_id, timestamp, location, description, status) VALUES (?, ?, ?, ?, ?)");
            $updStmt->execute([$shipmentId, $upd['timestamp'], $upd['location'], $upd['description'], $upd['status']]);
        }

        echo json_encode(['success' => true, 'id' => $shipmentId]);
        break;

    case 'delete':
        $id = $_GET['id'] ?? '';
        $stmt = $pdo->prepare("DELETE FROM shipments WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);
        break;
}
?>
