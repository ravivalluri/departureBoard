<?php

$url = "https://huxley.apphb.com/departures/Wimbledon%20Chase/20?accessToken=1d02acb7-3a7c-4ba0-b640-a8b5375e504a";
// $url = "train2.txt";


header('Content-type: application/json');
header('Access-Control-Allow-Origin: *');
$json_page = file_get_contents($url);
echo $json_page;

?>