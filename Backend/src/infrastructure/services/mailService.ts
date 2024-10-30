import nodemailer,{Transporter} from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

class SendEmail {
    private transporter: Transporter;
    constructor(){
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSKEY,
                },
        })
    }

    async sendEmail(mailOptions: {
        email: string;
        subject: string;
        code: string;
      }): Promise<boolean> {
        try {
          const info = await this.transporter.sendMail({
            from: `"CalmNest" <${process.env.EMAIL}>`, 
            to: mailOptions.email, 
            subject: mailOptions.subject, 
            html: `<div>
                     <p>${mailOptions.subject}</p>
                     <div><h1>${mailOptions.code}</h1></div>
                   </div>`, 
          });
    
          console.log("Message sent: %s", info.messageId);
          return true;
        } catch (error) {
          console.error("Error sending email:", error);
          return false;
        }
      }
    }
export default SendEmail;
