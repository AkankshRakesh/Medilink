<?php
require 'vendor/autoload.php'; 
require 'db.php'; 

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

function generateOTP() {
    return rand(100000, 999999);
}

$data = json_decode(file_get_contents("php://input"), true);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (!isset($data['email']) || empty($data['email'])) {
        echo json_encode(["status" => "error", "message" => "Email is required"]);
        exit;
    }

    $email = $data['email']; 
    $otp = generateOTP();
    $expiry = date('Y-m-d H:i:s', strtotime('+10 minutes'));

    $stmt = $pdo->prepare("SELECT COUNT(*) FROM otptable WHERE email = :email");
    $stmt->execute(['email' => $email]);
    $emailExists = $stmt->fetchColumn();

    if ($emailExists) {
        $stmt = $pdo->prepare("UPDATE otptable SET otp = :otp, expires_at = :expires_at WHERE email = :email");
        $stmt->execute(['email' => $email, 'otp' => $otp, 'expires_at' => $expiry]);
    } else {
        $stmt = $pdo->prepare("INSERT INTO otptable (email, otp, expires_at) VALUES (:email, :otp, :expires_at)");
        $stmt->execute(['email' => $email, 'otp' => $otp, 'expires_at' => $expiry]);
    }

    // HTML email template with OTP
    $htmlTemplate = <<<HTML
<!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">

<head>
	<title></title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link href="https://fonts.googleapis.com/css?family=Cormorant+Garamond" rel="stylesheet" type="text/css">
	<style>
		* {
			box-sizing: border-box;
		}

		body {
			margin: 0;
			padding: 0;
		}

		a[x-apple-data-detectors] {
			color: inherit !important;
			text-decoration: inherit !important;
		}

		#MessageViewBody a {
			color: inherit;
			text-decoration: none;
		}

		p {
			line-height: inherit
		}

		.desktop_hide,
		.desktop_hide table {
			mso-hide: all;
			display: none;
			max-height: 0px;
			overflow: hidden;
		}

		.image_block img+div {
			display: none;
		}

		sup,
		sub {
			font-size: 75%;
			line-height: 0;
		}

		@media (max-width:700px) {
			.desktop_hide table.icons-inner,
			.social_block.desktop_hide .social-table {
				display: inline-block !important;
			}

			.icons-inner {
				text-align: center;
			}

			.icons-inner td {
				margin: 0 auto;
			}

			.mobile_hide {
				display: none;
			}

			.row-content {
				width: 100% !important;
			}

			.stack .column {
				width: 100%;
				display: block;
			}

			.mobile_hide {
				min-height: 0;
				max-height: 0;
				max-width: 0;
				overflow: hidden;
				font-size: 0px;
			}

			.desktop_hide,
			.desktop_hide table {
				display: table !important;
				max-height: none !important;
			}

			.row-2 .column-1 .block-2.heading_block h1 {
				font-size: 40px !important;
			}

			.row-2 .column-1 .block-1.spacer_block {
				height: 30px !important;
			}

			.row-1 .column-1 .block-1.image_block td.pad {
				padding: 30px 0 0 !important;
			}

			.row-2 .column-1 .block-4.spacer_block,
			.row-3 .column-1 .block-1.spacer_block {
				height: 1px !important;
			}

			.row-2 .column-1 .block-3.paragraph_block td.pad {
				padding: 0 30px !important;
			}

			.row-2 .column-1 {
				padding: 5px 0 !important;
			}
		}
	</style>
</head>

