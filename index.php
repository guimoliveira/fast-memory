<?php

	error_reporting(0);

	$lang = $_GET['lang'];

	$langs = [];

	$langs["pt"] = ["keywords" => "cartas, jogo da memória, memória, memoria, jogo da memoria, online, jogo, html5",
				    "description" => "Teste sua habilidade em memorizar. Jogo da Memória online com recordes e uma grande diversidade de cartas.",
					"title" => "Fast Memory - Jogo da Memória Online",
					"incompatibleBrowser" => "Infelizmente o seu navegador não tem os recursos necessários para rodar o jogo. 😔"];
	
	$langs["en"] = ["keywords" => "cards, memory game, memory, online, game, html5",
					"description" => "Test your ability to memorize. Online memory game with records and a wide variety of cards.",
					"title" => "Fast Memory - Online Memory Game",
					"incompatibleBrowser" => "Unfortunately, your browser does not have the features needed to run the game. 😔"];		
					
	$langs["es"] = ["keywords" => "cartas, juego de memoria, memoria, en línea, juego, html5",
					"description" => "Pon a prueba tu habilidad para memorizar. Juego de memoria en línea con records y una gran variedad de cartas.",
					"title" => "Fast Memory - Juego de Memoria en Línea",
					"incompatibleBrowser" => "Desafortunadamente su navegador no tiene las características necesarias para ejecutar el juego. 😔"];

	if (!isset($langs[$lang])) {
		if (isset($_COOKIE['lang'])) {
			$lang = $_COOKIE['lang'];
		} else {
			$lang = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
		}
		if (isset($langs[$lang])) {
			header("Location: ?lang=".$lang);
		} else {
			$lang = 'en';
			header("Location: ?lang=".$lang);
		}
	}

	$strings = $langs[$lang];

	setcookie("lang", $lang, time()+365*60*60*24*1000, "/");

?>

<html lang="<?php echo $lang; ?>">

	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=Edge" />
		<meta charset="utf-8" />

		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
		<meta name="keywords" content="fastmemory, fast memory, <?php echo $strings["keywords"]; ?>">
		<meta name="description" content="<?php echo $strings["description"]; ?>">
		<meta name="author" content="Guilherme Marcelino">
		
		<title><?php echo $strings["title"]; ?></title>

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
	
		<link rel="shortcut icon" href="images/favicon.png" />
	</head>
	
	<body>
		<canvas id="game" width="500" height="100">
			<?php echo $strings["incompatibleBrowser"]; ?>
		</canvas>

		<a href="http://www.github.com/guimoliveira/fast_memory" style="color: white; position: fixed; top: 10px; right: 10px; text-decoration: none;" target="blank">GitHub Repo</a>

		<script>var lang = "<?php echo $lang; ?>";</script>
		<script src="js.js"></script>
	</body>
</html>