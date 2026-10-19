<?php
// Não usado no GitHub Pages (hospedagem estática, sem PHP) — o formulário em produção
// envia via Web3Forms (ver js/script.js). Mantido para uso em hospedagem com PHP, se um dia
// o site migrar para lá.
declare(strict_types=1);

// E-mail de destino do formulário de contato.
const CONTACT_EMAIL = "contato@klit.com.br";

header('Content-Type: application/json; charset=utf-8');

function respond(bool $success, string $message, int $status = 200): void {
    http_response_code($status);
    echo json_encode(['success' => $success, 'message' => $message]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Método não permitido.', 405);
}

// Honeypot: campo invisível que só bots preenchem.
if (!empty($_POST['website'] ?? '')) {
    respond(true, 'Mensagem enviada.');
}

$name = trim((string)($_POST['name'] ?? ''));
$email = trim((string)($_POST['email'] ?? ''));
$comment = trim((string)($_POST['comment'] ?? ''));

if ($name === '' || $email === '' || $comment === '') {
    respond(false, 'Preencha todos os campos obrigatórios.', 422);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 'Informe um e-mail válido.', 422);
}

// Remove quebras de linha para evitar injeção de cabeçalhos de e-mail.
$sanitize = static fn(string $value): string => str_replace(["\r", "\n"], ' ', $value);

$name = $sanitize($name);
$email = $sanitize($email);

$subject = '=?UTF-8?B?' . base64_encode('Contato pelo site - ' . $name) . '?=';

$body = "Nome: {$name}\n"
    . "E-mail: {$email}\n\n"
    . "Mensagem:\n{$comment}\n";

$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: KLIT - Site <' . CONTACT_EMAIL . '>',
    'Reply-To: ' . $name . ' <' . $email . '>',
];

$sent = mail(CONTACT_EMAIL, $subject, $body, implode("\r\n", $headers));

if ($sent) {
    respond(true, 'Mensagem enviada com sucesso!');
}

respond(false, 'Não foi possível enviar sua mensagem. Tente novamente mais tarde.', 500);
