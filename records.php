<?php

    error_reporting(0);

    require("connect.php");
    
    $lang = $_GET['lang'];

    $langs = [];

    $langs["pt"] = ["title" => "Fast Memory - Recordes",
                    "name" => "Nome/Apelido",
                    "score" => "Pontuação",
                    "level" => "Level",
                    "theme" => "Tema",
                    "date" => "Data"];      

    $langs["en"] = ["title" => "Fast Memory - Records",
                    "name" => "Name/Nickname",
                    "score" => "Score",
                    "level" => "Level",
                    "theme" => "Theme",
                    "date" => "Date"];

    $langs["es"] = ["title" => "Fast Memory - Récords",
                    "name" => "Nombre/Apodo",
                    "score" => "Pontuación",
                    "level" => "Level",
                    "theme" => "Tema",
                    "date" => "Data"];

    if (!isset($langs[$lang])) header("Location: ?lang=en");

    $strings = $langs[$lang];

    function fail() {
		global $db;

		$db->close();
		http_response_code(500);
		exit();
    }
    
    $data = $db->query("SELECT * FROM `$table_name` ORDER BY `points` DESC ");
    if ($data === FALSE) fail();

    $themes = ["Todos", "Transporte", "Frutas", "Animais", "Objetos", "Comidas", "Letras", "Números"];

?>

<html lang="<?php echo $lang; ?>">

	<head>
		<meta charset="utf-8" />

		<title><?php echo $strings["title"]; ?></title>

		<style>
			body {
				background: rgb(230, 230, 230);
                font-family: Arial;
			}

            .center {
                width: 700px;
                margin: auto;
                margin-top: 20px;
                text-align: center;
            }

            table {
                width: 100%;
                border-radius: 10px;
                border: 2px solid #66eb65;
                background: #faf7e4;
                margin-top: 20px;
                border-spacing: 0;
            }

            td {
                text-align: center;
                font-weight: bold;
                padding: 5px;
            }
		</style>
	
		<link rel="shortcut icon" href="images/favicon.png" />
	</head>
	
	<body>
		
        <div class="center">    
            <img src="images/title.png" width="300">

            <table>
                <tr style="background: #66eb65; border: 0; color: white;">
                    <td>#</td>
                    <td><?php echo $strings["name"]; ?></td>
                    <td><?php echo $strings["score"]; ?></td>
                    <td><?php echo $strings["level"]; ?></td>
                    <td><?php echo $strings["theme"]; ?></td>
                    <td><?php echo $strings["date"]; ?></td>
                </tr>

<?php

    $i = 0;
    $format = $lang == "en" ? "m/d/Y" : "d/m/Y";

    while ($row = $data->fetch_assoc()) {
        $i++;
        $date = (new DateTime($row['date']))->format($format);
        $theme = $themes[$row['theme']];
        $level = $row['level'] + 1;
        echo "<tr><td>$i</td><td>$row[name]</td><td>$row[points]</td><td>$level</td><td>$theme</td><td>$date</td></tr>";
    }

    $db->close();

?>

            </table>
        </div>

	</body>
</html>
