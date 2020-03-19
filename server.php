<?php

	error_reporting(0);

	require("connect.php");

	function fail() {
		global $db;

		$db->close();
		http_response_code(400);
		exit();
	}

	function getLevelSettings($level) {

		static $levels = [["pairs" => 2, "time" => 25],
				   		  ["pairs" => 3, "time" => 30],
						  ["pairs" => 4, "time" => 35],
						  ["pairs" => 5, "time" => 40],
						  ["pairs" => 5, "time" => 35],
						  ["pairs" => 6, "time" => 45],
						  ["pairs" => 6, "time" => 40],
						  ["pairs" => 8, "time" => 55],
						  ["pairs" => 8, "time" => 50],
						  ["pairs" => 10, "time" => 60]];

		if ($level < 10) return $levels[$level]; else {
			return ["pairs" => 10, "time" => max(60 - 3 * ($level - 9), 10)];
		}

	}

	function getMaxLevelPoints($finalLevel) {

		$total = 0;

		for ($i = 0; $i <= $finalLevel; $i++) {
			$settings = getLevelSettings($i);
 
			$total += $settings["pairs"] * 1000 + $settings["time"] * 100;
		}

		return $total;

	}

	$result = "";

	switch ($_GET['action']) {
		case "get":

			if (empty($_GET['amount'])) fail();

			$amount = $_GET['amount'];

			$data = $db->query("SELECT `name`, `points` FROM `$table_name` ORDER BY `points` DESC LIMIT $amount");
			if ($data === FALSE) fail();

			$result = json_encode($data->fetch_all(MYSQLI_ASSOC));
			
			$data->close();

			break;
		case "save":

			if (empty($_POST['name']) || !isset($_POST['theme']) || empty($_POST['record'])) fail();

			$name = $db->escape_string($_POST['name']);
			$theme = $_POST['theme'];
			$record = $_POST['record'];

			if (strlen($record) != 14) fail();
			if (!is_numeric($theme) || $theme < 0 || $theme > 7) fail();

			$level = intval($record[0].$record[1], 16);
			$gd = intval($record[2].$record[3], 16);
			$bd = intval($record[4].$record[5], 16);
			$tl = intval($record[6].$record[7].$record[8], 16);
			$points = intval($record[9].$record[10].$record[11].$record[12].$record[13], 16);

			$sum = $gd * 1000 - $bd * 500 + $tl * 100;

			echo ($sum . " " . $points . " " . getMaxLevelPoints($level));

			if ($sum != $points) fail();
			if ($sum > getMaxLevelPoints($level)) fail();

			if ($db->query("INSERT INTO `records` (`id`, `name`, `theme`, `points`, `level`, `date`) VALUES (NULL, '$name', $theme, '$sum', '$level', CURRENT_TIMESTAMP);") === FALSE) fail();

			break;
		default:
			fail();
	}

	$db->close();

	exit($result);

?>