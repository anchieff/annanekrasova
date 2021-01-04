<?php

  require 'phpmailer/Exception.php';
  require 'phpmailer/PHPMailer.php';
  require 'phpmailer/SMTP.php';

  $name = $_POST['name'];
  $email = $_POST['email'];
  $message = $_POST['message'];

  // Формирование самого письма
  $title = "Заявка на сайт";
  $body = "
  <h2>Новая заявка на сайт</h2>
  <b>Имя:</b> $name<br>
  <b>Почта:</b> $email<br><br>
  <b>Сообщение:</b><br>$message
  ";

  // Настройки PHPMailer
$mail = new PHPMailer\PHPMailer\PHPMailer();
try {
    $mail->isSMTP();   
    $mail->CharSet = "UTF-8";
    $mail->SMTPAuth   = true;
    $mail->SMTPDebug = 2;
    $mail->Debugoutput = function($str, $level) {$GLOBALS['status'][] = $str;};

    // Настройки вашей почты
    $mail->Host       = 'smtp.yandex.ru'; // SMTP сервера вашей почты
    $mail->Username   = ''; // Логин на почте
    $mail->Password   = ''; // Пароль на почте
    $mail->SMTPSecure = 'ssl';
    $mail->Port       = 465;
    $mail->setFrom('', 'Фронтенд-разработка'); // Адрес самой почты и имя отправителя

    // Получатель письма
    $mail->addAddress('');   

    
    // Отправка сообщения
    $mail->isHTML(true);
    $mail->Subject = $title;
    $mail->Body = $body;    

    // Проверяем отравленность сообщения
    if ($mail->send()) {$result = "все ок, письмо ушло";} 
    else {$result = "опять херня какая-то {$mail->ErrorInfo}";}

} catch (Exception $e) {
    $result = "error";
    
}

  $response = ['result' => $result];

  header('Content-type: application/json');
  echo json_encode($response);

 ?>