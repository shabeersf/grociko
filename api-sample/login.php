<?php
require_once "includes/includepath.php";

// Include the JWT functions
function generate_jwt($headers, $payload, $secret = 'secret')
{
    $headers_encoded = base64url_encode(json_encode($headers));
    $payload_encoded = base64url_encode(json_encode($payload));
    $signature = hash_hmac(
        'SHA256',
        "$headers_encoded.$payload_encoded",
        $secret,
        true
    );
    $signature_encoded = base64url_encode($signature);
    $jwt = "$headers_encoded.$payload_encoded.$signature_encoded";
    return $jwt;
}

function getSigniture($token)
{
    $_token = explode(".", $token);
    return $_token[2];
}

function getPayload($token)
{
    $_token = explode(".", $token);
    $payload = json_decode(base64UrlDecode($_token[1]), true);
    return $payload;
}

function base64UrlDecode(string $base64Url): string
{
    return base64_decode(strtr($base64Url, '-_', '+/'));
}

function is_jwt_valid($jwt, $secret = 'secret')
{
    $tokenParts = explode('.', $jwt);
    $header = base64_decode($tokenParts[0]);
    $payload = base64_decode($tokenParts[1]);
    $signature_provided = getSigniture($jwt);
    $base64_url_header = base64url_encode($header);
    $base64_url_payload = base64url_encode($payload);
    $signature = hash_hmac(
        'SHA256',
        $base64_url_header . '.' . $base64_url_payload,
        $secret,
        true
    );
    $base64_url_signature = base64url_encode($signature);
    $is_signature_valid = $base64_url_signature === $signature_provided;

    if (!$is_signature_valid) {
        return false;
    } else {
        return true;
    }
}

function base64url_encode($data)
{
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function get_authorization_header()
{
    $headers = null;
    if (isset($_SERVER['Authorization'])) {
        $headers = trim($_SERVER['Authorization']);
    } elseif (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $headers = trim($_SERVER['HTTP_AUTHORIZATION']);
    } elseif (function_exists('apache_request_headers')) {
        $requestHeaders = apache_request_headers();
        $requestHeaders = array_combine(
            array_map('ucwords', array_keys($requestHeaders)),
            array_values($requestHeaders)
        );
        if (isset($requestHeaders['Authorization'])) {
            $headers = trim($requestHeaders['Authorization']);
        }
    }
    return $headers;
}

function get_bearer_token()
{
    $headers = get_authorization_header();
    if (!empty($headers)) {
        if (preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
            return $matches[1];
        }
    }
    return null;
}

$objval = new validate();
$api = new api();
$rest = new rest();
$objgen = new general();

$api->valide_method('POST'); // Check Post

if ($authkey == true) {
    $email    = $rest->_request['email'];
    $phone    = $rest->_request['phone'];
    $password = $rest->_request['password'];

    if ((!empty($email) || !empty($phone)) && !empty($password)) {

        if ($phone == '') {
            $user_details = $objgen->get_Onerow("user", " and email='" . $email . "' and password='" . $objgen->encrypt_pass($password) . "'");
        } else {
            $user_details = $objgen->get_Onerow("user", " and phone='" . $phone . "' and password='" . $objgen->encrypt_pass($password) . "'");
        }

        if ($user_details['id'] != "") {
            $data['id']           = $user_details['id'];
            $data['name']         = $objgen->check_tag($user_details['name']);
            $data['phone']        = $objgen->check_tag($user_details['phone']);
            $data['email']        = $objgen->check_tag($user_details['email']);
            $data['password']     = $objgen->decrypt_pass($user_details['password']);
            $data['gst']          = $objgen->check_tag($user_details['gst']);
            $data['organization'] = $objgen->check_tag($user_details['organization']);
            $data['gst_address']  = $objgen->basedecode($user_details['gst_address']);
            $data['image']        = $user_details['image'] ? IMAGE_PATH . "/medium/" . $objgen->check_tag($user_details['image']) : '';
            $data['status']       = $objgen->check_tag($user_details['status']);

            // Generate JWT
            $jwt_headers = array(); // Set your desired JWT headers
            $jwt_payload = $data['name'] . date('YmdHis'); // Set the payload as the user data
            $jwt_secret  = 'apple'; // Set your secret key
            $jwt = generate_jwt($jwt_headers, $jwt_payload, $jwt_secret);

            $response_arr["data"] = $data;
            $response_arr["response_code"] = 200;
            $response_arr["status"] = "Success";
            $response_arr["jwt"] = $jwt; // Include the JWT in the response

            $rest->response($api->json($response_arr), 200);
        } else {
            $data['response_code'] = 220;
            $data['status'] = "Error";
            $data['message'] = "No Result Found";
            $rest->response($api->json($data), 220);
        }
    } else {
        $data['response_code'] = 401;
        $data['status'] = "Error";
        $data['message'] = "Enter values for either email or phone and password";
        $rest->response($api->json($data), 220);
    }
} else {
    $data['response_code'] = 401;
    $data['status'] = 'Error';
    $data['message'] = "Unauthorized";
    $rest->response($api->json($data), 401);
}

$api->processApi(); //Process API
