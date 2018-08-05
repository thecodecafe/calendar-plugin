<?php 
    header('Access-Control-Allow-Origin: *', false);
    header('Access-Control-Allow-Methods: *', false);
    header('Content-Type: application/json');

    $events = [
        [
            'id' => '56',
            'title' => 'Sample event one',
            'startDate' => date('m/03/Y'),
            'endDate' => date('m/06/Y'),
            'category' => 'male',
            'gender' => 'male',
            'lastName' => 'Barde',
            'startTime' => '06:00',
            'endTime' => '12:00',
        ],
        [
            'id' => '29',
            'title' => 'Sample event two',
            'startDate' => date('m/05/Y'),
            'endDate' => date('m/10/Y'),
            'startTime' => '18:00',
            'endTime' => '20:00',
        ],
        [
            'id' => '44',
            'title' => 'Sample event three',
            'startDate' => date('m/14/Y'),
            'endDate' => date('m/16/Y'),
            'startTime' => '14:00',
            'endTime' => '15:30',
        ],
        [
            'id' => '27',
            'title' => 'Sample event four',
            'startDate' => date('m/22/Y'),
            'endDate' => date('m/24/Y'),
            'startTime' => '08:00',
            'endTime' => '08:45',
        ],
        [
            'id' => '27',
            'title' => 'Sample event five',
            'startDate' => date('m/02/Y'),
            'endDate' => date('m/03/Y'),
            'startTime' => '12:00',
            'endTime' => '13:00',
        ]
    ];

    echo json_encode([
        'success' => true,
        'data' => $events
    ]);
    
?>