<body class="body" style="background-color: #eae4e1; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
	<table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #eae4e1;">
		<tbody>
			<tr>
				<td>
					<table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/7961/Email_Body_1.png'); background-position: top center; background-repeat: no-repeat; background-size: auto;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-size: auto; color: #000000; width: 680px; margin: 0 auto;" width="680">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-left: 60px; padding-right: 60px; padding-top: 5px; vertical-align: top;">
													<div class="spacer_block block-1" style="height:100px;line-height:100px;font-size:1px;">&#8202;</div>
													<table class="heading_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad">
																<h1 style="margin: 0; color: #37648e; direction: ltr; font-family: 'Cormorant Garamond', 'Times New Roman', Times, serif; font-size: 55px; font-weight: 700; letter-spacing: normal; line-height: 1.2; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 66px;"><span class="tinyMce-placeholder" style="word-break: break-word; ">Your Verification Code</span></h1>
															</td>
														</tr>
													</table>
													<table class="paragraph_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad" style="padding-left:60px;padding-right:60px;">
																<div style="color:#37648e;direction:ltr;font-family:'Cormorant Garamond', 'Times New Roman', Times, serif;font-size:18px;font-weight:400;letter-spacing:0px;line-height:1.2;text-align:center;mso-line-height-alt:22px;">
																	<p style="margin: 0;"><span style="word-break: break-word; background-color: #f5f0ec;">Your one-time verification code for Medilink is:</span></p>
																</div>
															</td>
														</tr>
													</table>
													<table class="heading_block block-4" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad">
																<h1 style="margin: 0; color: #37648e; direction: ltr; font-family: 'Cormorant Garamond', 'Times New Roman', Times, serif; font-size: 55px; font-weight: 700; letter-spacing: normal; line-height: 1.2; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 66px;"><span style="word-break: break-word; background-color: #f5f0ec;">$otp</span></h1>
															</td>
														</tr>
													</table>
													<table class="paragraph_block block-5" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad" style="padding-left:60px;padding-right:60px;">
																<div style="color:#37648e;direction:ltr;font-family:'Cormorant Garamond', 'Times New Roman', Times, serif;font-size:18px;font-weight:400;letter-spacing:0px;line-height:1.2;text-align:center;mso-line-height-alt:22px;">
																	<p style="margin: 0;"><span style="word-break: break-word; background-color: #f5f0ec;">This code will expire in 10 minutes. Please do not share this code with anyone.</span></p>
																</div>
															</td>
														</tr>
													</table>
													<div class="spacer_block block-6" style="height:100px;line-height:100px;font-size:1px;">&#8202;</div>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-3" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f0ec; color: #000000; width: 680px; margin: 0 auto;" width="680">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top;">
													<div class="spacer_block block-1" style="height:50px;line-height:50px;font-size:1px;">&#8202;</div>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-4" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #37648e; border-radius: 0; color: #000000; width: 680px; margin: 0 auto;" width="680">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top;">
													<div class="spacer_block block-1" style="height:40px;line-height:40px;font-size:1px;">&#8202;</div>
													<table class="social_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad" style="padding-bottom:20px;padding-left:10px;padding-right:10px;padding-top:20px;text-align:center;">
																<div class="alignment" align="center">
																	<table class="social-table" width="208px" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block;">
																		<tr>
																			<td style="padding:0 10px 0 10px;"><a href="https://www.facebook.com" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-circle-white/facebook@2x.png" width="32" height="auto" alt="facebook" title="facebook" style="display: block; height: auto; border: 0;"></a></td>
																			<td style="padding:0 10px 0 10px;"><a href="https://www.twitter.com" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-circle-white/twitter@2x.png" width="32" height="auto" alt="twitter" title="twitter" style="display: block; height: auto; border: 0;"></a></td>
																			<td style="padding:0 10px 0 10px;"><a href="https://www.linkedin.com" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-circle-white/linkedin@2x.png" width="32" height="auto" alt="linkedin" title="linkedin" style="display: block; height: auto; border: 0;"></a></td>
																			<td style="padding:0 10px 0 10px;"><a href="https://www.instagram.com" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-circle-white/instagram@2x.png" width="32" height="auto" alt="instagram" title="instagram" style="display: block; height: auto; border: 0;"></a></td>
																		</tr>
																	</table>
																</div>
															</td>
														</tr>
													</table>
													<table class="heading_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad" style="padding-left:20px;padding-right:20px;text-align:center;width:100%;">
																<h1 style="margin: 0; color: #f5f0ec; direction: ltr; font-family: 'Cormorant Garamond', 'Times New Roman', Times, serif; font-size: 18px; font-weight: 400; letter-spacing: normal; line-height: 1.5; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 27px;"><a href="http://www.example.com" target="_blank" style="text-decoration: underline; color: #f5f0ec;" rel="noopener">Medilink</a> | <a href="http://www.example.com" target="_blank" style="text-decoration: underline; color: #f5f0ec;" rel="noopener">Healthcare Solutions</a></h1>
															</td>
														</tr>
													</table>
													<table class="paragraph_block block-4" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px;">
																<div style="color:#f5f0ec;direction:ltr;font-family:'Cormorant Garamond', 'Times New Roman', Times, serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:1.5;text-align:center;mso-line-height-alt:24px;">
																	<p style="margin: 0;">Medilink provides innovative healthcare solutions to improve patient care and streamline medical services.</p>
																</div>
															</td>
														</tr>
													</table>
													<table class="paragraph_block block-5" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px;">
																<div style="color:#f5f0ec;direction:ltr;font-family:'Cormorant Garamond', 'Times New Roman', Times, serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:1.5;text-align:center;mso-line-height-alt:24px;">
																	<p style="margin: 0;">Questions? Email us at support@medilink.com<br>Questions relating to privacy and the protection of your personal information should be sent to privacy@medilink.com</p>
																</div>
															</td>
														</tr>
													</table>
													<table class="paragraph_block block-6" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px;">
																<div style="color:#f5f0ec;direction:ltr;font-family:'Cormorant Garamond', 'Times New Roman', Times, serif;font-size:18px;font-weight:400;letter-spacing:0px;line-height:1.5;text-align:center;mso-line-height-alt:27px;">
																	<p style="margin: 0;"><a href="http://www.example.com" target="_blank" style="text-decoration: underline; color: #f5f0ec;" rel="noopener">Unsubscribe</a></p>
																</div>
															</td>
														</tr>
													</table>
													<table class="paragraph_block block-7" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad" style="padding-bottom:20px;padding-left:20px;padding-right:20px;padding-top:10px;">
																<div style="color:#f5f0ec;direction:ltr;font-family:'Cormorant Garamond', 'Times New Roman', Times, serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:1.5;text-align:center;mso-line-height-alt:24px;">
																	<p style="margin: 0;">Medilink | 123 Healthcare Street, Medical City, Country<br>Post Code HC12 34MD</p>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
				</td>
			</tr>
		</tbody>
	</table>
</body>
</html>
HTML;

    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = 'smtp-relay.brevo.com'; 
        $mail->SMTPAuth = true;
        $mail->Username = '852d66001@smtp-brevo.com';
        $mail->Password = 'cH52JzGKUaWRLVYS'; 
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        $mail->setFrom('akankshrakesh@gmail.com', 'Medilink');
        $mail->addAddress($email);
        $mail->Subject = 'Your Medilink Verification Code';
        $mail->isHTML(true);
        $mail->Body = $htmlTemplate;
        $mail->AltBody = "Your OTP code for Medilink is: $otp. This OTP is valid for 10 minutes.";

        $mail->send();
        echo json_encode(["status" => "success", "message" => "OTP sent successfully"]);
    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => "Mailer Error: " . $mail->ErrorInfo]);
    }
}
?>