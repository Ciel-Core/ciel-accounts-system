// For more info, refer to https://developers.cloudflare.com/email-routing/email-workers/

// import { EmailMessage } from "cloudflare:email";
// import { createMimeMessage } from "mimetext";

// ...
const NO_REPLY_EMAIL = {
    address: "no-reply@ciel.today",
    name: "DO NOT REPLY - Ciel auto response"
};

// Check if destination is for public use
function is_valid_dest_email(message) {
    const public_emails = ["webmaster@ciel.today", "app@ciel.today"];
    return public_emails.includes(message.to);
}

// Send an email
// <message>, <sender>
// <sender>: {<subject>, <content>, <sender>}
async function send_email(message, mail) {
    // const ticket = createTicket(message);
    // Add info
    const msg = createMimeMessage();
    msg.setHeader("In-Reply-To", message.headers.get("Message-ID"));
    msg.setSender({ name: mail.sender.name, addr: mail.sender.address });
    msg.setRecipient(message.from);
    msg.setSubject(mail.subject);
    msg.addMessage(mail.message);

    // Create message object
    const replyMessage = new EmailMessage(
        mail.sender.address,
        message.from,
        msg.asRaw()
    );

    // Send message
    await message.reply(replyMessage);
}

// EXPORT OBJECT
export default {
    async email(message, env, ctx) {
        if (is_valid_dest_email(message)) {
            // Forward email
            // You can change the value of FORWARD_EMAIL_MAIN in the Coulflare console!
            await message.forward(env.FORWARD_EMAIL_MAIN);
            return;
        } else {
            // Do some magic
            /*send_email(message, {
              subject: "Email blocked!",
              message: {
                contentType: 'text/plain',
                data: `Your email to '${message.to}' has been blocked. Please recheck the email address (*@ciel.today) and try again later!`
              },
              sender: NO_REPLY_EMAIL
            });*/
            message.setReject("Address not allowed! Please recheck that you have the correct email address! (*@ciel.today)");
            return;
        }
    }
}