<?php

    error_reporting(0);

    require("connect.php");
    
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

<html lang="pt">

	<head>
		<meta charset="utf-8" />

		<title>Fast Memory - Records</title>

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
                    <td>Nome/Apelido</td>
                    <td>Pontuação</td>
                    <td>Tema</td>
                    <td>Data</td>
                </tr>

<?php

    $i = 0;

    while ($row = $data->fetch_assoc()) {
        $i++;
        $date = (new DateTime($row['date']))->format("d/m/Y");
        $theme = $themes[$row['theme']];
        echo "<tr><td>$i</td><td>$row[name]</td><td>$row[points]</td><td>$theme</td><td>$date</td></tr>";
    }

    $db->close();

?>

            </table>
        </div>

	</body>
</html>
