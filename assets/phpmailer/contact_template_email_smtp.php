<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Vértice Resto - Lounge">
    <meta name="author" content="Ansonika">
    <title>Vértice Resto - Lounge</title>
</head>

<body>

<?php

date_default_timezone_set('America/Guayaquil');
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require 'src/Exception.php';
require 'src/PHPMailer.php';
require 'src/SMTP.php';

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = 'smtp.hostinger.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'info@verticerestolounge.com';
    $mail->Password   = 'Vertice.3210';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    $mail->setFrom('info@verticerestolounge.com', 'Vértice Resto - Lounge');
    $mail->addAddress('info@verticerestolounge.com', 'Vértice Resto - Lounge');
    $mail->isHTML(true);                                                    
    
    function isEmail($email_contact ) {
        return(preg_match("/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/",$email_contact));
    }

    $name_contact     = $_POST['name_contact'];
    $email_contact    = $_POST['email_contact'];
    $message_contact = $_POST['message_contact'];

    if(trim($name_contact) == '') {
    echo '<div class="error_message">Por favor ingresa tu nombre.</div>';
    exit();
    } else if(trim($email_contact) == '') {
        echo '<div class="error_message">Por favor ingresa un correo electrónico válido.</div>';
        exit();
    } else if(!isEmail($email_contact)) {
        echo '<div class="error_message">El correo electrónico ingresado no es válido.</div>';
        exit();
    } else if(trim($message_contact) == '') {
        echo '<div class="error_message">Por favor escribe tu mensaje.</div>';
        exit();
    }        

    $mail->Subject = 'Formulario de contacto - ' . $name_contact;
    $mail->addReplyTo($email_contact, $name_contact);
    
    $email_html = file_get_contents('template-email.html');

    $fecha = date('d/m/Y h:i A');

    $e_content = 
    "<p><strong>Nombre:</strong> {$name_contact}</p>
    <p><strong>Correo:</strong> <a href='mailto:{$email_contact}'>{$email_contact}</a></p>
    <p><strong>Fecha:</strong> {$fecha}</p>
    <hr>
    <p><strong>Mensaje:</strong></p>
    <p>{$message_contact}</p>";

    $body = str_replace(array('message'),array($e_content),$email_html);
    $mail->MsgHTML($body);

    $mail->CharSet = 'UTF-8';

    $mail->send();

    $mail->ClearAddresses();
    $mail->clearReplyTos();
    $mail->addAddress($email_contact);
    $mail->isHTML(true);
    $mail->Subject = 'Hemos recibido tu mensaje';
    
    $email_html_confirm = file_get_contents('confirmation.html');

    $confirm_content = 
    "<p>Hola <strong>{$name_contact}</strong>,</p>
    <p>Hemos recibido tu mensaje correctamente.</p>
    <p>Nuestro equipo revisará tu mensaje y se pondrá en contacto contigo lo antes posible.</p>
    <p>Gracias por comunicarte con nosotros.</p>
    <p><strong>Vértice Resto - Lounge</strong></p>";

    $body = str_replace(
        array('message'),
        array($confirm_content),
        $email_html_confirm
    );

    $mail->MsgHTML($body);

    $mail->CharSet = 'UTF-8';
    $mail->send();

    echo '<div id="success_page">
            <div class="icon icon--order-success svg">
                 <svg xmlns="http://www.w3.org/2000/svg" width="72px" height="72px">
                  <g fill="none" stroke="#8EC343" stroke-width="2">
                     <circle cx="36" cy="36" r="35" style="stroke-dasharray:240px, 240px; stroke-dashoffset: 480px;"></circle>
                     <path d="M17.417,37.778l9.93,9.909l25.444-25.393" style="stroke-dasharray:50px, 50px; stroke-dashoffset: 0px;"></path>
                  </g>
                 </svg>
             </div>
            <h5>¡Gracias!<span>Tu mensaje ha sido enviado correctamente.</span></h5>
            <small>Nos pondremos en contacto contigo lo antes posible.</small>
        </div>';
    } catch (Exception $e) {
        echo "No fue posible enviar el mensaje. Error: {$mail->ErrorInfo}";
} 
?> 

</body>
</html>