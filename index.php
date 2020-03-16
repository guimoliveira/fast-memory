<html>

	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=Edge" />
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
		<meta name="keywords" content="fastmemory, fast memory, memory, game, canvas, jogo da memória, memória, memoria, jogo da memoria, online, jogo, html5, autism, austismo, autista">
		<meta name="description" content="Teste sua habilidade em decorar. Jogo da Memória online com records e uma grande diversidade de cartas.">
		<meta name="author" content="Guilherme Marcelino">
		
		<title>Fast Memory - Jogo da Memória Online</title>

		<style>
			body{
				padding: 0;
				margin: 0;
				font-family: Arial;
				width: 100%;
				height: 100%;
				overflow: hidden;
				cursor: pointer;
				-webkit-tap-highlight-color: rgba(0,0,0,0);
			}
		</style>
		
		<script>
			var records = [];
			
			<?php
				//error_reporting(0);
				
				$mysqli = new mysqli('localhost', 'lbcf_user', '10/01/2001', 'lbcf_fastmemory');
				
				$query = "INSERT INTO `ips` (`ID`, `IP`, `UA`) VALUES (NULL, '".$_SERVER['REMOTE_ADDR']."', '".$_SERVER['HTTP_USER_AGENT']."')";
				$mysqli->query($query);
				
				$idip = $mysqli->insert_id;
				
				echo 'var convidado = "Convidado#'.$idip.'";';
				
				$query = "SELECT `Nome`,`Score` FROM `records` ORDER BY `Score` DESC LIMIT 0,10";
				$result = $mysqli->query($query);
				
				$array = [];
				$i = 0;
				
				while($row = $result->fetch_array(MYSQLI_NUM)){
				        $array[$i]=$row;
				        $i++;
				}

				$result->close();

				$mysqli->close();
			?>
			
			records = JSON.parse('<?php echo json_encode($array);?>');

		</script>
		
		<script src="js.js"></script>
		<link rel="shortcut icon" href="images/favicon.png" />
	</head>
	
	<body>
		<canvas id="game" width="500" height="100">
			Infelizmente seu navegador não suporta canvas.
		</canvas>
		<iframe name="p" style="width: 0; height: 0; visibility: hidden;"></iframe>
		<form method="post" action="add.php" id="add" target="p" style="visibility: hidden;">
			<input type="text" id="name" name="name">
			<input type="text" id="score" name="score">
			<input type="text" name="idip" value="<?php echo $idip; ?>">
		</form>
	</body>
</html>