<?php
	error_reporting(0);

	$mysqli = new mysqli('localhost', 'lbcf_user', '10/01/2001', 'lbcf_fastmemory');
	$query = "INSERT INTO `records` (`Nome`, `Score`,`IDIP`) VALUES ('".$_POST['name']."','".$_POST['score']."','".$_POST['idip']."')";
	$mysqli->query($query);
	$mysqli->close();
?>