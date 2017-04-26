<?php
$url = "http://countdown.tfl.gov.uk/stopBoard/51599";
// $url = "bus.txt";
header('Content-type: application/json');
$json_page = file_get_contents($url);
echo $json_page;




/*$url = "http://countdown.tfl.gov.uk/stopBoard/51599";
// $url = "bus.txt";
$ch = curl_init();
curl_setopt ($ch, CURLOPT_URL, $url);
curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, 5);
curl_setopt ($ch, CURLOPT_RETURNTRANSFER, true);
$contents = curl_exec($ch);
if (curl_errno($ch)) {
  echo curl_error($ch);
  echo "\n<br />";
  $contents = '';
} else {
  curl_close($ch);
}

if (!is_string($contents) || !strlen($contents)) {
echo "Failed to get contents.";
$contents = '';
}

echo $contents;*/
?>